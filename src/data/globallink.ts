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
  "san-francisco": 85, "daly-city": 75, "south-san-francisco": 70, "redwood-city": 95,
  "palo-alto": 105, "mountain-view": 115, "sunnyvale": 120, "santa-clara": 125,
  "san-jose": 135, oakland: 110, berkeley: 120, fremont: 140, "walnut-creek": 130,
  "san-mateo": 80, "menlo-park": 100, cupertino: 130, milpitas: 140, hayward: 125,
  "san-rafael": 115, concord: 135, pleasanton: 145, livermore: 155, vallejo: 140,
  richmond: 120, napa: 150, "santa-rosa": 165,
  burlingame: 65, millbrae: 70, "san-bruno": 70, pacifica: 95, "half-moon-bay": 115,
  "foster-city": 80, belmont: 90, "san-carlos": 95, atherton: 100, "portola-valley": 110,
  "los-altos": 110, "los-gatos": 130, saratoga: 125, campbell: 120, "morgan-hill": 150,
  gilroy: 170, "union-city": 105, newark: 110, "castro-valley": 115, dublin: 125,
  "san-ramon": 130, danville: 135, lafayette: 125, orinda: 120, martinez: 135,
  pittsburg: 145, antioch: 160, "american-canyon": 140, sonoma: 145, petaluma: 135,
  novato: 125, "mill-valley": 115, sausalito: 105,
};

export const OAK_RATES: Rates = {
  oakland: 75, berkeley: 85, "walnut-creek": 95, fremont: 110, "san-francisco": 110,
  "daly-city": 120, "south-san-francisco": 115, "redwood-city": 125, "palo-alto": 135,
  "mountain-view": 140, sunnyvale: 135, "santa-clara": 130, "san-jose": 125,
  "san-mateo": 115, "menlo-park": 130, cupertino: 140, milpitas: 120, hayward: 70,
  "san-rafael": 100, concord: 70, pleasanton: 80, livermore: 90, vallejo: 85,
  richmond: 65, napa: 110, "santa-rosa": 130,
  burlingame: 110, millbrae: 115, "san-bruno": 120, pacifica: 130, "half-moon-bay": 150,
  "foster-city": 105, belmont: 115, "san-carlos": 120, atherton: 125, "portola-valley": 135,
  "los-altos": 135, "los-gatos": 145, saratoga: 140, campbell: 135, "morgan-hill": 165,
  gilroy: 180, "union-city": 85, newark: 90, "castro-valley": 75, dublin: 70,
  "san-ramon": 75, danville: 80, lafayette: 70, orinda: 65, martinez: 80,
  pittsburg: 90, antioch: 100, "american-canyon": 110, sonoma: 115, petaluma: 120,
  novato: 105, "mill-valley": 95, sausalito: 100,
};

export const SJC_RATES: Rates = {
  "san-jose": 75, "santa-clara": 80, sunnyvale: 85, "mountain-view": 90, "palo-alto": 95,
  fremont: 95, "redwood-city": 105, "walnut-creek": 130, oakland: 125, berkeley: 135,
  "south-san-francisco": 135, "daly-city": 140, "san-francisco": 145, "san-mateo": 110,
  "menlo-park": 100, cupertino: 70, milpitas: 65, hayward: 90, "san-rafael": 150,
  concord: 115, pleasanton: 75, livermore: 80, vallejo: 150, richmond: 130,
  napa: 155, "santa-rosa": 175,
  burlingame: 105, millbrae: 110, "san-bruno": 120, pacifica: 145, "half-moon-bay": 155,
  "foster-city": 95, belmont: 95, "san-carlos": 95, atherton: 90, "portola-valley": 85,
  "los-altos": 80, "los-gatos": 75, saratoga: 80, campbell: 75, "morgan-hill": 55,
  gilroy: 90, "union-city": 80, newark: 75, "castro-valley": 85, dublin: 75,
  "san-ramon": 80, danville: 85, lafayette: 95, orinda: 100, martinez: 115,
  pittsburg: 125, antioch: 135, "american-canyon": 145, sonoma: 135, petaluma: 125,
  novato: 140, "mill-valley": 150, sausalito: 145,
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
