// A pickup counts as an airport pickup when it is SFO, OAK or SJC, or mentions an airport.
export function isAirportPickup(...values: string[]): boolean {
  return values.some((v) => /airport|\bsfo\b|\boak\b|\bsjc\b/i.test(v.replace(/[:_-]/g, " ")));
}

export const FLIGHT_REQUIRED_MESSAGE = "Flight number is required for airport pickups.";

export function flightNumberError(pickupValues: string[], flightNumber: string): string | null {
  return isAirportPickup(...pickupValues) && !flightNumber.trim() ? FLIGHT_REQUIRED_MESSAGE : null;
}