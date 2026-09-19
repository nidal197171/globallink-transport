import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { createReservationCheckout } from "@/lib/checkout.functions";

export const Route = createFileRoute("/pay")({
  head: () => ({
    meta: [
      { title: "Pay your reservation — Globallink Transportation" },
      {
        name: "description",
        content:
          "Complete your Globallink Transportation reservation payment securely by card.",
      },
    ],
  }),
  component: PayPage,
});

function readParams() {
  if (typeof window === "undefined") return { amount: "", ref: "", name: "", email: "" };
  const q = new URLSearchParams(window.location.search);
  return {
    amount: q.get("amount") ?? "",
    ref: q.get("ref") ?? "",
    name: q.get("name") ?? "",
    email: q.get("email") ?? "",
  };
}

function PayPage() {
  const [initial] = useState(readParams);
  const [amount, setAmount] = useState(initial.amount);
  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [address, setAddress] = useState("");
  const [details, setDetails] = useState("");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const cents = Math.round(Number(amount));
  const valid =
    Number.isFinite(cents) &&
    cents > 0 &&
    cents <= 100000 &&
    name.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const pay = async () => {
    if (!valid || paying) return;
    setPaying(true);
    setError("");
    try {
      const parts = [details.trim(), address.trim(), initial.ref]
        .filter((x) => x && x.length > 0)
        .join(" — ");
      const description = `Custom reservation payment${parts ? ` — ${parts}` : ""}`;
      const res = await createReservationCheckout({
        data: {
          base: cents,
          gratuity: 0,
          fee: 0,
          description,
          origin: window.location.origin,
          customerName: name.trim(),
          customerEmail: email.trim(),
        },
      });
      if (res.url) {
        window.location.href = res.url;
        return;
      }
      setError(res.error || "We couldn't open the payment page. Please try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setPaying(false);
  };

  return (
    <section>
      <div className="wrap" style={{ maxWidth: 560 }}>
        <div className="section-head">
          <h2>Complete your payment</h2>
          <p>Globallink Transportation — secure card payment.</p>
        </div>
        <div className="booking-card">
          {initial.ref && (
            <p className="sub" style={{ marginBottom: 16 }}>
              Reference: <strong>{initial.ref}</strong>
            </p>
          )}
          <div className="field">
            <label htmlFor="payAmount">Amount (USD)</label>
            <input
              id="payAmount"
              type="number"
              min={1}
              max={100000}
              step={1}
              inputMode="numeric"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="payDetails">Reservation</label>
            <textarea
              id="payDetails"
              rows={3}
              placeholder="Explain your reservation — date, pickup, dropoff, passengers…"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="payAddress">Address</label>
            <input
              id="payAddress"
              type="text"
              autoComplete="street-address"
              placeholder="Pickup address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="payName">Full name</label>
              <input
                id="payName"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="payEmail">Email (for your receipt)</label>
              <input
                id="payEmail"
                type="email"
                autoComplete="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          {error && (
            <p className="sub" style={{ color: "#a33", marginTop: 12 }}>
              {error}
            </p>
          )}
          <button
            type="button"
            className="btn btn-brass"
            style={{ width: "100%", marginTop: 20 }}
            onClick={pay}
            disabled={!valid || paying}
          >
            {paying
              ? "Opening secure payment…"
              : Number.isFinite(cents) && cents > 0
                ? `Pay $${cents}`
                : "Enter an amount to pay"}
          </button>
          <p className="sub" style={{ marginTop: 12 }}>
            You'll be taken to our secure checkout to enter your card details.
          </p>
        </div>
      </div>
    </section>
  );
}
