import { expect, test } from "bun:test";
import { flightNumberError, isAirportPickup } from "../src/lib/airportPickup";

test("SFO, OAK and SJC pickups are airport pickups", () => {
  expect(isAirportPickup("airport:sfo")).toBe(true);
  expect(isAirportPickup("airport:oak")).toBe(true);
  expect(isAirportPickup("airport:sjc")).toBe(true);
  expect(isAirportPickup("Mineta San Jose Airport")).toBe(true);
});

test("hotel or home pickup is not an airport pickup", () => {
  expect(isAirportPickup("city:san-francisco", "San Francisco")).toBe(false);
  expect(flightNumberError(["city:san-francisco", "San Francisco"], "")).toBeNull();
});

test("airport pickup without a flight number is blocked", () => {
  expect(flightNumberError(["airport:sfo"], " ")).toBe("Flight number is required for airport pickups.");
  expect(flightNumberError(["airport:sfo"], "UA 1234")).toBeNull();
});