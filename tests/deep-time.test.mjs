import test from 'node:test';
import assert from 'node:assert/strict';
import { pos, timeAt, SEG, presence } from '../src/model.js';
import { SITES } from '../data/migration.js';
import { ARCHAEA_SITES, ARCHAEA_STRANDS, LINEAGES, SOURCES } from '../data/deep-time.js';
import { CONTAIN } from '../data/geography.js';
import { createSeeds } from '../src/seeds.js';
import {
  START_BP, SAPIENS_START_BP, extendedPos, extendedTimeAt, cameraAt, chapterAt, formatAge,
} from '../src/deep-time-model.js';

const near = (actual, expected, tolerance = 1e-7) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} differs from ${expected}`);
};

test('the extended timeline reserves 46% for deep time and keeps its boundary dates', () => {
  assert.equal(START_BP, 4000000);
  assert.equal(SAPIENS_START_BP, 300000);
  for (const [date, progress] of [[4000000, 0], [3000000, 0.1], [2000000, 0.2], [1000000, 0.32], [300000, 0.46], [0, 1]]) {
    near(extendedPos(date), progress, 1e-12);
    near(extendedTimeAt(progress), date);
  }
});

test('sapiens dates and relative slider pacing use the original model unchanged', () => {
  const dates = [0, 300000, ...SEG.flatMap(([older, younger]) => [older, younger, (older + younger) / 2]), ...SITES.map(site => site.t)];
  for (let age = 0; age <= 300000; age += 1000) dates.push(age);
  for (const age of dates) {
    assert.equal(extendedPos(age), 0.46 + 0.54 * pos(age));
    near(extendedTimeAt(extendedPos(age)), age);
  }
  for (let i = 0; i <= 1000; i++) near(extendedTimeAt(0.46 + 0.54 * i / 1000), timeAt(i / 1000));
});

test('scrubbing round trips across deep time without reversing chronology', () => {
  let previous = START_BP;
  for (let i = 0; i <= 10000; i++) {
    const progress = i / 10000, age = extendedTimeAt(progress);
    assert.ok(age <= previous && age >= 0);
    near(extendedPos(age), progress, 1e-12);
    previous = age;
  }
});

test('timeline and camera clamp endpoints and tolerate invalid inputs', () => {
  for (const age of [Infinity, START_BP + 1]) {
    assert.equal(extendedPos(age), 0);
    assert.deepEqual(cameraAt(age), cameraAt(START_BP));
  }
  for (const age of [-Infinity, -1]) {
    near(extendedPos(age), 1, 1e-12);
    assert.deepEqual(cameraAt(age), cameraAt(0));
  }
  assert.equal(extendedTimeAt(-1), START_BP);
  assert.equal(extendedTimeAt(Infinity), 0);
  for (const value of [NaN, undefined, null, 'invalid']) {
    assert.equal(extendedPos(value), 0);
    assert.equal(extendedTimeAt(value), START_BP);
    assert.deepEqual(cameraAt(value), cameraAt(START_BP));
    assert.equal(chapterAt(value).id, 'african-origins');
    assert.equal(formatAge(value), '4.0 Ma');
  }
});

test('the camera opens near the Horn, expands south, and reaches the original world view', () => {
  assert.deepEqual(cameraAt(4000000), { lon: 35, lat: 4, span: 60, label: 'East Africa' });
  assert.deepEqual(cameraAt(3000000), cameraAt(4000000));
  assert.deepEqual(cameraAt(2500000), { lon: 29, lat: -9, span: 150, label: 'Eastern & southern Africa' });
  assert.deepEqual(cameraAt(2000000), cameraAt(2500000));
  assert.deepEqual(cameraAt(1800000), { lon: 43, lat: 12, span: 192, label: 'Africa & western Eurasia' });
  assert.deepEqual(cameraAt(1000000), { lon: 55, lat: 14, span: 240, label: 'Afro-Eurasia' });
  for (const age of [400000, 300000, 100000, 40000, 10000, 0]) {
    assert.deepEqual(cameraAt(age), { lon: 0, lat: 14, span: 360, label: 'World' });
  }
});

test('the southern camera includes the Horn and Cape through the southward arrival', () => {
  for (const age of [2500000, 2200000, 2000000, 1950000]) {
    const camera = cameraAt(age);
    const halfLatitudeSpan = camera.span * 140 / 720;
    assert.ok(camera.lat + halfLatitudeSpan >= 14, `Horn margin missing at ${age}`);
    assert.ok(camera.lat - halfLatitudeSpan <= -36, `Cape margin missing at ${age}`);
  }
});

test('Dmanisi is framed with margin when its marker and route endpoint first appear', () => {
  const site = ARCHAEA_SITES.find(s => s.id === 'dmanisi');
  assert.ok(site);
  for (const age of [1850000, 1800000]) {
    const camera = cameraAt(age), halfLatitudeSpan = camera.span * 140 / 720;
    assert.ok(site.y <= camera.lat + halfLatitudeSpan - 2);
    assert.ok(site.y >= camera.lat - halfLatitudeSpan + 2);
    assert.ok(site.x <= camera.lon + camera.span / 2 - 2);
    assert.ok(site.x >= camera.lon - camera.span / 2 + 2);
  }
});

test('camera position stays continuous and does not overshoot between keyframes', () => {
  const keys = [4000000, 3000000, 2500000, 2000000, 1800000, 1000000, 400000, 0];
  for (const age of keys.slice(1, -1)) {
    for (const dimension of ['lon', 'lat', 'span']) {
      near(cameraAt(age + 1)[dimension], cameraAt(age - 1)[dimension], 1e-7);
    }
  }
  for (let i = 1; i < keys.length; i++) {
    const from = cameraAt(keys[i - 1]), to = cameraAt(keys[i]);
    let previous = from;
    for (let step = 1; step <= 100; step++) {
      const frame = cameraAt(keys[i - 1] + (keys[i] - keys[i - 1]) * step / 100);
      for (const dimension of ['lon', 'lat', 'span']) {
        assert.ok(Number.isFinite(frame[dimension]));
        assert.ok(frame[dimension] >= Math.min(from[dimension], to[dimension]) - 1e-9);
        assert.ok(frame[dimension] <= Math.max(from[dimension], to[dimension]) + 1e-9);
        assert.ok((frame[dimension] - previous[dimension]) * (to[dimension] - from[dimension]) >= -1e-9);
      }
      previous = frame;
    }
  }
});

test('chapters change at their authored dates and label broad early Homo separately', () => {
  assert.equal(chapterAt(4000000).id, 'african-origins');
  for (const [boundary, older, younger] of [
    [2800000, 'african-origins', 'african-expansion'],
    [1900000, 'african-expansion', 'early-homo'],
    [400000, 'early-homo', 'shared-world'],
    [70000, 'shared-world', 'sapiens-dispersal'],
    [0, 'sapiens-dispersal', 'today'],
  ]) {
    assert.equal(chapterAt(boundary + 1).id, older);
    assert.equal(chapterAt(boundary).id, younger);
    assert.ok(chapterAt(boundary).title && chapterAt(boundary).note);
  }
});

test('evidence ages retain useful precision across the million-year boundary', () => {
  assert.equal(formatAge(4200000), '4.2 Ma');
  assert.equal(formatAge(4000000), '4.0 Ma');
  assert.equal(formatAge(1750000), '1.75 Ma');
  assert.equal(formatAge(300000), '300 ka');
  assert.equal(formatAge(14600), '14.6 ka');
  assert.equal(formatAge(950), '950 BP');
  assert.equal(formatAge(0), '0 BP');
});

test('new evidence and ranges have valid lineage references, coordinates, dates and sources', () => {
  const groups = new Set(['early', 'neanderthal', 'denisovan']);
  const ids = new Set();
  const sourceUrls = new Set(SOURCES.map(source => source.url));
  const coordinate = ([x, y]) => Number.isFinite(x) && Number.isFinite(y) && Math.abs(x) <= 180 && Math.abs(y) <= 90;
  assert.equal(new Set(Object.values(LINEAGES).map(lineage => lineage.color)).size, 4);
  for (const site of ARCHAEA_SITES) {
    assert.ok(site.id && !ids.has(site.id), `Repeated site ID: ${site.id}`);
    ids.add(site.id);
    assert.ok(groups.has(site.group) && LINEAGES[site.group]);
    assert.ok(coordinate([site.x, site.y]), site.id);
    assert.ok(Number.isFinite(site.t) && site.t > 0, site.id);
    assert.ok(Number.isFinite(site.end) && site.end >= 0 && site.end <= site.t, site.id);
    assert.ok(site.n && site.pl && site.note, site.id);
    assert.ok(site.url.startsWith('https://') && sourceUrls.has(site.url), site.id);
  }
  for (const strand of ARCHAEA_STRANDS) {
    assert.ok(groups.has(strand.group) && LINEAGES[strand.group]);
    assert.ok(strand.p.length > 0 && strand.p.every(coordinate));
    assert.ok([strand.t0, strand.t1, strand.gone, strand.fade, strand.r].every(Number.isFinite));
    assert.ok(strand.t0 <= START_BP && strand.t0 >= strand.t1 && strand.t1 >= strand.gone);
    assert.ok(strand.gone > 0 && strand.fade > 0 && strand.fade <= strand.gone && strand.r > 0);
    assert.ok(!strand.bound || CONTAIN[strand.bound]);
    const seeds = createSeeds([strand], []);
    assert.ok(seeds.length > 0);
    assert.ok(seeds.every(seed => coordinate([seed.x, seed.y]) && seed.t >= strand.t1 && seed.t <= strand.t0));
  }
});

test('the opening contains exactly the three East African populations', () => {
  const opening = ARCHAEA_STRANDS.filter(strand => strand.t0 === START_BP);
  assert.equal(opening.length, 3);
  assert.deepEqual(opening.map(strand => strand.p), [[[40.5, 11]], [[36, 4]], [[35, -3]]]);
  for (const strand of opening) {
    assert.equal(strand.group, 'early');
    assert.equal(strand.bound, 'africa');
    assert.equal(strand.t1, START_BP);
    const [seed] = createSeeds([strand], []);
    assert.deepEqual([seed.x, seed.y], strand.p[0]);
    const camera = cameraAt(START_BP), halfLatitudeSpan = camera.span * 140 / 720;
    assert.ok(seed.y < camera.lat + halfLatitudeSpan && seed.y > camera.lat - halfLatitudeSpan);
  }
});

test('the Cape expansion finishes before the first northeastern departure from Africa', () => {
  const cape = ARCHAEA_STRANDS.find(strand => strand.group === 'early' && strand.bound === 'africa' && strand.p.at(-1)[1] <= -33);
  const departures = ARCHAEA_STRANDS.filter(strand => strand.group === 'early' && !strand.bound)
    .sort((a, b) => b.t0 - a.t0);
  assert.ok(cape && departures.length);
  assert.deepEqual(cape.p.at(-1), [20, -34]);
  assert.ok(cape.t1 > departures[0].t0, 'BP runs downward: Cape arrival must precede departure');
  assert.ok(departures.every(strand => strand.t0 < cape.t1));
  assert.deepEqual(departures[0].p[0], [39, 10]);
  const dmanisi = ARCHAEA_SITES.find(site => site.id === 'dmanisi');
  assert.deepEqual(departures[0].p.at(-1), [dmanisi.x, dmanisi.y]);
});

test('archaic presence fades completely by 30 ka while retaining the earlier shared world', () => {
  const seeded = ARCHAEA_STRANDS.flatMap(strand => createSeeds([strand], []).map(seed => ({
    ...seed, group: strand.group, fade: strand.fade,
  })));
  for (const [group, visibleAt, absentBy] of [
    ['early', 120000, 108000], ['neanderthal', 50000, 38000], ['denisovan', 50000, 30000],
  ]) {
    const lineageSeeds = seeded.filter(seed => seed.group === group);
    assert.ok(lineageSeeds.some(seed => presence(seed, visibleAt) > 0.1), `${group} missing in its overlap chapter`);
    assert.ok(lineageSeeds.every(seed => presence(seed, absentBy) === 0), `${group} did not finish fading`);
  }
  for (const age of [30000, 29999, 21000, 10000, 0]) {
    assert.ok(seeded.every(seed => presence(seed, age) === 0), `Archaic presence remains at ${age} BP`);
    assert.ok(ARCHAEA_SITES.every(site => age < site.end), `Archaic marker remains at ${age} BP`);
  }
});
