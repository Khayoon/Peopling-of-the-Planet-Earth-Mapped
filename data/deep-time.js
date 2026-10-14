// Experimental deep-time overlay. Dates are years BP; x/y are lon/lat.
// Fossil/DNA anchors below are evidence. Strands are illustrative geometry:
// neither a continuous occupation map nor an inferred ancestor-to-descendant tree.
// No Homo sapiens sites or strands are replaced by this module.

export const LINEAGES = {
  early: { id: 'early', label: 'Early hominins', color: '#e7c65c', description: 'Australopithecus populations, followed by early Homo and Homo erectus.' },
  neanderthal: { id: 'neanderthal', label: 'Neanderthals', color: '#68aeef', description: 'Neanderthal populations across parts of Europe and western to central Asia.' },
  denisovan: { id: 'denisovan', label: 'Denisovans', color: '#65cb9f', description: 'Sparse fossil and ancient-DNA anchors across Asia; the full range remains unknown.' },
  sapiens: { id: 'sapiens', label: 'Homo sapiens', color: '#e8783a', description: 'The original Homo sapiens migration layer.' },
};

const U = {
  anamensis: 'https://humanorigins.si.edu/evidence/human-fossils/species/australopithecus-anamensis',
  afarensis: 'https://humanorigins.si.edu/evidence/human-fossils/species/australopithecus-afarensis',
  africanus: 'https://humanorigins.si.edu/evidence/human-fossils/species/australopithecus-africanus',
  taung: 'https://www.si.edu/object/australopithecus-africanus%3Adpo_3d_200043',
  woranso: 'https://www.nature.com/articles/s41586-019-1513-8',
  laetoli: 'https://www.nature.com/articles/srep21916',
  dmanisi: 'https://pubmed.ncbi.nlm.nih.gov/21646521/',
  ileret: 'https://www.nature.com/articles/srep28766',
  sangiran: 'https://doi.org/10.1126/science.aau8556',
  ngandong: 'https://www.nature.com/articles/s41586-019-1863-2',
  neanderthal: 'https://humanorigins.si.edu/evidence/human-fossils/species/homo-neanderthalensis',
  sima: 'https://www.nature.com/articles/nature17405',
  krapina: 'https://www.nature.com/articles/s41467-025-56155-8',
  chagyrskaya: 'https://www.nature.com/articles/s41586-022-05283-y',
  denisova: 'https://www.nature.com/articles/s41467-025-60140-6',
  denisovaFossils: 'https://www.nature.com/articles/s41586-018-0870-z',
  baishiya: 'https://www.nature.com/articles/s41586-024-07612-9',
  harbin: 'https://www.sciencedirect.com/science/article/pii/S0092867425006270',
  bianfu: 'https://www.nature.com/articles/s41586-026-10976-9',
};

// `t` is the display anchor (older edge where an interval is represented).
// `end` is a marker display cutoff, NOT a claim that occupation was continuous
// between these dates. The note carries the actual age and evidence type.
// Coordinates are rounded for this world map, not survey coordinates.
export const ARCHAEA_SITES = [
  { id: 'kanapoi', group: 'early', n: 'Kanapoi · A. anamensis', x: 35.95, y: 2.32, t: 4200000, end: 1900000, pl: 'Lake Turkana, Kenya', note: 'Australopithecus anamensis fossils from the Turkana region date to about 4.2–3.9 million years ago. This anchor is already present when the scene opens at 4 million years.', url: U.anamensis },
  { id: 'woranso', group: 'early', n: 'Woranso-Mille', x: 40.5, y: 11.3, t: 3800000, end: 1900000, pl: 'Afar, Ethiopia', note: 'A 3.8-million-year-old cranium assigned to Australopithecus anamensis. Its age overlaps the early record of A. afarensis.', url: U.woranso },
  { id: 'laetoli', group: 'early', n: 'Laetoli footprints', x: 35.2, y: -3.2, t: 3660000, end: 1900000, pl: 'Tanzania', note: 'Hominin footprints preserved in ash about 3.66 million years ago, commonly associated with Australopithecus afarensis. They record walking at this site, not a continental migration route.', url: U.laetoli },
  { id: 'hadar', group: 'early', n: 'Hadar · Lucy', x: 40.6, y: 11.1, t: 3200000, end: 1900000, pl: 'Ethiopia', note: 'Lucy is an approximately 3.2-million-year-old Australopithecus afarensis skeleton. The species is documented across Ethiopia, Kenya and Tanzania.', url: U.afarensis },
  { id: 'taung', group: 'early', n: 'Taung Child', x: 24.6, y: -27.6, t: 2800000, end: 1900000, pl: 'South Africa', note: 'Australopithecus africanus from South Africa, displayed at the Smithsonian estimate of about 2.8 million years. Southern African australopith chronologies remain debated; the connecting trail is illustrative.', url: U.taung },
  { id: 'dmanisi', group: 'early', n: 'Dmanisi · early Homo', x: 44.35, y: 41.33, t: 1850000, end: 800000, pl: 'Georgia', note: 'Repeated early human occupation dated to 1.85–1.78 million years ago. The fossils are commonly included in Homo erectus, although their classification is debated. The exact route out of Africa is unknown.', url: U.dmanisi },
  { id: 'ileret', group: 'early', n: 'Ileret footprints', x: 36.23, y: 4.31, t: 1500000, end: 500000, pl: 'Kenya', note: 'Footprint surfaces around 1.5 million years old provide evidence of human-like walking, with tracks attributed to Homo erectus. This is a local trace-fossil record.', url: U.ileret },
  { id: 'sangiran', group: 'early', n: 'Sangiran · H. erectus', x: 110.83, y: -7.45, t: 1300000, end: 108000, pl: 'Java, Indonesia', note: 'A 2020 dating study places the earliest Sangiran hominins most likely around 1.3 million years ago and younger than 1.5 million. Earlier chronologies differ; this date is not a settled first arrival for all Java.', url: U.sangiran },
  { id: 'ngandong', group: 'early', n: 'Ngandong · late H. erectus', x: 111.43, y: -7.38, t: 117000, end: 108000, pl: 'Java, Indonesia', note: 'The Homo erectus bone bed is dated to 117,000–108,000 years ago. This is the youngest well-dated occurrence used here; a last known fossil is not an exact extinction date.', url: U.ngandong },
  { id: 'sima', group: 'neanderthal', n: 'Sima de los Huesos', x: -3.52, y: 42.35, t: 430000, end: 40000, pl: 'Atapuerca, Spain', note: 'Roughly 430,000-year-old fossils have nuclear DNA linking them to the Neanderthal lineage. They precede the later, classic Neanderthal populations.', url: U.sima },
  { id: 'krapina', group: 'neanderthal', n: 'Krapina', x: 15.88, y: 46.16, t: 130000, end: 40000, pl: 'Croatia', note: 'A large Neanderthal fossil assemblage conventionally dated to approximately 130,000–120,000 years ago.', url: U.krapina },
  { id: 'denisova-neanderthal', group: 'neanderthal', n: 'Denisova · Neanderthal remains', x: 84.67, y: 51.4, t: 140000, end: 80000, pl: 'Altai, Siberia', note: 'The 2019 fossil chronology places the Neanderthal remains and Denisova 11, a child of a Neanderthal and a Denisovan, between about 140,000 and 80,000 years ago.', url: U.denisovaFossils },
  { id: 'chagyrskaya', group: 'neanderthal', n: 'Chagyrskaya', x: 83.16, y: 51.44, t: 54000, end: 40000, pl: 'Altai, Siberia', note: 'Neanderthal remains from around 54,000 years ago yielded genomes including close relatives. This anchors the eastern reach of the blue layer.', url: U.chagyrskaya },
  { id: 'denisova-denisovan', group: 'denisovan', n: 'Denisova · Denisovan record', x: 84.67, y: 51.4, t: 250000, end: 50000, pl: 'Altai, Siberia', note: 'Denisovan sediment DNA occurs from about 250,000 years ago; the oldest fossils are about 200,000 years old. Later DNA extends through roughly 80,000–50,000 years ago. Occupation was not necessarily continuous.', url: U.denisova },
  { id: 'bianfu', group: 'denisovan', n: 'Bianfu Cave', x: 100.1654, y: 26.4621, t: 167000, end: 134000, pl: 'Yunnan, China', note: 'A 2026 study molecularly identified Denisovan teeth and bone fragments in layers dated to approximately 167,000–134,000 years ago.', url: U.bianfu },
  { id: 'baishiya', group: 'denisovan', n: 'Baishiya · Xiahe mandible', x: 102.57, y: 35.45, t: 160000, end: 32000, pl: 'Northeastern Tibetan Plateau', note: 'The Xiahe mandible is at least 160,000 years old and was identified through ancient proteins. Later sediment DNA and a rib show repeated Denisovan presence at this cave.', url: U.baishiya },
  { id: 'harbin', group: 'denisovan', n: 'Harbin cranium', x: 126.65, y: 45.76, t: 146000, end: 100000, pl: 'Northeastern China', note: 'The cranium is older than 146,000 years, a minimum age rather than an exact date. Mitochondrial DNA recovered in 2025 falls within Denisovan variation. Its display window does not date regional occupation.', url: U.harbin },
  { id: 'baishiya-late', group: 'denisovan', n: 'Baishiya · Xiahe 2 rib', x: 102.57, y: 35.45, t: 48000, end: 32000, pl: 'Northeastern Tibetan Plateau', note: 'A Denisovan rib occurs in a layer dated to 48,000–32,000 years ago. The green layer fades by 30,000 years ago as a drawing endpoint, not a known Denisovan extinction date.', url: U.baishiya },
];

// Three opening populations are a schematic composition at 4 Ma. Their
// coordinates are not three fossils of that same age. The renderer may fully
// illuminate these initial scene seeds while dated evidence remains separate.
// Radius is in map degrees before createSeeds applies its standard multiplier.
export const ARCHAEA_STRANDS = [
  { group: 'early', bound: 'africa', p: [[40.5,11]], t0: 4000000, t1: 4000000, gone: 1900000, fade: 150000, r: 2.7 },
  { group: 'early', bound: 'africa', p: [[36,4]], t0: 4000000, t1: 4000000, gone: 1900000, fade: 150000, r: 2.7 },
  { group: 'early', bound: 'africa', p: [[35,-3]], t0: 4000000, t1: 4000000, gone: 1900000, fade: 150000, r: 2.7 },
  { group: 'early', bound: 'africa', p: [[40.5,11],[38,7],[36,4],[35,-3]], t0: 3950000, t1: 3600000, gone: 1900000, fade: 150000, r: 2.5 },
  // Connecting East and South African evidence; not a demonstrated travel path.
  { group: 'early', bound: 'africa', p: [[35,-3],[34,-9],[31,-15],[28,-22],[24.6,-27.6]], t0: 3000000, t1: 2300000, gone: 1900000, fade: 150000, r: 3.0 },
  { group: 'early', bound: 'africa', p: [[28,-23],[27.7,-26],[24.6,-27.6]], t0: 2350000, t1: 2200000, gone: 1900000, fade: 150000, r: 3.1 },
  // The next yellow chapter summarizes early Homo; it is not a single species.
  { group: 'early', bound: 'africa', p: [[40,10],[36,4],[35,-3]], t0: 2400000, t1: 1900000, gone: 500000, fade: 80000, r: 3.4 },
  // The script's first major expansion runs south to the Cape before departure.
  // The Cape endpoint is narrative geography, not a newly asserted fossil date.
  { group: 'early', bound: 'africa', p: [[35,-3],[31,-13],[28,-23],[25,-29],[20,-34]], t0: 2600000, t1: 1950000, gone: 600000, fade: 80000, r: 3.0 },
  // Out-of-Africa route is illustrative. Dmanisi supplies the dated endpoint.
  { group: 'early', p: [[39,10],[36,20],[34,29],[36,34],[40,38],[44.35,41.33]], t0: 1900000, t1: 1800000, gone: 800000, fade: 80000, r: 2.9 },
  { group: 'early', p: [[44,39],[53,34],[65,30],[76,27],[88,24],[99,20],[106,23],[112,31]], t0: 1800000, t1: 1000000, gone: 400000, fade: 80000, r: 3.2 },
  // The western branch of the script's Eurasian expansion, before blue appears.
  { group: 'early', p: [[44,39],[35,37],[27,40],[20,40],[13,42],[3,42],[-3,40]], t0: 1700000, t1: 1200000, gone: 400000, fade: 60000, r: 3.2 },
  { group: 'early', p: [[99,20],[100,12],[103,3],[105,-3],[110.83,-7.45]], t0: 1600000, t1: 1300000, gone: 300000, fade: 50000, r: 2.4 },
  // Java stays yellow through the youngest well-dated H. erectus fossil window.
  { group: 'early', p: [[106,-6.5],[110.83,-7.45],[111.43,-7.38],[114,-7.7]], t0: 1300000, t1: 900000, gone: 117000, fade: 9000, r: 2.1 },
  // Blue is a schematic range developing over time, not a continuous territory.
  { group: 'neanderthal', p: [[-3.5,42.3]], t0: 430000, t1: 430000, gone: 40000, fade: 2000, r: 3.3 },
  { group: 'neanderthal', p: [[-5,40],[1,45],[8,49],[16,47],[23,45]], t0: 400000, t1: 220000, gone: 40000, fade: 2000, r: 4.7 },
  { group: 'neanderthal', p: [[1,45],[2,50],[10,51],[20,50],[31,47]], t0: 250000, t1: 130000, gone: 40000, fade: 2000, r: 4.1 },
  { group: 'neanderthal', p: [[23,43],[31,39],[37,36],[35,32],[44,36]], t0: 220000, t1: 100000, gone: 40000, fade: 2000, r: 3.5 },
  { group: 'neanderthal', p: [[43,43],[52,43],[63,43],[72,46],[84.67,51.4]], t0: 180000, t1: 130000, gone: 40000, fade: 2000, r: 3.2 },
  // Green remains four separated, evidence-anchored pockets. No Asia-wide fill.
  { group: 'denisovan', p: [[84.67,51.4],[87,49.5]], t0: 250000, t1: 200000, gone: 50000, fade: 10000, r: 3.2 },
  { group: 'denisovan', p: [[100.1654,26.4621]], t0: 167000, t1: 167000, gone: 134000, fade: 10000, r: 2.7 },
  { group: 'denisovan', p: [[102.57,35.45],[100.5,34.5]], t0: 160000, t1: 140000, gone: 32000, fade: 2000, r: 3.2 },
  { group: 'denisovan', p: [[126.65,45.76]], t0: 146000, t1: 146000, gone: 100000, fade: 10000, r: 3.0 },
];

export const SOURCES = [
  { title: 'Smithsonian: Australopithecus anamensis', url: U.anamensis, note: 'East African fossil locations and the 4.2–3.8 Ma species range.' },
  { title: 'Smithsonian: Australopithecus afarensis', url: U.afarensis, note: 'Eastern African record, including Lucy at about 3.2 Ma.' },
  { title: 'Smithsonian: Australopithecus africanus', url: U.africanus, note: 'Southern African record; the broad chronology remains debated.' },
  { title: 'Smithsonian: Taung Child', url: U.taung, note: 'The approximately 2.8 Ma display age used for Taung.' },
  { title: 'Haile-Selassie et al. (2019): Woranso-Mille cranium', url: U.woranso, note: 'Primary study of the 3.8 Ma A. anamensis cranium.' },
  { title: 'Bennett et al. (2016): Laetoli footprints', url: U.laetoli, note: 'Primary footprint analysis; Laetoli tracks date to 3.66 Ma.' },
  { title: 'Ferring et al. (2011): Dmanisi occupations', url: U.dmanisi, note: 'Early Homo outside Africa at 1.85–1.78 Ma.' },
  { title: 'Hatala et al. (2016): Ileret footprints', url: U.ileret, note: 'Trace-fossil evidence around 1.5 Ma.' },
  { title: 'Matsu’ura et al. (2020): Sangiran chronology', url: U.sangiran, note: 'First appearance most likely around 1.3 Ma; older chronologies differ.' },
  { title: 'Rizal et al. (2020): Ngandong chronology', url: U.ngandong, note: 'H. erectus bone bed dated 117–108 ka; not a measured extinction date.' },
  { title: 'Smithsonian: Homo neanderthalensis', url: U.neanderthal, note: 'Broad temporal and geographic overview for the blue range.' },
  { title: 'Meyer et al. (2016): Sima nuclear DNA', url: U.sima, note: 'Approximately 430 ka fossils linked to the Neanderthal lineage.' },
  { title: 'Semicircular canals and Neanderthal bottlenecks (2025)', url: U.krapina, note: 'Comparative primary research using Krapina at 130–120 ka.' },
  { title: 'Skov et al. (2022): Neanderthal social organization', url: U.chagyrskaya, note: 'Genomes from Chagyrskaya and Okladnikov.' },
  { title: 'Douka et al. (2019): Denisova fossil ages', url: U.denisovaFossils, note: 'Neanderthal and mixed-parentage fossils dated 140–80 ka.' },
  { title: 'Denisova Cave chronology (2025)', url: U.denisova, note: 'Sediment DNA from roughly 250 ka; later Denisovan evidence to roughly 50 ka.' },
  { title: 'Xia et al. (2024): Baishiya Denisovan subsistence', url: U.baishiya, note: 'A ≥160 ka mandible, later DNA, and a rib from a 48–32 ka layer.' },
  { title: 'Fu et al. (2025): Harbin mitochondrial DNA', url: U.harbin, note: 'Denisovan DNA from a cranium older than 146 ka.' },
  { title: 'Bianfu ancient proteins (2026)', url: U.bianfu, note: 'Molecular identification of Denisovan fossils dated 167–134 ka.' },
];
