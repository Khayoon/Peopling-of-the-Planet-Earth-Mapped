# Where the dates live

Every date on this map is authored in one of five places. Nothing is computed from a
model of population growth, and no date is derived from another. If a date looks wrong,
it is editable, and this page says where.

All values are **years before present (BP)**, counting down. `t0` is always older than
`t1`. Calendar readouts subtract from 1950.

| What you want to change | File | Field |
| --- | --- | --- |
| A dated site's age, position, wording or confidence label | `data/migration.js` → `SITES` | `t`, `x`, `y`, `n`, `pl`, `c`, `note` |
| When a region fills in, and how fast | `data/migration.js` → `STRANDS` | `t0` → `t1` along `p` |
| When people leave a region, and whether they return | `data/migration.js` → `STRANDS` | `gone`, `back` |
| A group that moves instead of spreading | `data/migration.js` → `STRANDS` | `trail`, `fade` |
| Which fence a strand is confined to | `data/migration.js` → `STRANDS` | `bound` |
| The shape of a fence | `data/geography.js` → `CONTAIN` | polygon by name |
| When an island is settled | `data/migration.js` → `ISLANDS` | third element of each row |
| When a land bridge is dry | `data/geography.js` → `SHELF` | `d` (depth) and `win` (dated window) |
| Sea level at a date | `data/geography.js` → `SL` | `[BP, metres]` pairs |
| How much of the slider a period gets | `src/model.js` → `SEG` | third element of each row |
| The name shown for a period | `src/model.js` → `ERAS` | `[older, younger, label]` |

## How a strand becomes visible ground

A strand is a polyline with a start and end date. `createSeeds` resamples it into
overlapping circles and interpolates a date along the path, so the first point lights up
at `t0` and the last at `t1`. Radius `r` is in degrees before a scale factor; the reveal
is clipped to land, so a generous radius is normal.

```js
{ r: 5, t0: 18000, t1: 14800, p: [[-102,34], [-96,33], [-91,32], [-86,31], [-83,29]] }
```

That reads: *starting 18,000 BP in west Texas, reaching the Florida panhandle by 14,800 BP.*

`gone` fades a strand back out; `back` brings it in again. Both exist because people
genuinely left places — north-west Europe under the ice, northern Siberia, Greenland.

`trail` is different: instead of one shared retreat date, every seed fades that many
years after **its own** arrival, so only a short stretch behind the front stays lit. The
strand reads as a group walking rather than a region filling in. `fade` sets how quickly
each point goes out (default 900 years). The failed first wave's walk from Arabia to
Sunda and Sahul uses `trail: 1800`.

## Fences

A `bound` name confines a strand to a polygon in `CONTAIN`, permanently. Fences exist
because seed radii are wide enough to jump narrow water: without one, Africa's spread
crosses the Strait of Gibraltar. Three fences are in use:

- `africa` — the African spread cannot leave the continent.
- `excursion` — the failed Levant and Arabian excursions cannot reach Anatolia or Iran.
- `northAmericaSouth` — the early North American spread stays south of the ice sheets.

`northAmericaSouth` also gets a second, moving clip: the renderer subtracts the current
Laurentide and Cordilleran outlines from it every frame, using the same `iceShape()` the
visible ice overlay uses. So that group cannot occupy ground that is under ice at that
date, and it opens up as the ice retreats without needing its own retreat dates.

## The North American sequence, as currently authored

| Strand | Window | Path |
| --- | --- | --- |
| Pacific coast route | 25,000 → 22,200 | Alaska to the American Southwest |
| Southern spread begins | 20,000 → 18,000 | Southwest across to west Texas |
| Gulf coast | 18,000 → 14,800 | west Texas to the Florida panhandle |
| Interior and eastern seaboard | 17,000 → 10,350 | mid-continent to the Gulf of Maine |
| Mexico and Central America southward | 21,500 → 17,000 | continues to South America |
| Post-glacial Canada | 11,000 → 7,500 | fills as the ice leaves |
| High Arctic | 4,700 → 4,200 | Nunavut and the Arctic islands |
| Greenland | 4,500 → 3,900, `gone` 2,700, `back` 1,000 | settled, abandoned, resettled |

The southern spread is an **authored interpolation between anchors**, not a dated
settlement boundary. The anchors it runs between are White Sands (23–21,000 BP),
[Page-Ladson in Florida](https://doi.org/10.1126/sciadv.1600375) (14,550 BP), Monte Verde
(14,500 BP) and the Clovis horizon (13,000 BP). Sites in eastern North America older than
Page-Ladson exist and are argued over; this map does not take a side on them, and the
smooth fill between anchors should not be read as evidence for any particular one.

The eastern seaboard finishing near 10,350 BP is later than the Gulf coast on purpose.
The northeast was under the Laurentide ice sheet long after the Southeast was habitable,
so it is the ice clip, not distance, that holds that ground back.

## After changing a date

```
npm run check     # every module parses, every asset referenced by index.html exists
npm test          # timeline round trips, presence, retreat, shelf windows, dataset invariants
npm run build     # refresh dist/ before publishing
```

The tests check that the software behaves, not that a date is right. `tests/model.test.js`
asserts an exact `SITES.length`, so adding or removing a site means updating that number
and the count quoted in `README.md`.
