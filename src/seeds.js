/** Resample strands into dated reveal seeds; take the short path across the dateline. */
// `trail` turns a strand into a moving blob: each seed fades that many years
// after its own arrival, so the lit part is a short comet following the front
// rather than the whole path staying lit. `fade` sets how abruptly it goes.
export function createSeeds(STRANDS, ISLANDS, RS=1.65) {
  const seeds=[];
  for(const [x,y,t,r] of ISLANDS) seeds.push({x,y,r:r*RS,t});
  for(const s0 of STRANDS){
    const s=Object.assign({},s0,{r:s0.r*RS});
    if(s.skip) continue;
    const pts=s.p, step=Math.max(s.r*0.48,0.8);
    const trailed=(t)=>s.trail===undefined?{gone:s.gone,back:s.back}:{gone:t-s.trail,fade:s.fade??900};
    if(pts.length===1){ seeds.push({x:pts[0][0],y:pts[0][1],r:s.r,t:s.t0,bound:s.bound,...trailed(s.t0)}); continue; }
    // resample along the polyline
    const segs=[]; let total=0;
    for(let i=0;i<pts.length-1;i++){
      let dx=pts[i+1][0]-pts[i][0]; const dy=pts[i+1][1]-pts[i][1];
      if(dx>180) dx-=360; if(dx<-180) dx+=360;
      const L=Math.hypot(dx*Math.cos(pts[i][1]*Math.PI/180),dy);
      segs.push({a:pts[i],dx,dy,L}); total+=L;
    }
    const n=Math.max(2,Math.round(total/step));
    for(let k=0;k<=n;k++){
      const want=total*k/n; let acc=0,px=pts[0][0],py=pts[0][1];
      for(const sg of segs){
        if(want<=acc+sg.L||sg===segs[segs.length-1]){
          const f=sg.L?Math.max(0,Math.min(1,(want-acc)/sg.L)):0;
          px=sg.a[0]+sg.dx*f; py=sg.a[1]+sg.dy*f; break;
        }
        acc+=sg.L;
      }
      if(px>180) px-=360; if(px<-180) px+=360;
      const t=s.t0+(s.t1-s.t0)*(k/n);
      seeds.push({x:px,y:py,r:s.r,t,bound:s.bound,...trailed(t)});
    }
  }
  return seeds.sort((a,b)=>b.t-a.t); // oldest first
}
