import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    // SEO patch-01 (2026-11-06): the Lovable staging host serves a full duplicate
    // of the site — 301 every staging request to the real domain, same path.
    const url = new URL(request.url);
    if (url.hostname.endsWith(".lovable.app")) {
      return new Response(null, {
        status: 301,
        headers: { Location: `https://globallinktransport.com${url.pathname}${url.search}` },
      });
    }
    // SEO (2026-11-12): trailing-slash URLs 200 as duplicates of their
    // slash-less canonicals, so GSC lists them as "Alternate page with
    // proper canonical tag" (validation failed 11/10/26 on all 5 service
    // pages) and the sitemap fed Google the slash variants. 301 every
    // non-root trailing-slash path to its canonical — the sitemap now
    // lists the slash-less URLs too.
    if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
      return new Response(null, {
        status: 301,
        headers: {
          Location: `https://globallinktransport.com${url.pathname.slice(0, -1)}${url.search}`,
        },
      });
    }
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
