import { useEffect, useState } from "react";
import { SITE } from "@/config/site";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /iphone|ipad|ipod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isInstalled(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

/**
 * "Install app" button. On Android/Chrome it triggers the browser's install
 * prompt (beforeinstallprompt). On iPhone (or anywhere the prompt is
 * unavailable) it shows quick instructions instead, since browsers don't
 * allow a site to add itself to the home screen programmatically.
 */
export default function InstallAppButton({ className = "" }: { className?: string }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (isInstalled()) {
      setDone(true);
      return;
    }
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (done) return null;

  const onClick = async () => {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      setDeferred(null);
      if (choice.outcome === "accepted") setDone(true);
      return;
    }
    setHelpOpen(true);
  };

  const ios = isIosDevice();

  return (
    <>
      <button type="button" className={className} onClick={onClick}>
        Install app
      </button>
      {helpOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Install instructions"
          onClick={() => setHelpOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(15,27,45,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--paper)",
              color: "var(--charcoal)",
              borderRadius: 14,
              border: "1px solid var(--hairline)",
              maxWidth: 340,
              width: "100%",
              padding: "20px 22px",
            }}
          >
            <h3 style={{ margin: "0 0 10px", fontSize: 18 }}>Install {SITE.brand.shortName}</h3>
            {ios ? (
              <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.7 }}>
                <li>
                  Tap the <strong>Share</strong> button in Safari.
                </li>
                <li>
                  Choose <strong>Add to Home Screen</strong>.
                </li>
                <li>Tap Add — the app icon appears on your home screen.</li>
              </ol>
            ) : (
              <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.7 }}>
                <li>Open your browser's menu (⋮ or ⋯).</li>
                <li>
                  Choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.
                </li>
                <li>Confirm — the app icon appears on your home screen.</li>
              </ol>
            )}
            <button
              type="button"
              className="btn btn-brass"
              style={{ marginTop: 16, width: "100%" }}
              onClick={() => setHelpOpen(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
