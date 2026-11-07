export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServicePageData {
  title: string;
  description: string;
  h1: string;
  image: string;
  alt: string;
  paragraphs: readonly string[];
  /** City/service-specific FAQs — rendered only when present. */
  faqs?: readonly ServiceFaq[];
}

export const SERVICE_PAGES = {
  "/sfo-airport-limo": {
    title: "SFO Airport Limo & Black Car Service | Global Link",
    description: "SFO airport limo and black car service. Flight tracking, meet & greet, fixed fares. Book your San Francisco airport transfer online.",
    h1: "SFO Airport Limo & Black Car Service",
    image: "/images/services/airport.jpg",
    alt: "Airport chauffeured transportation",
    paragraphs: [
      "Global Link Transportation arranges SFO airport limo and black car service between San Francisco International Airport and destinations across San Francisco and the Bay Area. Choose a sedan, limousine, or town car for your airport transfer, with a professional chauffeur handling the ground transportation. Our airport car service provides fixed fares with no surge pricing, whether your San Francisco airport journey is for business, a celebration, or a return home.",
      "Flight tracking helps your chauffeur coordinate SFO airport pickup around flight delays and early arrivals. Include your flight information when booking your airport transfer, and confirm the terminal and meeting location with dispatch before pickup. Meet & greet can be selected for your reservation; follow your confirmed pickup instructions at the airport terminals. SFO airport limo service pairs that arrival coordination with black car comfort and luxury car service throughout the Bay Area.",
      "For business arrivals in San Francisco, executive car service and corporate transportation connect the airport with hotels, offices, meetings, and conferences. A town car or limousine suits individual travelers, while group transportation can include a charter bus or bus rental for a larger visiting team. Our chauffeur network coordinates airport car service and onward ground transportation, so an SFO airport transfer fits into your wider Bay Area itinerary.",
      "An SFO airport limo reservation can also start a wedding limo itinerary, prom limo evening, or wine country tours from San Francisco. Arrange luxury car service for a Napa Valley wine tour or Sonoma wine tours and wine tasting, or ask about party bus options for a group celebration. Book your airport transfer on the homepage and choose the vehicle and journey that suit your Bay Area plans, from black car and town car rides to limousine transportation.",
    ],
    faqs: [
      {
        question: "Where does my driver meet me at SFO?",
        answer:
          "With meet & greet selected, your chauffeur waits at arrivals with a name sign. Flight tracking keeps pickup coordinated around delays and early arrivals — confirm the terminal and meeting location with dispatch before pickup and follow your confirmed pickup instructions at the terminal.",
      },
      {
        question: "What happens if my flight is delayed?",
        answer:
          "Your chauffeur tracks your flight and coordinates pickup around the delay, so a late arrival does not mean a missed ride. Include your airline and flight number when booking so dispatch can follow the flight.",
      },
      {
        question: "Do I need to give my flight number to book an SFO pickup?",
        answer:
          "Yes. Airport pickups require your airline and flight number — a single field at booking — so your chauffeur can track the flight and be at the terminal when you land.",
      },
      {
        question: "Can an SFO pickup start a Napa wine tour or a wedding day?",
        answer:
          "Yes. An SFO airport transfer can connect straight on to a Napa Valley or Sonoma wine tour, a wedding venue, or a hotel, with the same chauffeur and vehicle — book the onward journey with your airport transfer.",
      },
    ],
  },
  "/burlingame-limo-service": {
    title: "Burlingame Limo Service & SFO-Area Black Car | Global Link",
    description: "Burlingame limo and black car service minutes from SFO. Airport pickups, hotel transfers, weddings and hourly chauffeur — book online.",
    h1: "Burlingame Limo Service & Black Car Near SFO",
    image: "/images/services/airport.jpg",
    alt: "Burlingame chauffeured car service near SFO",
    paragraphs: [
      "Burlingame is the closest Peninsula city to San Francisco International Airport, and Global Link Transportation arranges limo and black car service across it — from SFO to downtown Burlingame Avenue, the bayfront hotels, and the Caltrain station on California Drive. A chauffeur handles the short airport run or the longer trip into San Francisco, the Peninsula, or Silicon Valley, with a sedan, SUV, limousine, or Sprinter to match the party. Book an airport transfer or an hourly chauffeur and your car is confirmed before you land.",
      "Pickup points cover the whole SFO hotel cluster: the Hyatt Regency San Francisco Airport, San Francisco Airport Marriott Waterfront, Embassy Suites, and Hilton San Francisco Airport Bayfront, plus downtown Burlingame Avenue addresses, the Burlingame Caltrain station, and Bayfront Park. The drive from SFO to Burlingame is about five minutes; downtown San Francisco is roughly 25–30 minutes via US-101, Palo Alto about 25 minutes, and San Jose about 35–40 minutes. Airport pickups include flight tracking and a name-sign meet at arrivals, with the airline and flight number taken at booking.",
      "Burlingame is where flight crews, airline staff, and business travelers staying at the airport hotels book most — a 5 AM departure or a midnight arrival is a routine pickup here, and the service runs 24 hours. Wedding parties book Burlingame too, with Kohl Mansion the best-known local venue, and conference guests at the bayfront hotels use an hourly chauffeur for multi-stop days. A Sprinter suits a crew or a wedding party traveling together; a sedan or SUV suits a solo traveler or a couple.",
      "A Burlingame booking can also be the start of a longer day: an SFO pickup that continues to a Napa Valley or Sonoma wine tour, a corporate roadshow down the Peninsula, or a wedding weekend. Hourly chauffeur service carries a 4-hour minimum, and airport transfers come with fixed fares and no surge pricing. Get an instant quote on the homepage and book your Burlingame car service online, or call (415) 787-8776.",
    ],
    faqs: [
      {
        question: "How long is the drive from SFO to Burlingame?",
        answer:
          "About five minutes by car — Burlingame is the closest Peninsula city to the airport. Your chauffeur tracks your flight and meets you at arrivals with a name sign, so the short ride starts the moment you land.",
      },
      {
        question: "Do you pick up from hotels near SFO in Burlingame?",
        answer:
          "Yes. We pick up from the airport hotels in Burlingame — Hyatt Regency San Francisco Airport, San Francisco Airport Marriott Waterfront, Embassy Suites, and Hilton San Francisco Airport Bayfront — as well as downtown Burlingame Avenue addresses and the Burlingame Caltrain station.",
      },
      {
        question: "Can I book a car from Burlingame to downtown San Francisco?",
        answer:
          "Yes. The drive to downtown San Francisco is roughly 25–30 minutes via US-101. Book it as a one-way transfer or as an hourly chauffeur if you have several stops — get an instant quote on the homepage.",
      },
      {
        question: "Do you provide wedding transportation in Burlingame?",
        answer:
          "Yes. We arrange wedding limousines and Sprinter group transport for Burlingame venues including Kohl Mansion, with an hourly chauffeur on a 4-hour minimum for the ceremony, photos, and reception.",
      },
    ],
  },
  "/san-francisco-limo-service": {
    title: "San Francisco Limo Service & Black Car | Global Link",
    description: "Luxury limo service in San Francisco. Black car, town car, executive car service for airport transfers, events, and hourly chauffeur.",
    h1: "San Francisco Limo Service & Black Car",
    image: "/images/services/business.jpg",
    alt: "Business and city chauffeured car service",
    paragraphs: [
      "Explore San Francisco with limo and black car service arranged around your destination and schedule. Global Link Transportation offers town car, limousine, and executive car service for travel across the Bay Area, with a professional chauffeur at the wheel. Choose luxury car service for a hotel arrival, dinner, or an afternoon out, and combine city ground transportation with an SFO airport transfer when your visit begins or ends at the airport.",
      "Plan San Francisco car service for Fisherman's Wharf, Union Square, SoMa, the Financial District, or Chinatown. An hourly chauffeur can accommodate several stops, including a visit near the Golden Gate Bridge, while a town car or black car supports a direct journey. For business schedules, executive car service and corporate transportation connect Bay Area offices and meetings with SFO airport limo and airport car service, keeping your ground transportation in one itinerary.",
      "Our San Francisco limo service also supports wedding limo arrivals, prom limo evenings, and event group transportation. Select a limousine or luxury car service for a smaller party, or ask about party bus, charter bus, and bus rental options for guests traveling together. Whether you need a chauffeur for a celebration or an airport transfer for arriving guests, we arrange car service across San Francisco and the Bay Area.",
      "Extend your San Francisco visit with wine country tours, a Napa Valley wine tour, or Sonoma wine tours for wine tasting outside the city. A black car, town car, or limousine provides a comfortable setting for the journey, with a chauffeur handling your Bay Area ground transportation. Book city limo service, executive car service, or SFO airport limo travel through the homepage, selecting your pickup, destination, vehicle, and any airport car service needed for your trip.",
    ],
  },
  "/corporate-transportation": {
    title: "Corporate Transportation & Executive Car Service | Global Link",
    description: "Corporate transportation in San Francisco. Executive car service for business travel, meetings, and airport transfers. Reliable, professional chauffeurs.",
    h1: "Corporate Transportation & Executive Car Service",
    image: "/images/services/corporate.jpg",
    alt: "Corporate chauffeured transportation",
    paragraphs: [
      "Global Link Transportation arranges corporate transportation and executive car service for business travel in San Francisco and the Bay Area. A professional chauffeur provides business car service for meetings, client visits, and hotel transfers, with black car, town car, and limousine options. Pair your ground transportation with an airport transfer from SFO, OAK, or SJC, or choose luxury car service for an executive's arrival in San Francisco.",
      "Airport transfers for executives include SFO airport limo and airport car service with flight tracking to coordinate arrivals. Your chauffeur can connect the airport with San Francisco's Financial District, SoMa, or offices elsewhere in the Bay Area. Book executive car service for a direct journey or an hourly chauffeur for roadshows and consecutive meetings, using town car, black car, or limo transportation suited to the day's business schedule.",
      "Conferences and visiting teams benefit from coordinated corporate transportation and group transportation across San Francisco and the Bay Area. Alongside executive car service and limousine travel, charter bus and bus rental options accommodate larger groups, while a party bus may suit a company celebration. Extend a business visit with wine country tours, a Napa Valley wine tour, or Sonoma wine tours for wine tasting, with luxury car service and a chauffeur managing the ground transportation.",
      "Book corporate transportation and business car service through the homepage for airport arrivals, meetings, or hourly travel. An invoice is sent automatically with your confirmation email for every reservation. Whether you need SFO airport limo travel, a black car, town car, or limousine, your reservation records the selected journey. The same San Francisco and Bay Area chauffeur network can also arrange wedding limo and prom limo transportation outside your business itinerary.",
    ],
  },
  "/wedding-limo": {
    title: "Wedding Limo Service in San Francisco | Global Link",
    description: "Wedding limo service in San Francisco & Bay Area. Luxury limousines for your big day. Book your wedding transportation online.",
    h1: "Wedding Limo Service in San Francisco",
    image: "/images/services/events.jpg",
    alt: "Special occasion chauffeured transportation",
    paragraphs: [
      "Celebrate with wedding limo service in San Francisco and throughout the Bay Area. Global Link Transportation arranges wedding limousine and luxury car service for the bride & groom, wedding party, and guests. A professional chauffeur handles the ground transportation between your pickup, ceremony, and reception, with black car, town car, and limousine choices. Add an airport transfer or SFO airport limo reservation for loved ones arriving at the airport.",
      "Build your wedding transportation around the moments that matter: getting ready, the ceremony, photos, and the reception. Share your locations and timing when arranging a wedding limo, whether the celebration is in San Francisco, a Napa wedding venue, or a Sonoma wedding setting. An hourly chauffeur and luxury car service can support several stops, while airport car service, executive car service, and town car travel accommodate separate arrivals across the Bay Area.",
      "For a larger wedding party, arrange group transportation with charter bus or bus rental options alongside a wedding limousine. A party bus can suit a celebration, and black car service offers another choice for individual guests. Our San Francisco chauffeur network also arranges prom limo and corporate transportation, so you can choose the limo or limousine that fits your occasion and coordinate SFO airport transfers with the rest of your Bay Area plans.",
      "Extend a Napa wedding or Sonoma wedding weekend with wine country tours and wine tasting for your guests. Choose a Napa Valley wine tour or Sonoma wine tours with luxury car service, a town car, or a limousine and chauffeur, then return to San Francisco or another Bay Area destination. Book your wedding limo and ground transportation through the homepage, including any SFO airport limo or airport car service needed before or after the celebration.",
    ],
  },
  "/wine-country-tours": {
    title: "Napa & Sonoma Wine Country Tours | Global Link",
    description: "Napa Valley & Sonoma wine country tours. Luxury limo and car service for wine tasting. Book your wine tasting experience.",
    h1: "Napa & Sonoma Wine Country Tours",
    image: "/images/services/prom-wine.jpg",
    alt: "Chauffeured prom and wine country transportation",
    paragraphs: [
      "Enjoy wine country tours from San Francisco and the Bay Area with Global Link Transportation. A Napa Valley wine tour, Sonoma wine tours, or a visit to Livermore brings wine tasting within comfortable reach by limo, limousine, or black car. Our luxury car service pairs a professional chauffeur with your chosen itinerary, so your wine tasting experience centers on the tasting rooms rather than driving. Town car and executive car service are also available for your ground transportation.",
      "Plan Napa Valley wine tasting and Sonoma wine tasting tours around the tasting rooms you want to visit. Share your stops and appointment times when booking wine tasting tours, and choose an hourly chauffeur for an afternoon or full-day tour. Wine country tours can start in San Francisco or another Bay Area city, with a limousine, town car, or black car providing car service between Napa, Sonoma, or Livermore destinations on your planned itinerary.",
      "For group transportation, ask about a party bus, charter bus, or bus rental alongside limo and luxury car service. A Napa Valley wine tour or Sonoma wine tours can be part of a wedding limo weekend or corporate transportation itinerary, while prom limo service is another separate celebration option. Each wine tasting experience benefits from a chauffeur handling Bay Area ground transportation, leaving your San Francisco group free to enjoy the day together.",
      "Connect your wine country tours with an airport transfer when arriving through SFO. Our SFO airport limo and airport car service provide flight tracking for your San Francisco airport arrival, followed by black car, town car, limousine, or executive car service for the next part of your journey. Book your Napa Valley wine tour, Sonoma wine tours, or wine tasting tours on the homepage and include your Bay Area pickup, planned tasting rooms, and full-day travel needs.",
    ],
  },
} satisfies Record<string, ServicePageData>;

export type ServicePath = keyof typeof SERVICE_PAGES;

/**
 * Hourly chauffeur rates, from the SEO fact sheet (NED 2026-11-06).
 * NOTE: these are the fact-sheet values — sedan $85, SUV $120, limousine
 * $120, Sprinter $120 / $140 / $160. The booking form's HOURLY_RATES still
 * shows SUV/limousine at $140; that is a known open item and NED's call —
 * content keeps $120 here. Do NOT "sync" this table to HOURLY_RATES.
 */
export const HOURLY_RATES_FACT_SHEET: readonly { label: string; rate: number }[] = [
  { label: "Sedan", rate: 85 },
  { label: "SUV", rate: 120 },
  { label: "Limousine", rate: 120 },
  { label: "Sprinter", rate: 120 },
  { label: "Luxury Sprinter", rate: 140 },
  { label: "Limo Sprinter", rate: 160 },
];

/** Canonical NAP — the exact string used on the site, GBP and every citation. */
export const CANONICAL_NAP =
  "Global Link Transportation · 405 California Dr, Burlingame, CA 94010 · (415) 787-8776 · https://globallinktransport.com/";

export const BOLD_TERMS = [
  "airport", "limo", "limousine", "San Francisco", "Bay Area", "SFO", "black car",
  "car service", "town car", "executive car service", "chauffeur", "luxury car service",
  "ground transportation", "SFO airport limo", "airport transfer", "airport car service",
  "wedding limo", "prom limo", "corporate transportation", "wine country tours",
  "Napa Valley wine tour", "Sonoma wine tours", "wine tasting", "charter bus",
  "party bus", "bus rental", "group transportation",
] as const;