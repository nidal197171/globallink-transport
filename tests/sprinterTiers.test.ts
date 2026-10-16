import { describe, expect, test } from "bun:test";
import { sprinterTier, sprinterTripFare } from "../src/lib/sprinterTiers";

describe("Sprinter tier pricing", () => {
  test("base Sprinter remains $175 per hour", () => {
    expect(sprinterTier("sprinter")?.hourlyRate).toBe(175);
    expect(sprinterTripFare("sprinter", 350)).toBe(350);
  });
  test("Luxury Sprinter is $225 per hour", () => {
    expect(sprinterTier("luxury-sprinter")?.hourlyRate).toBe(225);
    expect((sprinterTier("luxury-sprinter")?.hourlyRate ?? 0) * 4).toBe(900);
  });
  test("Limo Sprinter is $275 per hour", () => {
    expect(sprinterTier("limo-sprinter")?.hourlyRate).toBe(275);
    expect((sprinterTier("limo-sprinter")?.hourlyRate ?? 0) * 4).toBe(1100);
  });
  test("Luxury trip uplift is exactly $50", () => {
    expect(sprinterTripFare("luxury-sprinter", 350)).toBe(400);
    expect(sprinterTripFare("luxury-sprinter", 515)).toBe(565);
  });
  test("Limo trip uplift is exactly $100", () => {
    expect(sprinterTripFare("limo-sprinter", 350)).toBe(450);
    expect(sprinterTripFare("limo-sprinter", 515)).toBe(615);
  });
});