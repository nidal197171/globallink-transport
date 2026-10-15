# Roadmap

## Current request
- Create five dedicated service pages with exact metadata, four descriptive paragraphs, shared homepage header/footer, booking CTA, and cross-links.
- Replace prohibited recurring-invoice wording across the site with the exact per-reservation invoice statement.
- Verify all five pages and checks; do not publish.

## Done
- SEO keyword-rich service descriptions, 8 new FAQ items, "Serving the San Francisco Bay Area" section.
- Keyword variety pass: limo/limousine, car service, airport taxi alternative, ground transportation, black car, luxury car service, chauffeur, town car, executive car service, group transportation, buses, bus rental, charter bus, party bus.
- Occasions pass: wedding limo service, prom limo, event transportation, concert transportation, sports game transportation (football/baseball/basketball/hockey).
- Wine country pass: Napa Valley wine tour, Sonoma wine tour, Livermore wine tours, wine country tours; "winery to winery" never used.
- Wine tasting pass: wine tasting, wine tasting tours, Napa Valley wine tasting, Sonoma wine tasting tours, wine tasting experience.
- Emphasis pass: SFO airport, airport transfer, airport limo, airport car service, limo service, limo rental, wedding limo, San Francisco, Bay Area, SFO repeated across all three areas.
- Typecheck + production build pass; live preview verified (no "shuttle", no "winery to winery", prices/fees/terms unchanged).
- "For someone else" card: added one required Email field (type=email, autoComplete=email, same styling); blocks submit when empty/invalid and is sent in the reservation details ("Booker email: ..."). Typecheck + build pass; verified live.
- Stripe checkout works live again (a real payment page opened during testing) — the earlier "secrets disconnected" item is resolved.

## Open
- Do NOT publish until the user says so. Head/SEO changes + all new copy are not yet live on globallinktransport.com.
- Stripe secrets were disconnected by the user — dynamic checkout will fail until restored.
- Fees ARE applied at checkout (base × 1.25 = 20% gratuity + 5% booking fee). Unresolved: the user earlier asked for 30% (20% + 10%) and the agreement/booking form say 10% — needs the user's call on 5% vs 10%.
- Stale "opened in a new tab" confirmation text after the user's manual same-tab payment redirect.
