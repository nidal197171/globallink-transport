/**
 * Scripted chat brain for the site chat widget.
 *
 * Keyword intent matching + REAL fare quotes computed from
 * src/data/globallink.ts. Never invents a fare: if a city or airport
 * can't be matched, it says so and points at the booking form.
 * New bookings always go to the booking form (so customers can pay);
 * the bot only collects info for changing or confirming an existing booking.
 * The bot always presents itself as an automated assistant.
 */

import {
  AIRPORT_COORDS,
  AIRPORT_RATES,
  AIRPORT_TO_AIRPORT,
  CITIES,
  CITY_COORDS,
  cityToCityQuote,
  estimateRoadMiles,
  sprinterBaseFare,
  ZONE_PREMIUM,
  ZONE_PREMIUM_CITIES,
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

export interface EngineResult {
  messages: BotMessage[];
  /** When set, the widget navigates here after showing the messages. */
  navigate?: string;
  /** When set, the widget submits this change/confirmation request. */
  submitRequest?: ChangeRequest;
}

/** Info collected only for changing or confirming an existing booking. */
export interface ChangeRequest {
  name: string;
  phone: string;
  booking: string;
  request: string;
}

type ManageStep = "askName" | "askPhone" | "askBooking" | "askRequest" | "confirm";

const BOOK_QUICK = ["Get a fare quote", "Book a ride", "Change booking", "Call us"];

const CITY_ALIASES: Record<string, string> = {
  sf: "san-francisco",
  "san fran": "san-francisco",
  "st helena": "st-helena",
  "saint helena": "st-helena",
  "daly city": "daly-city",
};

/** Zone pairs: a bare city name ("San Jose", "Oakland") quotes both zones. */
const ZONE_PAIRS: [string, string][] = [
  ["san-jose-north", "san-jose-south"],
  ["oakland-downtown", "oakland-hills"],
];
const ZONE_BARE_NAMES: [string, [string, string]][] = [
  ["san jose", ["san-jose-north", "san-jose-south"]],
  ["oakland", ["oakland-downtown", "oakland-hills"]],
];

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
  // A bare "San Jose" / "Oakland" (no zone named) matches both zones so the
  // bot can quote each. Airport mentions were already stripped above.
  for (const [bare, pair] of ZONE_BARE_NAMES) {
    if (
      new RegExp(`\\b${esc(bare)}\\b`).test(rest.toLowerCase()) &&
      !pair.some((s) => cities.includes(s))
    ) {
      cities.push(...pair);
    }
  }
  return { airports, cities };
}

const has = (text: string, ...words: string[]) =>
  words.some((w) => text.includes(w));

export class ChatEngine {
  private site: SiteInfo;
  private mflow: ManageStep | null = null;
  private mlead: Partial<ChangeRequest> = {};

  constructor(site: SiteInfo) {
    this.site = site;
  }

  start(): EngineResult {
    return {
      messages: [
        {
          text: `Hi! I'm the ${this.site.brandName} automated assistant. I can quote fares, answer questions, or help with an existing booking — what do you need?`,
          quickReplies: BOOK_QUICK,
        },
      ],
    };
  }

  handle(rawInput: string): EngineResult {
    const input = rawInput.trim();
    const text = input.toLowerCase();
    if (!text) return { messages: [] };

    // Global escape hatch — works after any bot question.
    if (/^(cancel|never ?mind|stop|quit)$/.test(text)) {
      this.mflow = null;
      this.mlead = {};
      return this.msg(`No problem — cancelled. What would you like to do?`, BOOK_QUICK);
    }

    // "Start over" / "main menu" — always available, resets to the main menu.
    if (/^(start over|main menu|menu)$/.test(text)) {
      this.mflow = null;
      this.mlead = {};
      return this.start();
    }

    // Change/confirmation flow takes priority while active.
    if (this.mflow) return this.handleManageFlow(input, text);

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

    // --- Existing booking: change or confirm (info only — new bookings go to the page) ---
    if (
      has(text, "change", "modify", "cancel", "postpone", "reschedule", "confirm") &&
      has(text, "book", "reservation", "ride", "trip", "pickup")
    )
      return this.startManageFlow();

    // --- Booking intent: send them to the booking form ---
    // NOTE: "quote" is deliberately NOT here — quote requests fall through
    // to the fare intent below, which asks for the route.
    if (
      has(text, "book", "reserve", "schedule", "need a ride", "need a car", "get a ride", "i want a", "i'd like a", "request a") &&
      !has(text, "change", "modify", "cancel", "postpone", "reschedule", "confirm")
    )
      return {
        messages: [{ text: `You can book right here on the site — taking you to the booking form…` }],
        navigate: "/#book",
      };

    if (/^(hi|hello|hey|yo)\b/.test(text) || /\bgood (morning|afternoon|evening)\b/.test(text))
      return this.msg(
        `Hello! How can I help — a fare quote, a new booking, or an existing one?`,
        BOOK_QUICK
      );

    // --- Info intents ---
    if (has(text, "hour", "per hour", "charter", "as directed"))
      return this.msg(
        `Hourly service: sedan $${HOURLY_RATES["sedan"]}/hr, SUV or limousine $${HOURLY_RATES["suv"]}/hr, sprinter van $${HOURLY_RATES["sprinter"]}/hr (4-hour minimum). Bus & coach is a custom quote. 20% gratuity + 5% booking fee are added at checkout. Tap "Book a ride" below to book on our booking form.`,
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
        `Our fleet: Sedan, SUV, Limousine, Sprinter van, and Bus & coach for big groups. Tell me your route and I'll quote fares for each vehicle.`,
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
        `Two ways: the booking form right here on the site — you can pay online — or call us at ${this.site.phoneDisplay}.`,
        ["Book a ride", "Call us"]
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
      `I didn't quite catch that — I'm an automated assistant and I can quote exact fares, answer questions, or help with an existing booking. You can also call us at ${this.site.phoneDisplay}.`,
      BOOK_QUICK
    );
  }

  // ---------- Fare quoting ----------

  /** Sprinter van route fare ($200 + $4.50/mile, nearest $5), null if coords missing. */
  private sprinterFare(
    a: { lat: number; lon: number } | undefined,
    b: { lat: number; lon: number } | undefined
  ): number | null {
    if (!a || !b) return null;
    return sprinterBaseFare(estimateRoadMiles(a, b));
  }

  /** Fare quote with one price per line. */
  private stackedQuote(
    header: string,
    sedan: string,
    suv: string,
    sprinter: string | null,
    note?: string
  ): string {
    const lines = [header + ":", `Sedan — ${sedan}`, `SUV or limousine — ${suv}`];
    if (sprinter) lines.push(`Sprinter van — ${sprinter}`);
    if (note) lines.push(note);
    lines.push(
      "",
      `20% gratuity + 5% booking fee are added at checkout. Tap "Book this ride" below to book this fare on our booking form.`
    );
    return lines.join("\n");
  }

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
      const sprinterAA = this.sprinterFare(AIRPORT_COORDS[a.code], AIRPORT_COORDS[b.code]);
      return this.msg(
        this.stackedQuote(
          `${a.label} → ${b.label} (each way)`,
          `$${fare}`,
          `$${fare + 40}`,
          sprinterAA != null ? `$${sprinterAA}` : null
        ),
        ["Book this ride", "Get another quote"]
      );
    }

    // Airport <-> city
    if (airports.length === 1 && cities.length >= 1) {
      const ap = airports[0];
      if (!ap) return null;
      // Bare city name matched both zones of a pair — quote each zone.
      const pair = ZONE_PAIRS.find(([a, b]) => cities.includes(a) && cities.includes(b));
      if (pair) {
        const lines: string[] = [];
        for (const slug of pair) {
          const fare = AIRPORT_RATES[ap.code]?.[slug];
          if (fare == null) continue;
          const sprinterAC = this.sprinterFare(AIRPORT_COORDS[ap.code], CITY_COORDS[slug]);
          const sp =
            sprinterAC == null ? null : sprinterAC + (ZONE_PREMIUM_CITIES.has(slug) ? ZONE_PREMIUM : 0);
          lines.push(
            `${cityName(slug)} — sedan $${fare}, SUV/limo $${fare + 40}${
              sp != null ? `, sprinter $${sp}` : ""
            }`
          );
        }
        if (!lines.length) return null;
        return this.msg(
          `${ap.label} (each way):\n${lines.join("\n")}\n\n20% gratuity + 5% booking fee are added at checkout. Tap "Book this ride" below to book on our booking form.`,
          ["Book this ride", "Get another quote"]
        );
      }
      const slug = cities[0];
      if (!slug) return null;
      const fare = AIRPORT_RATES[ap.code]?.[slug];
      if (fare == null) {
        return this.msg(
          `I don't have an instant fare for ${ap.label} → ${cityName(slug)}. Try the booking form on the site for an exact quote, or call us at ${this.site.phoneDisplay}.`,
          ["Book a ride", "Call us"]
        );
      }
      const sprinterAC = this.sprinterFare(AIRPORT_COORDS[ap.code], CITY_COORDS[slug]);
      const sp =
        sprinterAC == null ? null : sprinterAC + (ZONE_PREMIUM_CITIES.has(slug) ? ZONE_PREMIUM : 0);
      return this.msg(
        this.stackedQuote(
          `${ap.label} → ${cityName(slug)} (each way)`,
          `$${fare}`,
          `$${fare + 40}`,
          sp != null ? `$${sp}` : null
        ),
        ["Book this ride", "Get another quote"]
      );
    }

    // City <-> city
    if (cities.length >= 2) {
      const from = cities[0];
      const to = cities[1];
      if (!from || !to) return null;
      if (from === to) {
        return this.msg(`Pickup and drop-off can't be the same place — where are you headed?`, ["Cancel"]);
      }
      // Bare city name matched both zones of a pair — ask which zone + the other end.
      const pairHit = ZONE_PAIRS.find(
        ([a, b]) => (from === a && to === b) || (from === b && to === a)
      );
      if (pairHit) {
        return this.msg(
          `Just to be sure — did you mean ${cityName(pairHit[0])} or ${cityName(pairHit[1])}? And where's the other end of the trip? For example "${cityName(pairHit[1])} to Palo Alto".`,
          [cityName(pairHit[0]), cityName(pairHit[1]), "Cancel"]
        );
      }
      const { base, miles } = cityToCityQuote(from, to);
      const sprinterCC = this.sprinterFare(CITY_COORDS[from], CITY_COORDS[to]);
      return this.msg(
        this.stackedQuote(
          `${cityName(from)} → ${cityName(to)} (about, ~${Math.round(miles)} road miles)`,
          `about $${base}`,
          `about $${base + 60}`,
          sprinterCC != null ? `about $${sprinterCC}` : null,
          undefined
        ),
        ["Book this ride", "Get another quote"]
      );
    }

    // Only an airport mentioned — ask for the other end.
    if (airports.length === 1 && cities.length === 0 && has(text, "how much", "price", "cost", "fare", "quote", "to", "from")) {
      const ap = airports[0];
      if (!ap) return null;
      return this.msg(
        `Sure — which city is the other end of your ${ap.label} trip? For example "${ap.label} to San Jose".`,
        ["Cancel"]
      );
    }
    return null;
  }

  // ---------- Existing booking: change or confirm ----------

  private startManageFlow(): EngineResult {
    this.mflow = "askName";
    this.mlead = {};
    return {
      messages: [
        {
          text: `Sure — I can help with an existing booking. What's your name?`,
          quickReplies: ["Cancel"],
        },
      ],
    };
  }

  private handleManageFlow(input: string, text: string): EngineResult {
    switch (this.mflow) {
      case "askName": {
        if (input.length < 2)
          return this.msg(`I didn't catch your name — what should I call you?`, ["Cancel"]);
        this.mlead.name = input;
        this.mflow = "askPhone";
        return this.msg(`Thanks ${input.split(" ")[0]}. What's the best phone number to reach you?`, ["Cancel"]);
      }
      case "askPhone": {
        const digits = input.replace(/\D/g, "");
        if (digits.length < 7)
          return this.msg(`That doesn't look like a valid phone number — mind double-checking?`, ["Cancel"]);
        this.mlead.phone = input;
        this.mflow = "askBooking";
        return this.msg(`What's the pickup date on the booking? A booking reference works too, if you have one.`, ["Cancel"]);
      }
      case "askBooking": {
        if (input.length < 2)
          return this.msg(`Which booking is this for — a pickup date or reference?`, ["Cancel"]);
        this.mlead.booking = input;
        this.mflow = "askRequest";
        return this.msg(`And what do you need — change it, confirm it, or cancel? (Cancellations need 48 hours notice.)`, ["Cancel"]);
      }
      case "askRequest": {
        if (input.length < 2)
          return this.msg(`What should we do with this booking?`, ["Cancel"]);
        this.mlead.request = input;
        this.mflow = "confirm";
        const l = this.mlead;
        return {
          messages: [
            {
              text:
                `Here's what I'll send our team:\n` +
                `• Name: ${l.name}\n• Phone: ${l.phone}\n• Booking: ${l.booking}\n• Request: ${l.request}\n\n` +
                `Does that look right?`,
              quickReplies: ["Yes, submit", "Start over", "Cancel"],
            },
          ],
        };
      }
      case "confirm": {
        if (has(text, "yes", "submit", "looks good", "correct")) {
          const req = this.mlead as ChangeRequest;
          this.mflow = null;
          this.mlead = {};
          return { messages: [{ text: `Sending your request…` }], submitRequest: req };
        }
        if (has(text, "start over", "restart", "redo")) return this.startManageFlow();
        return this.msg(`Just say "yes" to submit, "start over" to redo it, or "cancel".`, [
          "Yes, submit",
          "Start over",
          "Cancel",
        ]);
      }
      default: {
        this.mflow = null;
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

/** POST a booking change/confirmation request to FormSubmit (free form-to-email). Falls back to a mailto: link. */
export async function submitChangeRequest(
  req: ChangeRequest,
  toEmail: string,
  brandName: string
): Promise<{ ok: boolean; mailto: string }> {
  const subject = `Booking change/confirmation — ${brandName}`;
  const body =
    `Name: ${req.name}\n` +
    `Phone: ${req.phone}\n` +
    `Booking: ${req.booking}\n` +
    `Request: ${req.request}`;
  const mailto = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(toEmail)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name: req.name,
        phone: req.phone,
        booking: req.booking,
        request: req.request,
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
