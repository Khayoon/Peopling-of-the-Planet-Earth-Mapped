# Deep-time overlay

This experimental layer adds yellow early hominins, blue Neanderthals, and green Denisovans. The original Homo sapiens data remains separate and unchanged. Source links and short evidence notes are exported by `data/deep-time.js` for the interface.

## Reading the animation

The opening shows three **Australopithecus populations** in an East African composition at 4 million years: Afar, Turkana, and the southern Rift. The script then moves through early Homo, a first major expansion south to the Cape, and Homo erectus moving beyond Africa. The Cape trail completes around 1.95 Ma before the northeast departure begins at 1.9 Ma. These are illustrative population positions and narrative geometry; the dated fossil markers remain separate.

Colored areas and connecting strands summarize possible dispersal and broad presence. Their boundaries, radii, interpolation, and fade times are drawing choices, not population measurements. Modern coastlines are only geographic context for the earliest scenes. The early yellow category combines several hominin groups; it is not a single taxon or a claim of direct ancestry.

## Evidence used

| Chapter | Anchor | Source |
| --- | --- | --- |
| East Africa | A. anamensis, about 4.2–3.8 Ma; Woranso-Mille cranium 3.8 Ma | [Smithsonian](https://humanorigins.si.edu/evidence/human-fossils/species/australopithecus-anamensis); [primary cranium study](https://www.nature.com/articles/s41586-019-1513-8) |
| East Africa | Laetoli footprints 3.66 Ma; Lucy at Hadar about 3.2 Ma | [footprint analysis](https://www.nature.com/articles/srep21916); [Smithsonian afarensis](https://humanorigins.si.edu/evidence/human-fossils/species/australopithecus-afarensis) |
| Southern Africa | A. africanus record; Taung displayed at about 2.8 Ma | [species overview](https://humanorigins.si.edu/evidence/human-fossils/species/australopithecus-africanus); [Taung specimen](https://www.si.edu/object/australopithecus-africanus%3Adpo_3d_200043) |
| Early Homo | Dmanisi occupation 1.85–1.78 Ma; Ileret footprints around 1.5 Ma | [Dmanisi study](https://pubmed.ncbi.nlm.nih.gov/21646521/); [Ileret study](https://www.nature.com/articles/srep28766) |
| Java | Sangiran around 1.3 Ma in the selected chronology; Ngandong 117–108 ka | [Sangiran study](https://doi.org/10.1126/science.aau8556); [Ngandong study](https://www.nature.com/articles/s41586-019-1863-2) |
| Neanderthals | Sima lineage about 430 ka; Krapina 130–120 ka; Altai fossils and genomes | [Sima DNA](https://www.nature.com/articles/nature17405); [Krapina comparison](https://www.nature.com/articles/s41467-025-56155-8); [Denisova fossil ages](https://www.nature.com/articles/s41586-018-0870-z); [Chagyrskaya genomes](https://www.nature.com/articles/s41586-022-05283-y) |
| Denisovans | Denisova DNA from about 250 ka and fossils from about 200 ka | [2025 cave chronology](https://www.nature.com/articles/s41467-025-60140-6) |
| Denisovans | Baishiya mandible ≥160 ka; younger rib layer 48–32 ka | [Baishiya study](https://www.nature.com/articles/s41586-024-07612-9) |
| Denisovans | Harbin >146 ka; Bianfu fossils 167–134 ka | [Harbin DNA](https://www.sciencedirect.com/science/article/pii/S0092867425006270); [Bianfu proteins](https://www.nature.com/articles/s41586-026-10976-9) |

Ma means million years ago; ka means thousand years ago. Dates are rounded for animation. The Smithsonian sources are institutional syntheses; the linked research papers supply the individual fossil, DNA, or dating analyses. Southern African australopith dates and early Java chronologies are not fully settled.

## Endpoints and schema

`ARCHAEA_SITES` contains `{id, group, n, x, y, t, end, pl, note, url}`. Coordinates are rounded longitude/latitude. `t` anchors the marker; `end` controls how long its evidence label remains in the scene, not the duration of occupation. A minimum age such as Harbin's >146 ka is stated explicitly in the note.

`ARCHAEA_STRANDS` contains `{group, p, t0, t1, gone, fade, r, bound?}`. The only containment key is the existing `africa`. All dates run from older to younger BP. `gone` begins a visual fade lasting `fade` years. African australopith strands fade after 1.9 Ma as the early Homo chapter takes over. Java fades across 117–108 ka, Neanderthals across 40–38 ka, and the youngest Denisovan pocket across 32–30 ka. These endpoints do not establish exact extinction dates. Green pockets remain separated to avoid presenting all Asia as occupied.

`LINEAGES` and `SOURCES` provide display metadata. No sapiens strands are exported. The existing seed generator does not preserve fixed-strand `fade`, so the overlay integration must retain each strand's fade when generating its seeds.
