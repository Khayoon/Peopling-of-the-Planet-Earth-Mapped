# Code walkthrough

Read this beside the source and run `npm test` after experimenting. These examples explain the implemented model, not additional historical claims.

## 1. Translate the timeline

In [`src/model.js`](../src/model.js), `SEG` contains `[olderDate, youngerDate, sliderFraction]` entries. Fractions sum to 1.

The 70,000–40,000 BP segment starts at slider position 0.21 and receives 0.27 of the bar. At its halfway date, 55,000 BP:

```text
position = 0.21 + ((70,000 - 55,000) / 30,000) × 0.27
         = 0.345
```

`timeAt(0.345)` reverses the calculation. A linear scale would give the last 3,000 years only 1% of the bar; this model gives them 12%. The first three tests protect endpoints, inversion and direction.

**Experiment:** change one segment width. The endpoint test should fail until the widths sum to 1 again. Restore the original values afterward.

## 2. Resample a route

[`createSeeds()`](../src/seeds.js) measures polyline segments, chooses a sample count and interpolates coordinates and dates along the path.

The raw longitude difference between 178° and −175° is −353°. It wraps to +7° for a short Pacific crossing. Generated coordinates are then wrapped back into −180° to +180°. The dateline test catches an accidental route through the Atlantic.

**Experiment:** inspect the result of `createSeeds([{ r: 2, t0: 3000, t1: 2000, p: [[178, -15], [-175, -15]] }], [])` in a Node module. Longitudes should stay near ±180° and dates should decrease from 3000 to 2000.

## 3. Calculate presence

`presence(seed, t)` produces a drawing weight between 0 and 1. It is not a population estimate or probability.

A hypothetical seed arriving at 10,000 BP has a 300-year fade-in: `max(45, arrival × 0.03)`. It is absent at 10,001 BP, halfway visible at 9,850 BP and fully visible at 9,700 BP. A `gone` date can fade it out; `back` can restore it.

**Experiment:** run `node --test --test-name-pattern="retreat"`. Read the synthetic dates in the test before reading the implementation.

## 4. Combine masks

In [`src/atlas.js`](../src/atlas.js), `blob()` paints radial gradients and `paintPresence()` combines them. Canvas mode `lighter` accumulates overlapping gradients; `destination-in` retains only pixels covered by another mask.

A containment fence limits a seed group to a region. The dry-land mask separately prevents ember from spilling into water. Ember is then drawn through the presence mask over cold slate land, with a faint bloom over water so sea crossings still read as glow.

**Experiment:** find each assignment to `globalCompositeOperation`. Identify the mask applied by each `destination-in`, and where `source-over` is restored. An unreset mode would change later operations.

## 5. Invalidate the cache

The baked mask assumes established seeds stay present as time moves forward. Going backward invalidates that assumption.

Find `if(t>bakeTime) resetBake()` in `paintPresence()`. BP dates count backward, so 60,000 BP is earlier than 20,000 BP.

**Experiment:** go to the present, then scrub to 300,000 BP. Later ember regions must disappear. This also requires a browser check: Node tests do not inspect canvas pixels.

## 6. Trace a user action

```text
field-log click → jump(site.t) → stop() + setT()
               → slider/log update; dirty = true
               → next frame rebuilds and composites the map
```

Markers start with nonzero opacity to remain visible at their exact date. Readouts update during scene rebuilding, so a DOM read immediately after an event can precede the rendered frame.

## 7. Know the boundaries

The implementation demonstrates data-driven rendering, Canvas composition, time interpolation, cache invalidation, geographic edge cases and automated testing. It does not implement a GIS reconstruction, population model, real-time ingestion or backend service.

Useful next contributions are structured citations per site and a browser regression test for field-log jumps. Both address concrete current limitations.
