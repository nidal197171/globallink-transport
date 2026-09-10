export const CITIES: { slug: string; name: string }[] = [
  { slug: "american-canyon", name: "American Canyon" },
  { slug: "antioch", name: "Antioch" },
  { slug: "atherton", name: "Atherton" },
  { slug: "belmont", name: "Belmont" },
  { slug: "berkeley", name: "Berkeley" },
  { slug: "burlingame", name: "Burlingame" },
  { slug: "campbell", name: "Campbell" },
  { slug: "castro-valley", name: "Castro Valley" },
  { slug: "concord", name: "Concord" },
  { slug: "cupertino", name: "Cupertino" },
  { slug: "daly-city", name: "Daly City" },
  { slug: "danville", name: "Danville" },
  { slug: "dublin", name: "Dublin" },
  { slug: "foster-city", name: "Foster City" },
  { slug: "fremont", name: "Fremont" },
  { slug: "gilroy", name: "Gilroy" },
  { slug: "half-moon-bay", name: "Half Moon Bay" },
  { slug: "hayward", name: "Hayward" },
  { slug: "lafayette", name: "Lafayette" },
  { slug: "livermore", name: "Livermore" },
  { slug: "los-altos", name: "Los Altos" },
  { slug: "los-gatos", name: "Los Gatos" },
  { slug: "martinez", name: "Martinez" },
  { slug: "menlo-park", name: "Menlo Park" },
  { slug: "mill-valley", name: "Mill Valley" },
  { slug: "millbrae", name: "Millbrae" },
  { slug: "milpitas", name: "Milpitas" },
  { slug: "morgan-hill", name: "Morgan Hill" },
  { slug: "mountain-view", name: "Mountain View" },
  { slug: "napa", name: "Napa" },
  { slug: "newark", name: "Newark" },
  { slug: "novato", name: "Novato" },
  { slug: "oakland", name: "Oakland" },
  { slug: "orinda", name: "Orinda" },
  { slug: "pacifica", name: "Pacifica" },
  { slug: "palo-alto", name: "Palo Alto" },
  { slug: "petaluma", name: "Petaluma" },
  { slug: "pittsburg", name: "Pittsburg" },
  { slug: "pleasanton", name: "Pleasanton" },
  { slug: "portola-valley", name: "Portola Valley" },
  { slug: "redwood-city", name: "Redwood City" },
  { slug: "richmond", name: "Richmond" },
  { slug: "san-bruno", name: "San Bruno" },
  { slug: "san-carlos", name: "San Carlos" },
  { slug: "san-francisco", name: "San Francisco" },
  { slug: "san-jose", name: "San Jose" },
  { slug: "san-mateo", name: "San Mateo" },
  { slug: "san-rafael", name: "San Rafael" },
  { slug: "san-ramon", name: "San Ramon" },
  { slug: "santa-clara", name: "Santa Clara" },
  { slug: "santa-rosa", name: "Santa Rosa" },
  { slug: "saratoga", name: "Saratoga" },
  { slug: "sausalito", name: "Sausalito" },
  { slug: "sonoma", name: "Sonoma" },
  { slug: "south-san-francisco", name: "South San Francisco" },
  { slug: "sunnyvale", name: "Sunnyvale" },
  { slug: "union-city", name: "Union City" },
  { slug: "vallejo", name: "Vallejo" },
  { slug: "walnut-creek", name: "Walnut Creek" },
];

export const AIRPORTS: { code: string; label: string; short: string }[] = [
  { code: "sfo", label: "San Francisco Airport", short: "SFO" },
  { code: "oak", label: "Oakland Airport", short: "OAK" },
  { code: "sjc", label: "San Jose Airport", short: "SJC" },
];

type Rates = Record<string, number>;

export const SFO_RATES: Rates = {
  millbrae: 65, "san-bruno": 60, "south-san-francisco": 70, "daly-city": 75, burlingame: 70, 
  "san-mateo": 80, "foster-city": 85, belmont: 85, "san-carlos": 90, "redwood-city": 95, 
  atherton: 100, "menlo-park": 100, "palo-alto": 105, "portola-valley": 110, 
  "half-moon-bay": 120, "mountain-view": 115, "los-altos": 115, sunnyvale: 120, 
  "santa-clara": 125, cupertino: 130, "san-jose": 135, saratoga: 135, campbell: 135, 
  "los-gatos": 140, milpitas: 140, "morgan-hill": 155, gilroy: 165, "san-francisco": 85, 
  oakland: 110, berkeley: 120, richmond: 120, hayward: 125, "castro-valley": 130, 
  "union-city": 135, newark: 135, fremont: 140, "san-ramon": 150, danville: 150, 
  "walnut-creek": 130, concord: 135, martinez: 140, pittsburg: 150, orinda: 130, 
  lafayette: 130, pleasanton: 145, dublin: 145, livermore: 155, "san-rafael": 115, novato: 125, 
  "mill-valley": 105, sausalito: 100, petaluma: 140, "santa-rosa": 165, sonoma: 155, napa: 150, 
  "american-canyon": 145, vallejo: 140, antioch: 150, pacifica: 95
};

export const OAK_RATES: Rates = {
  oakland: 75, berkeley: 85, "castro-valley": 80, richmond: 65, "walnut-creek": 95, 
  concord: 70, martinez: 75, pittsburg: 85, orinda: 80, lafayette: 80, "san-ramon": 90, 
  danville: 90, pleasanton: 80, dublin: 80, livermore: 90, hayward: 70, "union-city": 85, 
  newark: 90, fremont: 110, "san-francisco": 110, "daly-city": 120, "south-san-francisco": 115, 
  millbrae: 115, "san-bruno": 115, burlingame: 115, "san-mateo": 115, "foster-city": 120, 
  belmont: 125, "san-carlos": 125, "redwood-city": 125, atherton: 130, "menlo-park": 130, 
  "palo-alto": 135, "portola-valley": 140, "half-moon-bay": 150, "mountain-view": 140, 
  "los-altos": 140, sunnyvale: 135, "santa-clara": 130, cupertino: 140, "san-jose": 125, 
  saratoga: 145, campbell: 130, "los-gatos": 135, milpitas: 120, "morgan-hill": 140, 
  gilroy: 155, "san-rafael": 100, novato: 110, "mill-valley": 105, sausalito: 100, 
  petaluma: 120, "santa-rosa": 130, sonoma: 115, napa: 110, "american-canyon": 105, 
  vallejo: 85, antioch: 95, pacifica: 125
};

export const SJC_RATES: Rates = {
  "san-jose": 75, "santa-clara": 80, sunnyvale: 85, cupertino: 70, campbell: 75, 
  "los-gatos": 80, saratoga: 80, milpitas: 65, "mountain-view": 90, "los-altos": 85, 
  "morgan-hill": 75, gilroy: 90, "palo-alto": 95, "menlo-park": 100, "redwood-city": 105, 
  atherton: 100, "san-carlos": 105, belmont: 105, "foster-city": 110, "san-mateo": 110, 
  burlingame: 115, millbrae: 120, "san-bruno": 120, "south-san-francisco": 135, 
  "daly-city": 140, "san-francisco": 145, "portola-valley": 100, "half-moon-bay": 115, 
  fremont: 95, newark: 90, "union-city": 90, hayward: 90, "castro-valley": 100, oakland: 125, 
  berkeley: 135, richmond: 130, pleasanton: 75, dublin: 80, livermore: 80, "san-ramon": 85, 
  danville: 90, "walnut-creek": 130, concord: 115, martinez: 120, pittsburg: 130, orinda: 130, 
  lafayette: 130, "san-rafael": 150, novato: 160, "mill-valley": 145, sausalito: 140, 
  petaluma: 165, "santa-rosa": 175, sonoma: 165, napa: 155, "american-canyon": 150, 
  vallejo: 150, antioch: 125, pacifica: 135
};

export const AIRPORT_RATES: Record<string, Rates> = {
  sfo: SFO_RATES,
  oak: OAK_RATES,
  sjc: SJC_RATES,
};

// Display order per airport panel — alphabetical by city name.
const ALPHABETICAL_CITY_ORDER = [
  "american-canyon","antioch","atherton","belmont","berkeley","burlingame",
  "campbell","castro-valley","concord","cupertino","daly-city","danville",
  "dublin","foster-city","fremont","gilroy","half-moon-bay","hayward",
  "lafayette","livermore","los-altos","los-gatos","martinez","menlo-park",
  "mill-valley","millbrae","milpitas","morgan-hill","mountain-view","napa",
  "newark","novato","oakland","orinda","pacifica","palo-alto","petaluma",
  "pittsburg","pleasanton","portola-valley","redwood-city","richmond","san-bruno",
  "san-carlos","san-francisco","san-jose","san-mateo","san-rafael","san-ramon",
  "santa-clara","santa-rosa","saratoga","sausalito","sonoma","south-san-francisco",
  "sunnyvale","union-city","vallejo","walnut-creek",
];

export const AIRPORT_ORDER: Record<string, string[]> = {
  sfo: ALPHABETICAL_CITY_ORDER,
  oak: ALPHABETICAL_CITY_ORDER,
  sjc: ALPHABETICAL_CITY_ORDER,
};

export const AIRPORT_TO_AIRPORT: Record<string, number> = {
  "oak-sfo": 120,
  "sfo-sjc": 135,
  "oak-sjc": 110,
};

export const VEHICLES: { value: string; label: string; multiplier: number | null }[] = [
  { value: "sedan", label: "Sedan", multiplier: 1 },
  { value: "suv", label: "SUV", multiplier: 125 / 85 },
  { value: "limousine", label: "Limousine", multiplier: 235 / 85 },
  { value: "sprinter", label: "Sprinter van", multiplier: 285 / 85 },
  { value: "bus", label: "Bus & coach", multiplier: null },
];

export function cityName(slug: string) {
  return CITIES.find((c) => c.slug === slug)?.name ?? slug;
}
