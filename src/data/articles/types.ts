/**
 * Blog article data format.
 *
 * Articles are stored as structured blocks (not raw HTML) so they
 * server-render as real text in the page HTML. Inline markup supported
 * inside `text` / `items` strings:
 *   **bold**            -> <strong>
 *   [label](/some-url)  -> <a href="/some-url">
 */

export type ArticleBlock =
  | { t: "p"; text: string }
  | { t: "h2"; text: string }
  | { t: "h3"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] };

export interface ArticleFaq {
  q: string;
  a: string;
}

export interface Article {
  slug: string;
  title: string;
  /** <= 155 characters, used for the meta description tag. */
  metaDescription: string;
  /** One-sentence summary shown on the /blog index. */
  excerpt: string;
  cluster: string;
  keyword: string;
  /** ISO date, e.g. "2026-11-05". */
  datePublished: string;
  blocks: ArticleBlock[];
  faq: ArticleFaq[];
}
