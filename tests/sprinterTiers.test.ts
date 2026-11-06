import { describe, expect, test } from "bun:test";
import { sprinterTier, sprinterTripFare } from "../src/lib/sprinterTiers";

describe("Sprinter tier pricing", () => {
  test("base Sprinter is $120 per hour (NED 2026-11-06)", () => {
    expect(sprinterTier("sprinter")?.hourlyRate).toBe(120);
    expect(sprinterTripFare("sprinter", 350)).toBe(490);
  });
  test("Luxury Sprinter is $140 per hour", () => {
    expect(sprinterTier("luxury-sprinter")?.hourlyRate).toBe(140);
    expect((sprinterTier("luxury-sprinter")?.hourlyRate ?? 0) * 4).toBe(560);
  });
  test("Limo Sprinter is $160 per hour", () => {
    expect(sprinterTier("limo-sprinter")?.hourlyRate).toBe(160);
    expect((sprinterTier("limo-sprinter")?.hourlyRate ?? 0) * 4).toBe(640);
  });
  test("Luxury trip fare: $20 uplift, then the 40% transfer raise", () => {
    expect(sprinterTripFare("luxury-sprinter", 350)).toBe(520);
    expect(sprinterTripFare("luxury-sprinter", 515)).toBe(750);
  });
  test("Limo trip fare: $40 uplift, then the 40% transfer raise", () => {
    expect(sprinterTripFare("limo-sprinter", 350)).toBe(545);
    expect(sprinterTripFare("limo-sprinter", 515)).toBe(775);
  });
});