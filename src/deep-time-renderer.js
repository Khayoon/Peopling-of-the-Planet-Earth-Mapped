import { ARCHAEA_STRANDS, ARCHAEA_SITES, LINEAGES } from '../data/deep-time.js';
import { CONTAIN } from '../data/geography.js';
import { createSeeds } from './seeds.js';
import { presence } from './model.js';
import { START_BP } from './deep-time-model.js';

// New populations have their own masks and lifetime rules. The original
// sapiens seeds, caches, containment and arrival calculations are untouched.
export function createDeepTimeRenderer({ project, dimensions, enabled }) {
  const make = () => document.createElement('canvas');
  const layer = make(), strandCanvas = make();
  const lc = layer.getContext('2d'), sc = strandCanvas.getContext('2d');
  const strands = ARCHAEA_STRANDS.map(strand => ({
    ...strand,
    seeds: createSeeds([strand], []).map(seed => ({ ...seed, fade: strand.fade })),
  }));
  const groups = ['early', 'neanderthal', 'denisovan'];
  const opening = [
    { n: 'Afar group', x: 40.5, y: 11, label: 'Australopithecus', pl: 'Afar, Ethiopia' },
    { n: 'Turkana group', x: 36, y: 4, label: 'Australopithecus', pl: 'Northern Kenya' },
    { n: 'Southern Rift group', x: 35, y: -3, label: 'Australopithecus', pl: 'Southern Rift Valley' },
  ].map(s => ({...s, group:'early', t:START_BP, opening:true, note:'One of the three Australopithecus groups in the opening scene. Follow the yellow layer as the story moves south.'}));

  function resize() {
    const { W, H } = dimensions();
    for (const canvas of [layer, strandCanvas]) { canvas.width = W; canvas.height = H; }
  }

  function weight(seed, t) {
    // These three groups are already here when the narrative opens. Their
    // placement is a composition, separate from the dated fossil markers.
    if (seed.t >= START_BP && t >= START_BP - 120000) return 1;
    return presence(seed, t);
  }

  function polygon(c, points) {
    c.beginPath();
    points.forEach(([x, y], i) => {
      const p = project(x, y);
      i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y);
    });
    c.closePath();
  }

  function drawPresence(c, t, land) {
    const { W, H } = dimensions();
    for (const group of groups) {
      if (!enabled[group]) continue;
      lc.clearRect(0, 0, W, H);
      let any = false;
      for (const strand of strands.filter(s => s.group === group)) {
        if (t > strand.t0 || (strand.gone !== undefined && t < strand.gone - (strand.fade ?? Math.max(300, strand.gone * .05)))) continue;
        sc.clearRect(0, 0, W, H);
        let painted = false;
        for (const seed of strand.seeds) {
          const a = weight(seed, t);
          if (a <= 0.004) continue;
          const p = project(seed.x, seed.y);
          const rx = Math.abs(project(seed.x + seed.r / Math.max(.4, Math.cos(seed.y * Math.PI / 180)), seed.y).x - p.x);
          const ry = Math.abs(project(seed.x, seed.y + seed.r).y - p.y);
          const radius = rx * (.6 + .4 * a);
          if (p.x < -radius || p.x > W + radius || p.y < -ry || p.y > H + ry) continue;
          any = true; painted = true;
          sc.save(); sc.translate(p.x, p.y); sc.scale(1, ry / Math.max(rx, .01));
          const gradient = sc.createRadialGradient(0, 0, 0, 0, 0, radius);
          gradient.addColorStop(0, `rgba(255,255,255,${.88 * a})`);
          gradient.addColorStop(.6, `rgba(255,255,255,${.70 * a})`);
          gradient.addColorStop(1, 'rgba(255,255,255,0)');
          sc.fillStyle = gradient;
          sc.beginPath(); sc.arc(0, 0, radius, 0, Math.PI * 2); sc.fill(); sc.restore();
        }
        if (!painted) continue;
        if (strand.bound && CONTAIN[strand.bound]) {
          sc.globalCompositeOperation = 'destination-in';
          polygon(sc, CONTAIN[strand.bound]); sc.fillStyle = '#fff'; sc.fill();
          sc.globalCompositeOperation = 'source-over';
        }
        lc.drawImage(strandCanvas, 0, 0);
      }
      if (!any) continue;
      lc.globalCompositeOperation = 'source-in';
      lc.fillStyle = LINEAGES[group].color; lc.fillRect(0, 0, W, H);
      lc.globalCompositeOperation = 'destination-in'; lc.drawImage(land, 0, 0);
      lc.globalCompositeOperation = 'source-over';
      c.drawImage(layer, 0, 0);
    }
  }

  function visibleSites(t) {
    if (t > 2800000) return enabled.early ? opening : [];
    return ARCHAEA_SITES.filter(s => enabled[s.group] && t <= s.t && (s.end === undefined || t >= s.end));
  }

  function drawDetails(c, t, hovered) {
    const { W, H, DPR } = dimensions();
    c.save();
    c.lineCap = 'round';
    for (const strand of strands) {
      if (!enabled[strand.group] || strand.p.length < 2 || t > strand.t0) continue;
      if (strand.gone !== undefined && t < strand.gone - (strand.fade ?? strand.gone * .05)) continue;
      const fraction = Math.max(0, Math.min(1, (strand.t0 - t) / Math.max(1, strand.t0 - strand.t1)));
      const segments = strand.p.length - 1, until = fraction * segments;
      c.beginPath();
      const first = project(...strand.p[0]); c.moveTo(first.x, first.y);
      for (let i = 0; i < segments && i < until; i++) {
        const a = strand.p[i], b = strand.p[i + 1], f = Math.min(1, until - i);
        const p = project(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f);
        c.lineTo(p.x, p.y);
      }
      c.strokeStyle = LINEAGES[strand.group].color;
      c.globalAlpha = .5; c.lineWidth = 1.3 * DPR;
      c.setLineDash([4 * DPR, 5 * DPR]); c.stroke();
    }
    c.globalAlpha = 1; c.setLineDash([]);
    const points = visibleSites(t);
    const recent = [...points].sort((a, b) => Math.abs(a.t - t) - Math.abs(b.t - t));
    const labels = new Set(recent.slice(0, t > 300000 ? 5 : 3));
    if (hovered) labels.add(hovered);
    const labelBoxes = [];
    for (const site of points) {
      const p = project(site.x, site.y);
      if (p.x < 4 || p.x > W - 4 || p.y < 4 || p.y > H - 4) continue;
      const color = LINEAGES[site.group].color;
      c.fillStyle = '#081419'; c.strokeStyle = color; c.lineWidth = 1.5 * DPR;
      c.beginPath(); c.arc(p.x, p.y, (site.opening ? 6 : 4) * DPR, 0, Math.PI * 2); c.fill(); c.stroke();
      c.fillStyle = color; c.beginPath(); c.arc(p.x, p.y, 1.8 * DPR, 0, Math.PI * 2); c.fill();
      if (!labels.has(site)) continue;
      const right = p.x < W * .7, x = p.x + (right ? 12 : -12) * DPR;
      c.textAlign = right ? 'left' : 'right'; c.textBaseline = 'middle';
      c.font = `500 ${13 * DPR}px 'Fira Sans Condensed', Arial, sans-serif`;
      const textWidth = c.measureText(site.n).width;
      const box = { x: right ? x : x - textWidth, y:p.y - 9*DPR, w:textWidth, h:(site.opening?35:18)*DPR };
      const collides = labelBoxes.some(b=>box.x<b.x+b.w+8*DPR&&box.x+box.w+8*DPR>b.x&&box.y<b.y+b.h&&box.y+box.h>b.y);
      if (collides && site!==hovered) continue;
      labelBoxes.push(box);
      c.lineWidth = 4 * DPR; c.strokeStyle = '#081419';
      c.strokeText(site.n, x, p.y); c.fillStyle = '#eee7d5'; c.fillText(site.n, x, p.y);
      if (site.opening) {
        c.font = `italic ${11 * DPR}px Fraunces, Georgia, serif`;
        c.strokeText(site.label, x, p.y + 16 * DPR); c.fillStyle = color; c.fillText(site.label, x, p.y + 16 * DPR);
      }
    }
    if (t > 1900000) {
      c.font = `500 ${10 * DPR}px 'Fira Mono', monospace`;
      c.fillStyle = '#b9c5bf'; c.globalAlpha = .45; c.textAlign = 'center';
      for (const [label, lon, lat] of [['HORN OF AFRICA', 48, 6], ['EAST AFRICA', 28, 10], ['SOUTHERN AFRICA', 24, -23]]) {
        const p = project(lon, lat);
        if (p.x > 70 * DPR && p.x < W - 70 * DPR && p.y > 28 * DPR && p.y < H - 28 * DPR) c.fillText(label, p.x, p.y);
      }
    }
    c.restore();
  }

  return { resize, drawPresence, drawDetails, visibleSites };
}
