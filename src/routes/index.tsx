import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/services/SiteChrome";
import { SERVICE_PAGES, type ServicePath } from "@/data/service-pages";
import { SITE } from "@/config/site";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import { createReservationCheckout } from "@/lib/checkout.functions";
import { capturePayPalOrder, createPayPalOrder, getPayPalClientId } from "@/lib/paypal.functions";
import {
  AIRPORTS,
  AIRPORT_COORDS,
  AIRPORT_RATES,
  AIRPORT_TO_AIRPORT,
  CITIES,
  CITY_COORDS,
  VEHICLES,
  cityToCityQuote,
  estimateRoadMiles,
} from "@/data/globallink";
import InstallAppButton from "@/components/InstallAppButton";
import { mintBookingNumber } from "@/lib/bookingNumber";
import { postToBookingSheet, markBookingPaid } from "@/lib/bookingSheet";
import { flightNumberError, isAirportPickup } from "@/lib/airportPickup";
import fleetSedan from "@/assets/fleet/sedan.jpg";
import fleetSuv from "@/assets/fleet/suv.jpg";
import fleetLimousine from "@/assets/fleet/limousine.jpg";
import fleetSprinter from "@/assets/fleet/sprinter.jpg";
import fleetCoach from "@/assets/fleet/coach.jpg";
import fleetLuxurySprinter from "@/assets/fleet/luxury-sprinter.jpg";
import fleetLimoSprinter from "@/assets/fleet/limo-sprinter.jpg";
import { SPRINTER_TIERS, sprinterTier, sprinterTripFare } from "@/lib/sprinterTiers";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "San Francisco Limo & Black Car Service | SFO Airport Transfers | Global Link",
      },
      {
        name: "description",
        content:
          "Luxury black car & limo service in San Francisco & the Bay Area. SFO, OAK & SJC airport transfers with flight tracking. Fixed fares, vetted chauffeurs. Book online in 2 minutes.",
      },
      {
        property: "og:title",
        content: "San Francisco Limo & Black Car Service | SFO Airport Transfers | Global Link",
      },
      {
        property: "og:description",
        content:
          "Luxury black car & limo service in San Francisco & the Bay Area. SFO, OAK & SJC airport transfers with flight tracking. Fixed fares, vetted chauffeurs. Book online in 2 minutes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const EMAIL = SITE.contact.email;
const PHONE = SITE.contact.phoneDisplay;
const PHONE_HREF = SITE.contact.phoneHref;

const VEHICLE_LABEL: Record<string, string> = Object.fromEntries(VEHICLES.map((v) => [v.value, v.label]));
const VEHICLE_MULTIPLIER: Record<string, number | null> = Object.fromEntries(
  VEHICLES.map((v) => [v.value, v.multiplier]),
);
const HOURLY_RATES: Record<string, number | null> = {
  sedan: 85,
  suv: 140,
  limousine: 140,
  ...Object.fromEntries(Object.entries(SPRINTER_TIERS).map(([value, tier]) => [value, tier.hourlyRate])),
  bus: null,
};

const HOUR_OPTIONS = [4, 5, 6, 7, 8, 9, 10, 11, 12];

const AGREEMENT_TERMS: { title: string; body: string }[] = [
  {
    title: "Passenger capacity",
    body: `The maximum capacity of the vehicle is the number of seat belts installed and must not be exceeded unless discussed and agreed upon with ${SITE.brand.legalName} prior to pickup.`,
  },
  {
    title: "Personal belongings",
    body: `${SITE.brand.legalName} is not liable or responsible for anything left in the vehicle. Please check your belongings before exiting.`,
  },
  {
    title: "Damage to the vehicle",
    body: "You are financially responsible for any physical damage done to the vehicle by you or your guests.",
  },
  {
    title: "Eating, drinking and smoking",
    body: "Eating, drinking and smoking in the vehicle are prohibited in order to preserve the original upholstery and interior finishes.",
  },
  {
    title: "Unsafe behavior",
    body: "If, in the sole judgment of the driver, the behavior of you or your guests is out of control, unsafe, illegal, dangerous or irresponsible to lives and/or property, the driver may terminate the run and order all occupants out of the vehicle, with or without a prior warning. If this happens, no refund will be issued.",
  },
  {
    title: "Cancellations",
    body: "Cancellations must be made at least 48 hours before your scheduled pickup. Cancellations inside the 48-hour window, or no-shows, will be charged the full reservation amount.",
  },
  {
    title: "Waiting time",
    body: "Waiting time up to 10 minutes is included. Any waiting time over 10 minutes will be charged at $2 per minute.",
  },
  {
    title: "Surprise pickups",
    body: "If the arrival of the vehicle is meant as a surprise, please indicate this at the time of booking.",
  },
  {
    title: "Payment authorization",
    body: `By signing this agreement, you authorize ${SITE.brand.legalName} to keep your credit card on file and charge it for any unpaid charges such as gratuity, overtime, tolls, waiting time, cleaning charges and damages.`,
  },
];

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "Can I book a car for today?",
    a: `Yes, across the ${SITE.market.metro} cities and airports we serve. Same-day requests are matched with the nearest available chauffeur; dispatch will confirm within minutes.`,
  },
  {
    q: "Do you cover airport pickups?",
    a: `Yes — ${SITE.market.airports} all include flight tracking, so your chauffeur adjusts to delays or early landings at no extra charge.`,
  },
  {
    q: "What happens if my flight is delayed?",
    a: "Airport pickups are tracked against your flight automatically, so your chauffeur's arrival shifts with you and you're never charged a wait fee for a late landing.",
  },
  {
    q: "Can I book multiple vehicles for a group?",
    a: "Yes — sprinter vans and coaches are built for this. For large events, our team will coordinate multi-vehicle logistics directly with your point of contact.",
  },
  {
    q: "What's your cancellation policy?",
    a: (
      <>
        Cancellations must be made at least 48 hours before your scheduled pickup. Cancellations inside the 48-hour
        window, or no-shows, will be charged the full reservation amount — see the{" "}
        <a href="#book" style={{ color: "var(--brass-dark)" }}>
          rental agreement
        </a>{" "}
        in the booking form above for full details.
      </>
    ),
  },
  {
    q: "What areas does Global Link Transportation serve?",
    a: "Global Link Transportation serves the San Francisco Bay Area with chauffeured car service, limousine, limo, Sprinter van, and charter bus coverage across San Francisco, San Mateo, San Jose, Oakland, Berkeley, Palo Alto, Mountain View, Daly City, South San Francisco, Redwood City, Fremont, Santa Clara, Sunnyvale, Walnut Creek, and more than 60 Bay Area cities. We also run SFO airport transfers plus pickups at OAK and SJC, and serve wine country and the coast, including Napa, Sonoma, Livermore, and Monterey.",
  },
  {
    q: "How much does an SFO airport transfer cost?",
    a: "SFO airport transfers use fixed fares with no surge pricing — a private black car, SUV, or limousine with a chauffeur, not an airport taxi. Our airport car service covers San Francisco, Oakland, and San Jose, and every SFO airport transfer is priced before you book. Use the fare calculator on this page to see your exact fixed fare for your pickup, destination, and vehicle. A 20% gratuity and a 5% booking fee apply.",
  },
  {
    q: "Do you offer wedding limo service in San Francisco?",
    a: "Yes — we offer wedding limo service in San Francisco and across the Bay Area with stretch limousines, SUVs, and Sprinter vans, plus charter bus and party bus options for larger wedding parties. Add red carpet service and champagne for your celebration, or book SFO airport transfers for guests flying in. Our on-time guarantee helps your wedding day run on schedule.",
  },
  {
    q: "Can I book a Napa wine tour with a chauffeur?",
    a: "Yes — book a Napa Valley wine tour with a professional chauffeur, or choose a Sonoma wine tour, Livermore wine tours, and other wine country tours across Napa, Sonoma, and Livermore wineries. Our wine tasting tours link a Napa Valley wine tasting with Sonoma wine tasting tours so the day flows easily, and a limo, SUV, Sprinter van, or party bus makes it a comfortable wine tasting experience with group transportation between wineries. Wine tours leave from San Francisco and most Bay Area cities, are booked by the hour with a 4-hour minimum, and can include an SFO airport transfer, so you can visit multiple wineries at your own pace.",
  },
  {
    q: "Do you provide corporate transportation for large events?",
    a: "Yes — we provide corporate transportation for conferences, roadshows, and large events across San Francisco and the Bay Area. Choose Sprinter vans, charter bus, bus rental, and coach service for up to 56 passengers, coordinated by one dispatch team as complete group transportation, with airport car service for SFO, OAK, and SJC arrivals. An invoice is sent automatically with your confirmation email for every reservation.",
  },
  {
    q: "What vehicles are available?",
    a: "Choose from seven vehicle options: Sedan for up to 3 passengers, SUV for up to 5 passengers, Limousine for up to 6 passengers, Sprinter van for up to 12 passengers, Luxury Sprinter for up to 12 passengers, Limo Sprinter for up to 12 passengers, and Bus & coach for up to 56 passengers. Each vehicle comes with a licensed, background-checked chauffeur, and every option can be booked for SFO airport transfers, wedding limo service, prom limo nights, concert transportation, sports game transportation, and wine country tours across San Francisco and the Bay Area.",
  },
  {
    q: "How far in advance should I book?",
    a: "We recommend booking 24-48 hours in advance for most San Francisco and Bay Area rides. Same-day bookings are available when vehicles and chauffeurs are available, including SFO airport transfers. For weddings, proms, concerts, sports games, and events that need charter buses, we recommend booking 2-4 weeks in advance.",
  },
  {
    q: "Do you offer hourly service?",
    a: "Yes — hourly limo and car service is available with a 4-hour minimum, then billed in 30-minute increments after that, which suits wine country tours, wedding limo service, and special nights out across San Francisco and the Bay Area. Hourly rates are Sedan $85/hr, SUV $120/hr, Limo $120/hr, Sprinter $175/hr, and Bus available with a custom quote.",
  },
  {
    q: "How long will my chauffeur wait at airport pickup?",
    a: "Waiting time up to 10 minutes is included. Any waiting time over 10 minutes is charged at $2 per minute. Flight tracking is included for SFO, OAK, and SJC, so your chauffeur adjusts to delays or early landings.",
  },
  {
    q: "Do you offer meet & greet service?",
    a: "Yes — for airport pickups you can add greet & meet in the booking form, where your driver meets you inside the terminal with a name sign for $40. For any other arrival details, note them in your booking or contact us.",
  },
  {
    q: "Can I request a child seat?",
    a: `Please note child seat needs when you book, or contact us at ${PHONE} or ${EMAIL} before your trip so dispatch can confirm what is available.`,
  },
  {
    q: "Can I bring a pet?",
    a: `Please contact us at ${PHONE} or ${EMAIL} before booking if you plan to travel with a pet, so dispatch can review your request.`,
  },
  {
    q: "What is the cancellation policy?",
    a: "Cancellations must be made at least 48 hours before your scheduled pickup. Cancellations inside the 48-hour window, or no-shows, will be charged the full reservation amount.",
  },
  {
    q: "Will I receive an invoice?",
    a: "An invoice is sent automatically with your confirmation email for every reservation.",
  },
  {
    q: "How do I change a reservation?",
    a: `Contact us at ${PHONE} or ${EMAIL} with your booking number. Please save your booking number, since you'll need it for any changes to your reservation.`,
  },
  {
    q: "Can I book for someone else?",
    a: "Yes — choose the someone-else option in the booking form and enter your name, phone, and email, plus a company or hotel name if relevant. The traveler details and signed rental agreement are included with the reservation.",
  },
  {
    q: "How much luggage fits in each vehicle?",
    a: "The Sedan carries up to 3 passengers and 2 bags, and the SUV carries up to 5 passengers and 4 bags. For limousine, Sprinter van, or bus and coach luggage needs, note them in your booking or contact us.",
  },
  {
    q: "Is gratuity included?",
    a: "A 20% gratuity is automatically added to all reservations. A 5% booking fee also applies.",
  },
  {
    q: "Can I add stops?",
    a: "For pick up & drop off and city-to-city reservations, you can add extra pickups in the booking form at $35 per stop. For other route needs, contact us before your trip.",
  },
  {
    q: "What is the difference between one-way and hourly service?",
    a: "Pick up & drop off and city-to-city reservations cover a route from your pickup to your destination at a fixed fare. Hourly service keeps your chauffeur and vehicle with you, with a 4-hour minimum and billing in 30-minute increments after that.",
  },
];

const DRIVE_REQS = [
  "Valid driver's license, age 21 or older",
  "Clean driving record, verified at onboarding",
  "Own or have access to a qualifying vehicle",
  "Valid commercial insurance where required",
  "Pass a background check",
  "Professional appearance and communication",
  "Smartphone for dispatch coordination",
  "Based in or near " + SITE.market.metro,
  "Proof of state license for company",
];

function placeLabel(value: string) {
  if (!value) return "";
  const [type, code] = value.split(":");
  if (type === "airport") {
    const a = AIRPORTS.find((x) => x.code === code);
    return a ? `${a.label} (${a.short})` : (code ?? "");
  }
  return CITIES.find((c) => c.slug === code)?.name ?? code ?? "";
}

function sprinterRouteMiles(
  pType: string | undefined,
  pCode: string | undefined,
  dType: string | undefined,
  dCode: string | undefined,
): number | null {
  const point = (t: string | undefined, c: string | undefined) =>
    !t || !c ? undefined : t === "airport" ? AIRPORT_COORDS[c] : t === "city" ? CITY_COORDS[c] : undefined;
  const a = point(pType, pCode);
  const b = point(dType, dCode);
  if (!a || !b) return null;
  return estimateRoadMiles(a, b);
}

function computeSedanBase(pickup: string, dropoff: string): number | "same" | "quote" | null {
  if (!pickup || !dropoff) return null;
  // Same pickup and drop-off: blocked with a contact-for-quote message,
  // except city → same city which is a bookable $85 flat fare.
  if (pickup === dropoff && !pickup.startsWith("city:")) return "same";
  const [pType, pCode] = pickup.split(":");
  const [dType, dCode] = dropoff.split(":");
  if (pType === "airport" && dType === "airport") {
    const key = [pCode, dCode].sort().join("-");
    return AIRPORT_TO_AIRPORT[key] ?? null;
  }
  if (pType === "airport" && dType === "city") {
    return AIRPORT_RATES[pCode!]?.[dCode!] ?? null;
  }
  if (pType === "city" && dType === "airport") {
    return AIRPORT_RATES[dCode!]?.[pCode!] ?? null;
  }
  if (pType === "city" && dType === "city") {
    return cityToCityQuote(pCode!, dCode!).base;
  }
  return "quote";
}

function LocationSelect({
  id,
  label,
  value,
  onChange,
  placeholder,
  citiesOnly,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  citiesOnly?: boolean;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="" disabled>
          {placeholder}
        </option>
        {!citiesOnly && (
          <optgroup label="Airports">
            {AIRPORTS.map((a) => (
              <option key={a.code} value={`airport:${a.code}`}>
                {a.label} ({a.short})
              </option>
            ))}
          </optgroup>
        )}
        <optgroup label="Cities">
          {CITIES.map((c) => (
            <option key={c.slug} value={`city:${c.slug}`}>
              {c.name}
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );
}

type FeeParts = { base: number; gratuity: number; fee: number; total: number };

// Google Sheet receiver for driver applications (Apps Script web app).
const DRIVER_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbwY3WnN5Yqnc3PJ62nMW6Le_1TWZnJRev9e8rlf11oIzf-KkGKnHD6F5IsYRp-RFsjk/exec";
// Greet & meet add-on: airport pickups only, flat $40 added to the total (no gratuity/fee on it).
const GREET_MEET_PRICE = 40;
// Extra pickups: $35 per additional stop, added to the total (no gratuity/fee on it).
const EXTRA_PICKUP_PRICE = 35;
const EXTRA_PICKUP_OPTIONS = [0, 1, 2, 3, 4, 5];

type BookingState = {
  service: string;
  pickup: string;
  dropoff: string;
  dt: string;
  vehicle: string;
  hours: number;
  greetMeet: boolean;
  extraPickups: number;
  name: string;
  signature: string;
  email: string;
  isConcierge: boolean;
  bookingFor: string;
  hotelName: string;
  conciergeName: string;
  conciergePhone: string;
  conciergeEmail: string;
  flightNumber: string;
};

function validateBooking(s: BookingState): string | null {
  const missingRoute = s.service === "hourly" ? !s.pickup : !s.pickup || !s.dropoff;
  if (missingRoute || !s.dt || !s.name.trim() || !s.signature.trim()) {
    return s.service === "hourly"
      ? "Please choose pickup, date & time, and sign your name before submitting."
      : "Please choose pickup, drop-off, date & time, and sign your name before submitting.";
  }
  const flightErr = flightNumberError([s.pickup, placeLabel(s.pickup)], s.flightNumber);
  if (flightErr) return flightErr;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email.trim())) {
    return "Please enter a valid email address for your receipt.";
  }
  if (!s.bookingFor) {
    return "Please tell us whether this booking is for you or for someone else.";
  }
  if (s.isConcierge && (!s.conciergeName.trim() || !s.conciergePhone.trim())) {
    return "Please enter your name and phone number.";
  }
  if (s.isConcierge && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.conciergeEmail.trim())) {
    return "Please enter a valid email address for the person booking.";
  }
  return null;
}

function buildDescription(s: BookingState): string {
  const base =
    s.service === "hourly"
      ? `${s.hours} hours hourly service · ${VEHICLE_LABEL[s.vehicle]} · pickup ${placeLabel(s.pickup)} · ${s.dt}`
      : `${placeLabel(s.pickup)} to ${placeLabel(s.dropoff)} · ${VEHICLE_LABEL[s.vehicle]} · ${s.dt}`;
  const flight = s.flightNumber.trim() ? ` · flight ${s.flightNumber.trim()}` : "";
  return `${base}${flight} · incl. 20% gratuity + 5% booking fee${s.greetMeet ? ` + greet & meet ($${GREET_MEET_PRICE})` : ""}${s.extraPickups > 0 ? ` + ${s.extraPickups} extra pickup${s.extraPickups > 1 ? "s" : ""} ($${s.extraPickups * EXTRA_PICKUP_PRICE})` : ""}`;
}

function reservationDetailsText(s: BookingState, fareText: string, bookingNo: string): string {
  const today = new Date().toISOString().split("T")[0];
  return (
    `${SITE.brand.legalName} — Reservation request\n\n` +
    `Booking number: ${bookingNo}\n` +
    `Service: ${s.service === "hourly" ? `Hourly (${s.hours} hours, 4-hour minimum)` : s.service === "city" ? "City to city" : "Airport pick up & drop off"}\n` +
    `Pickup: ${placeLabel(s.pickup)}\n` +
    (s.flightNumber.trim() ? `Flight number: ${s.flightNumber.trim()}\n` : "") +
    (s.service === "hourly" ? "" : `Drop-off: ${placeLabel(s.dropoff)}\n`) +
    `Date & time: ${s.dt}\n` +
    `Vehicle: ${VEHICLE_LABEL[s.vehicle]}\n` +
    (s.greetMeet ? `Greet & meet: Yes ($${GREET_MEET_PRICE})\n` : "") +
    (s.extraPickups > 0 ? `Extra pickups: ${s.extraPickups} ($${s.extraPickups * EXTRA_PICKUP_PRICE})\n` : "") +
    `Fare: ${fareText}\n\n` +
    (s.isConcierge
      ? `Booking for someone else\n` +
        `Booked by: ${s.conciergeName.trim()}\n` +
        `Booker phone: ${s.conciergePhone.trim()}\n` +
        `Booker email: ${s.conciergeEmail.trim()}\n` +
        (s.hotelName.trim() ? `Company / hotel: ${s.hotelName.trim()}\n` : "") +
        `\n`
      : "") +
    "Rental agreement acknowledgement\n" +
    `Name: ${s.name.trim()}\n` +
    `Email: ${s.email.trim()}\n` +
    `Signature: ${s.signature.trim()}\n` +
    `Date signed: ${today}\n\n` +
    `By signing, this person confirms they have read, understood and will comply with the provisions of the ${SITE.brand.legalName} rental agreement, including the 48-hour cancellation policy.`
  );
}

function buildReservationMail(s: BookingState, fareText: string, bookingNo: string): string {
  const subject = encodeURIComponent(`[${bookingNo}] New Reservation & Signed Agreement — ${s.name.trim()}`);
  const body = encodeURIComponent(reservationDetailsText(s, fareText, bookingNo));
  return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}

// Log a reservation to the Google Sheet. keepalive + a short delay before the
// mailto navigation lets the request finish on mobile (same pattern as the driver form).
function logBookingToSheet(s: BookingState, fareText: string, bookingNo: string, paymentMethod: string) {
  const route =
    s.service === "hourly"
      ? `${placeLabel(s.pickup)} (${s.hours} hr)`
      : `${placeLabel(s.pickup)} → ${placeLabel(s.dropoff)}`;
  postToBookingSheet({
    bookingNumber: bookingNo,
    name: s.name.trim(),
    email: s.email.trim(),
    service: s.service,
    route,
    dateTime: s.dt,
    vehicle: VEHICLE_LABEL[s.vehicle] ?? s.vehicle,
    fare: fareText,
    paymentMethod,
    isConcierge: s.isConcierge ? "Yes" : "",
    hotelName: s.hotelName.trim(),
    conciergeName: s.conciergeName.trim(),
    conciergePhone: s.conciergePhone.trim(),
    flightNumber: s.flightNumber.trim(),
  });
}

function CopyDetailsButton({ getText }: { getText: () => string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-outline-dark"
      style={{ marginTop: 10 }}
      onClick={async () => {
        const text = getText();
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }}
    >
      {copied ? "Copied ✓ — paste it into any email or WhatsApp" : "Copy reservation details"}
    </button>
  );
}

function BookingCard() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [vehicle, setVehicle] = useState("sedan");
  const [service, setService] = useState<"transfer" | "city" | "hourly">("transfer");
  const [hours, setHours] = useState(4);
  const [greetMeet, setGreetMeet] = useState(false);
  const [extraPickups, setExtraPickups] = useState(0);
  const [dt, setDt] = useState("");
  const [name, setName] = useState("");
  const [signature, setSignature] = useState("");
  const [email, setEmail] = useState("");
  const [bookingFor, setBookingFor] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [conciergeName, setConciergeName] = useState("");
  const [conciergePhone, setConciergePhone] = useState("");
  const [conciergeEmail, setConciergeEmail] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [confirm, setConfirm] = useState<{ kind: "error" | "ok"; text: React.ReactNode } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [paying, setPaying] = useState(false);
  const createCheckout = useServerFn(createReservationCheckout);
  const createOrderFn = useServerFn(createPayPalOrder);
  const captureOrderFn = useServerFn(capturePayPalOrder);
  const getClientIdFn = useServerFn(getPayPalClientId);
  const [payMethod, setPayMethod] = useState<"card" | "paypal">("card");
  const [ppClientId, setPpClientId] = useState<string | null>(null);
  const [ppChecked, setPpChecked] = useState(false);

  // All reservations add 20% gratuity + 5% booking fee on top of the base fare at checkout.
  const feeParts = (base: number): FeeParts => {
    const total = Math.round(base * 1.25);
    const gratuity = Math.round(base * 0.2);
    return { base, gratuity, fee: total - base - gratuity, total };
  };

  const fare = useMemo(() => {
    if (service === "hourly") {
      const rate = HOURLY_RATES[vehicle];
      if (rate === null || rate === undefined)
        return {
          cls: "has-price",
          amount: null as number | null,
          parts: null as FeeParts | null,
          greetMeet: 0,
          extraPickups: 0,
          node: (
            <>
              <span className="fare-amount">Request a quote</span>{" "}
              <span className="fare-sub">{VEHICLE_LABEL[vehicle]} pricing is quoted per group size</span>
            </>
          ),
        };
      const parts = feeParts(rate * hours);
      return {
        cls: "has-price",
        amount: parts.total,
        parts,
        greetMeet: 0,
        extraPickups: 0,
        node: (
          <>
            <span className="fare-amount">${parts.base}</span>
            <span className="fare-sub">
              {hours} hours × ${rate}/hr · {VEHICLE_LABEL[vehicle]} (4-hour minimum) + 20% gratuity + 5% booking fee at
              checkout
            </span>
          </>
        ),
      };
    }
    const base = computeSedanBase(pickup, dropoff);
    if (!pickup || !dropoff)
      return {
        cls: "",
        amount: null as number | null,
        parts: null as FeeParts | null,
        greetMeet: 0,
        extraPickups: 0,
        node: <span className="fare-label">Choose pickup and drop-off to see your fare</span>,
      };
    if (base === "same")
      return {
        cls: "",
        amount: null as number | null,
        parts: null as FeeParts | null,
        greetMeet: 0,
        extraPickups: 0,
        node: (
          <span className="fare-label">
            Same pickup and drop-off — <a href="tel:+14157878776">call (415) 787-8776</a> or{" "}
            <a href="mailto:info@globallinktransport.com">email us</a> for a quote
          </span>
        ),
      };
    if (base === "quote" || base === null)
      return {
        cls: "",
        amount: null as number | null,
        parts: null as FeeParts | null,
        greetMeet: 0,
        extraPickups: 0,
        node: <span className="fare-label">Custom route — dispatch confirms your exact fare in minutes</span>,
      };
    const [pType, pCode] = pickup.split(":");
    const [dType, dCode] = dropoff.split(":");
    // Route miles are shown in the fare display ("· X miles").
    let routeMiles: number | null = null;
    if (sprinterTier(vehicle)) {
      routeMiles = sprinterRouteMiles(pType, pCode, dType, dCode);
    }
    const mult = VEHICLE_MULTIPLIER[vehicle];
    if (!sprinterTier(vehicle) && (mult === null || mult === undefined))
      return {
        cls: "has-price",
        amount: null as number | null,
        parts: null as FeeParts | null,
        greetMeet: 0,
        extraPickups: 0,
        node: (
          <>
            <span className="fare-amount">Request a quote</span>{" "}
            <span className="fare-sub">{VEHICLE_LABEL[vehicle]} pricing is quoted per group size</span>
          </>
        ),
      };
    let pricedBase: number;
    if (sprinterTier(vehicle)) {
      // Sprinter is $200 over the sedan base fare on every route type.
      pricedBase = sprinterTripFare(vehicle, (base as number) + 200);
    } else if (vehicle === "suv" || vehicle === "limousine") {
      // SUV and Limousine are $40 over the sedan base fare on every route type.
      pricedBase = (base as number) + 40;
    } else {
      pricedBase = Math.round(((base as number) * (mult as number)) / 5) * 5;
    }
    // (East/South Bay $50 pickup surcharge removed Oct 2026 per NED.)
    // Greet & meet is a flat $40 add-on, only when an airport pickup is selected for an airport transfer.
    const gm = service === "transfer" && greetMeet && pickup.startsWith("airport:") ? GREET_MEET_PRICE : 0;
    // Extra pickups: $35 per additional stop, flat add-on (no gratuity/fee on it).
    const ep = (service as string) !== "hourly" ? extraPickups * EXTRA_PICKUP_PRICE : 0;
    const parts = feeParts(pricedBase);
    const milesText =
      routeMiles !== null && routeMiles > 0
        ? ` · ${Math.round(routeMiles)} miles`
        : pType === "city" && dType === "city" && pCode && dCode
          ? (() => {
              const m = cityToCityQuote(pCode, dCode).miles;
              return m > 0 ? ` · ${Math.round(m)} miles` : "";
            })()
          : "";
    return {
      cls: "has-price",
      amount: parts.total + gm + ep,
      parts,
      greetMeet: gm,
      extraPickups: ep,
      node: (
        <>
          <span className="fare-amount">${parts.base + gm + ep}</span>
          <span className="fare-sub">
            Estimated one-way fare{milesText} · {VEHICLE_LABEL[vehicle]} + 20% gratuity + 5% booking fee at checkout
            {gm > 0 ? ` · incl. greet & meet ($${GREET_MEET_PRICE})` : ""}
            {ep > 0 ? ` · incl. ${extraPickups} extra pickup${extraPickups > 1 ? "s" : ""} ($${ep})` : ""}
          </span>
        </>
      ),
    };
  }, [pickup, dropoff, vehicle, service, hours, greetMeet, extraPickups]);

  const bookingSnapshot = (): BookingState => ({
    service,
    pickup,
    dropoff,
    dt,
    vehicle,
    hours,
    greetMeet: fare.greetMeet > 0,
    extraPickups,
    name,
    signature,
    email,
    isConcierge: bookingFor === "someone",
    bookingFor,
    hotelName,
    conciergeName,
    conciergePhone,
    conciergeEmail,
    flightNumber: isAirportPickup(pickup, placeLabel(pickup)) ? flightNumber : "",
  });

  const fareTextNow = () =>
    (typeof document !== "undefined" && document.getElementById("farePreview")?.textContent?.trim()) || "";

  // Bus & coach have no instant price — the request goes straight to email for a manual quote.
  const isQuoteOnly = !(fare.amount && fare.amount > 0);

  const submitCard = async () => {
    const err = validateBooking(bookingSnapshot());
    if (err) {
      setConfirm({ kind: "error", text: err });
      return;
    }
    const bookingNo = await mintBookingNumber();
    const mailHref = buildReservationMail(bookingSnapshot(), fareTextNow(), bookingNo);

    let paymentUrl: string | null = null;
    let paymentError: string | null = null;
    if (fare.amount && fare.amount > 0 && fare.parts) {
      setPaying(true);
      try {
        const result = await createCheckout({
          data: {
            base: fare.parts.base,
            gratuity: fare.parts.gratuity,
            fee: fare.parts.fee,
            greetMeet: fare.greetMeet,
            extraPickups: fare.extraPickups,
            description: buildDescription(bookingSnapshot()),
            origin: window.location.origin,
            customerName: name.trim(),
            customerEmail: email.trim(),
            bookingNumber: bookingNo,
          },
        });
        paymentUrl = result.url;
        paymentError = result.error;
      } catch {
        paymentError = "We couldn't open the payment page.";
      }
      setPaying(false);
    }

    if (paymentUrl) window.location.href = paymentUrl;
    // Logged as Not paid at submit; flipped to Paid when the customer returns
    // from the Stripe checkout (?payment=success&booking=...).
    logBookingToSheet(bookingSnapshot(), fareTextNow(), bookingNo, "Not paid");
    // Only open email for quotes (bus/coach) — card payments email after Stripe confirms
    if (isQuoteOnly) {
      setTimeout(() => {
        window.location.href = mailHref;
      }, 800);
    }
    setConfirm({
      kind: "ok",
      text: (
        <>
          Thanks, {name.trim()} — your booking number is <strong>{bookingNo}</strong>. Please save it; you'll need it
          for any changes to this reservation.{" "}
          {paymentUrl ? (
            <>
              your payment page for <strong>${fare.amount}</strong> opened in a new tab. Please complete payment, then
              send the reservation email that just opened.{" "}
              <a href={paymentUrl} target="_blank" rel="noopener" style={{ color: "var(--brass-dark)" }}>
                Reopen the payment page
              </a>{" "}
              if needed.{" "}
            </>
          ) : isQuoteOnly ? (
            <>
              your quote request and signed agreement are ready to send. Our dispatch team will reply with your price
              shortly.{" "}
            </>
          ) : (
            <>
              your reservation and signed agreement are ready to send.{" "}
              {paymentError ? `${paymentError} We'll send you a secure payment link by email. ` : ""}
            </>
          )}
          If your email app didn't open automatically, please email a copy to{" "}
          <a href={`mailto:${EMAIL}`} style={{ color: "var(--brass-dark)" }}>
            {EMAIL}
          </a>
          , or <CopyDetailsButton getText={() => reservationDetailsText(bookingSnapshot(), fareTextNow(), bookingNo)} />
          .
        </>
      ),
    });
    setSubmitted(true);
  };

  const completePayPalReservation = (amount: number, payerName: string, bookingNo: string) => {
    logBookingToSheet(bookingSnapshot(), fareTextNow(), bookingNo, "Paid");
    // Give the sheet request a head start before opening the email app.
    setTimeout(() => {
      window.location.href = buildReservationMail(bookingSnapshot(), fareTextNow(), bookingNo);
    }, 800);
    setConfirm({
      kind: "ok",
      text: (
        <>
          Thanks, {payerName} — your PayPal payment of <strong>${amount}</strong> is complete. Your booking number is{" "}
          <strong>{bookingNo}</strong>. Please save it; you'll need it for any changes to this reservation. Please send
          the reservation email that just opened. If your email app didn't open automatically, please email a copy to{" "}
          <a href={`mailto:${EMAIL}`} style={{ color: "var(--brass-dark)" }}>
            {EMAIL}
          </a>
          , or <CopyDetailsButton getText={() => reservationDetailsText(bookingSnapshot(), fareTextNow(), bookingNo)} />
          .
        </>
      ),
    });
    setSubmitted(true);
  };

  // Latest values for the PayPal button callbacks (avoids stale closures).
  const liveRef = useRef({
    snapshot: bookingSnapshot(),
    fare: { amount: fare.amount, parts: fare.parts, greetMeet: fare.greetMeet, extraPickups: fare.extraPickups },
  });
  liveRef.current = {
    snapshot: bookingSnapshot(),
    fare: { amount: fare.amount, parts: fare.parts, greetMeet: fare.greetMeet, extraPickups: fare.extraPickups },
  };
  const completeRef = useRef(completePayPalReservation);
  completeRef.current = completePayPalReservation;
  // Booking number minted when the PayPal order is created, shown after capture.
  const bookingNoRef = useRef<string>("");
  const orderFnRef = useRef(createOrderFn);
  orderFnRef.current = createOrderFn;
  const captureFnRef = useRef(captureOrderFn);
  captureFnRef.current = captureOrderFn;
  const setConfirmRef = useRef(setConfirm);
  setConfirmRef.current = setConfirm;

  // Check whether PayPal is configured (public client ID present).
  useEffect(() => {
    getClientIdFn()
      .then((r) => {
        setPpClientId(r.clientId);
        setPpChecked(true);
      })
      .catch(() => setPpChecked(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render PayPal buttons when PayPal is the chosen method.
  useEffect(() => {
    if (payMethod !== "paypal" || !ppClientId) return;
    const container = document.getElementById("paypal-buttons");
    if (!container) return;
    container.innerHTML = "";

    const renderButtons = () => {
      const paypal = (window as unknown as { paypal?: any }).paypal;
      if (!paypal || !container.isConnected) return;
      paypal
        .Buttons({
          style: { layout: "vertical", color: "gold", shape: "rect", label: "paypal" },
          onClick: (_data: unknown, actions: { resolve: () => void; reject: () => void }) => {
            const { snapshot } = liveRef.current;
            const err = validateBooking(snapshot);
            if (err) {
              setConfirmRef.current({ kind: "error", text: err });
              return actions.reject();
            }
            if (!liveRef.current.fare.amount) {
              setConfirmRef.current({ kind: "error", text: "Choose your route to see the fare first." });
              return actions.reject();
            }
            return actions.resolve();
          },
          createOrder: async () => {
            const { snapshot, fare } = liveRef.current;
            const bookingNo = await mintBookingNumber();
            const res = await orderFnRef.current({
              data: {
                amount: fare.amount ?? 0,
                base: fare.parts?.base,
                gratuity: fare.parts?.gratuity,
                fee: fare.parts?.fee,
                greetMeet: fare.greetMeet,
                extraPickups: fare.extraPickups,
                description: buildDescription(snapshot),
                bookingNumber: bookingNo,
              },
            });
            if (!res.orderId) throw new Error(res.error ?? "PayPal failed");
            bookingNoRef.current = bookingNo;
            return res.orderId;
          },
          onApprove: async (data: { orderID: string }) => {
            const cap = await captureFnRef.current({ data: { orderId: data.orderID } });
            if (!cap.ok) {
              setConfirmRef.current({
                kind: "error",
                text: cap.error ?? "The PayPal payment didn't go through.",
              });
              return;
            }
            const { snapshot, fare } = liveRef.current;
            completeRef.current(fare.amount ?? 0, snapshot.name.trim(), bookingNoRef.current);
          },
          onError: () =>
            setConfirmRef.current({
              kind: "error",
              text: "The PayPal payment was cancelled or failed. You can try again or pay by card.",
            }),
        })
        .render(container);
    };

    const sdkId = "paypal-js-sdk";
    if (!(window as unknown as { paypal?: unknown }).paypal) {
      if (!document.getElementById(sdkId)) {
        const s = document.createElement("script");
        s.id = sdkId;
        s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(ppClientId)}&currency=USD&intent=capture`;
        s.onload = renderButtons;
        document.body.appendChild(s);
      } else {
        const t = setInterval(() => {
          if ((window as unknown as { paypal?: unknown }).paypal) {
            clearInterval(t);
            renderButtons();
          }
        }, 300);
        return () => clearInterval(t);
      }
    } else {
      renderButtons();
    }
    return undefined;
  }, [payMethod, ppClientId]);

  return (
    <div className="booking-card" id="book">
      <h3>Check your fare</h3>
      <p className="sub">Payment is required to confirm your reservation.</p>
      <div className="field-row">
        <div className="field">
          <label htmlFor="svc">Reservation type</label>
          <select
            id="svc"
            value={service}
            onChange={(e) => {
              setService(e.target.value as "transfer" | "city" | "hourly");
              setPickup("");
              setDropoff("");
              setGreetMeet(false);
            }}
          >
            <option value="transfer">Airport pick up &amp; drop off</option>
            <option value="city">City to city</option>
            <option value="hourly">Hourly (4 hours minimum)</option>
          </select>
        </div>
        {service === "hourly" && (
          <div className="field">
            <label htmlFor="hrs">Hours</label>
            <select id="hrs" value={hours} onChange={(e) => setHours(Number(e.target.value))}>
              {HOUR_OPTIONS.map((h) => (
                <option key={h} value={h}>
                  {h} hours
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="field-row">
        <LocationSelect
          id="pu"
          label="Pickup"
          value={pickup}
          onChange={(v) => {
            setPickup(v);
            if (!v.startsWith("airport:")) setGreetMeet(false);
          }}
          placeholder="Choose pickup"
          citiesOnly={service === "city"}
        />
        {service !== "hourly" && (
          <LocationSelect
            id="do"
            label="Drop-off"
            value={dropoff}
            onChange={setDropoff}
            placeholder="Choose destination"
            citiesOnly={service === "city"}
          />
        )}
      </div>
      {isAirportPickup(pickup, placeLabel(pickup)) && (
        <div className="field-row">
          <div className="field">
            <label htmlFor="flightNumber">Flight number</label>
            <input
              id="flightNumber"
              type="text"
              required
              autoComplete="off"
              placeholder="e.g. UA 1234"
              value={flightNumber}
              aria-describedby="flightNumberHelp"
              aria-invalid={confirm?.kind === "error" && !flightNumber.trim()}
              onChange={(e) => setFlightNumber(e.target.value)}
            />
            <div className="fare-sub" id="flightNumberHelp" style={{ marginTop: "4px" }}>
              So dispatch can track your flight and adjust pickup for delays.
            </div>
            {confirm?.kind === "error" && !flightNumber.trim() && (
              <div className="mt-1 text-destructive" role="alert">
                Flight number is required for airport pickups.
              </div>
            )}
          </div>
        </div>
      )}
      <div className="field-row">
        <div className="field">
          <label htmlFor="dt">Date &amp; time</label>
          <input id="dt" type="datetime-local" value={dt} onChange={(e) => setDt(e.target.value)} />
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

      {service === "transfer" && pickup.startsWith("airport:") && (
        <div className="field-row">
          <label className="check-field">
            <input type="checkbox" checked={greetMeet} onChange={(e) => setGreetMeet(e.target.checked)} />
            <span>
              Add greet &amp; meet — your driver meets you inside the terminal with a name sign{" "}
              <strong>+${GREET_MEET_PRICE}</strong>
            </span>
          </label>
        </div>
      )}

      {service !== "hourly" && (
        <div className="field-row">
          <div className="field">
            <label htmlFor="extraPickups">Extra pickups — $35 per stop</label>
            <select id="extraPickups" value={extraPickups} onChange={(e) => setExtraPickups(Number(e.target.value))}>
              {EXTRA_PICKUP_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n === 0 ? "No extra pickups" : `${n} extra pickup${n > 1 ? "s" : ""} (+$${n * EXTRA_PICKUP_PRICE})`}
                </option>
              ))}
            </select>
            <div className="fare-sub" style={{ marginTop: "4px" }}>
              Waiting time up to 10 minutes is included. Any waiting time over 10 minutes is charged at $2 per minute.
            </div>
          </div>
        </div>
      )}

      <div className={`fare-preview ${fare.cls}`} id="farePreview">
        {fare.node}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="agName">Name</label>
          <input
            id="agName"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="agSignature">Signature (type your full name)</label>
          <input
            id="agSignature"
            type="text"
            placeholder="Type to sign"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="agEmail">Email (for your receipt)</label>
        <input
          id="agEmail"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <details className="agreement-details">
        <summary>Read the rental agreement</summary>
        <div className="agreement-details-body">
          <p style={{ fontSize: 13, color: "var(--steel)", paddingTop: 14 }}>
            This agreement applies to every ride booked with {SITE.brand.legalName}. By signing below, you agree to the
            terms here.
          </p>
          {AGREEMENT_TERMS.map((t, i) => (
            <div className="agreement-item" key={t.title}>
              <div className="num">{String(i + 1).padStart(2, "0")}</div>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </div>
          ))}
          <div className="agreement-box">
            <h4>Additional charges</h4>
            <p>
              A <strong>20% gratuity</strong> and <strong>5% booking fee</strong> are added to all reservations.
              Overtime is billed at the hourly rate of the reserved vehicle.
            </p>
          </div>
          <div className="agreement-box">
            <h4>Cleaning fees</h4>
            <p>
              A <strong>$600 cleaning fee</strong> applies if the vehicle must be cleaned due to someone getting sick in
              the vehicle.
            </p>
          </div>
          <div className="agreement-box">
            <h4>Damages</h4>
            <p>
              <strong>$25</strong> for any broken glass. Other damage is billed at repair cost.
            </p>
          </div>
        </div>
      </details>

      <p style={{ fontSize: 12, color: "var(--steel)", marginTop: 12, lineHeight: 1.5 }}>
        By typing your name as a signature above, you agree to the rental agreement and authorize the charges described
        in it.
      </p>

      {fare.parts && (
        <div className="field" style={{ marginTop: 14 }}>
          <div
            style={{
              border: "1px solid var(--brass)",
              borderRadius: 12,
              padding: "12px 14px",
              background: "rgba(176,141,62,0.06)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, padding: "2px 0" }}>
              <span>Base fare</span>
              <span>${fare.parts.base}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, padding: "2px 0" }}>
              <span>Gratuity (20%)</span>
              <span>${fare.parts.gratuity}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, padding: "2px 0" }}>
              <span>Booking fee (5%)</span>
              <span>${fare.parts.fee}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 700,
                fontSize: 15,
                borderTop: "1px solid var(--brass)",
                marginTop: 6,
                paddingTop: 8,
              }}
            >
              <span>Total due</span>
              <span>${fare.parts.total}</span>
            </div>
          </div>
        </div>
      )}

      <div className="field" style={{ marginTop: 14 }}>
        <label>Is this booking for you or for someone else?</label>
        <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
          <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 400, cursor: "pointer" }}>
            <input type="radio" name="bookingFor" checked={bookingFor === "me"} onChange={() => setBookingFor("me")} />
            For me
          </label>
          <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 400, cursor: "pointer" }}>
            <input
              type="radio"
              name="bookingFor"
              checked={bookingFor === "someone"}
              onChange={() => setBookingFor("someone")}
            />
            For someone else
          </label>
        </div>
      </div>

      {bookingFor === "someone" && (
        <div
          style={{
            border: "1px solid var(--brass)",
            borderRadius: 12,
            padding: "12px 14px",
            marginTop: 12,
            background: "rgba(176,141,62,0.06)",
          }}
        >
          <div className="field" style={{ marginBottom: 10 }}>
            <label htmlFor="hotelName">
              Company / hotel name <span style={{ fontWeight: 400 }}>(if booking for work)</span>
            </label>
            <input
              id="hotelName"
              type="text"
              autoComplete="organization"
              placeholder="e.g. Acme Inc. or Fairmont San Francisco"
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
            />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="conciergeName">Your name</label>
              <input
                id="conciergeName"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={conciergeName}
                onChange={(e) => setConciergeName(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="conciergePhone">Your phone number</label>
              <input
                id="conciergePhone"
                type="tel"
                autoComplete="tel"
                placeholder="(415) 555-0100"
                value={conciergePhone}
                onChange={(e) => setConciergePhone(e.target.value)}
              />
            </div>
          </div>
          <div className="field" style={{ marginTop: 10 }}>
            <label htmlFor="conciergeEmail">Email</label>
            <input
              id="conciergeEmail"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={conciergeEmail}
              onChange={(e) => setConciergeEmail(e.target.value)}
            />
          </div>
        </div>
      )}

      {isQuoteOnly ? (
        <>
          <p style={{ fontSize: 12.5, color: "var(--steel)", marginTop: 14, lineHeight: 1.55 }}>
            {VEHICLE_LABEL[vehicle]} trips are quoted per group — no payment is due now. Send your request and our
            dispatch team will reply with your price.
          </p>
          <button className="btn btn-brass" id="reserveSubmit" onClick={submitCard} disabled={paying}>
            {submitted ? "Request sent ✓" : "Send reservation request"}
          </button>
        </>
      ) : (
        <>
          <div className="field" style={{ marginTop: 14 }}>
            <label>Payment method</label>
            <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
              <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 400, cursor: "pointer" }}>
                <input
                  type="radio"
                  name="payMethod"
                  checked={payMethod === "card"}
                  onChange={() => setPayMethod("card")}
                />
                Card
              </label>
              <label
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  fontWeight: 400,
                  cursor: ppChecked && !ppClientId ? "not-allowed" : "pointer",
                  opacity: ppChecked && !ppClientId ? 0.55 : 1,
                }}
              >
                <input
                  type="radio"
                  name="payMethod"
                  checked={payMethod === "paypal"}
                  disabled={ppChecked && !ppClientId}
                  onChange={() => setPayMethod("paypal")}
                />
                PayPal{ppChecked && !ppClientId ? " (coming soon)" : ""}
              </label>
            </div>
          </div>

          {payMethod === "paypal" ? (
            fare.amount && fare.amount > 0 ? (
              <div id="paypal-buttons" style={{ marginTop: 12, minHeight: 100 }} />
            ) : (
              <p style={{ fontSize: 13, color: "var(--steel)", marginTop: 12 }}>
                Choose your route to see the PayPal payment button.
              </p>
            )
          ) : (
            <>
              <p style={{ fontSize: 12.5, color: "var(--steel)", marginTop: 14, lineHeight: 1.55 }}>
                Your card will be kept on file and may be charged for tolls, overtime, waiting time, cleaning and damage
                fees as described in the rental agreement.
              </p>
              <button className="btn btn-brass" id="reserveSubmit" onClick={submitCard} disabled={paying}>
                {paying ? "Opening secure payment…" : submitted ? "Reserved & signed ✓" : "Reserve, sign & pay"}
              </button>
            </>
          )}
        </>
      )}
      {confirm && (
        <div
          className="sign-confirm show"
          style={confirm.kind === "error" ? { background: "rgba(200,60,60,0.08)", borderColor: "#c83c3c" } : undefined}
        >
          {confirm.text}
        </div>
      )}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? "open" : ""}`}>
      <button className="faq-q" onClick={() => setOpen((o) => !o)}>
        {q}
        <span className="plus">+</span>
      </button>
      <div className="faq-a" style={open ? { maxHeight: 400 } : undefined}>
        <p>{a}</p>
      </div>
    </div>
  );
}

function DriveForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    vehicle: "sedan",
    experience: "",
    notes: "",
  });
  const [hasFiles, setHasFiles] = useState(false);
  const [confirm, setConfirm] = useState<{ kind: "error" | "ok"; text: React.ReactNode } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) setHasFiles(true);
  };

  const submit = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.city.trim()) {
      setConfirm({
        kind: "error",
        text: "Please fill in your name, phone, email and city before submitting.",
      });
      return;
    }
    // Show the commission note + agree checkbox before anything is sent.
    setAgreed(false);
    setShowTerms(true);
  };

  const confirmAndSend = () => {
    if (!agreed) return;
    setShowTerms(false);
    // Send the application to the Google Sheet. keepalive lets the request
    // finish even though we navigate to the email app right after.
    try {
      fetch(DRIVER_SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        keepalive: true,
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          city: form.city.trim(),
          vehicle: VEHICLE_LABEL[form.vehicle] ?? form.vehicle,
          experience: form.experience || "",
          notes: form.notes.trim(),
        }),
      }).catch(() => {});
    } catch {
      /* sheet write failed — the email application still goes out */
    }
    const subject = encodeURIComponent(`Driver Application — ${form.name.trim()}`);
    const body = encodeURIComponent(
      `${SITE.brand.legalName} — Driver application\n\n` +
        `Name: ${form.name.trim()}\n` +
        `Phone: ${form.phone.trim()}\n` +
        `Email: ${form.email.trim()}\n` +
        `City: ${form.city.trim()}\n` +
        `Vehicle: ${VEHICLE_LABEL[form.vehicle]}\n` +
        `Years driving professionally: ${form.experience || "Not specified"}\n` +
        `Notes: ${form.notes.trim() || "None"}\n\n` +
        "Documents: please attach driver's license, proof of insurance and PUC documents to this email before sending.",
    );
    // Give the sheet request a head start before opening the email app.
    setTimeout(() => {
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    }, 800);
    setConfirm({
      kind: "ok",
      text: (
        <>
          Thanks, {form.name.trim()} — your application is ready to send.{" "}
          {hasFiles
            ? "Please attach your uploaded documents to the email before sending, since they can't attach automatically. "
            : "Don't forget to attach your license, insurance and PUC documents to the email before sending. "}
          If your email app didn't open automatically, please email a copy to{" "}
          <a href={`mailto:${EMAIL}`} style={{ color: "var(--brass-dark)" }}>
            {EMAIL}
          </a>
          .
        </>
      ),
    });
    setSubmitted(true);
  };

  return (
    <div className="drive-form">
      <h3>Apply to drive</h3>
      <div className="field-row">
        <div className="field">
          <label htmlFor="drvName">Full name</label>
          <input id="drvName" type="text" autoComplete="name" value={form.name} onChange={set("name")} />
        </div>
        <div className="field">
          <label htmlFor="drvPhone">Phone</label>
          <input id="drvPhone" type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="drvEmail">Email</label>
          <input id="drvEmail" type="email" autoComplete="email" value={form.email} onChange={set("email")} />
        </div>
        <div className="field">
          <label htmlFor="drvCity">City</label>
          <input id="drvCity" type="text" value={form.city} onChange={set("city")} />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="drvVehicle">Vehicle you drive</label>
          <select id="drvVehicle" value={form.vehicle} onChange={set("vehicle")}>
            {VEHICLES.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
            <option value="none">Don't have one yet</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="drvExperience">Years driving professionally</label>
          <input id="drvExperience" type="number" min={0} value={form.experience} onChange={set("experience")} />
        </div>
      </div>
      <div className="field" style={{ marginBottom: 16 }}>
        <label htmlFor="drvNotes">Anything else we should know?</label>
        <textarea id="drvNotes" value={form.notes} onChange={set("notes")} />
      </div>

      <div className="drive-upload">
        <h4>Upload documents</h4>
        <p className="upload-note">
          Attach a photo or PDF of each. These stay on your device until you send the email — they don't upload
          automatically, so please attach them again in the email that opens if needed.
        </p>
        <div className="field-row">
          <div className="field">
            <label htmlFor="drvLicense">Driver's license (front &amp; back)</label>
            <input id="drvLicense" type="file" accept="image/*,.pdf" multiple onChange={onFiles} />
          </div>
          <div className="field">
            <label htmlFor="drvInsurance">Proof of insurance</label>
            <input id="drvInsurance" type="file" accept="image/*,.pdf" multiple onChange={onFiles} />
          </div>
          <div className="field">
            <label htmlFor="drvPuc">PUC documents</label>
            <input id="drvPuc" type="file" accept="image/*,.pdf" multiple onChange={onFiles} />
          </div>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-brass"
        id="drvSubmit"
        style={{ width: "100%", marginTop: 20 }}
        onClick={submit}
      >
        {submitted ? "Application sent ✓" : "Submit application"}
      </button>
      {showTerms && (
        <div className="drv-modal-backdrop" onClick={() => setShowTerms(false)}>
          <div className="drv-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h4>Before you apply</h4>
            <p className="drv-terms-note">
              Keep in mind that some of the bookings come through our reservation channels that we pay 20% commission on
              so that 20% will be deducted of your fare.
            </p>
            <label className="drv-agree">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              <span>I understand and agree</span>
            </label>
            <div className="drv-modal-actions">
              <button type="button" className="btn" onClick={() => setShowTerms(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-brass" disabled={!agreed} onClick={confirmAndSend}>
                Confirm &amp; send
              </button>
            </div>
          </div>
        </div>
      )}
      {confirm && (
        <div
          className="sign-confirm show"
          style={confirm.kind === "error" ? { background: "rgba(200,60,60,0.08)", borderColor: "#c83c3c" } : undefined}
        >
          {confirm.text}
        </div>
      )}
    </div>
  );
}

const CheckIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="8" stroke="#B08D3E" strokeWidth="1.4" />
    <path d="M5.5 9l2.5 2.5L13 6" stroke="#B08D3E" strokeWidth="1.4" fill="none" />
  </svg>
);

const SERVICE_CARD_LINKS: Record<string, ServicePath> = {
  "Corporate Transportation Service": "/corporate-transportation",
  "Airport Limo Service": "/sfo-airport-limo",
  "Business Transportation": "/san-francisco-limo-service",
  "Prom & Wine Tours": "/wine-country-tours",
  "Special Events & Occasions": "/wedding-limo",
};

const SERVICES: { title: string; img: string; desc: string }[] = [
  {
    title: "Corporate Transportation Service",
    img: "/images/services/corporate.jpg",
    desc: "Our corporate car service in San Francisco and across the Bay Area supports business travel, executive transfers, and team logistics. Book a town car, black car, or executive car service with a professional chauffeur for SFO airport transfers, client meetings, and roadshows, or arrange group transportation and corporate airport car service for a visiting team. One dedicated dispatch team coordinates every ride across San Francisco, San Mateo, and San Jose — from a single sedan to a full Bay Area fleet for conferences. Enjoy volume rates for corporate accounts. An invoice is sent automatically with your confirmation email for every reservation.",
  },
  {
    title: "Airport Limo Service",
    img: "/images/services/airport.jpg",
    desc: "Our San Francisco airport limo service provides reliable airport transfers with live flight tracking at San Francisco International Airport (SFO), Oakland International Airport (OAK), and San Jose Mineta International Airport (SJC). A comfortable airport taxi alternative, our black car and luxury car service puts a licensed chauffeur behind the wheel of a sedan, SUV, or limousine for door-to-door ground transportation across San Francisco and the Bay Area. Your chauffeur offers meet-and-greet service and adjusts for flight delays or early arrivals. Enjoy fixed fares with no surge pricing — book your SFO airport limo, airport car service, or limo rental online in minutes.",
  },
  {
    title: "Business Transportation",
    img: "/images/services/business.jpg",
    desc: "Business transportation across the San Francisco Bay Area for SFO airport transfers, client meetings, and executive travel. Our licensed, background-checked chauffeurs deliver on-time, professional service in a town car, black car, or executive car service, and our San Francisco airport car service keeps every flight on schedule. Fixed pricing means no surge and no surprises. From a single limo service booking to group transportation for a visiting team, we handle the ground transportation across the Bay Area so your day runs on schedule.",
  },
  {
    title: "Prom & Wine Tours",
    img: "/images/services/prom-wine.jpg",
    desc: "Enjoy a Napa Valley wine tour, a Sonoma wine tour, or Livermore wine tours with professional chauffeurs, plus prom limo service for a memorable night out in San Francisco. Our wine tasting tours cover Napa Valley wine tasting rooms, Sonoma wine tasting tours, and Livermore wineries as a relaxed wine tasting experience — no one has to drive. Choose stretch limousines, Sprinter vans, or a party bus for wine country tours across the Bay Area, or add an SFO airport transfer at the start or end of your trip. Book a limo rental by the hour and travel together in comfort and style — group transportation that keeps everyone in the same car.",
  },
  {
    title: "Special Events & Occasions",
    img: "/images/services/events.jpg",
    desc: "Special event transportation in San Francisco for weddings, galas, concerts, and sporting events. Our wedding limo service, event transportation, and concert transportation keep your guests arriving together, on time, and in style, with SFO airport transfers for out-of-town guests. We also provide sports game transportation across the Bay Area — football game transportation, baseball game limo service, basketball game transportation, and hockey game transportation — with limos, buses, and charter buses available for every game day. Choose from stretch limousines, SUVs, Sprinter vans, party bus, and charter bus rentals for groups of any size, plus prom limo service for a memorable night out. One dispatch team coordinates every vehicle in San Francisco and the wider Bay Area so your event runs on time.",
  },
];

function Index() {

  // After a Stripe checkout, the customer returns to /?payment=success&booking=GLxxxx —
  // flip that reservation's sheet row to Paid.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("payment") === "success" && q.get("booking")) {
      markBookingPaid(q.get("booking") as string);
      q.delete("payment");
      q.delete("booking");
      const clean = window.location.pathname + (q.toString() ? `?${q}` : "") + window.location.hash;
      window.history.replaceState(null, "", clean);
    }
  }, []);

  return (
    <>
      <SiteHeader home />

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
            <h1>San Francisco Limo Service &amp; Bay Area Black Car Transfers</h1>
            <p className="lead">One dispatch team for every ride your company books — sedan to coach.</p>
            <div className="hero-actions">
              <div className="hero-cta-stack">
                <a href="#book" className="btn btn-brass">
                  Reserve & Pay
                </a>
                <Link to="/pay" search={{}} className="btn btn-brass" preload="intent">
                  Custom reservations pay
                </Link>
                <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", marginTop: 8 }}>
                  Payment confirms your reservation {"\u00A0·\u00A0"} or{" "}
                  <a href={`mailto:${EMAIL}`} style={{ color: "rgba(255,255,255,0.65)", textDecoration: "underline" }}>
                    email us
                  </a>
                </p>
              </div>
              <a href="#fleet" className="btn btn-outline-dark">
                View the fleet
              </a>
              <a href={PHONE_HREF} className="btn btn-outline-dark">
                Call us: {PHONE}
              </a>
              <a href={`mailto:${EMAIL}`} className="btn btn-outline-dark">
                Email us: {EMAIL}
              </a>
              <InstallAppButton className="btn btn-outline-dark" />
            </div>
            <div className="hero-stats">
              <div>
                <strong>62</strong>
                <span>{SITE.market.metro} cities &amp; airports</span>
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

      <section className="promo-video">
        <div className="wrap">
          <div className="section-head">
            <h2>{SITE.brand.shortName} in motion</h2>
            <p>
              A glimpse of what a {SITE.brand.shortName} ride feels like — from airport pickup to the final drop-off,
              every trip handled by a vetted chauffeur.
            </p>
          </div>
          <video
            className="promo-video-frame"
            src="/videos/global-link-promo.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            title={`${SITE.brand.legalName} promo video`}
          />
        </div>
      </section>

      <div className="trust">
        <div className="wrap trust-inner">
          <p>
            <strong>98% on-time</strong> across the {SITE.market.metro} — {SITE.market.airports} included
          </p>
          <p>Fixed pricing {"\u00A0·\u00A0"} An invoice is sent automatically with your confirmation email for every reservation.</p>
        </div>
      </div>

      <section className="services-band" id="services">
        <div className="wrap">
          <div className="section-head">
            <h2>Our Services</h2>
            <p>We offer a wide range of luxury vehicles to suit every need.</p>
          </div>
          <div className="services-grid">
            {SERVICES.map((svc) => (
              <Link className="service-card" key={svc.title} to={SERVICE_CARD_LINKS[svc.title] ?? "/"}>
                <h3>{svc.title}</h3>
                <p className="desc">{svc.desc}</p>
                <img src={svc.img} alt={svc.title} loading="lazy" />
              </Link>
            ))}
          </div>
          <nav className="service-related-links" aria-label="Explore our transportation services">
            {(Object.keys(SERVICE_PAGES) as ServicePath[]).map((path) => (
              <Link key={path} to={path}>{SERVICE_PAGES[path].h1}<span aria-hidden="true">↗</span></Link>
            ))}
          </nav>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="section-head">
            <h2>Booking rides for a team isn't a car problem. It's a trust problem.</h2>
            <p>
              Every time you book a driver for a colleague or a guest, you're betting on something you don't control:
              will they show up on time, in a clean car, and will your reservation paperwork be easy to find?
              An invoice is sent automatically with your confirmation email for every reservation.
            </p>
          </div>
          <div className="problem-grid">
            <div className="problem-item">
              <div className="tag">Time</div>
              <h3>Every ride, coordinated by hand</h3>
              <p>Switching between apps and unknown drivers for each trip eats the hours it was supposed to save.</p>
            </div>
            <div className="problem-item">
              <div className="tag">Budget control</div>
              <h3>Receipts, not reporting</h3>
              <p>Dozens of scattered charges with no cost center make travel spend nearly impossible to reconcile.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <div className="wrap">
          <div className="about-inner">
            <h2>Transportation you stop having to think about</h2>
            <p>
              {SITE.brand.shortName} isn't another ride-booking app. We're a full transportation coordination team — one
              unified fleet, individually vetted licensed chauffeurs, and support that answers as a person, not a
              routing bot.
            </p>
            <p>
              We started because travel managers and event planners were coordinating every ride by hand: one driver
              here, one invoice there, no guarantee on either. Today, we're the one team your company needs for every
              kind of trip across the {SITE.market.metro} — {SITE.market.airports}.
              An invoice is sent automatically with your confirmation email for every reservation.
            </p>
          </div>
        </div>
      </section>

      <section id="fleet">
        <style>{`
          .fleet-card .fleet-img{width:calc(100% + 48px); margin:-30px -24px 4px; max-width:none; aspect-ratio:4/3; object-fit:cover; display:block; background:var(--paper-2);}
          @media (min-width:901px){#fleet .fleet-row{grid-template-columns:repeat(12,minmax(0,1fr));}#fleet .fleet-card{grid-column:span 3;}#fleet .fleet-card:nth-child(n+5){grid-column:span 4;}}
          @media (max-width:900px){.fleet-card .fleet-img{width:calc(100% + 40px); margin:-24px -20px 4px; border-radius:8px 8px 0 0;}}
        `}</style>
        <div className="wrap">
          <div className="section-head">
            <h2>Choose your ride</h2>
            <p>
              Seven vehicle options, each with its own vetted chauffeur pool — from a single airport transfer to a
              fifty-person conference charter bus.
            </p>
          </div>

          <div className="fleet-row">
            <div className="fleet-card">
              <img className="fleet-img" src={fleetSedan} alt="Black luxury sedan for airport transfers" loading="lazy" width={1024} height={768} />
              <h3>Sedan</h3>
              <p className="desc">Airport runs and single meetings, understated and quick.</p>
              <div className="meta">Up to 3 passengers, 2 bags</div>
            </div>

            <div className="fleet-card">
              <img className="fleet-img" src={fleetSuv} alt="Black full-size SUV for small groups with luggage" loading="lazy" width={1024} height={768} />
              <h3>SUV</h3>
              <p className="desc">Small teams, extra luggage, or a more commanding presence.</p>
              <div className="meta">Up to 5 passengers, 4 bags</div>
            </div>

            <div className="fleet-card">
              <img className="fleet-img" src={fleetLimousine} alt="Black stretch limousine for weddings and VIP arrivals" loading="lazy" width={1024} height={768} />
              <h3>Limousine</h3>
              <p className="desc">Weddings, galas and VIP arrivals that call for an entrance.</p>
              <div className="meta">Up to 6 passengers</div>
            </div>

            <div className="fleet-card">
              <img className="fleet-img" src={fleetSprinter} alt="Black Sprinter passenger van for group transfers" loading="lazy" width={1024} height={768} />
              <h3>Sprinter van</h3>
              <p className="desc">Group transfers, roadshows and full teams travelling together.</p>
              <div className="meta">Up to 14 passengers</div>
            </div>

            <div className="fleet-card">
              <img className="fleet-img" src={fleetLuxurySprinter} alt="Black Luxury Sprinter with upgraded leather seats and premium wood finishes" loading="lazy" width={1024} height={768} />
              <h3>Luxury Sprinter</h3>
              <p className="desc">Group travel with upgraded trim and refined premium finishes.</p>
              <div className="meta">Up to 14 passengers</div>
            </div>

            <div className="fleet-card">
              <img className="fleet-img" src={fleetLimoSprinter} alt="Black Limo Sprinter with limo-style quilted leather and premium interior finishes" loading="lazy" width={1024} height={768} />
              <h3>Limo Sprinter</h3>
              <p className="desc">Group travel with limo-style trim and distinctive premium finishes.</p>
              <div className="meta">Up to 14 passengers</div>
            </div>

            <div className="fleet-card">
              <img className="fleet-img" src={fleetCoach} alt="Black motor coach bus for conferences and large events" loading="lazy" width={1024} height={768} />
              <h3>Bus &amp; coach</h3>
              <p className="desc">Conferences and large events, arriving on one schedule.</p>
              <div className="meta">Up to 56 passengers</div>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing" id="hourly">
        <div className="wrap pricing-grid">
          <div className="pricing-copy">
            <h2>Need the car to wait? Book by the hour.</h2>
            <p>
              For roadshows, city tours, or a day where your schedule keeps shifting, your chauffeur and vehicle stay
              with you — no re-booking between stops, no separate fare for each leg.
            </p>
            <p>
              Hourly bookings have a <strong style={{ color: "var(--charcoal)" }}>4-hour minimum</strong>. After that,
              you're billed in 30-minute increments at the same rate.
            </p>
            <p className="note">Get your hourly rate now — no commitment.</p>
          </div>
          <div className="price-card">
            <div className="price-row">
              <span className="name">Sedan</span>
              <span className="leader" />
              <span className="amount">$85/hr</span>
            </div>
            <div className="price-row">
              <span className="name">SUV</span>
              <span className="leader" />
              <span className="amount">$120/hr</span>
            </div>
            <div className="price-row">
              <span className="name">Limousine</span>
              <span className="leader" />
              <span className="amount">$120/hr</span>
            </div>
            <div className="price-row">
              <span className="name">Sprinter van</span>
              <span className="leader" />
              <span className="amount">$175/hr</span>
            </div>
            <div className="price-row">
              <span className="name">Luxury Sprinter</span>
              <span className="leader" />
              <span className="amount">$225/hr</span>
            </div>
            <div className="price-row">
              <span className="name">Limo Sprinter</span>
              <span className="leader" />
              <span className="amount">$275/hr</span>
            </div>
            <div className="price-row">
              <span className="name">Bus &amp; coach</span>
              <span className="leader" />
              <span className="amount">Custom quote</span>
            </div>
            <a href="#book" className="btn btn-brass">
              Book by the hour
            </a>
            <p className="disclaimer">4-hour minimum {"\u00A0·\u00A0"} Same chauffeur, all day</p>
          </div>
        </div>
      </section>

      <section className="steps" id="how">
        <div className="wrap">
          <div className="section-head">
            <h2>How a reservation works</h2>
            <p>Two steps, handled by a person, not just software.</p>
          </div>
          <div className="step-grid">
            <div className="step">
              <div className="num">01</div>
              <h3>Tell us where and when</h3>
              <p>
                Enter your pickup, destination and vehicle class. Group or recurring trips can be arranged directly with
                dispatch.
              </p>
            </div>
            <div className="step">
              <div className="num">02</div>
              <h3>We confirm your chauffeur</h3>
              <p>A dispatcher assigns a licensed, background-checked driver.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="section-head">
            <h2>One dispatch team, for every ride your company books</h2>
            <p>
              Instead of switching between apps and unfamiliar drivers, your team gets a single fleet — sedan to coach —
              with licensed, background-checked chauffeurs. Booking takes a minute; the worrying stops.
            </p>
          </div>
          <div className="usp-grid">
            <div className="usp">
              <div className="icon-box">
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                  <circle cx="17" cy="17" r="14" stroke="#B08D3E" strokeWidth="1.6" />
                  <text x="17" y="22" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="14" fill="#B08D3E">
                    $
                  </text>
                </svg>
              </div>
              <h3>Fixed pricing</h3>
              <p>Your fare is confirmed at booking. No surge, no meter, no surprises on arrival.</p>
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
              <p>Every chauffeur passes a background check and a driving record review before their first trip.</p>
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
                "Every chauffeur showed up early for our three-day roadshow across four cities. Not one delay."
              </p>
              <div className="who">
                <strong>Priya N.</strong>Event planner, London
              </div>
            </div>
            <div className="test-card">
              <p className="quote">
                "We moved our whole travel program to {SITE.brand.shortName} for the invoicing alone. The service held
                up just as well."
              </p>
              <div className="who">
                <strong>Daniel R.</strong>COO, fintech startup
              </div>
            </div>
            <div className="test-card">
              <p className="quote">
                "The limousine arrived exactly on time and the driver knew the venue better than our own coordinator
                did."
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
              Get a dedicated account manager and volume rates for every ride across the{" "}
              {SITE.market.metro}. An invoice is sent automatically with your confirmation email for every reservation.
            </p>
          </div>
          <div>
            <a href="#book" className="btn btn-brass">
              Talk to our team
            </a>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", marginTop: 10, textAlign: "center" }}>
              or{" "}
              <a href={PHONE_HREF} style={{ color: "rgba(255,255,255,0.75)", textDecoration: "underline" }}>
                call us
              </a>
              {" \u00A0·\u00A0 "}
              <a href={`mailto:${EMAIL}`} style={{ color: "rgba(255,255,255,0.75)", textDecoration: "underline" }}>
                email us
              </a>
            </p>
          </div>
        </div>
      </div>

      <section id="faq">
        <div className="wrap">
          <div className="section-head">
            <h2>Questions before you book</h2>
          </div>
          <div className="faq-list">
            {FAQS.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
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
            Support available 24/7 {"\u00A0·\u00A0"} or{" "}
            <a href={PHONE_HREF} style={{ color: "var(--ink)", textDecoration: "underline" }}>
              call us
            </a>
            {" \u00A0·\u00A0 "}
            <a href={`mailto:${EMAIL}`} style={{ color: "var(--ink)", textDecoration: "underline" }}>
              email us
            </a>
          </p>
        </div>
      </section>

      <section id="drive">
        <div className="wrap" style={{ maxWidth: 720 }}>
          <div className="section-head">
            <h2>Drive with {SITE.brand.shortName}</h2>
            <p>
              We're always looking for professional chauffeurs across the {SITE.market.metro}. Here's what it takes to
              join the fleet.
            </p>
          </div>

          <div className="drive-req">
            {DRIVE_REQS.map((r) => (
              <div className="drive-req-item" key={r}>
                {CheckIcon}
                {r}
              </div>
            ))}
          </div>

          <DriveForm />
        </div>
      </section>

      <section id="fleetsites">
        <div className="wrap" style={{ maxWidth: 720 }}>
          <div className="section-head" style={{ textAlign: "center" }}>
            <img
              src="/fleetsites-logo.webp"
              alt="FleetSites"
              style={{ width: 96, height: 96, objectFit: "contain", marginBottom: 12 }}
            />
            <h2>Need a website for your business?</h2>
            <p>
              This site was built by <strong>FleetSites</strong>. We build high-converting websites for transportation
              companies — online booking, instant quotes, payments — and websites for <strong>any</strong> business.
            </p>
          </div>
          <div className="drive-req">
            <div className="drive-req-item">{CheckIcon}$1,500 one-time setup</div>
            <div className="drive-req-item">{CheckIcon}$200/month care plan — hosting, updates, support</div>
            <div className="drive-req-item">{CheckIcon}Booking, quotes &amp; payments built in</div>
          </div>
          <p style={{ textAlign: "center", marginTop: 20 }}>
            <a href="mailto:fleetsites1@gmail.com">Email us at fleetsites1@gmail.com</a> or call {PHONE} to get started.
        </p>
        </div>
      </section>

      <section id="areas" className="areas">
        <div className="wrap">
          <div className="section-head">
            <h2>Serving the San Francisco Bay Area</h2>
            <p>
              Global Link Transportation provides chauffeured car service, limo service, and airport transfers across
              the San Francisco Bay Area — sedan, SUV, limousine, limo, Sprinter van, charter bus, and coach ground
              transportation, from SFO airport runs to wine country tours: a Napa Valley wine tour, a Sonoma wine
              tour, Livermore wine tours, and runs to Monterey. Our licensed, background-checked chauffeurs cover
              more than 60 Bay Area cities.
            </p>
          </div>
          <div className="areas-grid">
            <div className="areas-group">
              <h3>Cities served</h3>
              <p>
                San Francisco, San Mateo, San Jose, Oakland, Berkeley, Palo Alto, Mountain View, Daly City, South San
                Francisco, Redwood City, Fremont, Santa Clara, Sunnyvale, Walnut Creek, and more than 60 Bay Area
                cities — with car service, limo rental, and charter bus options throughout.
              </p>
            </div>
            <div className="areas-group">
              <h3>Airports served</h3>
              <p>
                San Francisco International Airport (SFO), Oakland International Airport (OAK), and San Jose Mineta
                International Airport (SJC) — airport limo service, airport car service, and private transfers at
                every terminal.
              </p>
            </div>
            <div className="areas-group">
              <h3>Wine country</h3>
              <p>
                Napa, Sonoma, Livermore, and Monterey — wine country tours with a professional chauffeur, including a
                Napa Valley wine tour, a Sonoma wine tour, and Livermore wine tours, with pickup across San Francisco
                and the Bay Area.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter home />
    </>
  );
}
