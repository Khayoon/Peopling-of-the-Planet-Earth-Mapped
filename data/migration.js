// Historical anchors and illustrative model inputs. BP is relative to 1950.
// A strand or retreat is a modelling assumption, not a verified population boundary.
/* ============================ THE RECORD ============================ */
// t = years before present (mid-point where a range is published)
export const SITES = [
  {t:300000,x:-8.5,y:31.9,n:"Jebel Irhoud",pl:"Morocco",c:"firm",note:"The earliest fossils recognised as Homo sapiens — and they are in the far north-west of Africa, not the east."},
  {t:233000,x:36.0,y:5.4,n:"Omo Kibish",pl:"Ethiopia",c:"firm",note:"Oldest securely dated sapiens remains in East Africa."},
  {t:210000,x:22.6,y:36.6,n:"Apidima 1",pl:"Greece",c:"contested",note:"A partial skull claimed as sapiens at 210 ka. The identification and the date are both disputed, so it is marked here but given no occupied ground."},
  {t:185000,x:35.0,y:32.75,n:"Misliya Cave",pl:"Israel",c:"firm",note:"An upper jaw, 194–177 ka — unambiguously sapiens, unambiguously outside Africa. It is also a dead end: no living person descends from these people."},
  {t:160000,x:40.6,y:10.3,n:"Herto",pl:"Ethiopia",c:"firm",note:"Three crania showing deliberate post-mortem treatment."},
  {t:110000,x:35.6,y:31.3,n:"Skhul & Qafzeh",pl:"Israel",c:"firm",note:"Burials with grave goods, 120–90 ka. This Levantine population leaves no descendants."},
  {t:85000,x:41.0,y:27.0,n:"Al Wusta",pl:"Saudi Arabia",c:"firm",note:"A finger bone beside a vanished lake, from a green phase of the Arabian interior."},
  {t:105000,x:23.3,y:-27.4,n:"Ga-Mohana Hill",pl:"Kalahari",c:"firm",note:"Ostrich-eggshell containers and a cache of calcite crystals. The dry interior was innovating too, not just the coast — and it was wetter then."},
  {t:77000,x:22.1,y:-34.4,n:"Blombos Cave",pl:"South Africa",c:"firm",note:"Cross-hatched ochre and shell beads — abstract marking, 30,000 years before European cave art."},
  {t:68000,x:100.7,y:-0.4,n:"Lida Ajer",pl:"Sumatra",c:"debated",note:"Two teeth in a rainforest cave, 73–63 ka. Older than the genetic founder date, so either a failed excursion or a dating problem."},
  {t:65000,x:132.9,y:-12.4,n:"Madjedbebe",pl:"Australia",c:"debated",note:"Oldest claimed occupation of Sahul. It sits above the genetic ceiling, so it is drawn as an isolated toehold that fades — either these people left no descendants, or the 65 ka date is wrong. The excavators and the geneticists have not settled this."},
  {t:54000,x:4.75,y:44.5,n:"Grotte Mandrin",pl:"France",c:"contested",note:"A single layer of sapiens tools between Neanderthal layers — an incursion that lasted perhaps 40 years, then failed."},
  {t:52000,x:44.5,y:19.0,n:"The dispersal that survived",pl:"Arabia",c:"firm",note:"Genomes place the founding population of every living non-African after this point. Everything earlier outside Africa — the Levant, Apidima, perhaps Sumatra and Sahul — left no descendants."},
  {t:47000,x:44.0,y:35.5,n:"Neanderthal admixture",pl:"South-west Asia",c:"firm",note:"Interbreeding dated to 49,000–45,000 years ago. Because every non-African carries it, the dispersal that founded them cannot be much older."},
  {t:45500,x:25.4,y:42.9,n:"Bacho Kiro",pl:"Bulgaria",c:"firm",note:"Oldest directly dated sapiens in Europe, 46–44 ka. Their descendants did not persist either."},
  {t:45000,x:11.6,y:50.7,n:"Ilsenhöhle, Ranis",pl:"Germany",c:"firm",note:"Sapiens surviving a cold northern steppe at 45 ka, sharing the continent with Neanderthals."},
  {t:45000,x:71.2,y:57.7,n:"Ust'-Ishim",pl:"Siberia",c:"firm",note:"A femur that yielded a whole genome. Its long Neanderthal segments prove the mixing was recent."},
  {t:45000,x:113.8,y:3.8,n:"Niah Cave",pl:"Borneo",c:"firm",note:"The 'Deep Skull', 45–39 ka. Living off closed rainforest — a habitat long assumed to be far too poor for early foragers."},
  {t:44000,x:119.7,y:-4.9,n:"Leang Bulu' Sipong 4",pl:"Sulawesi",c:"firm",note:"A hunting scene on a cave wall — among the oldest known narrative images."},
  {t:42000,x:143.1,y:-33.7,n:"Lake Mungo",pl:"Australia",c:"firm",note:"Cremation and ochre burial deep in the arid interior."},
  {t:40000,x:115.9,y:39.6,n:"Tianyuan Cave",pl:"China",c:"firm",note:"A genome already related to living East Asians."},
  {t:40000,x:152.0,y:-3.4,n:"Buang Merabak",pl:"New Ireland",c:"firm",note:"Island-hopping past the point where the next island is over the horizon."},
  {t:32000,x:135.5,y:70.7,n:"Yana RHS",pl:"Arctic Siberia",c:"firm",note:"Living at 71°N in the depths of the Ice Age — the doorstep of the Americas."},
  {t:24000,x:-172.0,y:65.0,n:"Beringian standstill",pl:"Beringia",c:"debated",note:"Genetics implies the ancestors of Native Americans sat isolated for several thousand years before moving south."},
  {t:22000,x:-106.3,y:32.8,n:"White Sands",pl:"New Mexico",c:"debated",note:"Footprints dated 23–21 ka. Once fiercely doubted; three independent dating methods now agree."},
  {t:16000,x:-116.5,y:45.9,n:"Cooper's Ferry",pl:"Idaho",c:"firm",note:"Stemmed points along the Salmon River, before the ice-free corridor opened."},
  {t:14100,x:-144.0,y:63.9,n:"Swan Point",pl:"Alaska",c:"firm",note:"The oldest secure site in Alaska. Its microblades tie it straight back across Beringia to Siberia."},
  {t:13500,x:-70.3,y:11.4,n:"Taima-Taima",pl:"Venezuela",c:"debated",note:"A mastodon kill on the Caribbean coast. The 14–13 ka dates have been argued over for fifty years."},
  {t:13000,x:159.0,y:56.3,n:"Ushki Lake",pl:"Kamchatka",c:"firm",note:"The far north-east Pacific coast, occupied as the ice pulled back."},
  {t:14550,x:-83.9,y:30.1,n:"Page-Ladson",pl:"Florida",c:"firm",note:"A mastodon tusk with cut marks and stone tools in a sinkhole in the Aucilla River, 14,550 BP. It is why the eastward spread on this map reaches the Gulf coast before 14,000."},
  {t:14500,x:-73.2,y:-41.5,n:"Monte Verde",pl:"Chile",c:"firm",note:"A camp with preserved wood, cordage and seaweed — 14,000 km from Beringia."},
  {t:13000,x:-104.0,y:34.0,n:"Clovis horizon",pl:"North America",c:"firm",note:"A fluted-point toolkit spreads continent-wide in a few centuries."},
  {t:11000,x:-70.0,y:-52.0,n:"Fell's Cave",pl:"Patagonia",c:"firm",note:"The far end of the walk. From here, only islands remain."},
  {t:12000,x:33.0,y:34.9,n:"Aetokremnos",pl:"Cyprus",c:"firm",note:"The first deliberate colonisation of a Mediterranean island."},
  {t:8000,x:143.1,y:76.1,n:"Zhokhov Island",pl:"New Siberian Islands",c:"firm",note:"Hunters at 76°N running dog sledges — the earliest good evidence for sled dogs anywhere."},
  {t:4500,x:-50.0,y:70.0,n:"Saqqaq",pl:"Greenland",c:"firm",note:"Paleo-Inuit cross the High Arctic. Greenland is settled, abandoned and resettled more than once."},
  {t:3000,x:168.3,y:-17.7,n:"Lapita, Vanuatu",pl:"Remote Oceania",c:"firm",note:"Purpose-built voyaging canoes cross 800 km of open ocean into empty sea."},
  {t:1200,x:47.0,y:-19.0,n:"Madagascar",pl:"Indian Ocean",c:"debated",note:"Austronesian and Bantu settlement, roughly 1,200 years ago. Claims of much earlier visits remain unresolved."},
  {t:1080,x:-19.0,y:64.9,n:"Iceland",pl:"North Atlantic",c:"firm",note:"Norse landfall around 870 CE, on an island with no prior human population."},
  {t:1000,x:-149.5,y:-17.6,n:"Society Islands",pl:"East Polynesia",c:"firm",note:"After a long pause, central East Polynesia is settled within a few generations."},
  {t:950,x:-155.5,y:19.6,n:"Hawai'i",pl:"North Pacific",c:"debated",note:"Settled around 1000–1200 CE, 3,800 km from the nearest inhabited island."},
  {t:800,x:-109.4,y:-27.1,n:"Rapa Nui",pl:"South Pacific",c:"firm",note:"One of the most isolated inhabited places on Earth, reached around 1200 CE."},
  {t:750,x:174.8,y:-41.0,n:"Aotearoa",pl:"New Zealand",c:"firm",note:"Around 1250–1300 CE — the last large landmass on Earth to be settled by people."}
];

/* Dispersal strands. Fog seeds are generated along each polyline, with dates
   interpolated between t0 (start) and t1 (end). `gone`/`back` model retreat. */
export const STRANDS = [
  // --- Africa ---
  {bound:"africa",r:8.5,t0:300000,t1:265000,p:[[-8,32],[-2,28],[6,23],[16,21],[26,20],[33,22]]},
  {bound:"africa",r:8.5,t0:300000,t1:270000,p:[[38,11],[36,5],[34,-2],[31,-8]]},
  {bound:"africa",r:8,t0:280000,t1:235000,p:[[26,16],[16,14],[4,10],[-6,9],[-15,12]]},
  {bound:"africa",r:8,t0:260000,t1:205000,p:[[30,-13],[26,-20],[22,-28],[24,-33],[30,-30]]},
  {bound:"africa",r:8,t0:250000,t1:185000,p:[[22,-2],[28,-6],[16,-4],[12,3],[20,6]]},
  {r:7,t0:240000,t1:200000,p:[[43,-13],[46,-18],[48,-22],[44,-24]],skip:true},
  // --- early excursions that failed ---
  {bound:"excursion",r:3.0,t0:192000,t1:182000,gone:168000,p:[[33,20],[34,26],[35,30],[35.4,33],[37,36]],show:true,lab:"early excursion"},
  {bound:"excursion",r:4.0,t0:124000,t1:104000,gone:74000,p:[[34,24],[35,29],[35.3,32.5],[37,35],[40,37]],show:true},
  {bound:"excursion",r:4.4,t0:100000,t1:88000,gone:70000,p:[[43,15],[46,20],[43,25],[40,29]],show:true},
  // --- the main dispersal: southern coastal route ---
  {r:5.5,t0:55000,t1:50000,p:[[43,12],[49,15],[55,18],[59,23],[64,25],[69,24],[73,20],[78,13],[83,17],[88,21],[93,17],[98,11],[101,4],[105,0],[109,-3],[113,-6],[118,-6],[122,-4],[126,-6],[130,-8],[134,-11]],show:true,lab:"coastal route"},
  {r:6,t0:50000,t1:44000,p:[[73,25],[78,22],[83,25],[87,21],[81,15],[76,11]]},
  {r:5,t0:48000,t1:43000,p:[[98,19],[103,15],[106,11],[100,7]]},
  // --- Sahul ---
  {r:5,t0:49000,t1:43000,p:[[134,-5],[139,-6],[144,-7],[148,-9]]},
  {r:6,t0:49000,t1:44000,p:[[134,-11],[138,-14],[142,-17],[146,-21],[150,-27],[151,-33]],show:true},
  {r:6.5,t0:48000,t1:40000,p:[[133,-12],[128,-15],[122,-18],[117,-22],[115,-29],[119,-33],[126,-32],[133,-31],[139,-35],[145,-38],[147,-42]],show:true},
  {r:7,t0:45000,t1:34000,p:[[131,-19],[136,-24],[129,-26],[134,-29],[141,-27]]},
  {r:3,t0:42000,t1:38000,p:[[150,-5],[152,-4],[153,-2.5]]},
  {r:3,t0:32000,t1:27000,p:[[155,-6],[159,-9],[161.5,-10.5]]},
  // A splinter of the failed Arabian wave walks the south Asian coast. `trail`
  // keeps only a short stretch lit at a time, so it reads as one group moving
  // rather than a corridor filling in. It is what connects Al Wusta to the
  // contested toeholds below, which otherwise appear from nothing.
  {r:3,t0:84000,t1:71000,trail:1800,p:[[46,21],[52,22],[57,23],[60,25],[64,25.5],[67,25],
    [71,22],[73.5,18],[75,13],[77.5,9.5],[80,13],[83,17],[86,20],[89,22],[93,21],[96,17],
    [98.5,12],[100,7],[101,3],[101,0.5],[100.7,-0.4]],show:true,lab:"first wave, east"},
  {r:3,t0:71000,t1:66000,trail:1800,p:[[100.7,-0.4],[103,-2],[106,-4],[110,-5],[114,-6],
    [118,-6],[122,-7],[126,-8],[130,-10],[132.9,-12.4]],show:true},
  // Two contested early dates, shown as what they are: isolated toeholds with
  // no surviving descendants, not a continuous occupation.
  {r:3.2,t0:71000,t1:66000,gone:55000,p:[[100.7,-0.4],[102,-2]]},
  {r:3.6,t0:66000,t1:62000,gone:53000,p:[[132.9,-12.4],[135,-13]]},
  // --- into western Eurasia ---
  {r:5,t0:53000,t1:48000,p:[[53,26],[49,30],[46,33],[42,35],[38,34],[36,33]],show:true},
  {r:6,t0:50000,t1:44000,p:[[58,38],[64,40],[70,42],[76,44],[82,47],[88,50]],show:true,lab:"northern route"},
  {r:3.2,t0:55000,t1:54000,gone:51500,p:[[8,45],[6,44.5],[4.7,44.5]],show:true},
  {r:5,t0:47000,t1:40500,p:[[41,38],[34,40],[28,42],[22,45],[16,47],[11,49],[5,48],[-1,46],[-5,41],[-7,38]],show:true},
  {r:4.5,t0:45000,t1:39000,gone:26000,back:15000,p:[[12,50],[8,53],[2,52],[-3,54],[-6,55.5]]},
  {r:5.5,t0:44000,t1:35000,gone:25500,back:16000,p:[[34,47],[40,51],[45,55],[38,58]]},
  {r:5.5,t0:15000,t1:10000,p:[[0,45],[6,48],[11,52],[18,54],[26,56],[14,58],[22,62]]},
  {r:5,t0:11500,t1:9000,p:[[10,60],[15,64],[20,68],[26,70]]},
  // --- eastern Eurasia ---
  {r:6,t0:48000,t1:37000,p:[[95,32],[103,30],[110,27],[116,31],[119,37],[124,42],[128,39]],show:true},
  {r:6,t0:46000,t1:37000,p:[[86,50],[96,52],[106,53],[116,54],[126,56],[136,59]]},
  {r:5.5,t0:44000,t1:36000,gone:24500,back:16000,p:[[90,60],[100,63],[110,65],[120,66],[130,67]]},
  {r:4,t0:38000,t1:33000,p:[[130,33],[135,35],[139,37],[142,42]]},
  {r:3.5,t0:47000,t1:38000,p:[[121,15],[123,10],[125,7]]},
  {r:4,t0:31000,t1:25000,p:[[85,32],[92,30],[98,33]]},
  // --- interior fill (people spread inland from the dated corridors) ---
  {r:7,t0:52000,t1:46000,p:[[45,20],[50,22],[53,18],[47,17]]},
  {r:7.5,t0:50000,t1:44000,p:[[55,32],[61,34],[67,36],[73,38]]},
  {r:7.5,t0:46000,t1:34000,p:[[100,25],[106,22],[112,25],[108,32],[101,35]]},
  {r:7,t0:44000,t1:33000,p:[[20,50],[27,49],[34,44],[26,38],[18,41]]},
  {r:8,t0:13500,t1:10500,p:[[-110,44],[-100,44],[-92,44],[-96,35],[-86,33]]},
  {r:8,t0:13500,t1:10500,p:[[-60,-16],[-50,-14],[-45,-4],[-56,1],[-64,-10]]},
  // --- gaps filled in on a second pass ---
  {bound:"africa",r:8,t0:118000,t1:88000,p:[[19,-22],[23,-25],[26,-27],[22,-29],[25,-21]]},          // Kalahari interior
  {r:6.5,t0:46000,t1:39000,p:[[112,3],[115,5],[118,6],[117,2],[113,-1]]},             // northern Borneo
  {r:7,t0:43000,t1:34000,p:[[77,41],[83,44],[89,45],[95,44],[89,39],[82,37]]},        // Dzungaria & the Tarim rim
  {r:7,t0:44000,t1:35000,p:[[92,48],[100,47],[108,46],[116,46],[106,42]]},            // Mongolian plateau
  {r:6,t0:27000,t1:20000,p:[[128,45],[133,48],[137,51],[142,48],[143,52]]},           // Amur, Primorye & Sakhalin
  {r:5,t0:14000,t1:11000,p:[[154,52],[158,56],[161,60],[152,60]]},                    // Kamchatka & the Okhotsk coast
  {r:7,t0:40000,t1:32000,gone:25000,back:15000,p:[[58,59],[66,61],[74,62],[82,63]]},  // Ob & west Siberian plain
  {r:7,t0:32000,t1:26000,gone:24000,back:15000,p:[[116,61],[124,63],[132,65],[141,67],[150,66]]}, // Yakutia
  {r:7,t0:16000,t1:10500,p:[[42,56],[50,57],[58,58],[65,60]]},                        // Volga to the Urals
  {r:7,t0:11000,t1:7000,p:[[64,66],[74,68],[84,70],[94,71],[104,71],[114,71],[124,70],[134,71]]}, // Arctic Russian coast
  {r:5,t0:13500,t1:10500,p:[[-162,68],[-154,69],[-146,69],[-150,65],[-158,64]]},      // Alaskan North Slope
  {r:6,t0:14000,t1:11000,p:[[-73,10],[-66,10],[-61,8],[-58,4],[-67,5]]},              // northern Venezuela & the Guianas
  {r:6,t0:13000,t1:10500,p:[[-65,-31],[-59,-34],[-57,-38],[-63,-38],[-61,-28]]},      // the Pampas & Río de la Plata
  {r:3.2,t0:8200,t1:7900,p:[[141,75.5],[146,75.2],[150,74.8]]},                       // New Siberian Islands
  {r:2.6,t0:3700,t1:3600,p:[[-179.5,71.2]]},                                          // Wrangel Island
  {r:3.5,t0:520,t1:400,p:[[53,71],[57,74],[61,76]]},                                  // Novaya Zemlya
  {r:3,t0:3050,t1:2950,p:[[164.5,-20.5],[166.5,-22]]},                                // New Caledonia
  // --- third pass: high Arctic, dry interiors and coasts the earlier strands skimmed ---
  {r:6,t0:12500,t1:9000,p:[[-141,67],[-134,68],[-128,68.5],[-122,68],[-116,67],[-133,64],[-126,63]]}, // Yukon & Mackenzie
  {r:5,t0:4600,t1:4000,p:[[-120,73],[-112,74],[-105,75],[-98,76],[-92,77],[-86,78],[-86,80],[-78,79],[-72,80],[-88,74],[-86,75],[-100,71],[-112,70]]}, // Arctic archipelago
  {r:4.5,t0:4500,t1:3900,p:[[-90,80],[-84,81],[-78,82],[-70,82],[-76,79]]},           // Ellesmere & Axel Heiberg
  {r:5.5,t0:4500,t1:3900,p:[[-78,67],[-72,69],[-66,70.5],[-62,70.5],[-61,67],[-68,64],[-75,64],[-82,66]]}, // Baffin Island
  {r:4,t0:9000,t1:6800,p:[[-152,59],[-158,56],[-163,55],[-168,54],[-174,52]]},        // Alaska Peninsula & Aleutians
  {r:5,t0:9000,t1:5800,p:[[-56,47],[-53,48.5],[-56,50],[-60,53],[-63,57],[-69,59],[-75,60],[-71,62]]}, // Newfoundland, Labrador & Ungava
  {r:7,t0:38000,t1:29000,p:[[48,46],[54,47],[60,48],[66,50],[52,50],[57,43]]},        // steppe north of the Caspian
  {r:5,t0:12000,t1:9200,p:[[-115,31],[-113,28],[-111,25],[-110,23.4],[-112,27]]},     // Baja California
  {r:6,t0:12500,t1:9800,p:[[-40,-3],[-36,-6],[-35,-9],[-38,-12],[-42,-8]]},           // the eastern shoulder of Brazil
  {bound:"africa",r:7,t0:250000,t1:198000,p:[[-13,25],[-8,31],[-2,34],[4,33],[10,34],[16,31],[22,31],[28,30]]}, // Maghreb & Libyan coast
  {r:5,t0:47000,t1:42000,p:[[96,4],[99,1],[102,-2],[105,-5],[100,-1]]},               // Sumatra
  {r:6,t0:14000,t1:10800,p:[[154,52],[158,56],[161,59],[160,62],[152,60]]},           // Kamchatka, strengthened
  {r:4,t0:33000,t1:30000,gone:25000,back:16000,p:[[129,68],[136,71],[143,70]]},
  // --- Beringia & the Americas ---
  {r:5,t0:30000,t1:26000,p:[[146,64],[156,66],[166,66],[176,65],[-176,64],[-168,64],[-160,64]],show:true,lab:"Beringia"},
  {r:4.5,t0:25000,t1:22200,p:[[-158,62],[-146,59],[-136,55],[-129,50],[-124,44],[-119,36],[-112,31],[-107,33]],show:true},
  {r:5,t0:21500,t1:17000,p:[[-106,33],[-100,29],[-98,20],[-92,16],[-84,10],[-78,7],[-76,1]],show:true},
  {r:5,t0:17000,t1:14500,p:[[-76,1],[-73,-7],[-70,-15],[-68,-22],[-71,-30],[-73,-37],[-73,-41]],show:true},
  {r:4,t0:14000,t1:10800,p:[[-73,-42],[-70,-47],[-69,-52]]},
  {r:6,t0:14000,t1:10500,p:[[-66,-5],[-56,-8],[-45,-10],[-42,-18],[-50,-25],[-58,-31]]},
  // Gradual southern North American spread, independent of the route to Chile.
  // Authored interpolation, not dated settlement boundaries. BP counts down.
  // The renderer clips this group to the region and the current ice-free ground.
  {bound:"northAmericaSouth",r:4.5,t0:20000,t1:18000,p:[[-115,36],[-108,35],[-102,34]]},
  {bound:"northAmericaSouth",r:5,t0:18000,t1:14800,p:[[-102,34],[-96,33],[-91,32],[-86,31],[-83,29]]},
  {bound:"northAmericaSouth",r:5,t0:17000,t1:10350,p:[[-102,37],[-95,37],[-88,36],[-82,35],[-78,36],[-75,40],[-69,44]]},
  {r:6,t0:11000,t1:7500,p:[[-122,55],[-112,58],[-100,58],[-90,55],[-80,50],[-70,50],[-62,54]]},
  {r:5,t0:4700,t1:4200,p:[[-100,68],[-90,70],[-80,72],[-70,70],[-62,66]]},
  {r:2.6,t0:4500,t1:3900,gone:2700,back:1000,p:[[-52,65],[-51,68],[-53,71],[-56,74],[-62,76],[-68,77],[-64,80],[-52,82],[-40,83],[-31,83],[-26,82.3],[-22,81],[-17,81],[-19,78],[-22,75],[-25,72],[-31,69],[-38,65],[-44,61],[-48,61]]},
  {r:3,t0:6000,t1:4000,p:[[-61,11],[-66,18],[-73,19],[-77,20],[-80,22]]},
  // --- islands, late ---
  {r:2.4,t0:12000,t1:11800,p:[[33,35]]},
  {r:2.4,t0:11000,t1:10800,p:[[25,35.2]]},
  {r:2.4,t0:10500,t1:10000,p:[[9,41]]},
  {r:1.8,t0:7900,t1:7700,p:[[14.4,35.9]]},
  {r:2,t0:4400,t1:4200,p:[[3,39.6]]},
  {r:3.5,t0:3500,t1:2000,p:[[145,15],[152,7],[160,7],[168,8]]},
  {r:3.5,t0:3350,t1:2850,p:[[152,-4],[158,-9],[166,-15],[172,-18],[178,-18],[-175,-14],[-172,-14]],show:true,lab:"Lapita"},
  {r:3.5,t0:1060,t1:940,p:[[-172,-14],[-160,-16],[-152,-17],[-145,-16],[-140,-9]],show:true},
  {r:3,t0:960,t1:930,p:[[-156,20]]},
  {r:2.5,t0:800,t1:780,p:[[-109.4,-27.1]]},
  {r:3.5,t0:770,t1:700,p:[[173,-36],[174.5,-41],[170,-45],[168,-46]]},
  {r:3.5,t0:1400,t1:900,p:[[49,-15],[47,-19],[45,-23],[47,-25],[46,-21],[48,-17]]},
  {r:1.6,t0:1300,t1:1250,p:[[43.3,-11.7]]},
  {r:2.5,t0:1090,t1:1050,p:[[-19,64.9]]},
  {r:1.6,t0:1300,t1:1280,p:[[-7,62]]},
  {r:2.5,t0:430,t1:400,p:[[12,78],[16,79],[20,78.6],[17,77.2]]}
];

export const ISLANDS=[
  [33,35,12000,2.2],[25,35.2,11000,2.0],[14.4,35.9,7900,1.6],[3,39.6,4400,2.0],
  [-15.6,28.3,2500,2.2],[73,4,2500,1.8],[-61,15,2500,2.0],
  [144.8,13.4,3500,1.8],[134.5,7.5,3300,1.8],[165.5,-21.3,3000,2.2],
  [-172.1,-13.8,2900,2.0],[-178,-14.3,2900,1.8],[-175.2,-21.2,2850,2.2],
  [168,8,2000,2.0],[173,1.4,2000,1.8],[151.8,7.4,2000,1.8],
  [43.3,-11.7,1300,1.6],[-7,62,1300,1.6],
  [-149.5,-17.6,1000,2.2],[-139.5,-9,1000,1.8],[-159.8,-21.2,950,1.8],[-145,-16,950,2.0],
  [-156.4,20.2,950,2.6],[-109.4,-27.1,800,1.8],[-176.5,-44,500,1.8],
  [-179.5,71.2,3700,2.2],[143,75.6,8000,2.4],[148,75.2,8000,2.0],[17.9,79,430,2.4],
  [-16.9,32.7,530,1.6],[-27,38.5,515,2.0],[-24,16,490,2.0],[56.5,-20.5,312,2.0],
  [-64.8,32.3,341,1.6],[-59,-51.7,186,2.4],[55.5,-4.6,180,1.8],[-90.5,-0.7,118,2.0]
];

