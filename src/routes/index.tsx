import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import { createReservationCheckout } from "@/lib/checkout.functions";
import {
  capturePayPalOrder,
  createPayPalOrder,
  getPayPalClientId,
} from "@/lib/paypal.functions";
import {
  AIRPORTS,
  AIRPORT_RATES,
  AIRPORT_TO_AIRPORT,
  CITIES,
  VEHICLES,
  cityToCityQuote,
} from "@/data/globallink";
import InstallAppButton from "@/components/InstallAppButton";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Globallink — Chauffeured cars, wherever business takes you" },
      {
        name: "description",
        content:
          "Chauffeured sedans, SUVs, limousines, vans and coaches across the Bay Area and SFO, OAK and SJC. Fixed fares, vetted chauffeurs, one monthly invoice.",
      },
      { property: "og:title", content: "Globallink — Chauffeured cars, wherever business takes you" },
      {
        property: "og:description",
        content:
          "Chauffeured sedans, SUVs, limousines, vans and coaches across the Bay Area and SFO, OAK and SJC. Fixed fares, vetted chauffeurs, one monthly invoice.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const EMAIL = "GLtrans10@gmail.com";
const PHONE = "(415) 787-8776";
const PHONE_HREF = "tel:+14157878776";

const VEHICLE_LABEL: Record<string, string> = Object.fromEntries(
  VEHICLES.map((v) => [v.value, v.label])
);
const VEHICLE_MULTIPLIER: Record<string, number | null> = Object.fromEntries(
  VEHICLES.map((v) => [v.value, v.multiplier])
);
const HOURLY_RATES: Record<string, number | null> = {
  sedan: 85,
  suv: 120,
  limousine: 120,
  sprinter: 175,
  bus: null,
};

const HOUR_OPTIONS = [4, 5, 6, 7, 8, 9, 10, 11, 12];


const AGREEMENT_TERMS: { title: string; body: string }[] = [
  {
    title: "Passenger capacity",
    body: "The maximum capacity of the vehicle is the number of seat belts installed and must not be exceeded unless discussed and agreed upon with Globallink Transportation prior to pickup.",
  },
  {
    title: "Personal belongings",
    body: "Globallink Transportation is not liable or responsible for anything left in the vehicle. Please check your belongings before exiting.",
  },
  {
    title: "Damage to the vehicle",
    body: "You are financially responsible for any physical damage done to the vehicle by you or your guests.",
  },
  {
    title: "Eating, drinking and smoking",
    body: "Eating, drinking and smoking in the vehicle are prohibited in order to preserve the original upholstery and interior finishes.",
  },
  {
    title: "Unsafe behavior",
    body: "If, in the sole judgment of the driver, the behavior of you or your guests is out of control, unsafe, illegal, dangerous or irresponsible to lives and/or property, the driver may terminate the run and order all occupants out of the vehicle, with or without a prior warning. If this happens, no refund will be issued.",
  },
  {
    title: "Cancellations",
    body: "Cancellations must be made at least 48 hours before your scheduled pickup. Cancellations inside the 48-hour window, or no-shows, will be charged the full reservation amount.",
  },
  {
    title: "Surprise pickups",
    body: "If the arrival of the vehicle is meant as a surprise, please indicate this at the time of booking.",
  },
  {
    title: "Payment authorization",
    body: "By signing this agreement, you authorize Globallink Transportation to keep your credit card on file and charge it for any unpaid charges such as gratuity, overtime, tolls, waiting time, cleaning charges and damages.",
  },
];

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "Can I book a car for today?",
    a: "Yes, across the Bay Area cities and airports we serve. Same-day requests are matched with the nearest available chauffeur; dispatch will confirm within minutes.",
  },
  {
    q: "Do you cover airport pickups?",
    a: "Yes — SFO, OAK and SJC all include flight tracking, so your chauffeur adjusts to delays or early landings at no extra charge.",
  },
  {
    q: "Can we set up a corporate account?",
    a: "Yes. Corporate accounts get monthly invoicing, cost-center tagging and a dedicated account manager. Reach out through the contact section to get started.",
  },
  {
    q: "What happens if my flight is delayed?",
    a: "Airport pickups are tracked against your flight automatically, so your chauffeur's arrival shifts with you and you're never charged a wait fee for a late landing.",
  },
  {
    q: "Can I book multiple vehicles for a group?",
    a: "Yes — sprinter vans and coaches are built for this. For large events, our team will coordinate multi-vehicle logistics directly with your point of contact.",
  },
  {
    q: "What's your cancellation policy?",
    a: (
      <>
        Cancellations must be made at least 48 hours before your scheduled pickup. Cancellations
        inside the 48-hour window, or no-shows, will be charged the full reservation amount — see
        the{" "}
        <a href="#book" style={{ color: "var(--brass-dark)" }}>
          rental agreement
        </a>{" "}
        in the booking form above for full details.
      </>
    ),
  },
];

const DRIVE_REQS = [
  "Valid driver's license, age 21 or older",
  "Clean driving record, verified at onboarding",
  "Own or have access to a qualifying vehicle",
  "Valid commercial insurance where required",
  "Pass a background check",
  "Professional appearance and communication",
  "Smartphone for dispatch coordination",
  "Based in or near the Bay Area",
  "Proof of state license for company",
];

function placeLabel(value: string) {
  if (!value) return "";
  const [type, code] = value.split(":");
  if (type === "airport") {
    const a = AIRPORTS.find((x) => x.code === code);
    return a ? `${a.label} (${a.short})` : code ?? "";
  }
  return CITIES.find((c) => c.slug === code)?.name ?? code ?? "";
}

function computeSedanBase(pickup: string, dropoff: string): number | "same" | "quote" | null {
  if (!pickup || !dropoff) return null;
  if (pickup === dropoff) return "same";
  const [pType, pCode] = pickup.split(":");
  const [dType, dCode] = dropoff.split(":");
  if (pType === "airport" && dType === "airport") {
    const key = [pCode, dCode].sort().join("-");
    return AIRPORT_TO_AIRPORT[key] ?? null;
  }
  if (pType === "airport" && dType === "city") {
    return AIRPORT_RATES[pCode!]?.[dCode!] ?? null;
  }
  if (pType === "city" && dType === "airport") {
    return AIRPORT_RATES[dCode!]?.[pCode!] ?? null;
  }
  if (pType === "city" && dType === "city") {
    return cityToCityQuote(pCode!, dCode!).base;
  }
  return "quote";
}

function LocationSelect({
  id,
  label,
  value,
  onChange,
  placeholder,
  citiesOnly,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  citiesOnly?: boolean;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="" disabled>
          {placeholder}
        </option>
        {!citiesOnly && (
          <optgroup label="Airports">
            {AIRPORTS.map((a) => (
              <option key={a.code} value={`airport:${a.code}`}>
                {a.label} ({a.short})
              </option>
            ))}
          </optgroup>
        )}
        <optgroup label="Cities">
          {CITIES.map((c) => (
            <option key={c.slug} value={`city:${c.slug}`}>
              {c.name}
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );
}

type FeeParts = { base: number; gratuity: number; fee: number; total: number };

type BookingState = {
  service: string;
  pickup: string;
  dropoff: string;
  dt: string;
  vehicle: string;
  hours: number;
  name: string;
  signature: string;
  email: string;
};

function validateBooking(s: BookingState): string | null {
  const missingRoute = s.service === "hourly" ? !s.pickup : !s.pickup || !s.dropoff;
  if (missingRoute || !s.dt || !s.name.trim() || !s.signature.trim()) {
    return s.service === "hourly"
      ? "Please choose pickup, date & time, and sign your name before submitting."
      : "Please choose pickup, drop-off, date & time, and sign your name before submitting.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email.trim())) {
    return "Please enter a valid email address for your receipt.";
  }
  return null;
}

function buildDescription(s: BookingState): string {
  const base =
    s.service === "hourly"
      ? `${s.hours} hours hourly service · ${VEHICLE_LABEL[s.vehicle]} · pickup ${placeLabel(s.pickup)} · ${s.dt}`
      : `${placeLabel(s.pickup)} to ${placeLabel(s.dropoff)} · ${VEHICLE_LABEL[s.vehicle]} · ${s.dt}`;
  return `${base} · incl. 20% gratuity + 10% booking fee`;
}

function buildReservationMail(s: BookingState, fareText: string): string {
  const today = new Date().toISOString().split("T")[0];
  const subject = encodeURIComponent(`New Reservation & Signed Agreement — ${s.name.trim()}`);
  const body = encodeURIComponent(
    "Globallink Transportation — Reservation request\n\n" +
      `Service: ${s.service === "hourly" ? `Hourly (${s.hours} hours, 4-hour minimum)` : s.service === "city" ? "City to city" : "Airport pick up & drop off"}\n` +
      `Pickup: ${placeLabel(s.pickup)}\n` +
      (s.service === "hourly" ? "" : `Drop-off: ${placeLabel(s.dropoff)}\n`) +
      `Date & time: ${s.dt}\n` +
      `Vehicle: ${VEHICLE_LABEL[s.vehicle]}\n` +
      `Fare: ${fareText}\n\n` +
      "Rental agreement acknowledgement\n" +
      `Name: ${s.name.trim()}\n` +
      `Email: ${s.email.trim()}\n` +
      `Signature: ${s.signature.trim()}\n` +
      `Date signed: ${today}\n\n` +
      "By signing, this person confirms they have read, understood and will comply with the provisions of the Globallink Transportation rental agreement, including the 48-hour cancellation policy."
  );
  return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}

function BookingCard() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [vehicle, setVehicle] = useState("sedan");
  const [service, setService] = useState<"transfer" | "city" | "hourly">("transfer");
  const [hours, setHours] = useState(4);
  const [dt, setDt] = useState("");
  const [name, setName] = useState("");
  const [signature, setSignature] = useState("");
  const [email, setEmail] = useState("");
  const [confirm, setConfirm] = useState<{ kind: "error" | "ok"; text: React.ReactNode } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [paying, setPaying] = useState(false);
  const createCheckout = useServerFn(createReservationCheckout);
  const createOrderFn = useServerFn(createPayPalOrder);
  const captureOrderFn = useServerFn(capturePayPalOrder);
  const getClientIdFn = useServerFn(getPayPalClientId);
  const [payMethod, setPayMethod] = useState<"card" | "paypal">("card");
  const [ppClientId, setPpClientId] = useState<string | null>(null);
  const [ppChecked, setPpChecked] = useState(false);

  // All reservations add 20% gratuity + 10% booking fee on top of the base fare at checkout.
  const feeParts = (base: number): FeeParts => {
    const total = Math.round(base * 1.3);
    const gratuity = Math.round(base * 0.2);
    return { base, gratuity, fee: total - base - gratuity, total };
  };

  const fare = useMemo(() => {
    if (service === "hourly") {
      const rate = HOURLY_RATES[vehicle];
      if (rate === null || rate === undefined)
        return {
          cls: "has-price",
          amount: null as number | null,
          parts: null as FeeParts | null,
          node: (
            <>
              <span className="fare-amount">Request a quote</span>
              <span className="fare-sub">{VEHICLE_LABEL[vehicle]} pricing is quoted per group size</span>
            </>
          ),
        };
      const parts = feeParts(rate * hours);
      return {
        cls: "has-price",
        amount: parts.total,
        parts,
        node: (
          <>
            <span className="fare-amount">${parts.base}</span>
            <span className="fare-sub">
              {hours} hours × ${rate}/hr · {VEHICLE_LABEL[vehicle]} (4-hour minimum) + 20% gratuity + 10% booking fee at checkout
            </span>
          </>
        ),
      };
    }
    const base = computeSedanBase(pickup, dropoff);
    if (!pickup || !dropoff)
      return { cls: "", amount: null as number | null, parts: null as FeeParts | null, node: <span className="fare-label">Choose pickup and drop-off to see your fare</span> };
    if (base === "same")
      return { cls: "", amount: null as number | null, parts: null as FeeParts | null, node: <span className="fare-label">Pickup and drop-off can't be the same place</span> };
    if (base === "quote" || base === null)
      return {
        cls: "",
        amount: null as number | null,
        parts: null as FeeParts | null,
        node: <span className="fare-label">Custom route — dispatch confirms your exact fare in minutes</span>,
      };
    const mult = VEHICLE_MULTIPLIER[vehicle];
    if (mult === null || mult === undefined)
      return {
        cls: "has-price",
        amount: null as number | null,
        parts: null as FeeParts | null,
        node: (
          <>
            <span className="fare-amount">Request a quote</span>
            <span className="fare-sub">{VEHICLE_LABEL[vehicle]} pricing is quoted per group size</span>
          </>
        ),
      };
    const parts = feeParts(Math.round((base * mult) / 5) * 5);
    const [pType, pCode] = pickup.split(":");
    const [dType, dCode] = dropoff.split(":");
    const milesText =
      pType === "city" && dType === "city" && pCode && dCode
        ? ` · ${Math.round(cityToCityQuote(pCode, dCode).miles)} miles`
        : "";
    return {
      cls: "has-price",
      amount: parts.total,
      parts,
      node: (
        <>
          <span className="fare-amount">${parts.base}</span>
          <span className="fare-sub">Estimated one-way fare{milesText} · {VEHICLE_LABEL[vehicle]} + 20% gratuity + 10% booking fee at checkout</span>
        </>
      ),
    };
  }, [pickup, dropoff, vehicle, service, hours]);



  const bookingSnapshot = (): BookingState => ({
    service,
    pickup,
    dropoff,
    dt,
    vehicle,
    hours,
    name,
    signature,
    email,
  });

  const fareTextNow = () =>
    (typeof document !== "undefined" &&
      document.getElementById("farePreview")?.textContent?.trim()) ||
    "";

  const submitCard = async () => {
    const err = validateBooking(bookingSnapshot());
    if (err) {
      setConfirm({ kind: "error", text: err });
      return;
    }
    const mailHref = buildReservationMail(bookingSnapshot(), fareTextNow());

    let paymentUrl: string | null = null;
    let paymentError: string | null = null;
    if (fare.amount && fare.amount > 0 && fare.parts) {
      setPaying(true);
      try {
        const result = await createCheckout({
          data: {
            base: fare.parts.base,
            gratuity: fare.parts.gratuity,
            fee: fare.parts.fee,
            description: buildDescription(bookingSnapshot()),
            origin: window.location.origin,
            customerName: name.trim(),
            customerEmail: email.trim(),
          },
        });
        paymentUrl = result.url;
        paymentError = result.error;
      } catch {
        paymentError = "We couldn't open the payment page.";
      }
      setPaying(false);
    }

    if (paymentUrl) window.open(paymentUrl, "_blank", "noopener");
    window.location.href = mailHref;
    setConfirm({
      kind: "ok",
      text: (
        <>
          Thanks, {name.trim()} —{" "}
          {paymentUrl ? (
            <>
              your payment page for <strong>${fare.amount}</strong> opened in a new tab. Please complete
              payment, then send the reservation email that just opened.{" "}
              <a href={paymentUrl} target="_blank" rel="noopener" style={{ color: "var(--brass-dark)" }}>
                Reopen the payment page
              </a>{" "}
              if needed.{" "}
            </>
          ) : (
            <>
              your reservation and signed agreement are ready to send.{" "}
              {paymentError ? `${paymentError} We'll send you a secure payment link by email. ` : ""}
            </>
          )}
          If your email app didn't open automatically, please email a copy to{" "}
          <a href={`mailto:${EMAIL}`} style={{ color: "var(--brass-dark)" }}>
            {EMAIL}
          </a>
          .
        </>
      ),
    });
    setSubmitted(true);
  };

  const completePayPalReservation = (amount: number, payerName: string) => {
    window.location.href = buildReservationMail(bookingSnapshot(), fareTextNow());
    setConfirm({
      kind: "ok",
      text: (
        <>
          Thanks, {payerName} — your PayPal payment of <strong>${amount}</strong> is complete.
          Please send the reservation email that just opened. If your email app didn't open
          automatically, please email a copy to{" "}
          <a href={`mailto:${EMAIL}`} style={{ color: "var(--brass-dark)" }}>
            {EMAIL}
          </a>
          .
        </>
      ),
    });
    setSubmitted(true);
  };

  // Latest values for the PayPal button callbacks (avoids stale closures).
  const liveRef = useRef({ snapshot: bookingSnapshot(), fare: { amount: fare.amount, parts: fare.parts } });
  liveRef.current = { snapshot: bookingSnapshot(), fare: { amount: fare.amount, parts: fare.parts } };
  const completeRef = useRef(completePayPalReservation);
  completeRef.current = completePayPalReservation;
  const orderFnRef = useRef(createOrderFn);
  orderFnRef.current = createOrderFn;
  const captureFnRef = useRef(captureOrderFn);
  captureFnRef.current = captureOrderFn;
  const setConfirmRef = useRef(setConfirm);
  setConfirmRef.current = setConfirm;

  // Check whether PayPal is configured (public client ID present).
  useEffect(() => {
    getClientIdFn()
      .then((r) => {
        setPpClientId(r.clientId);
        setPpChecked(true);
      })
      .catch(() => setPpChecked(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render PayPal buttons when PayPal is the chosen method.
  useEffect(() => {
    if (payMethod !== "paypal" || !ppClientId) return;
    const container = document.getElementById("paypal-buttons");
    if (!container) return;
    container.innerHTML = "";

    const renderButtons = () => {
      const paypal = (window as unknown as { paypal?: any }).paypal;
      if (!paypal || !container.isConnected) return;
      paypal
        .Buttons({
          style: { layout: "vertical", color: "gold", shape: "rect", label: "paypal" },
          onClick: (_data: unknown, actions: { resolve: () => void; reject: () => void }) => {
            const { snapshot } = liveRef.current;
            const err = validateBooking(snapshot);
            if (err) {
              setConfirmRef.current({ kind: "error", text: err });
              return actions.reject();
            }
            if (!liveRef.current.fare.amount) {
              setConfirmRef.current({ kind: "error", text: "Choose your route to see the fare first." });
              return actions.reject();
            }
            return actions.resolve();
          },
          createOrder: async () => {
            const { snapshot, fare } = liveRef.current;
            const res = await orderFnRef.current({
              data: {
                amount: fare.amount ?? 0,
                base: fare.parts?.base,
                gratuity: fare.parts?.gratuity,
                fee: fare.parts?.fee,
                description: buildDescription(snapshot),
              },
            });
            if (!res.orderId) throw new Error(res.error ?? "PayPal failed");
            return res.orderId;
          },
          onApprove: async (data: { orderID: string }) => {
            const cap = await captureFnRef.current({ data: { orderId: data.orderID } });
            if (!cap.ok) {
              setConfirmRef.current({
                kind: "error",
                text: cap.error ?? "The PayPal payment didn't go through.",
              });
              return;
            }
            const { snapshot, fare } = liveRef.current;
            completeRef.current(fare.amount ?? 0, snapshot.name.trim());
          },
          onError: () =>
            setConfirmRef.current({
              kind: "error",
              text: "The PayPal payment was cancelled or failed. You can try again or pay by card.",
            }),
        })
        .render(container);
    };

    const sdkId = "paypal-js-sdk";
    if (!(window as unknown as { paypal?: unknown }).paypal) {
      if (!document.getElementById(sdkId)) {
        const s = document.createElement("script");
        s.id = sdkId;
        s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(ppClientId)}&currency=USD&intent=capture`;
        s.onload = renderButtons;
        document.body.appendChild(s);
      } else {
        const t = setInterval(() => {
          if ((window as unknown as { paypal?: unknown }).paypal) {
            clearInterval(t);
            renderButtons();
          }
        }, 300);
        return () => clearInterval(t);
      }
    } else {
      renderButtons();
    }
  }, [payMethod, ppClientId]);


  return (
    <div className="booking-card" id="book">
      <h3>Check your fare</h3>
      <p className="sub">Payment is required to confirm your reservation.</p>
      <div className="field-row">
        <div className="field">
          <label htmlFor="svc">Reservation type</label>
          <select
            id="svc"
            value={service}
            onChange={(e) => {
              setService(e.target.value as "transfer" | "city" | "hourly");
              setPickup("");
              setDropoff("");
            }}
          >
            <option value="transfer">Airport pick up &amp; drop off</option>
            <option value="city">City to city</option>
            <option value="hourly">Hourly (4 hours minimum)</option>
          </select>
        </div>
        {service === "hourly" && (
          <div className="field">
            <label htmlFor="hrs">Hours</label>
            <select id="hrs" value={hours} onChange={(e) => setHours(Number(e.target.value))}>
              {HOUR_OPTIONS.map((h) => (
                <option key={h} value={h}>
                  {h} hours
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="field-row">
        <LocationSelect id="pu" label="Pickup" value={pickup} onChange={setPickup} placeholder="Choose pickup" citiesOnly={service === "city"} />
        {service !== "hourly" && (
          <LocationSelect id="do" label="Drop-off" value={dropoff} onChange={setDropoff} placeholder="Choose destination" citiesOnly={service === "city"} />
        )}
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="dt">Date &amp; time</label>
          <input id="dt" type="datetime-local" value={dt} onChange={(e) => setDt(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="veh">Vehicle</label>
          <select id="veh" value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
            {VEHICLES.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      </div>


      <div className={`fare-preview ${fare.cls}`} id="farePreview">
        {fare.node}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="agName">Name</label>
          <input
            id="agName"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="agSignature">Signature (type your full name)</label>
          <input
            id="agSignature"
            type="text"
            placeholder="Type to sign"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="agEmail">Email (for your receipt)</label>
        <input
          id="agEmail"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <details className="agreement-details">
        <summary>Read the rental agreement</summary>
        <div className="agreement-details-body">
          <p style={{ fontSize: 13, color: "var(--steel)", paddingTop: 14 }}>
            This agreement applies to every ride booked with Globallink Transportation. By signing
            below, you agree to the terms here.
          </p>
          {AGREEMENT_TERMS.map((t, i) => (
            <div className="agreement-item" key={t.title}>
              <div className="num">{String(i + 1).padStart(2, "0")}</div>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </div>
          ))}
          <div className="agreement-box">
            <h4>Additional charges</h4>
            <p>
              A <strong>20% gratuity</strong> and <strong>10% booking fee</strong> are added to all
              reservations. Overtime is billed at the hourly rate of the reserved vehicle.
            </p>
          </div>
          <div className="agreement-box">
            <h4>Cleaning fees</h4>
            <p>
              A <strong>$600 cleaning fee</strong> applies if the vehicle must be cleaned due to
              someone getting sick in the vehicle.
            </p>
          </div>
          <div className="agreement-box">
            <h4>Damages</h4>
            <p>
              <strong>$25</strong> for any broken glass. Other damage is billed at repair cost.
            </p>
          </div>
        </div>
      </details>

      <p style={{ fontSize: 12, color: "var(--steel)", marginTop: 12, lineHeight: 1.5 }}>
        By typing your name as a signature above, you agree to the rental agreement and authorize
        the charges described in it.
      </p>

      {fare.parts && (
        <div className="field" style={{ marginTop: 14 }}>
          <div style={{ border: "1px solid var(--brass)", borderRadius: 12, padding: "12px 14px", background: "rgba(176,141,62,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, padding: "2px 0" }}>
              <span>Base fare</span>
              <span>${fare.parts.base}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, padding: "2px 0" }}>
              <span>Gratuity (20%)</span>
              <span>${fare.parts.gratuity}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, padding: "2px 0" }}>
              <span>Booking fee (10%)</span>
              <span>${fare.parts.fee}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 15, borderTop: "1px solid var(--brass)", marginTop: 6, paddingTop: 8 }}>
              <span>Total due</span>
              <span>${fare.parts.total}</span>
            </div>
          </div>
        </div>
      )}

      <div className="field" style={{ marginTop: 14 }}>
        <label>Payment method</label>
        <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
          <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 400, cursor: "pointer" }}>
            <input
              type="radio"
              name="payMethod"
              checked={payMethod === "card"}
              onChange={() => setPayMethod("card")}
            />
            Card
          </label>
          <label
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              fontWeight: 400,
              cursor: ppChecked && !ppClientId ? "not-allowed" : "pointer",
              opacity: ppChecked && !ppClientId ? 0.55 : 1,
            }}
          >
            <input
              type="radio"
              name="payMethod"
              checked={payMethod === "paypal"}
              disabled={ppChecked && !ppClientId}
              onChange={() => setPayMethod("paypal")}
            />
            PayPal{ppChecked && !ppClientId ? " (coming soon)" : ""}
          </label>
        </div>
      </div>

      {payMethod === "paypal" ? (
        fare.amount && fare.amount > 0 ? (
          <div id="paypal-buttons" style={{ marginTop: 12, minHeight: 100 }} />
        ) : (
          <p style={{ fontSize: 13, color: "var(--steel)", marginTop: 12 }}>
            Choose your route to see the PayPal payment button.
          </p>
        )
      ) : (
        <>
          <p style={{ fontSize: 12.5, color: "var(--steel)", marginTop: 14, lineHeight: 1.55 }}>
            Your card will be kept on file and may be charged for tolls, overtime, waiting time,
            cleaning and damage fees as described in the rental agreement.
          </p>
          <button className="btn btn-brass" id="reserveSubmit" onClick={submitCard} disabled={paying}>
          {paying
            ? "Opening secure payment…"
            : submitted
              ? "Reserved & signed ✓"
              : "Reserve, sign & pay"}
          </button>
        </>
      )}
      {confirm && (
        <div
          className="sign-confirm show"
          style={
            confirm.kind === "error"
              ? { background: "rgba(200,60,60,0.08)", borderColor: "#c83c3c" }
              : undefined
          }
        >
          {confirm.text}
        </div>
      )}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? "open" : ""}`}>
      <button className="faq-q" onClick={() => setOpen((o) => !o)}>
        {q}
        <span className="plus">+</span>
      </button>
      <div className="faq-a" style={open ? { maxHeight: 400 } : undefined}>
        <p>{a}</p>
      </div>
    </div>
  );
}

function DriveForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    vehicle: "sedan",
    experience: "",
    notes: "",
  });
  const [hasFiles, setHasFiles] = useState(false);
  const [confirm, setConfirm] = useState<{ kind: "error" | "ok"; text: React.ReactNode } | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) setHasFiles(true);
  };

  const submit = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.city.trim()) {
      setConfirm({
        kind: "error",
        text: "Please fill in your name, phone, email and city before submitting.",
      });
      return;
    }
    const subject = encodeURIComponent(`Driver Application — ${form.name.trim()}`);
    const body = encodeURIComponent(
      "Globallink Transportation — Driver application\n\n" +
        `Name: ${form.name.trim()}\n` +
        `Phone: ${form.phone.trim()}\n` +
        `Email: ${form.email.trim()}\n` +
        `City: ${form.city.trim()}\n` +
        `Vehicle: ${VEHICLE_LABEL[form.vehicle]}\n` +
        `Years driving professionally: ${form.experience || "Not specified"}\n` +
        `Notes: ${form.notes.trim() || "None"}\n\n` +
        "Documents: please attach driver's license and proof of insurance to this email before sending."
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setConfirm({
      kind: "ok",
      text: (
        <>
          Thanks, {form.name.trim()} — your application is ready to send.{" "}
          {hasFiles
            ? "Please attach your uploaded documents to the email before sending, since they can't attach automatically. "
            : "Don't forget to attach your license and insurance to the email before sending. "}
          If your email app didn't open automatically, please email a copy to{" "}
          <a href={`mailto:${EMAIL}`} style={{ color: "var(--brass-dark)" }}>
            {EMAIL}
          </a>
          .
        </>
      ),
    });
    setSubmitted(true);
  };

  return (
    <div className="drive-form">
      <h3>Apply to drive</h3>
      <div className="field-row">
        <div className="field">
          <label htmlFor="drvName">Full name</label>
          <input id="drvName" type="text" autoComplete="name" value={form.name} onChange={set("name")} />
        </div>
        <div className="field">
          <label htmlFor="drvPhone">Phone</label>
          <input id="drvPhone" type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="drvEmail">Email</label>
          <input id="drvEmail" type="email" autoComplete="email" value={form.email} onChange={set("email")} />
        </div>
        <div className="field">
          <label htmlFor="drvCity">City</label>
          <input id="drvCity" type="text" value={form.city} onChange={set("city")} />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="drvVehicle">Vehicle you drive</label>
          <select id="drvVehicle" value={form.vehicle} onChange={set("vehicle")}>
            {VEHICLES.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
            <option value="none">Don't have one yet</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="drvExperience">Years driving professionally</label>
          <input id="drvExperience" type="number" min={0} value={form.experience} onChange={set("experience")} />
        </div>
      </div>
      <div className="field" style={{ marginBottom: 16 }}>
        <label htmlFor="drvNotes">Anything else we should know?</label>
        <textarea id="drvNotes" value={form.notes} onChange={set("notes")} />
      </div>

      <div className="drive-upload">
        <h4>Upload documents</h4>
        <p className="upload-note">
          Attach a photo or PDF of each. These stay on your device until you send the email — they
          don't upload automatically, so please attach them again in the email that opens if needed.
        </p>
        <div className="field-row">
          <div className="field">
            <label htmlFor="drvLicense">Driver's license (front &amp; back)</label>
            <input id="drvLicense" type="file" accept="image/*,.pdf" multiple onChange={onFiles} />
          </div>
          <div className="field">
            <label htmlFor="drvInsurance">Proof of insurance</label>
            <input id="drvInsurance" type="file" accept="image/*,.pdf" multiple onChange={onFiles} />
          </div>
        </div>
      </div>

      <button type="button" className="btn btn-brass" id="drvSubmit" style={{ width: "100%", marginTop: 20 }} onClick={submit}>
        {submitted ? "Application sent ✓" : "Submit application"}
      </button>
      {confirm && (
        <div
          className="sign-confirm show"
          style={
            confirm.kind === "error"
              ? { background: "rgba(200,60,60,0.08)", borderColor: "#c83c3c" }
              : undefined
          }
        >
          {confirm.text}
        </div>
      )}
    </div>
  );
}

const CheckIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="8" stroke="#B08D3E" strokeWidth="1.4" />
    <path d="M5.5 9l2.5 2.5L13 6" stroke="#B08D3E" strokeWidth="1.4" fill="none" />
  </svg>
);

const SERVICES: { title: string; img: string }[] = [
  { title: "Corporate Transportation Service", img: "/images/services/corporate.jpg" },
  { title: "Airport Limo Service", img: "/images/services/airport.jpg" },
  { title: "Business Transportation", img: "/images/services/business.jpg" },
  { title: "Prom & Wine Tours", img: "/images/services/prom-wine.jpg" },
  { title: "Special Events & Occasions", img: "/images/services/events.jpg" },
];

const NAV_LINKS: { href: string; label: string }[] = [
  { href: "#about", label: "About" },
  { href: "#fleet", label: "Fleet" },
  { href: "#services", label: "Services" },
  { href: "#hourly", label: "Hourly rates" },
  { href: "#how", label: "How it works" },
  { href: "#corporate", label: "Corporate" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
  { href: "#drive", label: "Drive with us" },
  { href: "/pay", label: "Pay" },
];

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="announce-bar">Coming soon to more US cities and Dubai</div>
      <header>
        <div className="wrap nav-inner">
          <div className="logo">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <circle cx="13" cy="13" r="12" stroke="#B08D3E" strokeWidth="1.4" />
              <path d="M4 13H22M13 4V22M7 7L19 19M19 7L7 19" stroke="#B08D3E" strokeWidth="0.8" opacity="0.5" />
            </svg>
            Globallink
          </div>
          <nav className="nav-links">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="nav-cta">
            <a href={PHONE_HREF} className="btn btn-outline-dark">
              {PHONE}
            </a>
            <a href="#book" className="btn btn-brass">
              Reserve a car
            </a>
          </div>
          <button
            className="menu-toggle"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
        <div className={`mobile-panel ${menuOpen ? "open" : ""}`}>
          <div className="mobile-panel-inner">
            {NAV_LINKS.map((l) => (
              <a key={l.href} className="mp-link" href={l.href} onClick={() => setMenuOpen(false)}>
                {l.label}
              </a>
            ))}
            <div className="mp-actions">
              <a href={PHONE_HREF} className="btn btn-outline-dark">
                Call {PHONE}
              </a>
              <a href="#book" className="btn btn-brass" onClick={() => setMenuOpen(false)}>
                Reserve a car
              </a>
              <InstallAppButton className="btn btn-outline-dark" />
            </div>
          </div>
        </div>
      </header>

      <section className="hero">
        <svg className="route-motif" viewBox="0 0 1160 620" preserveAspectRatio="none">
          <path
            d="M -20 480 C 200 520, 340 320, 560 360 S 900 220, 1180 260"
            stroke="#B08D3E"
            strokeWidth="1.2"
            strokeDasharray="2 8"
            fill="none"
            opacity="0.55"
          />
          <circle cx="-20" cy="480" r="4" fill="#B08D3E" opacity="0.6" />
          <circle cx="560" cy="360" r="4" fill="#B08D3E" opacity="0.6" />
          <circle cx="1180" cy="260" r="4" fill="#B08D3E" opacity="0.6" />
        </svg>
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow-line">
              <span className="dot" />
              Built for corporate travel and event teams
            </div>
            <h1>The last late driver cost you a meeting. Not this time.</h1>
            <p className="lead">
              One dispatch team for every ride your company books — sedan to coach, invoiced once a
              month.
            </p>
            <div className="hero-actions">
              <div>
                <a href="#book" className="btn btn-brass">
                  Check availability
                </a>
                <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", marginTop: 8 }}>
                  Payment confirms your reservation {"\u00A0·\u00A0"} or{" "}
                  <a
                    href={`mailto:${EMAIL}`}
                    style={{ color: "rgba(255,255,255,0.65)", textDecoration: "underline" }}
                  >
                    email us
                  </a>
                </p>
              </div>
              <a href="#fleet" className="btn btn-outline-dark">
                View the fleet
              </a>
              <a href={PHONE_HREF} className="btn btn-outline-dark">
                Call us: {PHONE}
              </a>
              <a href={`mailto:${EMAIL}`} className="btn btn-outline-dark">
                Email us: {EMAIL}
              </a>
              <InstallAppButton className="btn btn-outline-dark" />

            </div>
            <div className="hero-stats">
              <div>
                <strong>62</strong>
                <span>Bay Area cities &amp; airports</span>
              </div>
              <div>
                <strong>98%</strong>
                <span>on-time pickups</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>live dispatch</span>
              </div>
            </div>
          </div>

          <BookingCard />
        </div>
      </section>

      <section className="promo-video">
        <div className="wrap">
          <div className="section-head">
            <h2>Globallink in motion</h2>
            <p>
              A glimpse of what a Globallink ride feels like — from airport pickup to the final
              drop-off, every trip handled by a vetted chauffeur.
            </p>
          </div>
          <video
            className="promo-video-frame"
            src="/videos/global-link-promo.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            title="Globallink Transportation promo video"
          />
        </div>
      </section>

      <div className="trust">
        <div className="wrap trust-inner">
          <p>
            <strong>98% on-time</strong> across the Bay Area — SFO, OAK and SJC included
          </p>
          <p>Fixed pricing {"\u00A0·\u00A0"} One monthly invoice</p>
        </div>
      </div>

      <section className="services-band" id="services">
        <div className="wrap">
          <div className="section-head">
            <h2>Our Services</h2>
            <p>We offer a wide range of luxury vehicles to suit every need.</p>
          </div>
          <div className="services-grid">
            {SERVICES.map((svc) => (
              <div className="service-card" key={svc.title}>
                <h3>{svc.title}</h3>
                <img src={svc.img} alt={svc.title} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="section-head">
            <h2>Booking rides for a team isn't a car problem. It's a trust problem.</h2>
            <p>
              Every time you book a driver for a colleague or a guest, you're betting on something
              you don't control: will they show up on time, in a clean car, and will you get one
              clear bill at month's end — or twenty scattered receipts?
            </p>
          </div>
          <div className="problem-grid">
            <div className="problem-item">
              <div className="tag">Time</div>
              <h3>Every ride, coordinated by hand</h3>
              <p>
                Switching between apps and unknown drivers for each trip eats the hours it was
                supposed to save.
              </p>
            </div>
            <div className="problem-item">
              <div className="tag">Budget control</div>
              <h3>Receipts, not reporting</h3>
              <p>
                Dozens of scattered charges with no cost center make travel spend nearly impossible
                to reconcile.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <div className="wrap">
          <div className="about-inner">
            <h2>Transportation you stop having to think about</h2>
            <p>
              Globallink isn't another ride-booking app. We're a full transportation coordination
              team — one unified fleet, individually vetted licensed chauffeurs, and support that
              answers as a person, not a routing bot.
            </p>
            <p>
              We started because travel managers and event planners were coordinating every ride by
              hand: one driver here, one invoice there, no guarantee on either. Today, we're the one
              team your company needs for every kind of trip across the Bay Area — San Francisco,
              Oakland, San Jose and the Peninsula, plus SFO, OAK and SJC — on a single invoice that
              ties it all together.
            </p>
          </div>
        </div>
      </section>

      <section id="fleet">
        <div className="wrap">
          <div className="section-head">
            <h2>Choose your ride</h2>
            <p>
              Five vehicle classes, each with its own vetted chauffeur pool — from a single airport
              transfer to a fifty-person conference shuttle.
            </p>
          </div>

          <div className="fleet-row">
            <div className="fleet-card">
              <div className="icon-box">
                <svg width="48" height="30" viewBox="0 0 48 30" fill="none">
                  <path d="M4 22 L7 12 Q10 8 16 8 H30 Q36 8 39 12 L44 22" stroke="#0F1B2D" strokeWidth="1.6" fill="none" />
                  <rect x="2" y="20" width="44" height="6" rx="2" stroke="#0F1B2D" strokeWidth="1.6" fill="none" />
                  <circle cx="13" cy="26" r="3" stroke="#0F1B2D" strokeWidth="1.6" fill="#F6F4EF" />
                  <circle cx="35" cy="26" r="3" stroke="#0F1B2D" strokeWidth="1.6" fill="#F6F4EF" />
                </svg>
              </div>
              <h3>Sedan</h3>
              <p className="desc">Airport runs and single meetings, understated and quick.</p>
              <div className="meta">Up to 3 passengers, 2 bags</div>
            </div>

            <div className="fleet-card">
              <div className="icon-box">
                <svg width="48" height="30" viewBox="0 0 48 30" fill="none">
                  <path d="M4 22 L6 10 Q8 7 14 7 H32 Q38 7 41 12 L44 22" stroke="#0F1B2D" strokeWidth="1.6" fill="none" />
                  <rect x="2" y="20" width="44" height="6" rx="2" stroke="#0F1B2D" strokeWidth="1.6" fill="none" />
                  <circle cx="13" cy="26" r="3" stroke="#0F1B2D" strokeWidth="1.6" fill="#F6F4EF" />
                  <circle cx="35" cy="26" r="3" stroke="#0F1B2D" strokeWidth="1.6" fill="#F6F4EF" />
                </svg>
              </div>
              <h3>SUV</h3>
              <p className="desc">Small teams, extra luggage, or a more commanding presence.</p>
              <div className="meta">Up to 5 passengers, 4 bags</div>
            </div>

            <div className="fleet-card">
              <div className="icon-box">
                <svg width="48" height="30" viewBox="0 0 48 30" fill="none">
                  <path d="M2 22 L4 13 Q6 9 12 9 H20 L23 8 H30 Q33 8 34 11 L36 13 Q40 13 42 17 L46 22" stroke="#0F1B2D" strokeWidth="1.6" fill="none" />
                  <rect x="1" y="20" width="46" height="6" rx="2" stroke="#0F1B2D" strokeWidth="1.6" fill="none" />
                  <circle cx="11" cy="26" r="3" stroke="#0F1B2D" strokeWidth="1.6" fill="#F6F4EF" />
                  <circle cx="37" cy="26" r="3" stroke="#0F1B2D" strokeWidth="1.6" fill="#F6F4EF" />
                </svg>
              </div>
              <h3>Limousine</h3>
              <p className="desc">Weddings, galas and VIP arrivals that call for an entrance.</p>
              <div className="meta">Up to 6 passengers</div>
            </div>

            <div className="fleet-card">
              <div className="icon-box">
                <svg width="48" height="30" viewBox="0 0 48 30" fill="none">
                  <path d="M3 22 V11 Q3 8 6 8 H40 Q45 8 45 13 V22" stroke="#0F1B2D" strokeWidth="1.6" fill="none" />
                  <rect x="2" y="20" width="44" height="6" rx="2" stroke="#0F1B2D" strokeWidth="1.6" fill="none" />
                  <line x1="18" y1="8" x2="18" y2="20" stroke="#0F1B2D" strokeWidth="1.2" />
                  <line x1="30" y1="8" x2="30" y2="20" stroke="#0F1B2D" strokeWidth="1.2" />
                  <circle cx="12" cy="26" r="3" stroke="#0F1B2D" strokeWidth="1.6" fill="#F6F4EF" />
                  <circle cx="37" cy="26" r="3" stroke="#0F1B2D" strokeWidth="1.6" fill="#F6F4EF" />
                </svg>
              </div>
              <h3>Sprinter van</h3>
              <p className="desc">Group transfers, roadshows and full teams travelling together.</p>
              <div className="meta">Up to 14 passengers</div>
            </div>

            <div className="fleet-card">
              <div className="icon-box">
                <svg width="48" height="30" viewBox="0 0 48 30" fill="none">
                  <rect x="2" y="8" width="44" height="14" rx="3" stroke="#0F1B2D" strokeWidth="1.6" fill="none" />
                  <line x1="12" y1="8" x2="12" y2="22" stroke="#0F1B2D" strokeWidth="1.2" />
                  <line x1="22" y1="8" x2="22" y2="22" stroke="#0F1B2D" strokeWidth="1.2" />
                  <line x1="32" y1="8" x2="32" y2="22" stroke="#0F1B2D" strokeWidth="1.2" />
                  <circle cx="11" cy="26" r="3" stroke="#0F1B2D" strokeWidth="1.6" fill="#F6F4EF" />
                  <circle cx="37" cy="26" r="3" stroke="#0F1B2D" strokeWidth="1.6" fill="#F6F4EF" />
                </svg>
              </div>
              <h3>Bus &amp; coach</h3>
              <p className="desc">Conferences and large events, arriving on one schedule.</p>
              <div className="meta">Up to 56 passengers</div>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing" id="hourly">
        <div className="wrap pricing-grid">
          <div className="pricing-copy">
            <h2>Need the car to wait? Book by the hour.</h2>
            <p>
              For roadshows, city tours, or a day where your schedule keeps shifting, your chauffeur
              and vehicle stay with you — no re-booking between stops, no separate fare for each
              leg.
            </p>
            <p>
              Hourly bookings have a{" "}
              <strong style={{ color: "var(--charcoal)" }}>4-hour minimum</strong>. After that,
              you're billed in 30-minute increments at the same rate.
            </p>
            <p className="note">Get your hourly rate now — no commitment.</p>
          </div>
          <div className="price-card">
            <div className="price-row"><span className="name">Sedan</span><span className="leader" /><span className="amount">$85/hr</span></div>
            <div className="price-row"><span className="name">SUV</span><span className="leader" /><span className="amount">$120/hr</span></div>
            <div className="price-row"><span className="name">Limousine</span><span className="leader" /><span className="amount">$120/hr</span></div>
            <div className="price-row"><span className="name">Sprinter van</span><span className="leader" /><span className="amount">$175/hr</span></div>
            <div className="price-row"><span className="name">Bus &amp; coach</span><span className="leader" /><span className="amount">Custom quote</span></div>
            <a href="#book" className="btn btn-brass">Book by the hour</a>
            <p className="disclaimer">4-hour minimum {"\u00A0·\u00A0"} Same chauffeur, all day</p>
          </div>
        </div>
      </section>

      <section className="steps" id="how">
        <div className="wrap">
          <div className="section-head">
            <h2>How a reservation works</h2>
            <p>Two steps, handled by a person, not just software.</p>
          </div>
          <div className="step-grid">
            <div className="step">
              <div className="num">01</div>
              <h3>Tell us where and when</h3>
              <p>
                Enter your pickup, destination and vehicle class. Group or recurring trips can be
                arranged directly with dispatch.
              </p>
            </div>
            <div className="step">
              <div className="num">02</div>
              <h3>We confirm your chauffeur</h3>
              <p>
                A dispatcher assigns a licensed, background-checked driver and sends confirmation
                with their name and photo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="section-head">
            <h2>One dispatch team, for every ride your company books</h2>
            <p>
              Instead of switching between apps and unfamiliar drivers, your team gets a single
              fleet — sedan to coach — with licensed, background-checked chauffeurs. Booking takes a
              minute; the worrying stops.
            </p>
          </div>
          <div className="usp-grid">
            <div className="usp">
              <div className="icon-box">
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                  <circle cx="17" cy="17" r="14" stroke="#B08D3E" strokeWidth="1.6" />
                  <text x="17" y="22" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="14" fill="#B08D3E">$</text>
                </svg>
              </div>
              <h3>Fixed pricing</h3>
              <p>Your fare is confirmed at booking. No surge, no meter, no surprises on arrival.</p>
            </div>
            <div className="usp">
              <div className="icon-box">
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                  <path d="M17 4 L28 9 V17 C28 24 23 28 17 30 C11 28 6 24 6 17 V9 Z" stroke="#B08D3E" strokeWidth="1.6" fill="none" />
                </svg>
              </div>
              <h3>Licensed &amp; vetted</h3>
              <p>Every chauffeur passes a background check and a driving record review before their first trip.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials" id="reviews">
        <div className="wrap">
          <div className="section-head">
            <h2>What riders say</h2>
          </div>
          <div className="test-grid">
            <div className="test-card">
              <p className="quote">"Every chauffeur showed up early for our three-day roadshow across four cities. Not one delay."</p>
              <div className="who"><strong>Priya N.</strong>Event planner, London</div>
            </div>
            <div className="test-card">
              <p className="quote">"We moved our whole travel program to Globallink for the invoicing alone. The service held up just as well."</p>
              <div className="who"><strong>Daniel R.</strong>COO, fintech startup</div>
            </div>
            <div className="test-card">
              <p className="quote">"The limousine arrived exactly on time and the driver knew the venue better than our own coordinator did."</p>
              <div className="who"><strong>Marisol T.</strong>Wedding client</div>
            </div>
          </div>
        </div>
      </section>

      <div className="corporate-wrap">
        <div className="corporate" id="corporate">
          <div>
            <h2>Managing travel for a team or event?</h2>
            <p>Get a dedicated account manager, volume rates, and a single invoice for every ride across the Bay Area.</p>
          </div>
          <div>
            <a href="#book" className="btn btn-brass">Talk to our team</a>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", marginTop: 10, textAlign: "center" }}>
              or{" "}
              <a href={PHONE_HREF} style={{ color: "rgba(255,255,255,0.75)", textDecoration: "underline" }}>call us</a>
              {" \u00A0·\u00A0 "}
              <a href={`mailto:${EMAIL}`} style={{ color: "rgba(255,255,255,0.75)", textDecoration: "underline" }}>email us</a>
            </p>
          </div>
        </div>
      </div>

      <section id="faq">
        <div className="wrap">
          <div className="section-head">
            <h2>Questions before you book</h2>
          </div>
          <div className="faq-list">
            {FAQS.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="wrap">
          <h2>Wherever you're headed next, a car is ready.</h2>
          <a href="#book" className="btn btn-outline-light">Book now</a>
          <p style={{ fontSize: 13, color: "rgba(15,27,45,0.65)", marginTop: 16 }}>
            Support available 24/7 {"\u00A0·\u00A0"} or{" "}
            <a href={PHONE_HREF} style={{ color: "var(--ink)", textDecoration: "underline" }}>call us</a>
            {" \u00A0·\u00A0 "}
            <a href={`mailto:${EMAIL}`} style={{ color: "var(--ink)", textDecoration: "underline" }}>email us</a>
          </p>
        </div>
      </section>

      <section id="drive">
        <div className="wrap" style={{ maxWidth: 720 }}>
          <div className="section-head">
            <h2>Drive with Globallink</h2>
            <p>
              We're always looking for professional chauffeurs across the Bay Area. Here's what it
              takes to join the fleet.
            </p>
          </div>

          <div className="drive-req">
            {DRIVE_REQS.map((r) => (
              <div className="drive-req-item" key={r}>
                {CheckIcon}
                {r}
              </div>
            ))}
          </div>

          <DriveForm />
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <div className="foot-logo">Globallink</div>
              <p style={{ maxWidth: 260, fontSize: 14 }}>
                Chauffeured sedans, SUVs, limousines, sprinter vans and coaches across the Bay Area,
                including SFO, OAK and SJC.
              </p>
            </div>
            <div>
              <h4>Company</h4>
              <ul>
                <li><a href="#fleet">Fleet</a></li>
                <li><a href="#how">How it works</a></li>
                <li><a href="#corporate">Corporate</a></li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#book">Rental agreement</a></li>
                <li><a href="/pay">Pay your reservation</a></li>
              </ul>
            </div>
            <div>
              <h4>Contact</h4>
              <ul>
                <li>{PHONE}</li>
                <li>{EMAIL}</li>
                <li>Available 24/7</li>
              </ul>
            </div>
            <div>
              <h4>Follow</h4>
              <ul>
                <li><a href="https://www.instagram.com/global.link1" target="_blank" rel="noopener">Instagram</a></li>
                <li><a href="https://www.linkedin.com/company/global-link-transportation" target="_blank" rel="noopener">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 Globallink Transportation. All rights reserved.</span>
            <span>
              Licensed for-hire chauffeur network {"\u00A0·\u00A0"}{" "}
              <a href="#drive" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "underline" }}>
                Drive with us
              </a>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
