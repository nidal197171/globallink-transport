export const CITIES: { slug: string; name: string }[] = [
  { slug: "san-francisco", name: "San Francisco" },
  { slug: "oakland", name: "Oakland" },
  { slug: "san-jose", name: "San Jose" },
  { slug: "palo-alto", name: "Palo Alto" },
  { slug: "mountain-view", name: "Mountain View" },
  { slug: "berkeley", name: "Berkeley" },
  { slug: "fremont", name: "Fremont" },
  { slug: "walnut-creek", name: "Walnut Creek" },
  { slug: "redwood-city", name: "Redwood City" },
  { slug: "sunnyvale", name: "Sunnyvale" },
  { slug: "santa-clara", name: "Santa Clara" },
  { slug: "daly-city", name: "Daly City" },
  { slug: "south-san-francisco", name: "South San Francisco" },
  { slug: "san-mateo", name: "San Mateo" },
  { slug: "menlo-park", name: "Menlo Park" },
  { slug: "cupertino", name: "Cupertino" },
  { slug: "milpitas", name: "Milpitas" },
  { slug: "hayward", name: "Hayward" },
  { slug: "san-rafael", name: "San Rafael" },
  { slug: "concord", name: "Concord" },
  { slug: "pleasanton", name: "Pleasanton" },
  { slug: "livermore", name: "Livermore" },
  { slug: "vallejo", name: "Vallejo" },
  { slug: "richmond", name: "Richmond" },
  { slug: "napa", name: "Napa" },
  { slug: "santa-rosa", name: "Santa Rosa" },
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
};

export const OAK_RATES: Rates = {
  oakland: 75, berkeley: 85, "walnut-creek": 95, fremont: 110, "san-francisco": 110,
  "daly-city": 120, "south-san-francisco": 115, "redwood-city": 125, "palo-alto": 135,
  "mountain-view": 140, sunnyvale: 135, "santa-clara": 130, "san-jose": 125,
  "san-mateo": 115, "menlo-park": 130, cupertino: 140, milpitas: 120, hayward: 70,
  "san-rafael": 100, concord: 70, pleasanton: 80, livermore: 90, vallejo: 85,
  richmond: 65, napa: 110, "santa-rosa": 130,
};

export const SJC_RATES: Rates = {
  "san-jose": 75, "santa-clara": 80, sunnyvale: 85, "mountain-view": 90, "palo-alto": 95,
  fremont: 95, "redwood-city": 105, "walnut-creek": 130, oakland: 125, berkeley: 135,
  "south-san-francisco": 135, "daly-city": 140, "san-francisco": 145, "san-mateo": 110,
  "menlo-park": 100, cupertino: 70, milpitas: 65, hayward: 90, "san-rafael": 150,
  concord: 115, pleasanton: 75, livermore: 80, vallejo: 150, richmond: 130,
  napa: 155, "santa-rosa": 175,
};

export const AIRPORT_RATES: Record<string, Rates> = {
  sfo: SFO_RATES,
  oak: OAK_RATES,
  sjc: SJC_RATES,
};

// Display order per airport panel, matching the source page.
export const AIRPORT_ORDER: Record<string, string[]> = {
  sfo: ["san-francisco","daly-city","south-san-francisco","redwood-city","palo-alto","mountain-view","sunnyvale","santa-clara","san-jose","oakland","berkeley","fremont","walnut-creek","san-mateo","menlo-park","cupertino","milpitas","hayward","san-rafael","concord","pleasanton","livermore","vallejo","richmond","napa","santa-rosa"],
  oak: ["oakland","berkeley","walnut-creek","fremont","san-francisco","daly-city","south-san-francisco","redwood-city","palo-alto","mountain-view","sunnyvale","santa-clara","san-jose","san-mateo","menlo-park","cupertino","milpitas","hayward","san-rafael","concord","pleasanton","livermore","vallejo","richmond","napa","santa-rosa"],
  sjc: ["san-jose","santa-clara","sunnyvale","mountain-view","palo-alto","fremont","redwood-city","walnut-creek","oakland","berkeley","south-san-francisco","daly-city","san-francisco","san-mateo","menlo-park","cupertino","milpitas","hayward","san-rafael","concord","pleasanton","livermore","vallejo","richmond","napa","santa-rosa"],
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
