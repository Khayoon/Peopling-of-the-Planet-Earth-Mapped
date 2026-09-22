# The Long Walk Out

**An interactive atlas of human dispersal over 300,000 years.**

[Explore the live map](https://khayoon.github.io/Peopling-of-the-Planet-Earth-Mapped/) · [Architecture](docs/ARCHITECTURE.md) · [Code walkthrough](docs/CODE_WALKTHROUGH.md) · [Sources & assumptions](docs/METHODOLOGY.md) · [Where the dates live](docs/TIMELINE.md)

[![Checks and Pages](https://github.com/Khayoon/Peopling-of-the-Planet-Earth-Mapped/actions/workflows/pages.yml/badge.svg)](https://github.com/Khayoon/Peopling-of-the-Planet-Earth-Mapped/actions/workflows/pages.yml)

Built with **vanilla JavaScript, native ES modules, Canvas 2D, HTML and CSS**. There are no application dependencies, framework runtime, external map tiles or API keys. Node.js is used only for development, tests and packaging.

## What to try

- Play from 300,000 BP, then change the speed or scrub backward.
- Jump to the Last Glacial Maximum to see the exposed shelves and ice barriers.
- Select White Sands or another field-log entry to jump to its date.
- Hover a dated site to read its note. Disputed dates have distinct markers.
- On a phone, swipe the map horizontally; its geographic proportions stay intact.

Ember represents **modelled presence**, not population, certainty or the extent of human knowledge. Oceans are background geography and carry no explored/unexplored status. This is an educational visualization with authored assumptions, not a validated reconstruction of exact settlement boundaries.

## Run locally

Use Node.js 22 or newer. No `npm install` is required.

```sh
git clone https://github.com/Khayoon/Peopling-of-the-Planet-Earth-Mapped.git
cd Peopling-of-the-Planet-Earth-Mapped
npm start
```

Open **http://127.0.0.1:4173/**. Serve the project over HTTP: browsers restrict ES module loading from `file://` URLs.

```sh
npm test        # Behavioral tests using Node's built-in test runner
npm run check   # Parse all JavaScript and verify local HTML assets
npm run build   # Copy only public application files into dist/
```

The equivalent direct commands are `node --test`, `node scripts/check.mjs` and `node scripts/build.mjs`. The only optional external page dependency is Google Fonts; system fonts remain available when it cannot load.

## Engineering decisions

| Problem | Approach | Trade-off |
| --- | --- | --- |
| A linear 300,000-year slider compresses recent history | A reversible, piecewise linear axis gives recent periods more room | Slider distance is not elapsed historical time; the UI says so |
| Dated points do not describe a complete occupied surface | Resample illustrative strands into radial reveal seeds | Smooth regions between sites are model assumptions |
| Repainting every seed each frame wastes work | Bake fully established seeds; keep retreats and fenced groups dynamic | Backward scrubbing must reset the baked mask |
| A textured fog layer read as weather and obscured the map | Drop it: flat ember through a soft presence mask, over cold slate land | The reveal edge is a drawing style, not a measured precision |
| Pacific routes can accidentally cross the entire map | Interpolate the short longitude difference across ±180° | The projection still distorts high latitudes |
| A whole-world map becomes unreadable on a narrow phone | Keep a minimum map width and allow horizontal scrolling | The user sees a portion of the world at a time |

## Source map

```text
index.html                 Page, controls, legend and source links
styles.css                 Responsive layout and atlas palette
src/atlas.js               Canvas layers, state, playback and pointer interaction
src/model.js               Pure timeline, presence and environment calculations
src/seeds.js               Route resampling and dateline handling
data/migration.js          43 site records, illustrative strands and island dates
data/geography.js          Shelves, ice, sea level and containment fences
data/land.js               Simplified Natural Earth land polygons
assets/relief.jpg          Terrain raster, retained but no longer rendered
tests/model.test.js        Behavioral and data-integrity checks
scripts/                   Local server, source checks and static packaging
.github/workflows/         Checks and GitHub Pages deployment
```

Start with [`src/model.js`](src/model.js), then [`src/seeds.js`](src/seeds.js), and follow the rendering path in [`src/atlas.js`](src/atlas.js). The [code walkthrough](docs/CODE_WALKTHROUGH.md) works through concrete examples and the corresponding tests. To change a date rather than the code, [where the dates live](docs/TIMELINE.md) maps every authored chronology value to its file and field.

## Validation and deployment

The automated suite tests timeline endpoints and round trips, monotonic playback, sea-level anchors, arrival/retreat/recolonisation, fading arrival accents, shelf time windows, dateline crossings and dataset invariants. These checks validate software behavior; they do not validate archaeological interpretations.

The Pages workflow runs checks, tests and packaging before deploying `dist/`. Pull requests run the same checks without publishing. The package excludes local backups, repository metadata and development-only files.

Browser review covers initial rendering, playback, speed changes, timeline endpoints, field-log jumps and narrow-screen layout. Canvas appearance is checked visually; the current test suite is not a screenshot regression suite.

## Limits and next steps

- Modern coastlines and terrain provide context; shelf and ice shapes are schematic.
- Chronology and migration/retreat assumptions need ongoing source review. The field log is a curated set, not a complete archaeological database.
- Keyboard users can operate playback, the slider and field-log buttons. Map tooltips currently depend on a pointer; a fully accessible map-detail view remains future work.
- Further improvements include per-site structured citations, browser regression tests and measured performance benchmarks. No performance target is claimed here.

Made with [Natural Earth](https://www.naturalearthdata.com/). See [third-party notices](THIRD_PARTY_NOTICES.md) and [methodology](docs/METHODOLOGY.md).
