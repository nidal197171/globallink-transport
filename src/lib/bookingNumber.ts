// Booking number counter (Google Apps Script web app).
// Paste the deployed /exec URL here once it's live. Until then (or if the
// script is unreachable), bookings fall back to a clearly-marked temporary
// number so checkout never breaks.
export const BOOKING_COUNTER_URL = "";

const fallbackNumber = () =>
  `GL-TMP-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

/** Mint the next sequential booking number (GL1000, GL1001, …). Never throws. */
export async function mintBookingNumber(): Promise<string> {
  if (!BOOKING_COUNTER_URL) return fallbackNumber();
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(BOOKING_COUNTER_URL, {
      cache: "no-store",
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return fallbackNumber();
    const json = (await res.json()) as { bookingNumber?: unknown };
    return typeof json.bookingNumber === "string" &&
      /^GL\d+$/.test(json.bookingNumber)
      ? json.bookingNumber
      : fallbackNumber();
  } catch {
    return fallbackNumber();
  }
}
