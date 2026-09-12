import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  amount: z.number().int().positive().max(100000),
  description: z.string().min(1).max(300),
  origin: z.string().url(),
});

export const createReservationCheckout = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env["STRIPE_SECRET_KEY"];
    if (!key) return { url: null as string | null, error: "Payments are not configured yet." };

    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set("success_url", `${data.origin}/?payment=success`);
    params.set("cancel_url", `${data.origin}/?payment=cancelled#book`);
    params.set("line_items[0][quantity]", "1");
    params.set("line_items[0][price_data][currency]", "usd");
    params.set("line_items[0][price_data][unit_amount]", String(data.amount * 100));
    params.set("line_items[0][price_data][product_data][name]", "Globallink Transportation reservation");
    params.set("line_items[0][price_data][product_data][description]", data.description);

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const json = (await res.json()) as { url?: string; error?: { message?: string } };
    if (!res.ok || !json.url) {
      console.error("Stripe checkout session failed", json.error?.message);
      return { url: null as string | null, error: "We couldn't open the payment page." };
    }
    return { url: json.url, error: null as string | null };
  });
