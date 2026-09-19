import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/config/site";

export const Route = createFileRoute("/agreement")({
  head: () => ({
    meta: [
      { title: `Rental Agreement — ${SITE.brand.legalName}` },
      {
        name: "description",
        content:
          `${SITE.brand.legalName} rental agreement: passenger responsibilities, cleaning and damage fees, cancellation policy, and payment authorization.`,
      },
      { property: "og:title", content: `Rental Agreement — ${SITE.brand.legalName}` },
      {
        property: "og:description",
        content: `Terms and conditions for rides booked with ${SITE.brand.legalName}.`,
      },
    ],
  }),
  component: AgreementPage,
});

const PHONE = SITE.contact.phoneDisplay;
const PHONE_HREF = "tel:+14157878776";
const EMAIL = SITE.contact.email;

const TERMS: { title: string; body: string }[] = [
  {
    title: "Passenger capacity",
    body: `The maximum capacity of the vehicle is the number of seat belts installed and must not be exceeded unless discussed and agreed upon with ${SITE.brand.legalName} prior to pickup.`,
  },
  {
    title: "Personal belongings",
    body: `${SITE.brand.legalName} is not liable or responsible for anything left in the vehicle. Please check your belongings before exiting.`,
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
    body: "Confirmed reservations are final. No cancellations or refunds once a reservation is confirmed.",
  },
  {
    title: "Surprise pickups",
    body: "If the arrival of the vehicle is meant as a surprise, please indicate this at the time of booking.",
  },
  {
    title: "Payment authorization",
    body: `By signing this agreement, you authorize ${SITE.brand.legalName} to charge your credit card for any unpaid charges such as gratuity, overtime, cleaning charges and damages.`,
  },
];

function AgreementPage() {
  return (
    <>
      <header>
        <div className="wrap nav-inner">
          <a href="/" className="logo">{SITE.brand.shortName}</a>
          <div className="nav-cta">
            <a className="btn btn-outline-dark" href={PHONE_HREF}>{PHONE}</a>
          </div>
        </div>
      </header>

      <section className="agree-doc">
        <div className="wrap agree-wrap">
          <div className="agree-head">
            <p className="eyebrow-line"><span className="dot" /> {SITE.brand.legalName}</p>
            <h1>Rental Agreement</h1>
            <p className="lead">
              This agreement applies to every ride booked with {SITE.brand.legalName} by phone,
              email or online. Please read it before confirming your reservation.
            </p>
            <button className="btn btn-brass agree-print" onClick={() => window.print()}>
              Print / save as PDF
            </button>
          </div>

          <ol className="agree-terms">
            {TERMS.map((t, i) => (
              <li key={t.title}>
                <h3>
                  <span className="agree-num">{String(i + 1).padStart(2, "0")}</span> {t.title}
                </h3>
                <p>{t.body}</p>
              </li>
            ))}
          </ol>

          <div className="agree-fees">
            <div className="agree-fee">
              <h3>Cleaning fees</h3>
              <p>
                A <strong>$600 cleaning fee</strong> applies if the vehicle must be cleaned due to
                someone getting sick in the vehicle.
              </p>
            </div>
            <div className="agree-fee">
              <h3>Damages</h3>
              <p>
                <strong>$25</strong> for any broken glass. Other damage is billed at repair cost.
              </p>
            </div>
            <div className="agree-fee">
              <h3>Additional charges</h3>
              <p>
                A <strong>20% gratuity</strong> and <strong>10% booking fee</strong> are added to all
                reservations. Overtime is billed at the hourly rate of the reserved vehicle.
              </p>
            </div>
          </div>

          <div className="agree-sign">
            <p>I have read, understood and will comply with the provisions stated above.</p>
            <div className="agree-sign-grid">
              <div><span>Name</span></div>
              <div><span>Signature</span></div>
              <div><span>Date</span></div>
              <div><span>Pickup location</span></div>
            </div>
          </div>

          <p className="agree-contact">
            Questions about this agreement? Call <a href={PHONE_HREF}>{PHONE}</a> or email{" "}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
          </p>
        </div>
      </section>

      <footer>
        <div className="wrap foot-bottom" style={{ borderTop: "none" }}>
          <span>© {new Date().getFullYear()} {SITE.brand.legalName}. All rights reserved.</span>
          <span>{PHONE} · {EMAIL}</span>
        </div>
      </footer>
    </>
  );
}
