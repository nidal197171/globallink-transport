/**
 * ============================================================
 *  SITE CONFIG — REBRAND THIS TEMPLATE BY EDITING THIS FILE
 * ============================================================
 *
 * This file is the ONLY place that holds client-specific details.
 * To launch this booking site for a new limousine company in a new
 * city:
 *
 *   1. Copy the whole project folder.
 *   2. Edit the values below (name, phone, email, market, socials).
 *   3. Swap the logo / service images in `public/images/`.
 *   4. Edit `src/data/globallink.ts` for their cities, airports and
 *      pricing (the pricing formula lives there too).
 *   5. Set their `STRIPE_SECRET_KEY` env var so payments land in
 *      THEIR Stripe account.
 *   6. Deploy + connect their domain.
 *
 * Nothing else in the codebase needs to change.
 */
export const SITE = {
  brand: {
    /** Short name used in headers, logos, headlines. */
    shortName: "Globallink",
    /** Full legal name used in agreements, footers, page titles. */
    legalName: "Globallink Transportation",
    /** Tagline used in page titles and meta. */
    tagline: "Chauffeured cars, wherever business takes you",
  },
  contact: {
    /** Phone as shown to visitors, e.g. "(415) 787-8776". */
    phoneDisplay: "(415) 787-8776",
    /** Click-to-call link, e.g. "tel:+14157878776". */
    phoneHref: "tel:+14157878776",
    /** Public contact email. */
    email: "info@globallinktransport.com",
  },
  market: {
    /** Metro/region name used in marketing copy, e.g. "Bay Area". */
    metro: "Bay Area",
    /** Airport shorthand used in marketing copy, e.g. "SFO, OAK and SJC". */
    airports: "SFO, OAK and SJC",
  },
  social: {
    instagram: "https://www.instagram.com/global.link1",
    linkedin: "https://www.linkedin.com/company/global-link-transportation",
  },
} as const;
