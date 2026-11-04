import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE } from "@/config/site";
import { articles } from "@/data/articles";

const CANONICAL = "https://globallinktransport.com/blog";
const DESCRIPTION =
  "Guides from Global Link Transportation: airport pickups, wine country tours, wedding and corporate car service, real Bay Area rates, and booking tips.";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: `Blog — ${SITE.brand.legalName}` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: `Blog — ${SITE.brand.legalName}` },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
  }),
  component: BlogIndexPage,
});

function BlogIndexPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="mb-2 text-sm">
        <Link to="/" className="underline underline-offset-2 hover:opacity-80">
          {SITE.brand.legalName}
        </Link>
      </p>
      <h1 className="mb-3 text-3xl font-bold">Blog</h1>
      <p className="mb-10 max-w-3xl leading-relaxed opacity-80">
        Practical guides to getting around the Bay Area with a private chauffeur — how airport
        pickups work, what wine country days cost, and how to book the right car for the day.
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        {articles.map((a) => (
          <article key={a.slug} className="rounded-lg border border-input p-5">
            <p className="mb-2 text-xs font-semibold tracking-wide uppercase opacity-60">
              {a.cluster}
            </p>
            <h2 className="mb-2 text-xl leading-snug font-semibold">
              <Link
                to="/blog/$slug"
                params={{ slug: a.slug }}
                className="hover:underline hover:underline-offset-2"
              >
                {a.title}
              </Link>
            </h2>
            <p className="leading-relaxed opacity-80">{a.excerpt}</p>
            <p className="mt-3 text-sm">
              <Link
                to="/blog/$slug"
                params={{ slug: a.slug }}
                className="font-medium text-primary underline underline-offset-2 hover:opacity-80"
              >
                Read the guide
              </Link>
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
