import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  AIRPORTS,
  AIRPORT_ORDER,
  AIRPORT_RATES,
  AIRPORT_TO_AIRPORT,
  CITIES,
  VEHICLES,
  cityName,
} from "@/data/globallink";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Globallink — Chauffeured Cars for Bay Area Business Travel" },
      {
        name: "description",
        content:
          "Chauffeured sedans, SUVs, limousines, vans and coaches across the Bay Area and SFO, OAK and SJC. Fixed fares, vetted chauffeurs, one monthly invoice.",
      },
      { property: "og:title", content: "Globallink — Chauffeured Cars, Wherever Business Takes You" },
      {
        property: "og:description",
        content:
          "One dispatch team for every ride your company books — sedan to coach, tracked live, invoiced once a month.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0F1B2D" },
    ],
  }),
  component: Index,
});

const NAV = [
  ["#about", "About"],
  ["#fleet", "Fleet"],
  ["#pricing", "Pricing"],
  ["#airport-rates", "Airport rates"],
  ["#hourly", "Hourly rates"],
  ["#how", "How it works"],
  ["#corporate", "Corporate"],
  ["#reviews", "Reviews"],
  ["#faq", "FAQ"],
] as const;

function LocationOptions() {
  return (
    <>
      <optgroup label="Airports">
        {AIRPORTS.map((a) => (
          <option key={a.code} value={`airport:${a.code}`}>
            {a.label} ({a.short})
          </option>
        ))}
      </optgroup>
      <optgroup label="Cities">
        {CITIES.map((c) => (
          <option key={c.slug} value={`city:${c.slug}`}>
            {c.name}
          </option>
        ))}
      </optgroup>
    </>
  );
}

function computeSedanBase(pickup: string, dropoff: string): number | "same" | "quote" | null {
  if (!pickup || !dropoff) return null;
  if (pickup === dropoff) return "same";
  const [pType, pCode = ""] = pickup.split(":");
  const [dType, dCode = ""] = dropoff.split(":");

  if (pType === "airport" && dType === "airport") {
    const key = [pCode, dCode].sort().join("-");
    return AIRPORT_TO_AIRPORT[key] ?? null;
  }
  if (pType === "airport" && dType === "city") return AIRPORT_RATES[pCode]?.[dCode] ?? null;
  if (pType === "city" && dType === "airport") return AIRPORT_RATES[dCode]?.[pCode] ?? null;
  return "quote";
}

function BookingCard() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [vehicle, setVehicle] = useState("sedan");

  const veh = VEHICLES.find((v) => v.value === vehicle)!;
  const base = computeSedanBase(pickup, dropoff);

  let hasPrice = false;
  let content: React.ReactNode;
  if (!pickup || !dropoff) {
    content = <span className="fare-label">Choose pickup and drop-off to see your fare</span>;
  } else if (base === "same") {
    content = <span className="fare-label">Pickup and drop-off can't be the same place</span>;
  } else if (base === "quote" || base === null) {
    content = (
      <span className="fare-label">Custom route — dispatch confirms your exact fare in minutes</span>
    );
  } else if (veh.multiplier === null) {
    hasPrice = true;
    content = (
      <>
        <span className="fare-amount">Request a quote</span>
        <span className="fare-sub">{veh.label} pricing is quoted per group size</span>
      </>
    );
  } else {
    hasPrice = true;
    const price = Math.round((base * veh.multiplier) / 5) * 5;
    content = (
      <>
        <span className="fare-amount">${price}</span>
        <span className="fare-sub">Estimated one-way fare · {veh.label}</span>
      </>
    );
  }

  return (
    <div className="booking-card" id="book">
      <h3>Check your fare</h3>
      <p className="sub">No payment required to reserve.</p>
      <div className="field-row">
        <div className="field">
          <label htmlFor="pu">Pickup</label>
          <select id="pu" value={pickup} onChange={(e) => setPickup(e.target.value)}>
            <option value="" disabled>
              Choose pickup
            </option>
            <LocationOptions />
          </select>
        </div>
        <div className="field">
          <label htmlFor="do">Drop-off</label>
          <select id="do" value={dropoff} onChange={(e) => setDropoff(e.target.value)}>
            <option value="" disabled>
              Choose destination
            </option>
            <LocationOptions />
          </select>
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="dt">Date &amp; time</label>
          <input id="dt" type="datetime-local" />
        </div>
        <div className="field">
          <label htmlFor="veh">Vehicle</label>
          <select id="veh" value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
            {VEHICLES.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={`fare-preview${hasPrice ? " has-price" : ""}`}>{content}</div>

      <button className="btn btn-brass">Reserve this ride</button>
    </div>
  );
}

function PriceRow({ name, amount }: { name: string; amount: string }) {
  return (
    <div className="price-row">
      <span className="name">{name}</span>
      <span className="leader" />
      <span className="amount">{amount}</span>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className={`faq-item${open ? " open" : ""}`}>
      <button className="faq-q" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {q}
        <span className="plus">+</span>
      </button>
      <div
        className="faq-a"
        ref={ref}
        style={{ maxHeight: open ? `${ref.current?.scrollHeight ?? 400}px` : undefined }}
      >
        <p>{a}</p>
      </div>
    </div>
  );
}

const FLEET = [
  {
    name: "Sedan",
    desc: "Airport runs and single meetings, understated and quick.",
    meta: "Up to 3 passengers, 2 bags",
    price: "From $85",
  },
  {
    name: "SUV",
    desc: "Small teams, extra luggage, or a more commanding presence.",
    meta: "Up to 5 passengers, 4 bags",
    price: "From $125",
  },
  {
    name: "Limousine",
    desc: "Weddings, galas and VIP arrivals that call for an entrance.",
    meta: "Up to 6 passengers",
    price: "From $235",
  },
  {
    name: "Sprinter van",
    desc: "Group transfers, roadshows and full teams travelling together.",
    meta: "Up to 14 passengers",
    price: "From $285",
  },
  {
    name: "Bus & coach",
    desc: "Conferences and large events, arriving on one schedule.",
    meta: "Up to 56 passengers",
    price: "Request a quote",
  },
];

function CarIcon() {
  return (
    <svg width="48" height="30" viewBox="0 0 48 30" fill="none">
      <path
        d="M4 22 L7 12 Q10 8 16 8 H30 Q36 8 39 12 L44 22"
        stroke="#0F1B2D"
        strokeWidth="1.6"
        fill="none"
      />
      <rect x="2" y="20" width="44" height="6" rx="2" stroke="#0F1B2D" strokeWidth="1.6" fill="none" />
      <circle cx="13" cy="26" r="3" stroke="#0F1B2D" strokeWidth="1.6" fill="#F6F4EF" />
      <circle cx="35" cy="26" r="3" stroke="#0F1B2D" strokeWidth="1.6" fill="#F6F4EF" />
    </svg>
  );
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [airport, setAirport] = useState("sfo");

  return (
    <>
      <header>
        <div className="wrap nav-inner">
          <div className="logo">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <circle cx="13" cy="13" r="12" stroke="#B08D3E" strokeWidth="1.4" />
              <path
                d="M4 13H22M13 4V22M7 7L19 19M19 7L7 19"
                stroke="#B08D3E"
                strokeWidth="0.8"
                opacity="0.5"
              />
            </svg>
            Globallink
          </div>
          <nav className="nav-links">
            {NAV.map(([href, label]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </nav>
          <div className="nav-cta">
            <a href="tel:+14157878776" className="btn btn-outline-dark">
              (415) 787-8776
            </a>
            <a href="#book" className="btn btn-brass">
              Reserve a car
            </a>
          </div>
          <button
            className="menu-toggle"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? "\u00d7" : "\u2630"}
          </button>
        </div>
        <div className={`mobile-panel${menuOpen ? " open" : ""}`}>
          <div className="mobile-panel-inner" onClick={() => setMenuOpen(false)}>
            {NAV.map(([href, label]) => (
              <a className="mp-link" key={href} href={href}>
                {label}
              </a>
            ))}
            <div className="mp-actions">
              <a href="tel:+14157878776" className="btn btn-outline-dark">
                Call (415) 787-8776
              </a>
              <a href="#book" className="btn btn-brass">
                Reserve a car
              </a>
            </div>
          </div>
        </div>
      </header>

      <section className="hero">
        <svg className="route-motif" viewBox="0 0 1160 620" preserveAspectRatio="none">
          <path
            d="M -20 480 C 200 520, 340 320, 560 360 S 900 220, 1180 260"
            stroke="#B08D3E"
            strokeWidth="1.2"
            strokeDasharray="2 8"
            fill="none"
            opacity="0.55"
          />
          <circle cx="-20" cy="480" r="4" fill="#B08D3E" opacity="0.6" />
          <circle cx="560" cy="360" r="4" fill="#B08D3E" opacity="0.6" />
          <circle cx="1180" cy="260" r="4" fill="#B08D3E" opacity="0.6" />
        </svg>
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow-line">
              <span className="dot" />
              Built for corporate travel and event teams
            </div>
            <h1>The last late driver cost you a meeting. Not this time.</h1>
            <p className="lead">
              One dispatch team for every ride your company books — sedan to coach, tracked live,
              invoiced once a month.
            </p>
            <div className="hero-actions">
              <div>
                <a href="#book" className="btn btn-brass">
                  Check availability
                </a>
                <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.45)", marginTop: 8 }}>
                  No card required to reserve
                </p>
              </div>
              <a href="#fleet" className="btn btn-outline-dark">
                View the fleet
              </a>
            </div>
            <div className="hero-stats">
              <div>
                <strong>29</strong>
                <span>Bay Area cities &amp; airports</span>
              </div>
              <div>
                <strong>1,200+</strong>
                <span>vetted chauffeurs</span>
              </div>
              <div>
                <strong>98%</strong>
                <span>on-time pickups</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>live dispatch</span>
              </div>
            </div>
          </div>

          <BookingCard />
        </div>
      </section>

      <div className="trust">
        <div className="wrap trust-inner">
          <p>
            <strong>98% on-time</strong> across the Bay Area — SFO, OAK and SJC included — not a
            marketing number, a dispatch metric we publish monthly
          </p>
          <p>1,200+ vetted chauffeurs · Fixed pricing · One monthly invoice</p>
        </div>
      </div>

      <section>
        <div className="wrap">
          <div className="section-head">
            <h2>Booking rides for a team isn't a car problem. It's a trust problem.</h2>
            <p>
              Every time you book a driver for a colleague or a guest, you're betting on something you
              don't control: will they show up on time, in a clean car, and will you get one clear
              bill at month's end — or twenty scattered receipts?
            </p>
          </div>
          <div className="problem-grid">
            <div className="problem-item">
              <div className="tag">Time</div>
              <h3>Every ride, coordinated by hand</h3>
              <p>
                Switching between apps and unknown drivers for each trip eats the hours it was
                supposed to save.
              </p>
            </div>
            <div className="problem-item">
              <div className="tag">Predictability</div>
              <h3>No guarantee on driver or price</h3>
              <p>
                Surge pricing and rotating drivers make it impossible to promise a guest — or your
                CFO — what a ride will actually cost.
              </p>
            </div>
            <div className="problem-item">
              <div className="tag">Budget control</div>
              <h3>Receipts, not reporting</h3>
              <p>
                Dozens of scattered charges with no cost center make travel spend nearly impossible
                to reconcile.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <div className="wrap">
          <div className="about-inner">
            <h2>Transportation you stop having to think about</h2>
            <p>
              Globallink isn't another ride-booking app. We're a full transportation coordination
              team — one unified fleet, individually vetted licensed chauffeurs, and support that
              answers as a person, not a routing bot.
            </p>
            <p>
              We started because travel managers and event planners were coordinating every ride by
              hand: one driver here, one invoice there, no guarantee on either. Today, we're the one
              team your company needs for every kind of trip across the Bay Area — San Francisco,
              Oakland, San Jose and the Peninsula, plus SFO, OAK and SJC — on a single invoice that
              ties it all together.
            </p>
          </div>
        </div>
      </section>

      <section id="fleet">
        <div className="wrap">
          <div className="section-head">
            <h2>Choose your ride</h2>
            <p>
              Five vehicle classes, each with its own vetted chauffeur pool — from a single airport
              transfer to a fifty-person conference shuttle.
            </p>
          </div>

          <div className="fleet-row">
            {FLEET.map((f) => (
              <div className="fleet-card" key={f.name}>
                <div className="icon-box">
                  <CarIcon />
                </div>
                <h3>{f.name}</h3>
                <p className="desc">{f.desc}</p>
                <div className="meta">
                  {f.meta}
                  <strong>{f.price}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing" id="pricing">
        <div className="wrap pricing-grid">
          <div className="pricing-copy">
            <h2>One car or a whole fleet, the same fair price every time.</h2>
            <p>
              From a quick airport run to coordinating a bus for a full event, one fleet and one set
              of chauffeurs covers every trip type — no surprise fees, no re-negotiating your rate
              each time you book.
            </p>
            <p>
              Your price is fixed at booking, not on arrival. The more you ride with us, the lower
              your average cost — no long contracts, no monthly minimum.
            </p>
            <p className="note">Get your price now — no commitment.</p>
          </div>
          <div className="price-card">
            <PriceRow name="Sedan" amount="From $85" />
            <PriceRow name="SUV" amount="From $125" />
            <PriceRow name="Limousine" amount="From $235" />
            <PriceRow name="Sprinter van" amount="From $285" />
            <PriceRow name="Bus & coach" amount="Custom quote" />
            <a href="#book" className="btn btn-brass">
              See your instant price
            </a>
            <p className="disclaimer">
              No card required · No sales call · Just a clear number, in seconds
            </p>
          </div>
        </div>
      </section>

      <section className="pricing" id="airport-rates">
        <div className="wrap">
          <div className="section-head">
            <h2>Airport transfer rates</h2>
            <p>
              Sedan pricing from SFO, OAK and SJC to every Bay Area city we serve. SUV, limousine and
              sprinter fares scale up from these base rates — dispatch confirms your exact price at
              booking.
            </p>
          </div>

          <div className="airport-tabs">
            {AIRPORTS.map((a) => (
              <button
                key={a.code}
                className={`airport-tab${airport === a.code ? " active" : ""}`}
                onClick={() => setAirport(a.code)}
              >
                {a.label} <span style={{ opacity: 0.6, fontWeight: 500 }}>({a.short})</span>
              </button>
            ))}
          </div>

          <div className="price-card airport-panel active">
            <div className="airport-rows">
              {(AIRPORT_ORDER[airport] ?? []).map((slug) => (
                <PriceRow
                  key={slug}
                  name={cityName(slug)}
                  amount={`$${AIRPORT_RATES[airport]?.[slug] ?? ""}`}
                />
              ))}
            </div>
            <a href="#book" className="btn btn-brass">
              Book from {airport.toUpperCase()}
            </a>
            <p className="disclaimer">
              Flight tracked · No wait fee for delays · Sedan base rate
            </p>
          </div>
        </div>
      </section>

      <section className="pricing" id="hourly">
        <div className="wrap pricing-grid">
          <div className="pricing-copy">
            <h2>Need the car to wait? Book by the hour.</h2>
            <p>
              For roadshows, city tours, or a day where your schedule keeps shifting, your chauffeur
              and vehicle stay with you — no re-booking between stops, no separate fare for each leg.
            </p>
            <p>
              Hourly bookings have a <strong>4-hour minimum</strong>. After that, you're billed in
              30-minute increments at the same rate.
            </p>
            <p className="note">Get your hourly rate now — no commitment.</p>
          </div>
          <div className="price-card">
            <PriceRow name="Sedan" amount="$75/hr" />
            <PriceRow name="SUV" amount="$95/hr" />
            <PriceRow name="Limousine" amount="$150/hr" />
            <PriceRow name="Sprinter van" amount="$175/hr" />
            <PriceRow name="Bus & coach" amount="Custom quote" />
            <a href="#book" className="btn btn-brass">
              Book by the hour
            </a>
            <p className="disclaimer">
              4-hour minimum · No card required · Same chauffeur, all day
            </p>
          </div>
        </div>
      </section>

      <section className="steps" id="how">
        <div className="wrap">
          <div className="section-head">
            <h2>How a reservation works</h2>
            <p>Three steps, handled by a person, not just software.</p>
          </div>
          <div className="step-grid">
            <div className="step">
              <div className="num">01</div>
              <h3>Tell us where and when</h3>
              <p>
                Enter your pickup, destination and vehicle class. Group or recurring trips can be
                arranged directly with dispatch.
              </p>
            </div>
            <div className="step">
              <div className="num">02</div>
              <h3>We confirm your chauffeur</h3>
              <p>
                A dispatcher assigns a licensed, background-checked driver and sends confirmation
                with their name and photo.
              </p>
            </div>
            <div className="step">
              <div className="num">03</div>
              <h3>Track your ride live</h3>
              <p>
                Watch your chauffeur's route in real time and reach dispatch directly if your plans
                change.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="section-head">
            <h2>One dispatch team, for every ride your company books</h2>
            <p>
              Instead of switching between apps and unfamiliar drivers, your team gets a single fleet
              — sedan to coach — with licensed chauffeurs, live tracking, and one invoice at the end
              of the month. Booking takes a minute; the worrying stops.
            </p>
          </div>
          <div className="usp-grid">
            <div className="usp">
              <div className="icon-box">
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                  <circle cx="17" cy="17" r="14" stroke="#B08D3E" strokeWidth="1.6" />
                  <text
                    x="17"
                    y="22"
                    textAnchor="middle"
                    fontFamily="Fraunces, serif"
                    fontSize="14"
                    fill="#B08D3E"
                  >
                    $
                  </text>
                </svg>
              </div>
              <h3>Fixed pricing</h3>
              <p>
                Your fare is confirmed at booking. No surge, no meter, no surprises on arrival —
                solves the predictability problem.
              </p>
            </div>
            <div className="usp">
              <div className="icon-box">
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                  <path
                    d="M17 4 L28 9 V17 C28 24 23 28 17 30 C11 28 6 24 6 17 V9 Z"
                    stroke="#B08D3E"
                    strokeWidth="1.6"
                    fill="none"
                  />
                </svg>
              </div>
              <h3>Licensed &amp; vetted</h3>
              <p>
                Every chauffeur passes a background check and a driving record review before their
                first trip.
              </p>
            </div>
            <div className="usp">
              <div className="icon-box">
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                  <circle cx="17" cy="17" r="14" stroke="#B08D3E" strokeWidth="1.6" />
                  <circle cx="17" cy="17" r="2.4" fill="#B08D3E" />
                  <circle
                    cx="17"
                    cy="17"
                    r="8"
                    stroke="#B08D3E"
                    strokeWidth="1"
                    strokeDasharray="1.5 3"
                  />
                </svg>
              </div>
              <h3>Live tracking</h3>
              <p>
                Follow your chauffeur from dispatch to drop-off and hand off coordination — solves
                the hands-on-time problem.
              </p>
            </div>
            <div className="usp">
              <div className="icon-box">
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                  <rect x="6" y="6" width="22" height="22" rx="2" stroke="#B08D3E" strokeWidth="1.6" />
                  <line x1="10" y1="13" x2="24" y2="13" stroke="#B08D3E" strokeWidth="1.4" />
                  <line x1="10" y1="18" x2="24" y2="18" stroke="#B08D3E" strokeWidth="1.4" />
                  <line x1="10" y1="23" x2="18" y2="23" stroke="#B08D3E" strokeWidth="1.4" />
                </svg>
              </div>
              <h3>Corporate billing</h3>
              <p>
                One monthly invoice with cost centers and ride reporting — solves the
                scattered-receipts problem.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials" id="reviews">
        <div className="wrap">
          <div className="section-head">
            <h2>What riders say</h2>
          </div>
          <div className="test-grid">
            <div className="test-card">
              <p className="quote">
                "Every chauffeur showed up early for our three-day roadshow across four cities. Not
                one delay."
              </p>
              <div className="who">
                <strong>Priya N.</strong>Event planner, London
              </div>
            </div>
            <div className="test-card">
              <p className="quote">
                "We moved our whole travel program to Globallink for the invoicing alone. The service
                held up just as well."
              </p>
              <div className="who">
                <strong>Daniel R.</strong>COO, fintech startup
              </div>
            </div>
            <div className="test-card">
              <p className="quote">
                "The limousine arrived exactly on time and the driver knew the venue better than our
                own coordinator did."
              </p>
              <div className="who">
                <strong>Marisol T.</strong>Wedding client
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="corporate-wrap">
        <div className="corporate" id="corporate">
          <div>
            <h2>Managing travel for a team or event?</h2>
            <p>
              Get a dedicated account manager, volume rates, and a single invoice for every ride
              across the Bay Area.
            </p>
          </div>
          <a href="#book" className="btn btn-brass">
            Talk to our team
          </a>
        </div>
      </div>

      <section id="faq">
        <div className="wrap">
          <div className="section-head">
            <h2>Questions before you book</h2>
          </div>
          <div className="faq-list">
            <FaqItem
              q="Can I book a car for today?"
              a="Yes, across the Bay Area cities and airports we serve. Same-day requests are matched with the nearest available chauffeur; dispatch will confirm within minutes."
            />
            <FaqItem
              q="Do you cover airport pickups?"
              a="Yes — SFO, OAK and SJC all include flight tracking, so your chauffeur adjusts to delays or early landings at no extra charge."
            />
            <FaqItem
              q="Can we set up a corporate account?"
              a="Yes. Corporate accounts get monthly invoicing, cost-center tagging and a dedicated account manager. Reach out through the contact section to get started."
            />
            <FaqItem
              q="What happens if my flight is delayed?"
              a="Airport pickups are tracked against your flight automatically, so your chauffeur's arrival shifts with you and you're never charged a wait fee for a late landing."
            />
            <FaqItem
              q="Can I book multiple vehicles for a group?"
              a="Yes — sprinter vans and coaches are built for this. For large events, our team will coordinate multi-vehicle logistics directly with your point of contact."
            />
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="wrap">
          <h2>Wherever you're headed next, a car is ready.</h2>
          <a href="#book" className="btn btn-outline-light">
            Book now
          </a>
          <p style={{ fontSize: 13, color: "rgba(15,27,45,0.65)", marginTop: 16 }}>
            No card required now · Support available 24/7
          </p>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <div className="foot-logo">Globallink</div>
              <p style={{ maxWidth: 260, fontSize: 14 }}>
                Chauffeured sedans, SUVs, limousines, sprinter vans and coaches across the Bay Area,
                including SFO, OAK and SJC.
              </p>
            </div>
            <div>
              <h4>Company</h4>
              <ul>
                <li>
                  <a href="#fleet">Fleet</a>
                </li>
                <li>
                  <a href="#how">How it works</a>
                </li>
                <li>
                  <a href="#corporate">Corporate</a>
                </li>
                <li>
                  <a href="#faq">FAQ</a>
                </li>
              </ul>
            </div>
            <div>
              <h4>Contact</h4>
              <ul>
                <li>(415) 787-8776</li>
                <li>GLtrans10@gmail.com</li>
                <li>Available 24/7</li>
              </ul>
            </div>
            <div>
              <h4>Follow</h4>
              <ul>
                <li>
                  <a href="#">Instagram</a>
                </li>
                <li>
                  <a href="#">LinkedIn</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 Globallink Transportation. All rights reserved.</span>
            <span>Licensed for-hire chauffeur network</span>
          </div>
        </div>
      </footer>
    </>
  );
}
