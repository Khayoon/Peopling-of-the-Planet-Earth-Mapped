# Before we were alone — local preview

Branch: `feature/shared-human-world`.

From this checkout, run `npm start` (Node 22+; no dependency install). Open the
local address printed by the server. The current review session uses port 4174;
to use that port again in PowerShell, run `$env:PORT=4174; npm start`.

The opening contains three yellow Australopithecus populations in East Africa.
Press **Begin** above the map or use the playback controls below it. The brief
competition backdrop disappears after the opening moment. The camera widens as
the first expansion runs south toward the Cape, then follows early Homo beyond
Africa. Blue Neanderthal and green Denisovan layers appear in later chapters.

- Chapter buttons jump to stages; the time slider works in both directions.
- **Follow the journey** switches between the moving regional camera and the world.
- The four layer controls can be toggled independently.
- **Homo sapiens · 300 ka** jumps to the original sapiens story.
- Field-log entries jump to their dates; map markers have hover notes.

The original `src/model.js`, `src/seeds.js`, and all original `data/` files are
unchanged. New populations live in `data/deep-time.js`; the extended timeline and
camera live in `src/deep-time-model.js`. The original 96-second sapiens playback
is retained after the new prologue. See [source notes](DEEP_TIME_SOURCES.md).

Validation: `npm test`, `npm run check`, and `npm run build`.
`dist/` is generated and ignored. This branch is being reviewed locally and has
not been pushed or published.
