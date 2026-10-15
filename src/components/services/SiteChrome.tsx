import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { SITE } from "@/config/site";
import InstallAppButton from "@/components/InstallAppButton";

const SERVICE_NAV: { to: "/sfo-airport-limo" | "/san-francisco-limo-service" | "/corporate-transportation" | "/wedding-limo" | "/wine-country-tours"; label: string }[] = [
  { to: "/sfo-airport-limo", label: "SFO Airport Limo" },
  { to: "/san-francisco-limo-service", label: "San Francisco Limo Service" },
  { to: "/corporate-transportation", label: "Corporate Transportation" },
  { to: "/wedding-limo", label: "Wedding Limo" },
  { to: "/wine-country-tours", label: "Wine Country Tours" },
];

const PHONE = SITE.contact.phoneDisplay;
const PHONE_HREF = SITE.contact.phoneHref;
const EMAIL = SITE.contact.email;

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
];

export function SiteHeader({ home = false }: { home?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (<>
      <div className="disclaimer-bar">
        We are a global ground transportation arranger
        <br />
        <span className="disclaimer-sub">(we are not a limo company)</span>
      </div>
      <div className="announce-bar">Coming soon to more US cities and Dubai</div>
      <header className={home ? undefined : "service-site-header"}>
        <div className="wrap nav-inner">
          <div className="logo">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <circle cx="13" cy="13" r="12" stroke="#B08D3E" strokeWidth="1.4" />
              <path d="M4 13H22M13 4V22M7 7L19 19M19 7L7 19" stroke="#B08D3E" strokeWidth="0.8" opacity="0.5" />
            </svg>
            {SITE.brand.shortName}
          </div>
          <nav className="nav-links">
            <div className="nav-dropdown">
              <button type="button" className="nav-dropdown-toggle" aria-haspopup="true">Our services ▾</button>
              <div className="nav-dropdown-menu">
                {SERVICE_NAV.map((s) => (
                  <Link key={s.to} to={s.to}>{s.label}</Link>
                ))}
              </div>
            </div>
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={home ? l.href : `/${l.href}`}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="nav-cta">
            <a href={PHONE_HREF} className="btn btn-outline-dark">
              {PHONE}
            </a>
            <a href={home ? "#book" : "/#book"} className="btn btn-brass">
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
            <div className="mp-group-label">Our services</div>
            {SERVICE_NAV.map((s) => (
              <Link key={s.to} className="mp-link" to={s.to} onClick={() => setMenuOpen(false)}>
                {s.label}
              </Link>
            ))}
            {NAV_LINKS.map((l) => (
              <a key={l.href} className="mp-link" href={home ? l.href : `/${l.href}`} onClick={() => setMenuOpen(false)}>
                {l.label}
              </a>
            ))}
            <div className="mp-actions">
              <a href={PHONE_HREF} className="btn btn-outline-dark">
                Call {PHONE}
              </a>
              <a href={home ? "#book" : "/#book"} className="btn btn-brass" onClick={() => setMenuOpen(false)}>
                Reserve a car
              </a>
              <InstallAppButton className="btn btn-outline-dark" />
            </div>
          </div>
        </div>
      </header>

  </>);
}

export function SiteFooter({ home = false }: { home?: boolean }) {
  return (
      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <div className="foot-logo">{SITE.brand.shortName}</div>
              <p style={{ maxWidth: 260, fontSize: 14 }}>
                Chauffeured sedans, SUVs, limousines, sprinter vans and coaches across the {SITE.market.metro},
                including {SITE.market.airports}.
              </p>
            </div>
            <div>
              <h4>Company</h4>
              <ul>
                <li>
                  <a href={home ? "#fleet" : "/#fleet"}>Fleet</a>
                </li>
                <li>
                  <a href={home ? "#how" : "/#how"}>How it works</a>
                </li>
                <li>
                  <a href={home ? "#corporate" : "/#corporate"}>Corporate</a>
                </li>
                <li>
                  <a href={home ? "#faq" : "/#faq"}>FAQ</a>
                </li>
                <li>
                  <a href={home ? "#book" : "/#book"}>Rental agreement</a>
                </li>
                <li>
                  <Link to="/pay" search={{}} preload="intent">
                    Custom reservations pay
                  </Link>
                </li>
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
                <li>
                  <a href={SITE.social.instagram} target="_blank" rel="noopener">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href={SITE.social.linkedin} target="_blank" rel="noopener">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 {SITE.brand.legalName}. All rights reserved.</span>
            <span>
              Licensed for-hire chauffeur network {"\u00A0·\u00A0"}{" "}
              <a href={home ? "#drive" : "/#drive"} style={{ color: "rgba(255,255,255,0.7)", textDecoration: "underline" }}>
                Drive with us
              </a>
            </span>
          </div>
        </div>
      </footer>
  );
}
