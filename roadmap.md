# Roadmap

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
- 30% markup (20% gratuity + 10% booking fee) still not applied to displayed fare / Stripe charge.
- Stale "opened in a new tab" confirmation text after the user's manual same-tab payment redirect.
