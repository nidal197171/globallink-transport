import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/services/ServicePage";
import { SERVICE_PAGES } from "@/data/service-pages";

const service = SERVICE_PAGES["/sfo-to-palo-alto-limo"];
const url = "https://globallinktransport.com/sfo-to-palo-alto-limo";

export const Route = createFileRoute("/sfo-to-palo-alto-limo")({
  head: () => ({
    meta: [
      { title: service.title },
      { name: "description", content: service.description },
      { property: "og:title", content: service.title },
      { property: "og:description", content: service.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: url }],
  }),
  component: Page,
});

function Page() {
  return <ServicePage path="/sfo-to-palo-alto-limo" />;
}
