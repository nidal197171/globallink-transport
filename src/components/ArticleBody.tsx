import type { ReactNode } from "react";
import type { ArticleBlock } from "@/data/articles/types";

/**
 * Renders the tiny inline markup used in article text:
 *   **bold** and [label](/url)
 */
export function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      parts.push(<strong key={i++}>{m[1]}</strong>);
    } else {
      parts.push(
        <a
          key={i++}
          href={m[3]}
          className="font-medium text-primary underline underline-offset-2 hover:opacity-80"
        >
          {m[2]}
        </a>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div>
      {blocks.map((b, i) => {
        switch (b.t) {
          case "h2":
            return (
              <h2 key={i} className="mt-10 mb-3 text-2xl font-semibold">
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="mt-6 mb-2 text-lg font-semibold">
                {b.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={i} className="mb-4 list-disc space-y-1 pl-6 leading-relaxed">
                {b.items.map((item, j) => (
                  <li key={j}>{renderInline(item)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="mb-4 list-decimal space-y-1 pl-6 leading-relaxed">
                {b.items.map((item, j) => (
                  <li key={j}>{renderInline(item)}</li>
                ))}
              </ol>
            );
          default:
            return (
              <p key={i} className="mb-4 leading-relaxed">
                {renderInline(b.text)}
              </p>
            );
        }
      })}
    </div>
  );
}
