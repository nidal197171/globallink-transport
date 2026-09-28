/**
 * Scripted chat brain for the site chat widget.
 *
 * Keyword intent matching + REAL fare quotes computed from
 * src/data/globallink.ts. Never invents a fare: if a city or airport
 * can't be matched, it says so and points at the booking form.
 * The bot always presents itself as an automated assistant.
 */

import {
  AIRPORT_RATES,
  AIRPORT_TO_AIRPORT,
  CITIES,
  cityToCityQuote,
  EAST_BAY_CITIES,
  EAST_BAY_PICKUP_SURCHARGE,
  SOUTH_BAY_CITIES,
  VEHICLES,
} from "@/data/globallink";

export interface SiteInfo {
  brandName: string;
  legalName: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  metro: string;
}

export interface BotMessage {
  text: string;
  quickReplies?: string[];
}

export interface Lead {
  name: string;
  phone: string;
  pickup: string;
  dropoff: string;
  datetime: string;
  vehicle: string;
}

export interface EngineResult {
  messages: BotMessage[];
  submitLead?: Lead;
}

type FlowStep =
  | "askName"
  | "askPhone"
  | "askPickup"
  | "askDropoff"
  | "askDatetime"
  | "askVehicle"
  | "confirm";

const BOOK_QUICK = ["Get a fare quote", "Book a ride", "Call us"];

const CITY_ALIASES: Record<string, string> = {
  sf: "san-francisco",
  "san fran": "san-francisco",
  "st helena": "st-helena",
  "saint helena": "st-helena",
  "daly city": "daly-city",
};

const AIRPORT_PATTERNS: { code: string; label: string; re: RegExp }[] = [
  { code: "sfo", label: "SFO", re: /\bsfo\b|san francisco (international )?airport/i },
  { code: "oak", label: "OAK", re: /\boak\b|oakland (international )?airport/i },
  { code: "sjc", label: "SJC", re: /\bsjc\b|san jose (international )?airport|mineta/i },
];

const HOURLY_RATES: Record<string, number> = {
  sedan: 85,
  suv: 140,
  limousine: 140,
  sprinter: 175,
};

function esc(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function cityName(slug: string) {
  return CITIES.find((c) => c.slug === slug)?.name ?? slug;
}

interface RouteEntities {
  airports: { code: string; label: string }[];
  cities: string[]; // slugs
}

function detectRoute(text: string): RouteEntities {
  const airports = AIRPORT_PATTERNS.filter((a) => a.re.test(text)).map((a) => ({
    code: a.code,
    label: a.label,
  }));
  // Strip airport mentions so "Oakland airport" doesn't also match the city Oakland.
  let rest = text;
  for (const a of AIRPORT_PATTERNS) rest = rest.replace(a.re, " ");
  const lower = ` ${rest.toLowerCase()} `;
  const cities: string[] = [];
  for (const c of CITIES) {
    if (lower.includes(` ${c.name.toLowerCase()} `) || new RegExp(`\\b${esc(c.name.toLowerCase())}\\b`).test(rest.toLowerCase())) {
      if (!cities.includes(c.slug)) cities.push(c.slug);
    }
  }
  for (const [alias, slug] of Object.entries(CITY_ALIASES)) {
    if (new RegExp(`\\b${esc(alias)}\\b`).test(rest.toLowerCase()) && !cities.includes(slug)) {
      cities.push(slug);
    }
  }
  return { airports, cities };
}

const has = (text: string, ...words: string[]) =>
  words.some((w) => text.includes(w));

export class ChatEngine {
  private site: SiteInfo;
  private flow: FlowStep | null = null;
  private lead: Partial<Lead> = {};

  constructor(site: SiteInfo) {
    this.site = site;
  }

  start(): EngineResult {
    return {
      messages: [
        {
          text: `Hi! I'm the ${this.site.brandName} automated assistant. I can quote fares, answer questions, or take your booking details — what do you need?`,
          quickReplies: BOOK_QUICK,
        },
      ],
    };
  }

  handle(rawInput: string): EngineResult {
    const input = rawInput.trim();
    const text = input.toLowerCase();
    if (!text) return { messages: [] };

    // Lead-capture flow takes priority.
    if (this.flow) return this.handleFlow(input, text);

    // --- High-priority intents ---
    if (has(text, "human", "real person", "someone real", "agent", "representative"))
      return this.msg(
        `I'm an automated assistant, but our team is a call away at ${this.site.phoneDisplay} — we answer 24/7.`,
        ["Call us", "Book a ride"]
      );
    if (has(text, "drive for", "drive with", "become a driver", "driver job", "work as a driver", "apply as a driver"))
      return this.msg(
        `We'd love to have you! You can apply through the "Drive with us" form on our site, or email us at ${this.site.email}.`
      );

    // --- Fare quotes from real data ---
    const fare = this.tryFareQuote(text);
    if (fare) return fare;

    // --- Booking intent ---
    if (
      has(text, "book", "reserve", "schedule", "need a ride", "need a car", "get a ride", "i want a", "i'd like a", "request a") ||
      (text.includes("quote") && !text.includes("how much"))
    )
      return this.startFlow();

    if (/^(hi|hello|hey|yo)\b/.test(text) || /\bgood (morning|afternoon|evening)\b/.test(text))
      return this.msg(
        `Hello! How can I help — a fare quote, booking, or a question about our service?`,
        BOOK_QUICK
      );

    // --- Info intents ---
    if (has(text, "hour", "per hour", "charter", "as directed"))
      return this.msg(
        `Hourly service: sedan $${HOURLY_RATES["sedan"]}/hr, SUV or limousine $${HOURLY_RATES["suv"]}/hr, sprinter van $${HOURLY_RATES["sprinter"]}/hr (4-hour minimum). Bus & coach is a custom quote. 20% gratuity + 5% booking fee are added at checkout.`,
        ["Book a ride", "Get a fare quote"]
      );
    if (has(text, "greet", "meet me", "name sign", "inside the terminal", "arrivals"))
      return this.msg(
        `Our chauffeur meets you inside the terminal with a name sign. It's a flat $40 on airport pickups — no gratuity or booking fee on it.`
      );
    if (has(text, "wait", "delay", "my flight is late", "running late"))
      return this.msg(
        `10 minutes of waiting is included free. After that it's $2 per minute.`
      );
    if (has(text, "fee", "gratuity", "tip", "surcharge", "extra charge", "hidden"))
      return this.msg(
        `No hidden fees. Every fare adds 20% gratuity + 5% booking fee at checkout. Optional extras: airport greet & meet ($40 flat), extra pickups ($35 each).`
      );
    if (has(text, "vehicle", "fleet", "what cars", "what kind of car", "sedan", "suv", "limo", "sprinter", "bus", "coach", "van"))
      return this.msg(
        `Our fleet: Sedan, SUV, Limousine, Sprinter van, and Bus & coach for big groups. Tell me your route and I'll quote the sedan fare — SUV and limousine run $60 more.`,
        ["Get a fare quote"]
      );
    if (has(text, "area", "where do you", "cities", "coverage", "serve", "service area", "location"))
      return this.msg(
        `We cover 106 cities across the ${this.site.metro} — San Francisco to San Jose, Oakland, Napa, plus Sacramento and Santa Cruz. Tell me your pickup and drop-off and I'll quote it.`,
        ["Get a fare quote"]
      );
    if (has(text, "open", "24", "availability", "available", "what time", "hours"))
      return this.msg(`We're available 24/7 — book any time, day or night.`, ["Book a ride"]);
    if (has(text, "how do i book", "how to book", "how can i book"))
      return this.msg(
        `Three ways: use the booking form right here on the site, call ${this.site.phoneDisplay}, or I can take your details now — want me to start a booking?`,
        ["Yes, start booking", "Call us"]
      );
    if (has(text, "contact", "phone", "call you", "email", "reach you"))
      return this.msg(
        `Call us at ${this.site.phoneDisplay} or email ${this.site.email}.`,
        ["Call us"]
      );
    if (has(text, "price", "cost", "how much", "fare", "rate", "quote"))
      return this.msg(
        `Fares depend on the route. Give me your pickup and drop-off — e.g. "SFO to San Jose" — and I'll quote the exact fare.`,
        ["Get a fare quote"]
      );
    if (has(text, "thank", "thanks", "thx"))
      return this.msg(`Anytime! Safe travels.`);
    if (has(text, "bye", "goodbye", "good night"))
      return this.msg(`Goodbye — we're here 24/7 whenever you need a ride.`);

    // --- Fallback ---
    return this.msg(
      `I didn't quite catch that — I'm an automated assistant and I can quote exact fares, explain our services, or take your booking details. You can also call us at ${this.site.phoneDisplay}.`,
      BOOK_QUICK
    );
  }

  // ---------- Fare quoting ----------

  private tryFareQuote(text: string): EngineResult | null {
    const { airports, cities } = detectRoute(text);

    // Airport <-> airport
    if (airports.length >= 2) {
      const a = airports[0];
      const b = airports[1];
      if (!a || !b) return null;
      const key1 = `${a.code}-${b.code}`;
      const key2 = `${b.code}-${a.code}`;
      const fare = AIRPORT_TO_AIRPORT[key1] ?? AIRPORT_TO_AIRPORT[key2];
      if (fare == null) return null;
      return this.msg(
        `${a.label} → ${b.label} is $${fare} each way in a sedan. SUV or limousine is $${fare + 60} (sedan + $60). 20% gratuity + 5% booking fee are added at checkout.`,
        ["Book this ride", "Get another quote"]
      );
    }

    // Airport <-> city
    if (airports.length === 1 && cities.length >= 1) {
      const ap = airports[0];
      const slug = cities[0];
      if (!ap || !slug) return null;
      const fare = AIRPORT_RATES[ap.code]?.[slug];
      if (fare == null) {
        return this.msg(
          `I don't have an instant fare for ${ap.label} → ${cityName(slug)}. Try the booking form on the site for an exact quote, or call us at ${this.site.phoneDisplay}.`,
          ["Book a ride", "Call us"]
        );
      }
      return this.msg(
        `${ap.label} → ${cityName(slug)} is $${fare} each way in a sedan. SUV or limousine is $${fare + 60} (sedan + $60). 20% gratuity + 5% booking fee are added at checkout.`,
        ["Book this ride", "Get another quote"]
      );
    }

    // City <-> city
    if (cities.length >= 2) {
      const from = cities[0];
      const to = cities[1];
      if (!from || !to) return null;
      if (from === to) {
        return this.msg(`Pickup and drop-off can't be the same place — where are you headed?`);
      }
      const { base, miles } = cityToCityQuote(from, to);
      const surcharge =
        EAST_BAY_CITIES.has(from) || SOUTH_BAY_CITIES.has(from)
          ? ` Note: a $${EAST_BAY_PICKUP_SURCHARGE} pickup surcharge applies in ${cityName(from)}.`
          : "";
      return this.msg(
        `${cityName(from)} → ${cityName(to)} is about $${base} in a sedan (roughly ${Math.round(miles)} road miles). SUV or limousine is about $${base + 60}.${surcharge} 20% gratuity + 5% booking fee are added at checkout.`,
        ["Book this ride", "Get another quote"]
      );
    }

    // Only an airport mentioned — ask for the other end.
    if (airports.length === 1 && cities.length === 0 && has(text, "how much", "price", "cost", "fare", "quote", "to", "from")) {
      const ap = airports[0];
      if (!ap) return null;
      return this.msg(
        `Sure — which city is the other end of your ${ap.label} trip? For example "${ap.label} to San Jose".`
      );
    }
    return null;
  }

  // ---------- Lead capture flow ----------

  private startFlow(): EngineResult {
    this.flow = "askName";
    this.lead = {};
    return {
      messages: [{ text: `Great — I'll take your booking details. What's your name?` }],
    };
  }

  private handleFlow(input: string, text: string): EngineResult {
    if (/^(cancel|stop|never ?mind|quit)/.test(text)) {
      this.flow = null;
      this.lead = {};
      return this.msg(`No problem — I've cancelled that. Anything else I can help with?`, BOOK_QUICK);
    }
    switch (this.flow) {
      case "askName": {
        if (input.length < 2)
          return this.msg(`I didn't catch your name — what should I call you?`);
        this.lead.name = input;
        this.flow = "askPhone";
        return this.msg(`Thanks ${input.split(" ")[0]}. What's the best phone number to reach you?`);
      }
      case "askPhone": {
        const digits = input.replace(/\D/g, "");
        if (digits.length < 7)
          return this.msg(`That doesn't look like a valid phone number — mind double-checking?`);
        this.lead.phone = input;
        this.flow = "askPickup";
        return this.msg(`Got it. Where should we pick you up?`);
      }
      case "askPickup": {
        if (input.length < 2) return this.msg(`Where's the pickup address or city?`);
        this.lead.pickup = input;
        this.flow = "askDropoff";
        return this.msg(`And where are you headed?`);
      }
      case "askDropoff": {
        if (input.length < 2) return this.msg(`What's the drop-off address or city?`);
        this.lead.dropoff = input;
        this.flow = "askDatetime";
        return this.msg(`What date and time? (e.g. "Friday 3pm" or "Oct 5 at 9:30am")`);
      }
      case "askDatetime": {
        if (input.length < 3) return this.msg(`When do you need the ride? A date and time works best.`);
        this.lead.datetime = input;
        this.flow = "askVehicle";
        return {
          messages: [
            {
              text: `Which vehicle?`,
              quickReplies: VEHICLES.map((v) => v.label),
            },
          ],
        };
      }
      case "askVehicle": {
        const match = VEHICLES.find((v) => text.includes(v.value) || text.includes(v.label.toLowerCase()));
        if (!match) {
          return {
            messages: [
              {
                text: `Please pick one of our vehicles:`,
                quickReplies: VEHICLES.map((v) => v.label),
              },
            ],
          };
        }
        this.lead.vehicle = match.label;
        this.flow = "confirm";
        const l = this.lead;
        return {
          messages: [
            {
              text:
                `Here's your booking request:\n` +
                `• Name: ${l.name}\n• Phone: ${l.phone}\n• Pickup: ${l.pickup}\n• Drop-off: ${l.dropoff}\n• When: ${l.datetime}\n• Vehicle: ${l.vehicle}\n\n` +
                `Does that look right?`,
              quickReplies: ["Yes, submit", "Start over", "Cancel"],
            },
          ],
        };
      }
      case "confirm": {
        if (has(text, "yes", "submit", "confirm", "looks good", "correct")) {
          const lead = this.lead as Lead;
          this.flow = null;
          this.lead = {};
          return { messages: [{ text: `Submitting your request…` }], submitLead: lead };
        }
        if (has(text, "start over", "restart", "redo")) return this.startFlow();
        return this.msg(`Just say "yes" to submit, "start over" to redo it, or "cancel".`, [
          "Yes, submit",
          "Start over",
          "Cancel",
        ]);
      }
      default: {
        this.flow = null;
        return this.msg(`Let's start fresh — how can I help?`, BOOK_QUICK);
      }
    }
  }

  private msg(text: string, quickReplies?: string[]): EngineResult {
    return quickReplies
      ? { messages: [{ text, quickReplies }] }
      : { messages: [{ text }] };
  }
}

/** POST the lead to FormSubmit (free form-to-email). Falls back to a mailto: link. */
export async function submitLead(
  lead: Lead,
  toEmail: string,
  brandName: string
): Promise<{ ok: boolean; mailto: string }> {
  const subject = `New chat lead — ${brandName}`;
  const body =
    `Name: ${lead.name}\n` +
    `Phone: ${lead.phone}\n` +
    `Pickup: ${lead.pickup}\n` +
    `Drop-off: ${lead.dropoff}\n` +
    `Date/time: ${lead.datetime}\n` +
    `Vehicle: ${lead.vehicle}`;
  const mailto = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(toEmail)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name: lead.name,
        phone: lead.phone,
        pickup: lead.pickup,
        dropoff: lead.dropoff,
        datetime: lead.datetime,
        vehicle: lead.vehicle,
        _subject: subject,
        _template: "table",
      }),
    });
    if (!res.ok) throw new Error(`formsubmit ${res.status}`);
    return { ok: true, mailto };
  } catch {
    return { ok: false, mailto };
  }
}
