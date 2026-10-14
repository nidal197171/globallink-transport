import { createServerFn } from "@tanstack/react-start";
import { SITE } from "@/config/site";
import { z } from "zod";
import { type StripeEnv, createStripeClient, getStripeErrorMessage } from "@/lib/stripe.server";

const schema = z.object({
  base: z.number().int().positive().max(100000),
  gratuity: z.number().int().nonnegative().max(100000),
  fee: z.number().int().nonnegative().max(100000),
  greetMeet: z.number().int().nonnegative().max(100000).default(0),
  extraPickups: z.number().int().nonnegative().max(100000).default(0),
  description: z.string().min(1).max(300),
  origin: z.string().url(),
  customerName: z.string().min(1).max(200),
  customerEmail: z.string().email().max(200),
  bookingNumber: z.string().min(1).max(20),
  environment: z.enum(["sandbox", "live"]),
});

// Passenger ground transportation — used for automatic tax calculation.
const TAX_CODE = "txcd_20070000";

export const createReservationCheckout = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }): Promise<{ clientSecret: string } | { error: string }> => {
    try {
      const stripe = createStripeClient(data.environment as StripeEnv);

      const items: Array<[string, number]> = [
        [`${SITE.brand.legalName} — base fare`, data.base],
        ["Gratuity (20%)", data.gratuity],
        ["Booking fee (5%)", data.fee],
        ["Greet & meet service", data.greetMeet],
        ["Extra pickups", data.extraPickups],
      ];

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        ui_mode: "embedded_page",
        return_url: `${data.origin}/?payment=success&booking=${encodeURIComponent(data.bookingNumber)}`,
        customer_email: data.customerEmail,
        line_items: items
          .filter(([, amount]) => amount > 0)
          .map(([name, amount], i) => ({
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: amount * 100,
              product_data: {
                name,
                tax_code: TAX_CODE,
                ...(i === 0 ? { description: data.description } : {}),
              },
            },
          })),
        automatic_tax: { enabled: true },
        metadata: {
          customer_name: data.customerName,
          booking_number: data.bookingNumber,
          reservation: data.description,
        },
        // Card on file: save the card for future off-session charges
        // (tolls, overtime, cleaning, damages) per the rental agreement.
        payment_intent_data: {
          setup_future_usage: "off_session",
          description: data.description,
          metadata: {
            booking_number: data.bookingNumber,
            reservation: data.description,
          },
        },
      });

      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });
