import test from 'node:test';
import assert from 'node:assert/strict';
import { pos, timeAt, SEG, seaLevel, iceFactor, eraAt, presence, shelfAlpha, hotOf } from '../src/model.js';
import { createSeeds } from '../src/seeds.js';
import { SITES, STRANDS, ISLANDS } from '../data/migration.js';
import { CONTAIN, SL } from '../data/geography.js';

test('timeline maps the entire historical interval to the slider endpoints', () => {
  assert.equal(pos(300000), 0);
  assert.ok(Math.abs(pos(0) - 1) < 1e-12);
  assert.equal(timeAt(0), 300000);
  assert.ok(Math.abs(timeAt(1)) < 1e-8);
  assert.ok(Math.abs(SEG.reduce((sum, segment) => sum + segment[2], 0) - 1) < 1e-12);
});

test('timeline round trips across every segment, boundary and site date', () => {
  const dates = [0, 300000, ...SEG.flatMap(([hi, lo]) => [hi, lo, (hi + lo) / 2]), ...SITES.map(s => s.t)];
  for (const date of dates) assert.ok(Math.abs(timeAt(pos(date)) - date) < 1e-7, `Failed at ${date} BP`);
});

test('advancing the slider never moves backward in history', () => {
  let previous = Infinity;
  for (let i = 0; i <= 10000; i++) {
    const age = timeAt(i / 10000);
    assert.ok(age <= previous && age >= -1e-8);
    previous = age;
  }
});

test('sea-level interpolation preserves anchors and stays between adjacent values', () => {
  for (const [date, metres] of SL) assert.equal(seaLevel(date), metres);
  for (let i = 1; i < SL.length; i++) {
    const a = SL[i - 1], b = SL[i];
    assert.ok(Math.abs(seaLevel((a[0] + b[0]) / 2) - (a[1] + b[1]) / 2) < 1e-10);
  }
  assert.equal(iceFactor(21000), 1);
  assert.equal(iceFactor(0), 0);
  assert.equal(eraAt(21000), 'Last Glacial Maximum');
});

test('a seed is absent before arrival, ramps in, then remains present', () => {
  const seed = { t: 10000 };
  assert.equal(presence(seed, 10001), 0);
  assert.equal(presence(seed, 10000), 0);
  assert.equal(presence(seed, 9850), 0.5);
  assert.equal(presence(seed, 9700), 1);
  assert.equal(presence(seed, 0), 1);
});

test('explicit retreat can erase presence and recolonisation can restore it', () => {
  const seed = { t: 10000, gone: 5000, back: 1000 };
  assert.equal(presence(seed, 6000), 1);
  assert.equal(presence(seed, 4850), 0.5);
  assert.equal(presence(seed, 4700), 0);
  assert.equal(presence(seed, 1500), 0);
  assert.equal(presence(seed, 900), 0.5);
  assert.equal(presence(seed, 800), 1);
});

test('arrival accents fade without erasing established presence', () => {
  const seed = { t: 10000 };
  assert.equal(hotOf(seed, 10001), 0);
  assert.ok(hotOf(seed, 9700) > 0);
  assert.equal(hotOf(seed, 9000), 0);
  assert.equal(presence(seed, 9000), 1);
});

test('exposed shelves respect both depth and independent time windows', () => {
  const shelf = { d: 40, win: [37000, 11000] };
  assert.equal(shelfAlpha(shelf, 21000, -20), 0);
  assert.equal(shelfAlpha(shelf, 21000, -120), 1);
  assert.equal(shelfAlpha(shelf, 40000, -120), 0);
  assert.equal(shelfAlpha(shelf, 10000, -120), 0);
});

test('Pacific seed interpolation crosses the dateline instead of the whole world', () => {
  const strand = { r: 2, t0: 3000, t1: 2000, p: [[178, -15], [-175, -15]] };
  const seeds = createSeeds([strand], [], 1);
  assert.ok(seeds.length > 2);
  assert.ok(seeds.every(seed => Math.abs(seed.x) >= 175));
  assert.equal(seeds[0].t, 3000);
  assert.equal(seeds.at(-1).t, 2000);
});

test('seed generation preserves inputs and carries containment and retreat metadata', () => {
  const input = [{ r: 2, t0: 10000, t1: 9000, gone: 5000, back: 1000, bound: 'africa', p: [[10, 10], [20, 15]] }];
  const original = structuredClone(input);
  const seeds = createSeeds(input, []);
  assert.deepEqual(input, original);
  assert.ok(seeds.every(s => s.bound === 'africa' && s.gone === 5000 && s.back === 1000));
});

test('the shipped dataset has valid coordinates, dates, classifications and fence references', () => {
  assert.equal(SITES.length, 43);
  for (const site of SITES) {
    assert.ok(site.t >= 0 && site.t <= 300000);
    assert.ok(Math.abs(site.x) <= 180 && Math.abs(site.y) <= 90);
    assert.ok(['firm', 'debated', 'contested'].includes(site.c));
  }
  const seeds = createSeeds(STRANDS, ISLANDS);
  for (let i = 0; i < seeds.length; i++) {
    const seed = seeds[i];
    assert.ok([seed.x, seed.y, seed.t, seed.r].every(Number.isFinite));
    assert.ok(Math.abs(seed.x) <= 180 && Math.abs(seed.y) <= 90 && seed.r > 0);
    assert.ok(!seed.bound || CONTAIN[seed.bound]);
    if (i) assert.ok(seeds[i - 1].t >= seed.t);
  }
});

test('a trailed strand fades behind its own front instead of staying lit', () => {
  const [strand] = [{ r: 3, t0: 80000, t1: 70000, trail: 1800, p: [[40, 20], [100, 0]] }];
  const seeds = createSeeds([strand], []);
  const front = seeds[0], back = seeds.at(-1);

  // Each seed carries its own retreat date, offset from its own arrival.
  for (const seed of seeds) assert.equal(seed.gone, seed.t - 1800);
  assert.equal(front.t, 80000);
  assert.equal(back.t, 70000);

  // When the front reaches the far end, the start must already be dark.
  assert.equal(presence(front, back.t), 0);
  assert.ok(presence(back, back.t - 200) > 0);   // BP counts down: later means smaller

  // Only a short stretch is lit at any moment, which is what makes it read as
  // one group moving rather than a corridor filling in behind it.
  for (const moment of [78000, 75000, 72000]) {
    const lit = seeds.filter(s => presence(s, moment) > 0.3).length;
    assert.ok(lit > 0, `nothing lit at ${moment} BP`);
    assert.ok(lit < seeds.length * 0.4, `${lit}/${seeds.length} lit at ${moment} BP`);
  }
});

test('the failed first wave connects Arabia to the Sunda and Sahul toeholds', () => {
  const travelling = STRANDS.filter(s => s.trail !== undefined);
  assert.equal(travelling.length, 2);
  const [east, sahul] = travelling;

  // It leaves after Al Wusta (85,000 BP) and hands over where the next leg starts.
  assert.ok(east.t0 <= 85000 && east.t0 > sahul.t0);
  assert.equal(east.t1, sahul.t0);

  // Each leg ends on the site the toehold strands later use.
  const near = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]) < 0.5;
  assert.ok(near(east.p.at(-1), [100.7, -0.4]));   // Lida Ajer
  assert.ok(near(sahul.p.at(-1), [132.9, -12.4])); // Madjedbebe
  for (const site of ['Lida Ajer', 'Madjedbebe']) {
    const record = SITES.find(s => s.n === site);
    assert.ok(record && record.t <= (site === 'Lida Ajer' ? east.t1 : sahul.t1) + 1000);
  }
});
