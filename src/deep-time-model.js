import { pos, timeAt } from './model.js';

export const START_BP = 4000000;
export const SAPIENS_START_BP = 300000;

// The existing sapiens timeline keeps its relative pacing in the final 54%.
const SAPIENS_POSITION = 0.46;
const SAPIENS_WIDTH = 0.54;
const EARLY_SEGMENTS = [
  [4000000, 3000000, 0.10],
  [3000000, 2000000, 0.10],
  [2000000, 1000000, 0.12],
  [1000000, 300000, 0.14],
];

// Missing or invalid values return to the beginning; infinities clamp normally.
function clamp(value, lower, upper, fallback) {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback;
  return Math.max(lower, Math.min(upper, value));
}

const ageOf = value => clamp(value, 0, START_BP, START_BP);

/** Convert years before present to the extended slider's normalized position. */
export function extendedPos(yearsBP) {
  const age = ageOf(yearsBP);
  if (age <= SAPIENS_START_BP) return SAPIENS_POSITION + SAPIENS_WIDTH * pos(age);
  let start = 0;
  for (const [older, younger, width] of EARLY_SEGMENTS) {
    if (age >= younger) return start + (older - age) / (older - younger) * width;
    start += width;
  }
  return SAPIENS_POSITION;
}

/** Invert extendedPos(), with input clamped to the visible slider interval. */
export function extendedTimeAt(position) {
  const progress = clamp(position, 0, 1, 0);
  if (progress >= SAPIENS_POSITION) {
    return Math.max(0, timeAt((progress - SAPIENS_POSITION) / SAPIENS_WIDTH));
  }
  let start = 0;
  for (const [older, younger, width] of EARLY_SEGMENTS) {
    if (progress <= start + width) return older - (progress - start) / width * (older - younger);
    start += width;
  }
  return SAPIENS_START_BP;
}

const CAMERA_KEYS = [
  { t: 4000000, lon: 35, lat: 4, span: 60, label: 'East Africa' },
  { t: 3000000, lon: 35, lat: 4, span: 60, label: 'East Africa' },
  { t: 2500000, lon: 29, lat: -9, span: 150, label: 'Eastern & southern Africa' },
  { t: 2000000, lon: 29, lat: -9, span: 150, label: 'Eastern & southern Africa' },
  { t: 1800000, lon: 43, lat: 12, span: 192, label: 'Africa & western Eurasia' },
  { t: 1000000, lon: 55, lat: 14, span: 240, label: 'Afro-Eurasia' },
  { t: 400000, lon: 0, lat: 14, span: 360, label: 'World' },
  { t: 0, lon: 0, lat: 14, span: 360, label: 'World' },
];

/** An authored camera, not a reconstruction of geographic species boundaries. */
export function cameraAt(yearsBP) {
  const age = ageOf(yearsBP);
  for (let i = 1; i < CAMERA_KEYS.length; i++) {
    const from = CAMERA_KEYS[i - 1], to = CAMERA_KEYS[i];
    if (age < to.t) continue;
    const fraction = (from.t - age) / (from.t - to.t);
    const eased = fraction * fraction * (3 - 2 * fraction);
    return {
      lon: from.lon + (to.lon - from.lon) * eased,
      lat: from.lat + (to.lat - from.lat) * eased,
      span: from.span + (to.span - from.span) * eased,
      label: eased < 0.5 ? from.label : to.label,
    };
  }
  const { lon, lat, span, label } = CAMERA_KEYS.at(-1);
  return { lon, lat, span, label };
}

const CHAPTERS = [
  {
    younger: 2800000, id: 'african-origins', title: 'Three groups in East Africa',
    note: 'The story begins with three Australopithecus groups at the forest edge, moving into open grassland.',
  },
  {
    younger: 1900000, id: 'african-expansion', title: 'Early Homo expands south',
    note: 'From East Africa, the first expansion runs south, toward the Cape.',
  },
  {
    younger: 400000, id: 'early-homo', title: 'Homo erectus leaves Africa',
    note: 'The journey opens into Eurasia as Homo erectus spreads beyond Africa.',
  },
  {
    younger: 70000, id: 'shared-world', title: 'A world of human relatives',
    note: 'Neanderthals, Denisovans and Homo sapiens share the world, each following their own paths.',
  },
  {
    younger: 0, id: 'sapiens-dispersal', title: 'The Homo sapiens journey',
    note: 'Follow the existing sapiens dispersal through a world also inhabited by other human lineages.',
  },
  {
    younger: -1, id: 'today', title: 'One surviving human species',
    note: 'Homo sapiens is the only surviving human species; traces of ancient encounters remain in living people’s DNA.',
  },
];

/** Broad reading chapters; their transitions are not precise species boundaries. */
export function chapterAt(yearsBP) {
  const age = ageOf(yearsBP);
  const { id, title, note } = CHAPTERS.find(chapter => age > chapter.younger);
  return { id, title, note };
}

/** Compact ages for evidence labels: Ma/ka mean million/thousand years ago. */
export function formatAge(yearsBP) {
  // Evidence can predate the visible timeline (for example Kanapoi at 4.2 Ma).
  const age = typeof yearsBP === 'number' && Number.isFinite(yearsBP)
    ? Math.max(0, yearsBP) : ageOf(yearsBP);
  if (age >= 1000000) {
    return `${(age / 1000000).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} Ma`;
  }
  if (age >= 1000) return `${(age / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 })} ka`;
  return `${Math.round(age)} BP`;
}
