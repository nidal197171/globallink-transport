import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/affiliate")({
  head: () => ({
    meta: [
      { title: "Affiliate Partner Sign-Up — Globallink" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Partner with Globallink as an affiliate driver." },
    ],
  }),
  component: AffiliatePage,
});

const EMAIL = "GLtrans10@gmail.com";
const PHONE = "(415) 787-8776";
const PHONE_HREF = "tel:+14157878776";

function AffiliatePage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    vehicles: "",
    notes: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = [
      "New affiliate partner application:",
      "",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email}`,
      `Company: ${form.company || "—"}`,
      `Vehicles (year / make / model): ${form.vehicles}`,
      "",
      "Notes:",
      form.notes || "—",
      "",
      "I confirm my vehicles meet the requirements: model year not older than 5 years, valid PUC and state licenses, and insurance for all vehicles.",
    ].join("\n");
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      `Affiliate application — ${form.name}`
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <>
      <header>
        <div className="wrap nav-inner">
          <a href="/" className="logo">Globallink</a>
          <div className="nav-cta">
            <a className="btn btn-outline-dark" href={PHONE_HREF}>{PHONE}</a>
          </div>
        </div>
      </header>

      <section className="affiliate-hero">
        <div className="wrap">
          <p className="eyebrow-line" style={{ color: "rgba(255,255,255,0.6)" }}>
            <span className="dot" /> Private — affiliate partners
          </p>
          <h1>Drive with Globallink</h1>
          <p className="lead">
            Join our affiliate network and receive pre-booked, pre-paid rides across the Bay Area.
            Review the requirements below, then send us your application.
          </p>
        </div>
      </section>

      <section>
        <div className="wrap affiliate-grid">
          <div>
            <div className="section-head" style={{ marginBottom: 32 }}>
              <h2>Partner requirements</h2>
              <p>All affiliate vehicles and drivers must meet the following standards before joining the network.</p>
            </div>
            <div className="req-list">
              <div className="req-item">
                <span className="req-num">01</span>
                <div>
                  <h3>Vehicle age</h3>
                  <p>Vehicle model year must not exceed 5 years old.</p>
                </div>
              </div>
              <div className="req-item">
                <span className="req-num">02</span>
                <div>
                  <h3>Licensing</h3>
                  <p>Proof of PUC (Public Utilities Commission) permit and all required state licenses.</p>
                </div>
              </div>
              <div className="req-item">
                <span className="req-num">03</span>
                <div>
                  <h3>Insurance</h3>
                  <p>Proof of current commercial insurance for all vehicles.</p>
                </div>
              </div>
            </div>
          </div>

          <form className="booking-form affiliate-form" onSubmit={submit}>
            <h3>Apply to become an affiliate</h3>
            <p className="modal-sub">Your application goes straight to our team by email.</p>
            <div className="bf-grid">
              <input required placeholder="Full name" value={form.name} onChange={set("name")} />
              <input required placeholder="Phone" type="tel" value={form.phone} onChange={set("phone")} />
              <input required placeholder="Email" type="email" value={form.email} onChange={set("email")} />
              <input placeholder="Company (optional)" value={form.company} onChange={set("company")} />
            </div>
            <textarea
              required
              rows={3}
              placeholder="Vehicles — year / make / model (e.g. 2023 Cadillac Escalade)"
              value={form.vehicles}
              onChange={set("vehicles")}
            />
            <textarea
              rows={3}
              placeholder="Anything else we should know? (optional)"
              value={form.notes}
              onChange={set("notes")}
            />
            <button className="btn btn-brass" type="submit" style={{ width: "100%" }}>
              Send application
            </button>
            <p className="fee-note">
              By applying you confirm your vehicles are no more than 5 years old, hold a valid PUC permit
              and state licenses, and carry insurance on all vehicles.
            </p>
          </form>
        </div>
      </section>

      <footer>
        <div className="wrap foot-bottom" style={{ borderTop: "none" }}>
          <span>© {new Date().getFullYear()} Globallink. All rights reserved.</span>
          <span>{PHONE} · {EMAIL}</span>
        </div>
      </footer>
    </>
  );
}
