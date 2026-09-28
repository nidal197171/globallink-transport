import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { ChatEngine, submitChangeRequest, type BotMessage, type ChangeRequest } from "@/lib/chatbot";
import { SITE } from "@/config/site";

interface ChatMsg {
  from: "bot" | "user";
  text: string;
  mailto?: string;
}

const ENGINE_SITE = {
  brandName: SITE.brand.shortName,
  legalName: SITE.brand.legalName,
  phoneDisplay: SITE.contact.phoneDisplay,
  phoneHref: SITE.contact.phoneHref,
  email: SITE.contact.email,
  metro: SITE.market.metro,
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const engineRef = useRef<ChatEngine | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  const pushBot = (msgs: BotMessage[], onDone?: () => void) => {
    if (msgs.length === 0) {
      onDone?.();
      return;
    }
    setTyping(true);
    let i = 0;
    const step = () => {
      const m = msgs[i];
      if (!m) {
        setTyping(false);
        onDone?.();
        return;
      }
      setMessages((prev) => [...prev, { from: "bot", text: m.text }]);
      setQuickReplies(m.quickReplies ?? []);
      i += 1;
      if (i < msgs.length) {
        timersRef.current.push(setTimeout(step, 650));
      } else {
        setTyping(false);
        onDone?.();
      }
    };
    timersRef.current.push(setTimeout(step, 650));
  };

  const openChat = () => {
    setOpen(true);
    if (!started) {
      setStarted(true);
      engineRef.current = new ChatEngine(ENGINE_SITE);
      pushBot(engineRef.current.start().messages);
    }
  };

  /** Always-available escape: wipes the conversation and restarts at the main menu. */
  const resetChat = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setTyping(false);
    setSubmitting(false);
    setMessages([]);
    setQuickReplies([]);
    setInput("");
    engineRef.current = new ChatEngine(ENGINE_SITE);
    pushBot(engineRef.current.start().messages);
  };

  const deliver = (engine: ChatEngine, text: string) => {
    const result = engine.handle(text);
    pushBot(result.messages, () => {
      if (result.submitRequest) finishSubmit(result.submitRequest);
      if (result.navigate) goToBooking();
    });
  };

  const finishSubmit = async (req: ChangeRequest) => {
    setSubmitting(true);
    const res = await submitChangeRequest(req, SITE.contact.email, SITE.brand.shortName);
    setSubmitting(false);
    if (res.ok) {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: `Done — your request is on its way to our team. We'll call you at ${req.phone} shortly. For anything urgent, call ${SITE.contact.phoneDisplay}.`,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: `I couldn't send that automatically — tap below to email us your request instead, and we'll call you back.`,
          mailto: res.mailto,
        },
      ]);
    }
    setQuickReplies(["Get a fare quote", "Call us"]);
  };

  /** Booking actions take the customer to the booking form. */
  const goToBooking = () => {
    setOpen(false);
    if (window.location.pathname === "/") {
      document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#book";
    }
  };

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || typing || submitting) return;
    const engine = engineRef.current;
    if (!engine) return;
    // "Call us" is a shortcut, not chat input.
    if (text.toLowerCase() === "call us") {
      window.location.href = SITE.contact.phoneHref;
      return;
    }
    // Booking chips go straight to the booking form.
    if (text.toLowerCase() === "book a ride" || text.toLowerCase() === "book this ride") {
      setMessages((prev) => [...prev, { from: "user", text }]);
      setQuickReplies([]);
      setInput("");
      goToBooking();
      return;
    }
    setMessages((prev) => [...prev, { from: "user", text }]);
    setQuickReplies([]);
    setInput("");
    deliver(engine, text);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={openChat}
          aria-label={`Chat with ${SITE.brand.shortName}`}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 100,
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "var(--brass)",
            color: "var(--ink)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 28px rgba(0,0,0,0.28)",
          }}
        >
          <MessageCircle size={26} />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-label={`${SITE.brand.shortName} chat`}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 100,
            width: "min(380px, calc(100vw - 32px))",
            height: "min(580px, calc(100dvh - 120px))",
            display: "flex",
            flexDirection: "column",
            background: "#fff",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 18px 60px rgba(0,0,0,0.32)",
            border: "1px solid var(--hairline)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "var(--ink)",
              color: "#fff",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 17 }}>
                {SITE.brand.shortName}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
                Automated assistant · replies instantly
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button
                onClick={resetChat}
                aria-label="Start over"
                title="Start over"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  padding: "6px 10px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                ↺ Start over
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  padding: 8,
                }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={bodyRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              background: "var(--paper)",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  background: m.from === "user" ? "var(--ink)" : "#fff",
                  color: m.from === "user" ? "#fff" : "var(--charcoal)",
                  border: m.from === "user" ? "none" : "1px solid var(--hairline)",
                  borderRadius: 14,
                  borderTopRightRadius: m.from === "user" ? 4 : 14,
                  borderTopLeftRadius: m.from === "user" ? 14 : 4,
                  padding: "10px 13px",
                  fontSize: 14,
                  lineHeight: 1.5,
                  whiteSpace: "pre-line",
                }}
              >
                {m.text}
                {m.mailto && (
                  <a
                    href={m.mailto}
                    style={{
                      display: "inline-block",
                      marginTop: 10,
                      background: "var(--brass)",
                      color: "var(--ink)",
                      fontWeight: 600,
                      fontSize: 13,
                      padding: "10px 16px",
                      borderRadius: 8,
                    }}
                  >
                    Email us your request
                  </a>
                )}
              </div>
            ))}
            {typing && (
              <div
                style={{
                  alignSelf: "flex-start",
                  background: "#fff",
                  border: "1px solid var(--hairline)",
                  borderRadius: 14,
                  padding: "10px 14px",
                  fontSize: 14,
                  color: "var(--steel)",
                }}
              >
                …
              </div>
            )}
            {submitting && (
              <div style={{ alignSelf: "flex-start", fontSize: 13, color: "var(--steel)" }}>
                Sending your request…
              </div>
            )}
          </div>

          {/* Quick replies */}
          {quickReplies.length > 0 && !typing && (
            <div
              style={{
                display: "flex",
                gap: 8,
                padding: "10px 14px 0",
                overflowX: "auto",
                background: "var(--paper)",
                flexShrink: 0,
              }}
            >
              {quickReplies.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  style={{
                    flexShrink: 0,
                    background: "#fff",
                    border: "1px solid var(--brass)",
                    color: "var(--brass-dark)",
                    borderRadius: 999,
                    padding: "8px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            style={{
              display: "flex",
              gap: 8,
              padding: 12,
              background: "#fff",
              borderTop: "1px solid var(--hairline)",
              flexShrink: 0,
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              aria-label="Type your message"
              style={{
                flex: 1,
                border: "1px solid var(--hairline)",
                borderRadius: 10,
                padding: "11px 13px",
                fontSize: 14,
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--brass)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--hairline)")}
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={!input.trim() || typing || submitting}
              style={{
                background: "var(--brass)",
                color: "var(--ink)",
                border: "none",
                borderRadius: 10,
                width: 46,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: !input.trim() || typing || submitting ? 0.5 : 1,
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
