import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/services/ServicePage";
import { SERVICE_PAGES } from "@/data/service-pages";

const service = SERVICE_PAGES["/corporate-transportation"];
const url = "https://globallinktransport.com/corporate-transportation";

export const Route = createFileRoute("/corporate-transportation")({
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
  return <ServicePage path="/corporate-transportation" />;
}
