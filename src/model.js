import { SL } from '../data/geography.js';

// [older BP, younger BP, fraction of slider]. Fractions add up to 1.
export const SEG = [
  [300000, 100000, 0.11],
  [100000, 70000, 0.10],
  [70000, 40000, 0.27],
  [40000, 20000, 0.17],
  [20000, 10000, 0.14],
  [10000, 3000, 0.09],
  [3000, 0, 0.12],
];

/** Convert a date (0–300000 BP) to its normalized slider position. */
export function pos(yearsBP) {
  let start = 0;
  for (const [older, younger, width] of SEG) {
    if (yearsBP >= younger) {
      const fraction = (older - Math.min(yearsBP, older)) / (older - younger);
      return start + fraction * width;
    }
    start += width;
  }
  return 1;
}

/** Inverse of pos(), for normalized input in [0, 1]. */
export function timeAt(position) {
  let start = 0;
  for (const [older, younger, width] of SEG) {
    if (position <= start + width + 1e-9) {
      const fraction = (position - start) / width;
      return older - fraction * (older - younger);
    }
    start += width;
  }
  return 0;
}

/** Linearly interpolate a descending-date table, clamping beyond its endpoints. */
export function lerpTable(table, yearsBP) {
  if (yearsBP >= table[0][0]) return table[0][1];
  for (let i = 0; i < table.length - 1; i++) {
    const [older, first] = table[i];
    const [younger, second] = table[i + 1];
    if (yearsBP <= older && yearsBP >= younger) {
      const fraction = (older - yearsBP) / (older - younger);
      return first + (second - first) * fraction;
    }
  }
  return table.at(-1)[1];
}

export const seaLevel = yearsBP => lerpTable(SL, yearsBP);
export const iceFactor = yearsBP => Math.max(0, Math.min(1, -seaLevel(yearsBP) / 125));

/** Shared schematic geometry for visible ice and the early American reveal mask. */
export function iceShape(sheet, yearsBP) {
  const ice = iceFactor(yearsBP);
  const pres = Math.max(sheet.min || 0, ice);
  if (pres <= 0.06) return null;
  const cx = sheet.p.reduce((sum, p) => sum + p[0], 0) / sheet.p.length;
  const cy = sheet.p.reduce((sum, p) => sum + p[1], 0) / sheet.p.length;
  const scale = sheet.min ? 0.90 : 0.34 + 0.66 * ice;
  return {
    pres, sea: sheet.min ? 0 : ice,
    pts: sheet.p.map(([x, y]) => [cx + (x - cx) * scale, cy + (y - cy) * scale]),
  };
}

export const ERAS = [
  [300000, 191000, 'Middle Stone Age'],
  [191000, 130000, 'Penultimate glacial'],
  [130000, 115000, 'Last interglacial'],
  [115000, 71000, 'MIS 5 — early excursions'],
  [71000, 57000, 'MIS 4 cold pulse'],
  [57000, 29000, 'MIS 3 — the main dispersal'],
  [29000, 26500, 'Glacial onset'],
  [26500, 19000, 'Last Glacial Maximum'],
  [19000, 12900, 'Deglaciation'],
  [12900, 11700, 'Younger Dryas'],
  [11700, 0, 'Holocene'],
];

export function eraAt(yearsBP) {
  for (const [older, younger, name] of ERAS) {
    if (yearsBP <= older && yearsBP > younger) return name;
  }
  return 'Holocene';
}

/** A drawing weight, not a population or probability. Lower BP means later. */
export function presence(seed, yearsBP) {
  if (yearsBP > seed.t) return 0;
  const arrivalRamp = Math.max(45, seed.t * 0.030);
  let weight = Math.min(1, (seed.t - yearsBP) / arrivalRamp);

  if (seed.gone !== undefined && yearsBP < seed.gone) {
    const retreatRamp = seed.fade ?? Math.max(300, seed.gone * 0.05);
    weight *= Math.max(0, 1 - (seed.gone - yearsBP) / retreatRamp);
    if (seed.back !== undefined && yearsBP < seed.back) {
      const returnRamp = Math.max(200, seed.back * 0.12);
      weight = Math.max(weight, Math.min(1, (seed.back - yearsBP) / returnRamp));
    }
  }
  return weight;
}

/** Shelf exposure depends on sea level and, optionally, an authored time window. */
export function shelfAlpha(shelf, yearsBP, seaLevelMetres) {
  let weight = Math.max(0, Math.min(1, (-seaLevelMetres - shelf.d) / 22));
  if (shelf.win) {
    const [opened, closed] = shelf.win;
    const ramp = 2500;
    weight = Math.min(weight, Math.max(0, Math.min(
      (opened - yearsBP) / ramp, (yearsBP - closed) / ramp, 1,
    )));
  }
  return weight;
}

/** A short-lived highlight layered over established presence. */
export function hotOf(seed, yearsBP) {
  const age = seed.t - yearsBP;
  if (age < 0) return 0;
  const duration = Math.max(200, seed.t * 0.09);
  if (age >= duration) return 0;
  const weight = presence(seed, yearsBP);
  if (weight <= 0.004) return 0;
  return (1 - age / duration) * weight;
}
