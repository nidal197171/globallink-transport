import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SiteHeader, SiteFooter } from "./SiteChrome";
import { BOLD_TERMS, SERVICE_PAGES, type ServicePath } from "@/data/service-pages";

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
  const service = SERVICE_PAGES[path];
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