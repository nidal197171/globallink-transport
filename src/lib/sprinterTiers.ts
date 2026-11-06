export const SPRINTER_TIERS = {
  sprinter: { label: "Sprinter van", hourlyRate: 120, uplift: 0 },
  "luxury-sprinter": { label: "Luxury Sprinter", hourlyRate: 140, uplift: 20 },
  "limo-sprinter": { label: "Limo Sprinter", hourlyRate: 160, uplift: 40 },
} as const;

export function sprinterTier(vehicle: string) {
  if (vehicle === "sprinter" || vehicle === "luxury-sprinter" || vehicle === "limo-sprinter") {
    return SPRINTER_TIERS[vehicle];
  }
  return undefined;
}

// Sprinter transfer fares (airport + city-to-city) were raised 40% on
// 2026-11-06 per NED, on top of the sedan base fare + $200 Sprinter add-on
// and the tier uplift. Rounded to the nearest $5 like every other fare.
export const SPRINTER_TRANSFER_RAISE = 1.4;

export function sprinterTripFare(vehicle: string, baseSprinterFare: number) {
  const withUplift = baseSprinterFare + (sprinterTier(vehicle)?.uplift ?? 0);
  return Math.round((withUplift * SPRINTER_TRANSFER_RAISE) / 5) * 5;
}