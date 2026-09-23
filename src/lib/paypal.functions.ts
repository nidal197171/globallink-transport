import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const apiBase = () => process.env["PAYPAL_API_BASE"] ?? "https://api-m.paypal.com";

async function getAccessToken(): Promise<string> {
  const id = process.env["PAYPAL_CLIENT_ID"];
  const secret = process.env["PAYPAL_CLIENT_SECRET"];
  if (!id || !secret) throw new Error("PayPal is not configured yet.");
  const res = await fetch(`${apiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const json = (await res.json()) as { access_token?: string };
  if (!res.ok || !json.access_token) throw new Error("PayPal auth failed.");
  return json.access_token;
}

// Public client ID for the PayPal JS SDK (safe to expose in the page).
export const getPayPalClientId = createServerFn({ method: "GET" }).handler(async () => {
  return { clientId: process.env["PAYPAL_CLIENT_ID"] ?? null };
});

const orderSchema = z.object({
  amount: z.number().int().positive().max(100000),
  base: z.number().int().positive().max(100000).optional(),
  gratuity: z.number().int().nonnegative().max(100000).optional(),
  fee: z.number().int().nonnegative().max(100000).optional(),
  greetMeet: z.number().int().nonnegative().max(100000).optional(),
  description: z.string().min(1).max(300),
});

export const createPayPalOrder = createServerFn({ method: "POST" })
  .validator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const token = await getAccessToken();
      const res = await fetch(`${apiBase()}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            (() => {
              const unit: Record<string, unknown> = {
                amount: { currency_code: "USD", value: data.amount.toFixed(2) },
                description: data.description,
              };
              if (data.base !== undefined && data.gratuity !== undefined && data.fee !== undefined) {
                (unit.amount as Record<string, unknown>).breakdown = {
                  item_total: { currency_code: "USD", value: data.amount.toFixed(2) },
                };
                unit.items = [
                  {
                    name: "Base fare",
                    unit_amount: { currency_code: "USD", value: data.base.toFixed(2) },
                    quantity: "1",
                  },
                  {
                    name: "Gratuity (20%)",
                    unit_amount: { currency_code: "USD", value: data.gratuity.toFixed(2) },
                    quantity: "1",
                  },
                  {
                    name: "Booking fee (5%)",
                    unit_amount: { currency_code: "USD", value: data.fee.toFixed(2) },
                    quantity: "1",
                  },
                  ...(data.greetMeet && data.greetMeet > 0
                    ? [
                        {
                          name: "Greet & meet service",
                          unit_amount: { currency_code: "USD", value: data.greetMeet.toFixed(2) },
                          quantity: "1",
                        },
                      ]
                    : []),
                ];
              }
              return unit;
            })(),
          ],
        }),
      });
      const json = (await res.json()) as { id?: string };
      if (!res.ok || !json.id) {
        return { orderId: null as string | null, error: "We couldn't start the PayPal payment." };
      }
      return { orderId: json.id, error: null as string | null };
    } catch {
      return { orderId: null as string | null, error: "PayPal is not configured yet." };
    }
  });

export const capturePayPalOrder = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ orderId: z.string().min(1).max(100) }).parse(data))
  .handler(async ({ data }) => {
    try {
      const token = await getAccessToken();
      const res = await fetch(`${apiBase()}/v2/checkout/orders/${data.orderId}/capture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const json = (await res.json()) as { status?: string };
      const ok = res.ok && json.status === "COMPLETED";
      return { ok, error: ok ? null : "The PayPal payment didn't go through." };
    } catch {
      return { ok: false, error: "PayPal is not configured yet." };
    }
  });
