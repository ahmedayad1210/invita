"use client";

import { useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Send, X } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { answerWellnessQuery } from "@/lib/invita/wellness-assistant";
import Link from "next/link";

type Message = { role: "user" | "assistant"; text: string; sources?: string[]; book?: string };

const HIDDEN_PREFIXES = ["/admin", "/auth"];

export default function WellnessAssistantWidget() {
  const pathname = usePathname();
  const hidden = HIDDEN_PREFIXES.some((p) => pathname.startsWith(p));
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: isAr
        ? "مرحباً — أسئلتك عن بروتوكولات Invita، السلامة، أو DNA. لا تشخيص طبي."
        : "Hello — ask about Invita protocols, safety, or DNA. No medical diagnosis.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  if (hidden) {
    return null;
  }

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q || loading) return;

    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setLoading(true);

    try {
      const res = await fetch("/api/wellness-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, locale }),
      });
      const json = (await res.json()) as {
        success: boolean;
        data?: { answer: string; sources: string[]; suggestBook?: string };
      };

      if (json.success && json.data) {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            text: json.data!.answer,
            sources: json.data!.sources,
            book: json.data!.suggestBook,
          },
        ]);
      } else {
        const local = answerWellnessQuery(q, locale);
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            text: local.answer,
            sources: local.sources,
            book: local.suggestBook,
          },
        ]);
      }
    } catch {
      const local = answerWellnessQuery(q, locale);
      setMessages((m) => [
        ...m,
        { role: "assistant", text: local.answer, sources: local.sources, book: local.suggestBook },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wellness-assistant">
      {open && (
        <div className="wellness-assistant-panel" role="dialog" aria-label={isAr ? "مساعد العافية" : "Wellness assistant"}>
          <header className="wellness-assistant-header">
            <strong>{isAr ? "مساعد Invita" : "Invita Assistant"}</strong>
            <button type="button" onClick={() => setOpen(false)} aria-label={isAr ? "إغلاق" : "Close"}>
              <X size={18} />
            </button>
          </header>
          <div className="wellness-assistant-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`wellness-assistant-msg wellness-assistant-msg--${msg.role}`}>
                <p>{msg.text}</p>
                {msg.sources && msg.sources.length > 0 && (
                  <p className="wellness-assistant-sources">
                    {isAr ? "المصادر: " : "Sources: "}
                    {msg.sources.join(" · ")}
                  </p>
                )}
                {msg.book && (
                  <Link href={msg.book} className="wellness-assistant-book">
                    {isAr ? "احجز استشارة →" : "Book consultation →"}
                  </Link>
                )}
              </div>
            ))}
            {loading && (
              <p className="wellness-assistant-msg wellness-assistant-msg--assistant">
                {isAr ? "جاري البحث…" : "Searching…"}
              </p>
            )}
          </div>
          <form onSubmit={send} className="wellness-assistant-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isAr ? "اسأل عن NAD+، المناعة…" : "Ask about NAD+, immunity…"}
              aria-label={isAr ? "سؤالك" : "Your question"}
            />
            <button type="submit" disabled={loading || !input.trim()} aria-label={isAr ? "إرسال" : "Send"}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
      <button
        type="button"
        className="wellness-assistant-fab"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={isAr ? "مساعد العافية" : "Wellness assistant"}
      >
        <MessageCircle size={22} />
      </button>
    </div>
  );
}
