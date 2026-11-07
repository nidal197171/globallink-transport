import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SiteHeader, SiteFooter } from "./SiteChrome";
import {
  BOLD_TERMS,
  CANONICAL_NAP,
  HOURLY_RATES_FACT_SHEET,
  SERVICE_PAGES,
  type ServicePageData,
  type ServicePath,
} from "@/data/service-pages";

const keywordPattern = new RegExp(`\\b(${[...BOLD_TERMS].sort((a, b) => b.length - a.length).join("|")})(?:s)?\\b`, "gi");

function KeywordText({ text }: { text: string }) {
  const nodes = [];
  let position = 0;
  for (const match of text.matchAll(keywordPattern)) {
    const start = match.index;
    nodes.push(text.slice(position, start));
    nodes.push(<strong key={start}>{match[0]}</strong>);
    position = start + match[0].length;
  }
  nodes.push(text.slice(position));
  return <>{nodes}</>;
}

export function ServicePage({ path }: { path: ServicePath }) {
  const service: ServicePageData = SERVICE_PAGES[path];
  return (
    <>
      <SiteHeader />
      <main className="service-page">
        <section className="service-cover">
          <img src={service.image} alt={service.alt} fetchPriority="high" />
          <div className="wrap service-cover-content">
            <span className="service-brand">Global Link Transportation</span>
            <h1>{service.h1}</h1>
            <Button asChild className="btn btn-brass service-book"><Link to="/" hash="book">Book Now</Link></Button>
          </div>
        </section>
        <section className="service-copy" aria-label={service.h1}>
          <div className="wrap service-copy-inner">
            {service.paragraphs.map((paragraph, index) => <p key={index}><KeywordText text={paragraph} /></p>)}
            <Button asChild className="btn btn-brass service-book"><Link to="/" hash="book">Book Now</Link></Button>
          </div>
        </section>
        <section className="service-rates" aria-label="Hourly chauffeur rates">
          <div className="wrap service-rates-inner">
            <h2>Hourly chauffeur rates</h2>
            <p>Chauffeur service is booked by the hour, with a 4-hour minimum on hourly bookings. Get an instant quote for your trip on the homepage.</p>
            <table>
              <thead>
                <tr><th scope="col">Vehicle</th><th scope="col">Hourly rate</th></tr>
              </thead>
              <tbody>
                {HOURLY_RATES_FACT_SHEET.map((row) => (
                  <tr key={row.label}><td>{row.label}</td><td>${row.rate} / hour</td></tr>
                ))}
              </tbody>
            </table>
            <p className="service-rates-note">A 20% gratuity, 10% fuel surcharge and 5% booking fee are added at checkout. Airport transfers are quoted instantly — no surge pricing, ever.</p>
          </div>
        </section>
        {service.faqs && service.faqs.length > 0 && (
          <section className="service-faqs" aria-label="Frequently asked questions">
            <div className="wrap service-faqs-inner">
              <h2>Frequently asked questions</h2>
              <dl>
                {service.faqs.map((faq) => (
                  <div key={faq.question}>
                    <dt>{faq.question}</dt>
                    <dd><KeywordText text={faq.answer} /></dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}
        <section className="service-nap" aria-label="Contact">
          <div className="wrap service-nap-inner">
            <address>{CANONICAL_NAP}</address>
          </div>
        </section>
        <section className="service-related">
          <div className="wrap">
            <h2>More from Global Link</h2>
            <nav aria-label="Other transportation services" className="service-related-links">
              {(Object.keys(SERVICE_PAGES) as ServicePath[]).filter((other) => other !== path).map((other) => (
                <Link key={other} to={other}>{SERVICE_PAGES[other].h1}<span aria-hidden="true">↗</span></Link>
              ))}
            </nav>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}