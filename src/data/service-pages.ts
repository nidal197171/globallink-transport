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
  "/san-jose-limo-service": {
    title: "San Jose Limo Service & Silicon Valley Black Car | Global Link",
    description: "San Jose limo and black car service across Silicon Valley. SJC airport pickups, corporate roadshows, events and hourly chauffeur — book online.",
    h1: "San Jose Limo Service & Silicon Valley Black Car",
    image: "/images/services/business.jpg",
    alt: "San Jose chauffeured car service in Silicon Valley",
    paragraphs: [
      "San Jose is the capital of Silicon Valley, and Global Link Transportation arranges limo and black car service across it — from Norman Y. Mineta San Jose International Airport (SJC) to downtown San Jose, the convention center, Santana Row, and the tech campuses that line the valley. A chauffeur handles the airport run, the cross-Bay Area trip to San Francisco, or a full day of meetings across Santa Clara County, with a sedan, SUV, limousine, or Sprinter to match the party. Book an airport transfer or an hourly chauffeur and your car is confirmed before you land.",
      "Pickup points cover the whole city: SJC terminals, downtown hotels and the San Jose McEnery Convention Center, the SAP Center, San Jose State University, Santana Row, and offices across North San Jose and the Golden Triangle. The drive from SJC to downtown San Jose is about 5–10 minutes; Palo Alto is roughly 20–25 minutes, SFO about 45–60 minutes via US-101, and downtown San Francisco about an hour. Airport pickups include flight tracking and a name-sign meet at arrivals, with the airline and flight number taken at booking.",
      "San Jose is where tech executives, conference attendees, and event groups book most — a roadshow that starts at a North San Jose campus, runs through meetings in Palo Alto and Mountain View, and ends at SFO is a routine day here, and the service runs 24 hours. Event groups book for the SAP Center and for Levi's Stadium in neighboring Santa Clara, where a Sprinter keeps a whole group together instead of five separate cars. A sedan or SUV suits a solo executive or a couple; a Sprinter suits a team or a wedding party.",
      "A San Jose booking can also be the start of a longer day: an SJC pickup that continues to a Napa Valley or Sonoma wine tour, a wedding at a San Jose venue such as Hayes Mansion, or a corporate event in San Francisco. Hourly chauffeur service carries a 4-hour minimum, and airport transfers come with fixed fares and no surge pricing. Get an instant quote on the homepage and book your San Jose car service online, or call (415) 787-8776.",
    ],
    faqs: [
      {
        question: "How long is the drive from SJC to downtown San Jose?",
        answer:
          "About 5–10 minutes by car — SJC sits just north of downtown. Your chauffeur tracks your flight and meets you at arrivals with a name sign, so the short ride starts the moment you land.",
      },
      {
        question: "Do you pick up from San Jose airport (SJC)?",
        answer:
          "Yes. We pick up from Norman Y. Mineta San Jose International Airport with flight tracking and a name-sign meet at arrivals. Include your airline and flight number when booking so dispatch can follow the flight.",
      },
      {
        question: "Can I book a car from San Jose to SFO?",
        answer:
          "Yes. The drive to SFO is roughly 45–60 minutes via US-101. Book it as a one-way transfer or as an hourly chauffeur if you have several stops — get an instant quote on the homepage.",
      },
      {
        question: "Do you provide transportation for events at the SAP Center or Levi's Stadium?",
        answer:
          "Yes. We arrange limousines and Sprinter group transport for events at the SAP Center in downtown San Jose and Levi's Stadium in neighboring Santa Clara, with an hourly chauffeur on a 4-hour minimum for the game, concert, or tailgate.",
      },
    ],
  },
  "/palo-alto-limo-service": {
    title: "Palo Alto Limo Service & Stanford Black Car | Global Link",
    description: "Palo Alto limo and black car service for Stanford, SFO and SJC airport pickups, medical visits, corporate travel and hourly chauffeur — book online.",
    h1: "Palo Alto Limo Service & Stanford Black Car",
    image: "/images/services/business.jpg",
    alt: "Palo Alto chauffeured car service near Stanford",
    paragraphs: [
      "Palo Alto is the heart of the Peninsula, and Global Link Transportation arranges limo and black car service across it — from SFO and SJC to Stanford University, Stanford Health Care, downtown University Avenue, and the offices of Stanford Research Park. A chauffeur handles the airport run, the cross-Bay Area trip to San Francisco, or a full day of meetings and appointments across the city, with a sedan, SUV, limousine, or Sprinter to match the party. Book an airport transfer or an hourly chauffeur and your car is confirmed before you land.",
      "Pickup points cover the whole city: SFO and SJC terminals, the Palo Alto Caltrain station, Stanford University campus, Stanford Health Care and the Palo Alto VA Medical Center, downtown University Avenue and California Avenue addresses, the Stanford Shopping Center, and offices across Stanford Research Park. The drive from SFO to Palo Alto is about 30–35 minutes via US-101; SJC is roughly 20–25 minutes, San Jose about 25 minutes, and downtown San Francisco about 45–50 minutes. Airport pickups include flight tracking and a name-sign meet at arrivals, with the airline and flight number taken at booking.",
      "Palo Alto is where Stanford visitors, medical patients and their families, and tech executives book most — a parent arriving for a campus tour, a family coming for a hospital appointment, or an executive with back-to-back meetings in Stanford Research Park and Mountain View is a routine day here, and the service runs 24 hours. Event groups book for Stanford ceremonies and weddings at Gamble Garden and other local venues, where a Sprinter keeps a whole party together instead of several separate cars. A sedan or SUV suits a solo traveler or a couple; a Sprinter suits a family group or a wedding party.",
      "A Palo Alto booking can also be the start of a longer day: an SFO pickup that continues to a Napa Valley or Sonoma wine tour, a corporate roadshow down the Peninsula, or a wedding weekend. Hourly chauffeur service carries a 4-hour minimum, and airport transfers come with fixed fares and no surge pricing. Get an instant quote on the homepage and book your Palo Alto car service online, or call (415) 787-8776.",
    ],
    faqs: [
      {
        question: "How long is the drive from SFO to Palo Alto?",
        answer:
          "About 30–35 minutes by car via US-101. Your chauffeur tracks your flight and meets you at arrivals with a name sign, so the ride starts the moment you land.",
      },
      {
        question: "Do you pick up from Stanford University and Stanford Health Care?",
        answer:
          "Yes. We pick up from Stanford University campus, Stanford Health Care, and the Palo Alto VA Medical Center, as well as downtown University Avenue and California Avenue addresses, the Palo Alto Caltrain station, and the Stanford Shopping Center.",
      },
      {
        question: "Can I book a car from Palo Alto to SJC or SFO?",
        answer:
          "Yes. The drive to SJC is roughly 20–25 minutes and to SFO about 30–35 minutes via US-101. Book it as a one-way transfer or as an hourly chauffeur if you have several stops — get an instant quote on the homepage.",
      },
      {
        question: "Do you provide transportation for Stanford events and weddings in Palo Alto?",
        answer:
          "Yes. We arrange limousines and Sprinter group transport for Stanford ceremonies, weddings at venues such as Gamble Garden, and family gatherings, with an hourly chauffeur on a 4-hour minimum for the ceremony, photos, and reception.",
      },
    ],
  },
  "/oakland-limo-service": {
    title: "Oakland Limo Service & OAK Airport Black Car | Global Link",
    description: "Oakland limo and black car service for OAK airport pickups, Jack London Square, downtown events and hourly chauffeur — book online.",
    h1: "Oakland Limo Service & OAK Airport Black Car",
    image: "/images/services/airport.jpg",
    alt: "Oakland chauffeured car service at OAK airport",
    paragraphs: [
      "Oakland is the East Bay's front door, and Global Link Transportation arranges limo and black car service across it — from Oakland International Airport (OAK) to downtown Oakland, Jack London Square, and the neighborhoods around Lake Merritt. A chauffeur handles the airport run, the Bay Bridge trip into San Francisco, or a full day of meetings and events across the East Bay, with a sedan, SUV, limousine, or Sprinter to match the party. Book an airport transfer or an hourly chauffeur and your car is confirmed before you land.",
      "Pickup points cover the whole city: OAK Terminals 1 and 2 off I-880 via Hegenberger Road, downtown hotels including the Oakland Marriott City Center and the Hilton Oakland Airport, Jack London Square, the Oakland Convention Center, and the Fox Theater and Paramount Theatre. The drive from OAK to downtown Oakland is about 15–20 minutes; downtown San Francisco is roughly 25–45 minutes via the Bay Bridge, Berkeley about 20–25 minutes, and San Jose about 45–55 minutes via I-880. Airport pickups include flight tracking and a name-sign meet at arrivals, with the airline and flight number taken at booking.",
      "Oakland is where OAK flyers, concert and event groups, and business travelers book most — OAK is the calmer Bay Area airport, and a pre-booked car beats the curbside scramble when the flight lands late or the Bay Bridge is backing up. Event groups book for shows at the Oakland Arena, the Fox Theater, and the Paramount Theatre, where a Sprinter keeps a whole party together instead of several separate cars. Wedding parties book Oakland too, with venues around Lake Merritt and Preservation Park, and a sedan or SUV suits a solo traveler or a couple.",
      "An Oakland booking can also be the start of a longer day: an OAK pickup that continues to a Napa Valley or Sonoma wine tour, a corporate roadshow across the Bay Area, or a wedding weekend. Hourly chauffeur service carries a 4-hour minimum, and airport transfers come with fixed fares and no surge pricing. Get an instant quote on the homepage and book your Oakland car service online, or call (415) 787-8776.",
    ],
    faqs: [
      {
        question: "How long is the drive from OAK to downtown Oakland?",
        answer:
          "About 15–20 minutes by car — OAK sits just south of downtown off I-880. Your chauffeur tracks your flight and meets you at arrivals with a name sign, so the ride starts the moment you land.",
      },
      {
        question: "Do you pick up from Oakland airport (OAK)?",
        answer:
          "Yes. We pick up from Oakland International Airport Terminals 1 and 2 with flight tracking and a name-sign meet at arrivals. Include your airline and flight number when booking so dispatch can follow the flight.",
      },
      {
        question: "Can I book a car from Oakland to downtown San Francisco?",
        answer:
          "Yes. The drive to downtown San Francisco is roughly 25–45 minutes via the Bay Bridge, depending on traffic. Book it as a one-way transfer or as an hourly chauffeur if you have several stops — get an instant quote on the homepage.",
      },
      {
        question: "Do you provide transportation for concerts and events in Oakland?",
        answer:
          "Yes. We arrange limousines and Sprinter group transport for events at the Oakland Arena, the Fox Theater, and the Paramount Theatre, with an hourly chauffeur on a 4-hour minimum for the show and the ride home.",
      },
    ],
  },
  "/berkeley-limo-service": {
    title: "Berkeley Limo Service & UC Berkeley Black Car | Global Link",
    description: "Berkeley limo and black car service for UC Berkeley, OAK and SFO airport pickups, graduations, events and hourly chauffeur — book online.",
    h1: "Berkeley Limo Service & UC Berkeley Black Car",
    image: "/images/services/business.jpg",
    alt: "Berkeley chauffeured car service at UC Berkeley",
    paragraphs: [
      "Berkeley is the East Bay's university city, and Global Link Transportation arranges limo and black car service across it — from Oakland International Airport (OAK) and SFO to the UC Berkeley campus, downtown Berkeley, the Berkeley Marina, and the neighborhoods along Shattuck Avenue and Fourth Street. A chauffeur handles the airport run, the Bay Bridge trip into San Francisco, or a full day of meetings and events across the East Bay, with a sedan, SUV, limousine, or Sprinter to match the party. Book an airport transfer or an hourly chauffeur and your car is confirmed before you land.",
      "Pickup points cover the whole city: OAK Terminals 1 and 2, SFO terminals, the Downtown Berkeley BART station, the UC Berkeley campus, the Claremont Hotel, the Berkeley Marina, the Lawrence Hall of Science, Fourth Street shops, and the Berkeley Amtrak station. The drive from OAK to downtown Berkeley is about 25–30 minutes via I-880 and I-980; SFO is roughly 45–60 minutes via the Bay Bridge, downtown San Francisco about 25–40 minutes, and San Jose about 60–70 minutes via I-880. Airport pickups include flight tracking and a name-sign meet at arrivals, with the airline and flight number taken at booking.",
      "Berkeley is where UC Berkeley visitors, graduation families, and event groups book most — a parent arriving for a campus tour, a visiting scholar with a week of meetings, or a whole family flying in for commencement is a routine day here, and the service runs 24 hours. Wedding parties book Berkeley too, with the Claremont Hotel and the Berkeley Rose Garden the best-known local venues, and groups book for shows at Berkeley Repertory Theatre and the Greek Theatre. A Sprinter keeps a graduation party or a wedding group together instead of several separate cars; a sedan or SUV suits a solo traveler or a couple.",
      "A Berkeley booking can also be the start of a longer day: an OAK pickup that continues to a Napa Valley or Sonoma wine tour, a corporate roadshow across the Bay Area, or a wedding weekend. Hourly chauffeur service carries a 4-hour minimum, and airport transfers come with fixed fares and no surge pricing. Get an instant quote on the homepage and book your Berkeley car service online, or call (415) 787-8776.",
    ],
    faqs: [
      {
        question: "How long is the drive from OAK to UC Berkeley?",
        answer:
          "About 25–30 minutes by car via I-880 and I-980 — OAK is the closest airport to Berkeley. Your chauffeur tracks your flight and meets you at arrivals with a name sign, so the ride starts the moment you land.",
      },
      {
        question: "Do you pick up from the UC Berkeley campus?",
        answer:
          "Yes. We pick up from the UC Berkeley campus, the Downtown Berkeley BART station, the Claremont Hotel, the Berkeley Marina, Fourth Street, and the Berkeley Amtrak station, as well as SFO and OAK with flight tracking and a name-sign meet at arrivals.",
      },
      {
        question: "Can I book a car from Berkeley to SFO?",
        answer:
          "Yes. The drive to SFO is roughly 45–60 minutes via the Bay Bridge, depending on traffic. Book it as a one-way transfer or as an hourly chauffeur if you have several stops — get an instant quote on the homepage.",
      },
      {
        question: "Do you provide transportation for UC Berkeley graduations and Berkeley weddings?",
        answer:
          "Yes. We arrange limousines and Sprinter group transport for UC Berkeley graduation weekends and weddings at venues such as the Claremont Hotel and the Berkeley Rose Garden, with an hourly chauffeur on a 4-hour minimum for the ceremony, photos, and reception.",
      },
    ],
  },
  "/fremont-limo-service": {
    title: "Fremont Limo Service & Tri-City Black Car | Global Link",
    description: "Fremont limo and black car service for SJC and OAK airport pickups, Tesla and Warm Springs corporate travel, weddings and hourly chauffeur — book online.",
    h1: "Fremont Limo Service & Tri-City Black Car",
    image: "/images/services/business.jpg",
    alt: "Fremont chauffeured car service in the Tri-City area",
    paragraphs: [
      "Fremont is the Tri-City area's largest city, where Silicon Valley meets the East Bay, and Global Link Transportation arranges limo and black car service across it — from San Jose International Airport (SJC) and Oakland International Airport (OAK) to the Tesla Fremont Factory, the Warm Springs tech district, and the historic Niles and Mission San José neighborhoods. A chauffeur handles the airport run, the cross-Bay Area trip to San Francisco, or a full day of meetings and events across the city, with a sedan, SUV, limousine, or Sprinter to match the party. Book an airport transfer or an hourly chauffeur and your car is confirmed before you land.",
      "Pickup points cover the whole city: SJC, OAK, and SFO terminals, the Fremont BART station and the Warm Springs/South Fremont BART station, the Tesla Fremont Factory on Fremont Boulevard, the Fremont Marriott Silicon Valley, Washington Hospital, Mission San José, the Niles district and Niles Canyon Railway depot, Central Park and Lake Elizabeth, and Pacific Commons. The drive from SJC to Fremont is about 20–25 minutes — SJC is Fremont's closest airport; OAK is roughly 25–40 minutes via I-880, SFO about 35–55 minutes via I-880 and the San Mateo Bridge, and downtown San Francisco about 45–60 minutes. Airport pickups include flight tracking and a name-sign meet at arrivals, with the airline and flight number taken at booking.",
      "Fremont is where Tesla and Warm Springs tech travelers book most — factory visitors, engineers, and corporate teams from the Warm Springs district, home to the Tesla Fremont Factory and employers such as Zoox, Seagate, Western Digital, and ThermoFisher, use a pre-booked car for SJC runs and multi-stop roadshows across Silicon Valley, and the service runs 24 hours. Wedding parties book Fremont too, with the Fremont Marriott Silicon Valley ballroom, Century House and Gardens in Centerville, Paradise Ballrooms, and the Garden Court Inn the best-known local venues, and families book for visits to Mission San José, the Niles Canyon Railway, and Central Park. A Sprinter keeps a corporate team or a wedding party together instead of several separate cars; a sedan or SUV suits a solo traveler or a couple.",
      "A Fremont booking can also be the start of a longer day: an SJC pickup that continues to a Napa Valley or Sonoma wine tour, a corporate roadshow down the Peninsula, or a wedding weekend. Hourly chauffeur service carries a 4-hour minimum, and airport transfers come with fixed fares and no surge pricing. Get an instant quote on the homepage and book your Fremont car service online, or call (415) 787-8776.",
    ],
    faqs: [
      {
        question: "How long is the drive from SJC to Fremont?",
        answer:
          "About 20–25 minutes by car — SJC is Fremont's closest airport. Your chauffeur tracks your flight and meets you at arrivals with a name sign, so the ride starts the moment you land.",
      },
      {
        question: "Do you pick up from the Tesla Fremont Factory and Warm Springs?",
        answer:
          "Yes. We pick up from the Tesla Fremont Factory on Fremont Boulevard, the Warm Springs/South Fremont BART station, the Fremont Marriott Silicon Valley, and offices across the Warm Springs tech district, as well as SJC, OAK, and SFO with flight tracking and a name-sign meet at arrivals.",
      },
      {
        question: "Can I book a car from Fremont to SFO or OAK?",
        answer:
          "Yes. The drive to OAK is roughly 25–40 minutes via I-880 and to SFO about 35–55 minutes via I-880 and the San Mateo Bridge. Book it as a one-way transfer or as an hourly chauffeur if you have several stops — get an instant quote on the homepage.",
      },
      {
        question: "Do you provide transportation for weddings in Fremont?",
        answer:
          "Yes. We arrange limousines and Sprinter group transport for weddings at venues such as the Fremont Marriott Silicon Valley, Century House and Gardens, Paradise Ballrooms, and the Garden Court Inn, with an hourly chauffeur on a 4-hour minimum for the ceremony, photos, and reception.",
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