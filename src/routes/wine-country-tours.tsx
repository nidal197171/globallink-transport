import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/services/ServicePage";
import { SERVICE_PAGES } from "@/data/service-pages";

const service = SERVICE_PAGES["/wine-country-tours"];
const url = "https://globallinktransport.com/wine-country-tours";

export const Route = createFileRoute("/wine-country-tours")({
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
  return <ServicePage path="/wine-country-tours" />;
}
