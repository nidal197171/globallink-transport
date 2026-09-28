// Google Sheet receiver for reservations (Apps Script web app, bound to the sheet).
// Past the /exec URL here once the script is deployed.
export const BOOKING_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbx58MtNg98scK2e83VtYliYrLDgw3lq59VrgU4Nn11S2bT6cU9sl2H6yZWILBL-X5jr/exec";

export function postToBookingSheet(payload: Record<string, string>) {
  if (!BOOKING_SHEET_URL) return;
  try {
    fetch(BOOKING_SHEET_URL, {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(payload),
    }).catch(() => {});
  } catch {
    /* sheet write failed — the booking flow continues */
  }
}

// Flip a reservation's sheet row to Paid (matched by booking number, column B).
export function markBookingPaid(bookingNo: string) {
  if (!bookingNo) return;
  postToBookingSheet({ action: "markPaid", bookingNumber: bookingNo });
}
