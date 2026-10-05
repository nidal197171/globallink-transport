import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/config/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: `Privacy Policy — ${SITE.brand.legalName}` },
      {
        name: "description",
        content: `${SITE.brand.legalName} privacy policy: how we handle your information.`,
      },
      { property: "og:title", content: `Privacy Policy — ${SITE.brand.legalName}` },
    ],
  }),
  component: PrivacyPage,
});

const EMAIL = SITE.contact.email;

const SECTIONS: { title: string; body: string }[] = [
  {
    title: "Information we collect",
    body: "When you book a ride or contact us, we collect the information you provide: your name, phone number, email address, pickup and drop-off locations, and payment details needed to complete your booking.",
  },
  {
    title: "How we use your information",
    body: "We use your information to arrange your transportation, communicate about your booking, process payments, and improve our service. We do not sell your personal information to third parties.",
  },
  {
    title: "Pinterest integration",
    body: "We use the Pinterest API to publish marketing content (images and videos promoting our services) to our own Pinterest business account. This integration does not collect, store, or process personal information of Pinterest users.",
  },
  {
    title: "Data sharing",
    body: "We share booking details only with the driver assigned to your trip and with payment processors as needed to complete your transaction. We do not share your information for marketing purposes without your consent.",
  },
  {
    title: "Contact",
    body: `For privacy questions, contact us at ${EMAIL}.`,
  },
];

function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm opacity-70 mb-8">Last updated: October 5, 2026</p>
      {SECTIONS.map((s) => (
        <section key={s.title} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{s.title}</h2>
          <p className="leading-relaxed">{s.body}</p>
        </section>
      ))}
    </main>
  );
}
