export const SPRINTER_TIERS = {
  sprinter: { label: "Sprinter van", hourlyRate: 175, uplift: 0 },
  "luxury-sprinter": { label: "Luxury Sprinter", hourlyRate: 225, uplift: 50 },
  "limo-sprinter": { label: "Limo Sprinter", hourlyRate: 275, uplift: 100 },
} as const;

export function sprinterTier(vehicle: string) {
  if (vehicle === "sprinter" || vehicle === "luxury-sprinter" || vehicle === "limo-sprinter") {
    return SPRINTER_TIERS[vehicle];
  }
  return undefined;
}

export function sprinterTripFare(vehicle: string, baseSprinterFare: number) {
  return baseSprinterFare + (sprinterTier(vehicle)?.uplift ?? 0);
}