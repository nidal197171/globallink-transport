/* Globallink Transportation service worker.
 * Minimal by design: its presence (with a fetch handler) satisfies PWA
 * installability so visitors can install the site as an app.
 * Currently a network passthrough — no offline caching yet. */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Passthrough: required for installability, falls back to default network behavior.
self.addEventListener("fetch", () => {});
