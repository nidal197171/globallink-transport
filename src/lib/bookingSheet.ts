// Google Sheet receiver for reservations (Apps Script web app, bound to the sheet).
// Past the /exec URL here once the script is deployed.
export const BOOKING_SHEET_URL = "";

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
