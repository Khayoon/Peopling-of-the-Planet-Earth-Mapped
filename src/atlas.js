import { LAND } from "../data/land.js";
import { CONTAIN, SHELF, ISLET, ICE } from "../data/geography.js";
import { SITES, STRANDS, ISLANDS } from "../data/migration.js";
import { pos, timeAt, seaLevel, iceShape, eraAt, presence, shelfAlpha, hotOf } from "./model.js";
import { createSeeds } from "./seeds.js";

const seeds = createSeeds(STRANDS, ISLANDS);
const ROUTES = STRANDS.filter(s => s.show && s.p.length > 1);

/* ============================ PROJECTION ============================ */
const LAT_N=84, LAT_S=-56;
let W=1600,H=622,DPR=1;
const px=lon=>(lon+180)/360*W;
const py=lat=>(LAT_N-lat)/(LAT_N-LAT_S)*H;

/* ============================ CANVASES ============================ */
const cv=document.getElementById("map"), ctx=cv.getContext("2d");
const mapViewport=document.querySelector(".map-viewport");
let mapHasCentered=false;
const mk=()=>document.createElement("canvas");
// Presence/hot are the reveal masks; land clips colour to dry ground.
// The two scene layers are cached until the date, hover, fonts or size changes.
const presenceC=mk(), hotC=mk(), landC=mk(), tmpC=mk(), terrainC=mk(), belowC=mk(), aboveC=mk();
const presenceMask=presenceC.getContext("2d",{willReadFrequently:true}), hot=hotC.getContext("2d"), lnd=landC.getContext("2d"),
      tmp=tmpC.getContext("2d"), ter=terrainC.getContext("2d"),
      below=belowC.getContext("2d"), above=aboveC.getContext("2d");
let FW=0,FH=0;

function ringPath(c,pts,close){
  c.beginPath();
  let started=false,prev=null;
  for(const p of pts){
    const X=px(p[0]),Y=py(p[1]);
    if(!started){c.moveTo(X,Y);started=true;}
    else{
      if(prev!==null&&Math.abs(X-prev)>W*0.6){ c.moveTo(X,Y); } else c.lineTo(X,Y);
    }
    prev=X;
  }
  if(close) c.closePath();
}
function drawLand(c,style,stroke,lw){ c.fillStyle=style; c.beginPath();
  for(const r of LAND){ let prev=null,first=true;
    for(const p of r){ const X=px(p[0]),Y=py(p[1]);
      if(first||(prev!==null&&Math.abs(X-prev)>W*0.6)){c.moveTo(X,Y);first=false;} else c.lineTo(X,Y);
      prev=X; }
    c.closePath(); }
  if(style) c.fill("evenodd");
  if(stroke){ c.strokeStyle=stroke; c.lineWidth=lw; c.stroke(); }
}
function smoothRing(c,pts){ // closed Catmull-Rom-ish curve through lon/lat points
  const n=pts.length, P=pts.map(p=>[px(p[0]),py(p[1])]);
  c.beginPath();
  c.moveTo((P[n-1][0]+P[0][0])/2,(P[n-1][1]+P[0][1])/2);
  for(let i=0;i<n;i++){
    const a=P[i], b=P[(i+1)%n];
    c.quadraticCurveTo(a[0],a[1],(a[0]+b[0])/2,(a[1]+b[1])/2);
  }
  c.closePath();
}

function drawIslets(c,style){
  c.fillStyle=style;
  for(const [lon,lat,r] of ISLET){
    const rx=Math.max(1.6,r*(W/360)), ry=Math.max(1.6,r*(H/(LAT_N-LAT_S)));
    c.save(); c.translate(px(lon),py(lat)); c.scale(1,ry/rx);
    c.beginPath(); c.arc(0,0,rx,0,6.2832); c.fill(); c.restore();
  }
}


function sizeAll(){
  const cssW=cv.clientWidth||1200;
  DPR=Math.min(2,window.devicePixelRatio||1);
  const cssH=Math.max(250,Math.min(640,Math.round(cssW/2.571)));
  W=Math.round(cssW*DPR); H=Math.round(cssH*DPR);
  cv.width=W; cv.height=H; cv.style.height=cssH+"px";
  if(!mapHasCentered&&mapViewport.clientWidth<cssW){
    mapViewport.scrollLeft=(cssW-mapViewport.clientWidth)/2;
    mapHasCentered=true;
  }
  FW=Math.max(160,Math.round(W*0.42)); FH=Math.max(70,Math.round(H*0.42));
  for(const c of [presenceC,hotC]){ c.width=FW; c.height=FH; }
  for(const c of [landC,tmpC,terrainC,belowC,aboveC]){ c.width=W; c.height=H; }
  lastSL=999; resetBake(); buildMasks();
  document.fonts&&document.fonts.ready.then(()=>{dirty=true;});
  dirty=true;
}

let lastSL=999, lastLandT=-1;
function buildLand(tNow,sl){
  lnd.clearRect(0,0,W,H);
  drawLand(lnd,"#fff");
  drawIslets(lnd,"#fff");
  for(const sh of SHELF){ const a=shelfAlpha(sh,tNow,sl); if(a<=0) continue;
    lnd.globalAlpha=a; ringPath(lnd,sh.p,true); lnd.fillStyle="#fff"; lnd.fill(); }
  lnd.globalAlpha=1;

  // Settled ground is a flat ember wash, clipped to dry land at this date.
  ter.clearRect(0,0,W,H);
  ter.fillStyle="#e8783a"; ter.fillRect(0,0,W,H);
  ter.globalCompositeOperation="destination-in";
  ter.drawImage(landC,0,0);
  ter.globalCompositeOperation="source-over";
}

/* ============================ PRESENCE MASK ============================ */

// Settled ground never un-settles unless a seed declares a retreat, so mature
// unfenced seeds are baked once into a persistent layer instead of every frame.
const FREE=seeds.filter(s=>!s.bound);
const STATIC=FREE.filter(s=>s.gone===undefined);
const DYNAMIC=FREE.filter(s=>s.gone!==undefined);
const GROUPS=[...new Set(seeds.filter(s=>s.bound).map(s=>s.bound))]
  .map(name=>({name, poly:CONTAIN[name], seeds:seeds.filter(s=>s.bound===name), mask:mk()}));
const bakeC=mk(), bndC=mk(), bhotC=mk();
const bake=bakeC.getContext("2d"), bnd=bndC.getContext("2d"), bhot=bhotC.getContext("2d");
let bakeIdx=0, bakeTime=Infinity;
function resetBake(){ bakeC.width=FW; bakeC.height=FH; bakeIdx=0; bakeTime=Infinity; }
function buildMasks(){
  const sx=FW/W, sy=FH/H;
  for(const g of GROUPS){
    g.mask.width=FW; g.mask.height=FH;
    const c=g.mask.getContext("2d");
    c.setTransform(sx,0,0,sy,0,0);
    c.beginPath();
    g.poly.forEach((p,i)=>{ const X=px(p[0]),Y=py(p[1]); i?c.lineTo(X,Y):c.moveTo(X,Y); });
    c.closePath(); c.fillStyle="#fff"; c.fill();
    c.setTransform(1,0,0,1,0,0);
  }
  bndC.width=FW; bndC.height=FH; bhotC.width=FW; bhotC.height=FH;
}

function blob(c,s,a,sx,sy,hotv){
  const cx=px(s.x)*sx, cy=py(s.y)*sy;
  const latAdj=1/Math.max(0.34,Math.cos(s.y*Math.PI/180));
  const rx=s.r*(W/360)*latAdj*sx, ry=s.r*(H/(LAT_N-LAT_S))*sy;
  const grow=(0.55+0.45*a)*(hotv?1.05:1);
  const p1=hotv?0.52*hotv:0.88*a, p2=hotv?0.34*hotv:0.62*a;
  for(const off of [0,-FW,FW]){
    const X=cx+off; if(X<-rx*2||X>FW+rx*2) continue;
    c.save(); c.translate(X,cy); c.scale(1,ry/rx);
    const g=c.createRadialGradient(0,0,0,0,0,rx*grow);
    g.addColorStop(0,"rgba(255,255,255,"+p1.toFixed(3)+")");
    g.addColorStop(0.64,"rgba(255,255,255,"+p2.toFixed(3)+")");
    g.addColorStop(1,"rgba(255,255,255,0)");
    c.fillStyle=g; c.beginPath(); c.arc(0,0,rx*grow,0,6.2832); c.fill(); c.restore();
  }
}


function paintPresence(t){
  const sx=FW/W, sy=FH/H;
  if(t>bakeTime) resetBake();      // scrubbed backwards in time
  bakeTime=t;
  bake.globalCompositeOperation="lighter";
  while(bakeIdx<STATIC.length&&presence(STATIC[bakeIdx],t)>=1){ blob(bake,STATIC[bakeIdx],1,sx,sy,0); bakeIdx++; }

  presenceMask.clearRect(0,0,FW,FH); hot.clearRect(0,0,FW,FH);
  presenceMask.globalCompositeOperation="lighter"; hot.globalCompositeOperation="lighter";
  presenceMask.drawImage(bakeC,0,0);
  for(let i=bakeIdx;i<STATIC.length;i++){
    const s=STATIC[i]; if(s.t<t) break;
    const a=presence(s,t); if(a>0.004) blob(presenceMask,s,a,sx,sy,0);
  }
  for(const s of DYNAMIC){ const a=presence(s,t); if(a>0.004) blob(presenceMask,s,a,sx,sy,0); }
  for(const s of FREE){ const h=hotOf(s,t); if(h>0) blob(hot,s,presence(s,t),sx,sy,h); }

  // Fenced groups are accumulated apart, clipped to their region, then merged in.
  for(const g of GROUPS){
    let any=false;
    bnd.clearRect(0,0,FW,FH); bhot.clearRect(0,0,FW,FH);
    bnd.globalCompositeOperation="lighter"; bhot.globalCompositeOperation="lighter";
    for(const s of g.seeds){
      const a=presence(s,t); if(a<=0.004) continue;
      any=true; blob(bnd,s,a,sx,sy,0);
      const h=hotOf(s,t); if(h>0) blob(bhot,s,a,sx,sy,h);
    }
    if(!any) continue;
    for(const c of [bnd,bhot]){ c.globalCompositeOperation="destination-in"; c.drawImage(g.mask,0,0); c.globalCompositeOperation="source-over"; }
    if(g.name==="northAmericaSouth"){
      // Subtract exactly the same curves used by the visible ice overlay.
      // Only this new group is clipped; later Canadian/Arctic strands keep their timing.
      for(const c of [bnd,bhot]){
        c.save(); c.scale(sx,sy); c.globalCompositeOperation="destination-out"; c.fillStyle="#fff";
        for(const sheet of ICE){
          if(sheet.n!=="Laurentide"&&sheet.n!=="Cordilleran") continue;
          const shape=iceShape(sheet,t);
          if(shape){ smoothRing(c,shape.pts); c.fill(); }
        }
        c.restore();
      }
    }
    presenceMask.drawImage(bndC,0,0); hot.drawImage(bhotC,0,0);
  }
  presenceMask.globalCompositeOperation="source-over"; hot.globalCompositeOperation="source-over";
}

/* ============================ EMBER REVEAL ============================ */
// Settled ground burns; unreached ground stays cold slate. The raw presence
// alpha is the look — soft radial edges that bloom instead of a hard boundary.

function drawPresence(c){
  // A faint bloom over water first, so sea crossings read as glow, not as a
  // coastline cut. Then the ember itself, clipped to land by terrainC.
  c.globalAlpha=0.07; c.globalCompositeOperation="lighter";
  c.drawImage(presenceC,0,0,W,H);
  c.globalCompositeOperation="source-over"; c.globalAlpha=1;

  tmp.clearRect(0,0,W,H);
  tmp.drawImage(terrainC,0,0);
  tmp.globalCompositeOperation="destination-in";
  tmp.drawImage(presenceC,0,0,W,H);
  tmp.globalCompositeOperation="source-over";
  c.globalAlpha=0.97; c.drawImage(tmpC,0,0); c.globalAlpha=1;
}

function drawOceanLabels(c){
  if(W/DPR<620) return;
  c.save();
  c.font="italic "+(13*DPR)+"px Fraunces, Georgia, serif";
  c.textAlign="center"; c.fillStyle="rgba(147,171,177,0.22)";
  for(const [name,x,y] of [["Pacific Ocean",-139,4],["Atlantic Ocean",-33,9],["Indian Ocean",78,-30]]){
    c.fillText(name,px(x),py(y));
  }
  c.restore();
}

/* ============================ SCENE ============================ */
let dirty=true, T=21000, playing=false, speed=1, lastFrame=0;
const tip=document.getElementById("tip"), tipB=tip.querySelector("b"),
      tipS=tip.querySelector("span"), tipI=tip.querySelector("i");
let hoverSite=null;

// Ocean -> cool terrain & shelves -> warm presence -> ice -> arrivals -> routes -> sites.
// The ocean treatment is independent of the historical presence mask.
function rebuildScene(){
  const t=T, sl=seaLevel(t);
  if(Math.abs(sl-lastSL)>1.2||t!==lastLandT){ buildLand(t,sl); lastSL=sl; lastLandT=t; }
  paintPresence(t);

  /* ---- atlas ground ---- */
  const og=below.createLinearGradient(0,0,0,H);
  og.addColorStop(0,"#08161c"); og.addColorStop(0.5,"#0a1a20"); og.addColorStop(1,"#07131a");
  below.fillStyle=og; below.fillRect(0,0,W,H);

  below.strokeStyle="rgba(120,170,185,0.055)"; below.lineWidth=Math.max(1,DPR*0.6);
  below.beginPath();
  for(let lon=-180;lon<=180;lon+=30){ below.moveTo(px(lon),0); below.lineTo(px(lon),H); }
  for(let lat=-40;lat<=80;lat+=20){ below.moveTo(0,py(lat)); below.lineTo(W,py(lat)); }
  below.stroke();
  below.strokeStyle="rgba(120,170,185,0.10)"; below.beginPath();
  below.moveTo(0,py(0)); below.lineTo(W,py(0)); below.stroke();

  for(const sh of SHELF){ const a=shelfAlpha(sh,t,sl); if(a<=0) continue;
    below.globalAlpha=a*0.95; ringPath(below,sh.p,true); below.fillStyle="#16262a"; below.fill(); }
  below.globalAlpha=1;

  drawLand(below,"#223034");
  drawIslets(below,"#2b3b40");
  drawPresence(below);
  drawLand(below,null,"rgba(150,195,208,0.22)",Math.max(1,DPR*0.7));
  drawOceanLabels(below);

  /* ---- evidence and overlays ---- */
  above.clearRect(0,0,W,H);

  // Ice: the part that floated over sea belongs to glacial sheets only, so a
  // present-day cap no longer paints a pale lens across the ocean beside it.
  const iceShapes=ICE.map(sh=>iceShape(sh,t)).filter(Boolean);
  if(iceShapes.length){
    tmp.clearRect(0,0,W,H);
    let anySea=false;
    for(const g of iceShapes){ if(g.sea<=0.06) continue; anySea=true;
      smoothRing(tmp,g.pts); tmp.globalAlpha=g.sea; tmp.fillStyle="#9dbcc8"; tmp.fill(); }
    tmp.globalAlpha=1;
    if(anySea){ above.globalAlpha=0.20; above.drawImage(tmpC,0,0); above.globalAlpha=1; }
    tmp.clearRect(0,0,W,H);
    for(const g of iceShapes){ smoothRing(tmp,g.pts); tmp.globalAlpha=g.pres; tmp.fillStyle="#9dbcc8"; tmp.fill(); }
    tmp.globalAlpha=1;
    tmp.globalCompositeOperation="destination-in";
    tmp.drawImage(landC,0,0);
    tmp.globalCompositeOperation="source-over";
    above.globalAlpha=0.66; above.drawImage(tmpC,0,0); above.globalAlpha=1;
  }

  // The advancing frontier: a hot leading edge, added rather than laid on top.
  tmp.clearRect(0,0,W,H);
  tmp.fillStyle="#ffd58a"; tmp.fillRect(0,0,W,H);
  tmp.globalCompositeOperation="destination-in";
  tmp.drawImage(hotC,0,0,W,H);
  tmp.drawImage(landC,0,0);
  tmp.globalCompositeOperation="source-over";
  above.globalCompositeOperation="lighter"; above.globalAlpha=0.75;
  above.drawImage(tmpC,0,0);
  above.globalCompositeOperation="source-over"; above.globalAlpha=1;

  // approximate routes
  above.lineWidth=Math.max(1,DPR*1.1); above.setLineDash([DPR*4,DPR*5]); above.lineCap="round";
  for(const r of ROUTES){
    if(T>r.t0) continue;
    const done=Math.max(0,Math.min(1,(r.t0-T)/((r.t0-r.t1)||1)));
    if(r.gone!==undefined&&T<r.gone&&!(r.back!==undefined&&T<r.back)) continue;
    const n=r.p.length, upto=1+Math.max(0,Math.min(n-1,Math.floor(done*(n-1))+1));
    above.strokeStyle="rgba(255,203,150,0.42)";
    ringPath(above,r.p.slice(0,upto),false); above.stroke();
  }
  above.setLineDash([]);

  // sites
  const recent=[];
  for(const s of SITES){
    if(T>s.t) continue;
    const age=s.t-T, appear=0.45+0.55*Math.min(1,age/Math.max(120,s.t*0.02));
    const X=px(s.x), Y=py(s.y);
    if(age<Math.max(600,s.t*0.06)){
      const pulse=1-age/Math.max(600,s.t*0.06);
      above.beginPath(); above.arc(X,Y,DPR*(4+16*(1-pulse)),0,6.2832);
      above.strokeStyle="rgba(255,213,138,"+(pulse*0.7).toFixed(3)+")"; above.lineWidth=DPR*1.4; above.stroke();
    }
    const disputed=s.c!=="firm";
    above.beginPath(); above.arc(X,Y,DPR*3.1,0,6.2832);
    if(disputed){
      above.fillStyle="rgba(8,14,17,0.9)"; above.fill();
      above.setLineDash([DPR*1.6,DPR*1.6]); above.strokeStyle="rgba(140,205,228,"+(0.95*appear).toFixed(2)+")";
      above.lineWidth=DPR*1.4; above.stroke(); above.setLineDash([]);
    }else{
      above.fillStyle="rgba(255,230,185,"+appear.toFixed(2)+")"; above.fill();
      above.strokeStyle="rgba(10,18,22,0.95)"; above.lineWidth=DPR*1.3; above.stroke();
    }
    recent.push({s,age,X,Y});
  }
  // labels: the four most recent arrivals, plus whatever is hovered
  recent.sort((a,b)=>a.age-b.age);
  const show=recent.slice(0,4);
  if(hoverSite&&!show.some(r=>r.s===hoverSite)) show.push({s:hoverSite,age:0,X:px(hoverSite.x),Y:py(hoverSite.y)});
  above.font="500 "+(12.5*DPR)+"px 'Fira Sans Condensed', Arial, sans-serif";
  above.textBaseline="middle";
  for(const r of show){
    const fade=r.s===hoverSite?1:Math.max(0.3,1-r.age/Math.max(2500,r.s.t*0.14));
    const right=r.X<W*0.80;
    above.textAlign=right?"left":"right";
    const tx=r.X+(right?DPR*8:-DPR*8);
    above.lineWidth=DPR*3.4; above.strokeStyle="rgba(6,13,16,0.9)"; above.lineJoin="round";
    above.strokeText(r.s.n,tx,r.Y);
    above.fillStyle="rgba(255,238,210,"+fade.toFixed(2)+")";
    above.fillText(r.s.n,tx,r.Y);
  }
  above.textAlign="left";

  updateHUD(t,sl);
}

function composite(){
  ctx.clearRect(0,0,W,H);
  ctx.drawImage(belowC,0,0);
  ctx.drawImage(aboveC,0,0);
}

/* ============================ HUD & LOG ============================ */
const el=id=>document.getElementById(id);
const nf=new Intl.NumberFormat("en-US");
function yearStr(y){ const a=Math.abs(y); const s=a>=10000?nf.format(a):String(a); return y<0?s+" BCE":s+" CE"; }
function updateHUD(t,sl){
  if(t<60){
    el("clockBig").textContent="Today"; el("clockUnit").textContent="";
    el("roCal").textContent="—";
  }else{
    const r=t>=10000?Math.round(t/100)*100:t>=1000?Math.round(t/10)*10:Math.round(t);
    el("clockBig").textContent=nf.format(r); el("clockUnit").textContent="years ago";
    el("roCal").textContent=yearStr(Math.round(1950-t));
  }
  el("roSea").textContent=(sl<-0.5?"−":"")+Math.abs(Math.round(sl))+" m";
  el("roEra").textContent=eraAt(t);
}

const logList=el("logList");
const order=[...SITES].sort((a,b)=>b.t-a.t);
const rows=order.map(s=>{
  const li=document.createElement("li");
  const b=document.createElement("button");
  b.className="ev"; b.type="button";
  const when=s.t>=10000?nf.format(Math.round(s.t/1000))+" ka":s.t>=1000?nf.format(Math.round(s.t/100)*100):nf.format(s.t);
  const suffix=s.t<10000?" yr":"";
  b.innerHTML='<span class="when">'+when+suffix+'</span><span class="what"><span class="nm">'+s.n+
    (s.c!=="firm"?' <span class="chip '+s.c+'">'+s.c+'</span>':'')+
    '</span><span class="nt">'+s.pl+' — '+s.note+'</span></span>';
  b.addEventListener("click",()=>jump(s.t));
  li.appendChild(b); logList.appendChild(li);
  return {s,b};
});
function updateLog(t){
  let n=0;
  for(const r of rows){ const on=t<=r.s.t; if(on) n++; r.b.classList.toggle("on",on); }
  el("logCount").textContent=n+" / "+rows.length;
}

/* ---- axis ticks ---- */
const axis=el("axis");
// `opt` ticks are dropped at phone width so the labels never collide
const TICKS=[["300 ka",300000,0],["100 ka",100000,1],["70 ka",70000,0],["40 ka",40000,1],
  ["20 ka",20000,0],["10 ka",10000,1],["3 ka",3000,1],["now",0,0]];
TICKS.forEach(([lab,t,opt],i)=>{
  const d=document.createElement("span");
  d.className="t"+(i===0?" first":i===TICKS.length-1?" last":"")+(opt?" opt":"");
  d.style.left=(pos(t)*100)+"%";
  d.innerHTML='<i></i><span>'+lab+'</span>'; axis.appendChild(d);
});

/* ============================ CONTROLS ============================ */
const scrub=el("scrub");
let touched=false;
function setT(t,fromScrub){
  T=Math.max(0,Math.min(300000,t));
  if(!fromScrub) scrub.value=Math.round(pos(T)*10000);
  updateLog(T); dirty=true;
}
function jump(t){ touched=true; stop(); setT(t); }
scrub.addEventListener("input",()=>{touched=true;setT(timeAt(scrub.value/10000),true);refreshPlay();});

function refreshPlay(){
  el("playGlyph").textContent=playing?"❚❚":"▶";
  el("playLabel").textContent=playing?"Pause":(touched?"Play":"Play from 300,000 BP");
}
function start(){
  if(!touched||T<=60) setT(300000);
  playing=true; lastFrame=performance.now(); refreshPlay();
}
function stop(){ playing=false; refreshPlay(); }
el("play").addEventListener("click",()=>playing?stop():start());
el("toLGM").addEventListener("click",()=>jump(21000));
el("toNow").addEventListener("click",()=>jump(0));
document.querySelectorAll(".speeds button").forEach(b=>{
  b.addEventListener("click",()=>{
    speed=parseFloat(b.dataset.sp);
    document.querySelectorAll(".speeds button").forEach(o=>o.setAttribute("aria-pressed",String(o===b)));
  });
});
window.addEventListener("keydown",e=>{
  if(e.target===mapViewport||e.target.tagName==="BUTTON") return;
  if(e.target.tagName==="INPUT"&&e.key!==" ") return;
  if(e.key===" "){ e.preventDefault(); playing?stop():start(); }
  else if(e.key==="ArrowLeft"||e.key==="ArrowRight"){
    e.preventDefault(); touched=true;
    scrub.value=Math.max(0,Math.min(10000,+scrub.value+(e.key==="ArrowRight"?40:-40)));
    setT(timeAt(scrub.value/10000),true); refreshPlay();
  }
});

/* ---- hover ---- */
cv.addEventListener("pointermove",e=>{
  const r=cv.getBoundingClientRect();
  const mx=(e.clientX-r.left)/r.width*W, my=(e.clientY-r.top)/r.height*H;
  let best=null,bd=22*DPR;
  for(const s of SITES){ if(T>s.t) continue;
    const d=Math.hypot(px(s.x)-mx,py(s.y)-my); if(d<bd){bd=d;best=s;} }
  if(best!==hoverSite){ hoverSite=best; dirty=true; }
  if(best){
    tip.classList.add("on");
    tip.style.left=(px(best.x)/W*r.width)+"px";
    tip.style.top=(py(best.y)/H*r.height)+"px";
    tipB.textContent=best.n;
    const when=best.t>=1000?nf.format(Math.round(best.t/(best.t>=10000?1000:100))*(best.t>=10000?1:100))+(best.t>=10000?" ka":" yr"):best.t+" yr";
    tipS.textContent=best.pl+" · "+when+" BP"+(best.c!=="firm"?" · "+best.c:"");
    tipI.textContent=best.note;
  } else tip.classList.remove("on");
});
cv.addEventListener("pointerleave",()=>{tip.classList.remove("on"); if(hoverSite){hoverSite=null;dirty=true;}});

/* ============================ LOOP ============================ */
const DURATION=96000; // ms for a full 1x sweep
// Paused dates are completely still; redraw only when something changes.
function frame(now){
  if(playing){
    const dt=Math.min(120,now-lastFrame); lastFrame=now;
    let p=pos(T)+ (dt/DURATION)*speed;
    if(p>=1){ p=1; setT(0); stop(); } else setT(timeAt(p));
  }
  if(dirty){ dirty=false; rebuildScene(); composite(); }
  requestAnimationFrame(frame);
}

const ro=new ResizeObserver(()=>sizeAll());
ro.observe(cv);
sizeAll();
setT(21000);
refreshPlay();
requestAnimationFrame(frame);
