import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SITE } from "@/config/site";
import { ArticleBody, renderInline } from "@/components/ArticleBody";
import { articles, getArticle } from "@/data/articles";
import type { Article } from "@/data/articles/types";

const BASE = "https://globallinktransport.com";

function articleJsonLd(a: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.metaDescription,
    datePublished: a.datePublished,
    mainEntityOfPage: `${BASE}/blog/${a.slug}`,
    author: { "@type": "Organization", name: SITE.brand.legalName, url: BASE },
    publisher: { "@type": "Organization", name: SITE.brand.legalName, url: BASE },
  };
}

function faqJsonLd(a: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: a.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export const Route = createFileRoute("/blog/$slug")({
  beforeLoad: ({ params }) => {
    if (!getArticle(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const a = getArticle(params.slug)!;
    const url = `${BASE}/blog/${a.slug}`;
    return {
      meta: [
        { title: `${a.title} — ${SITE.brand.legalName}` },
        { name: "description", content: a.metaDescription },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.metaDescription },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(articleJsonLd(a)) },
        { type: "application/ld+json", children: JSON.stringify(faqJsonLd(a)) },
      ],
    };
  },
  component: ArticlePage,
});

function relatedArticles(a: Article) {
  const sameCluster = articles.filter((x) => x.slug !== a.slug && x.cluster === a.cluster);
  const rest = articles.filter((x) => x.slug !== a.slug && x.cluster !== a.cluster);
  return [...sameCluster, ...rest].slice(0, 3);
}

function ArticlePage() {
  const { slug } = Route.useParams();
  const a = getArticle(slug)!;
  const related = relatedArticles(a);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="mb-2 text-sm">
        <Link to="/" className="underline underline-offset-2 hover:opacity-80">
          {SITE.brand.legalName}
        </Link>{" "}
        ·{" "}
        <Link to="/blog" className="underline underline-offset-2 hover:opacity-80">
          Blog
        </Link>
      </p>
      <p className="mb-2 text-xs font-semibold tracking-wide uppercase opacity-60">{a.cluster}</p>
      <h1 className="mb-8 text-3xl leading-tight font-bold">{a.title}</h1>

      <ArticleBody blocks={a.blocks} />

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-semibold">Frequently Asked Questions</h2>
        {a.faq.map((f) => (
          <div key={f.q} className="mb-5">
            <h3 className="mb-1 text-lg font-semibold">{f.q}</h3>
            <p className="leading-relaxed">{renderInline(f.a)}</p>
          </div>
        ))}
      </section>

      <section className="mt-12 rounded-lg border border-input p-6">
        <h2 className="mb-2 text-xl font-semibold">Ready when you are</h2>
        <p className="mb-4 leading-relaxed">
          {SITE.brand.legalName} is open 24 hours across the Bay Area, Napa, Sonoma, Monterey, and
          Sacramento. Get an instant quote and book online, or call {SITE.contact.phoneDisplay}.
        </p>
        <p>
          <a
            href="/#book"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Get an instant quote
          </a>
        </p>
      </section>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-semibold">More guides</h2>
          <ul className="space-y-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: r.slug }}
                  className="font-medium text-primary underline underline-offset-2 hover:opacity-80"
                >
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
