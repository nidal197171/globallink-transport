import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/services/ServicePage";
import { SERVICE_PAGES } from "@/data/service-pages";

const service = SERVICE_PAGES["/oakland-limo-service"];
const url = "https://globallinktransport.com/oakland-limo-service";

export const Route = createFileRoute("/oakland-limo-service")({
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
  return <ServicePage path="/oakland-limo-service" />;
}
