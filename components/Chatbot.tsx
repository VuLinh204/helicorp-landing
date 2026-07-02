"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { Bot } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  "Pin AuraRing dùng được bao lâu?",
  "AuraRing đo SpO2 chính xác không?",
  "Nhẫn có chống nước không?",
  "Giá AuraRing bao nhiêu?",
];

function TypingIndicator({ isDark }: { isDark: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, #3B82F6, #6366F1)",
        }}
      >
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div
        className="chat-message-bot flex items-center gap-1.5"
      >
        <div className="flex gap-1 items-center">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full animate-bounce"
              style={{
                background: isDark ? "#475569" : "#94A3B8",
                animationDelay: `${i * 150}ms`,
              }}
            />
          ))}
        </div>
        <span className="text-xs ml-1" style={{ color: isDark ? "#475569" : "#94A3B8" }}>
          Đang soạn trả lời...
        </span>
      </div>
    </div>
  );
}

export function Chatbot() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Xin chào! Tôi là trợ lý AI của AuraRing.\n\nTôi có thể giúp bạn tìm hiểu về tính năng, thông số kỹ thuật, giá cả và cách đặt hàng. Bạn muốn biết gì?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unread, setUnread] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, loading]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
        setUnread(0);
      }, 300);
    }
  }, [open]);

  // Track scroll events
  useEffect(() => {
    const handleScroll = () => {
      const pct = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      if (pct > 0 && pct % 25 === 0) {
        console.log(`[HELICORP Analytics] Scroll depth: ${pct}%`);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function sendMessage(content: string) {
    if (!content.trim() || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    // User behavior tracking
    console.log("[HELICORP Analytics] Chatbot message sent", {
      length: content.length,
      totalMessages: messages.length + 1,
    });

    try {
      const chatHistory = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content.trim(),
          history: chatHistory,
        }),
      });

      if (!res.ok) {
        const errData = (await res.json()) as { error?: string };
        throw new Error(errData.error ?? "Lỗi từ server");
      }

      const data = (await res.json()) as { reply: string };

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      if (!open) setUnread((n) => n + 1);
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "Đã có lỗi xảy ra";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function formatTime(date: Date): string {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="chatbot-widget" aria-label="Chatbot tư vấn AuraRing">
      {/* Chat window */}
      <div
        ref={chatRef}
        className="absolute bottom-16 right-0 w-80 sm:w-96 rounded-3xl overflow-hidden shadow-2xl
                   transition-all duration-400"
        style={{
          maxHeight: open ? "560px" : "0px",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transform: open ? "translateY(0) scale(1)" : "translateY(16px) scale(0.95)",
          transformOrigin: "bottom right",
          transition: "max-height 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.3s, transform 0.3s",
          background: isDark ? "#0A1628" : "#F8FAFC",
          border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{
            background: "linear-gradient(135deg, #3B82F6, #6366F1)",
          }}
        >
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-white">AuraRing AI</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-xs text-white/70">Trực tuyến — Trả lời ngay</span>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Đóng chatbot"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center
                       text-white transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div
          className="flex flex-col gap-4 p-4 overflow-y-auto"
          style={{
            height: "340px",
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              {msg.role === "assistant" && (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)" }}
                >
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div className="flex flex-col gap-1" style={{ maxWidth: "85%" }}>
                <div
                  className={msg.role === "user" ? "chat-message-user" : "chat-message-bot"}
                  style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}
                >
                  {msg.content}
                </div>
                <span
                  suppressHydrationWarning
                  className="text-[10px] px-1"
                  style={{
                    color: isDark ? "#374151" : "#CBD5E1",
                    textAlign: msg.role === "user" ? "right" : "left",
                  }}
                >
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </div>
          ))}

          {/* Typing indicator (skeleton) */}
          {loading && <TypingIndicator isDark={isDark} />}

          {/* Error */}
          {error && (
            <div
              className="text-xs px-3 py-2 rounded-xl text-center"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#F87171",
              }}
            >
              {error}. Thử lại hoặc{" "}
              <button
                onClick={() => sendMessage(messages[messages.length - 1]?.content ?? "")}
                className="underline"
              >
                gửi lại
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions */}
        {messages.length <= 1 && (
          <div
            className="px-4 pb-2 flex flex-wrap gap-2"
          >
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-xs px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: isDark ? "rgba(59,130,246,0.12)" : "rgba(59,130,246,0.08)",
                  border: "1px solid rgba(59,130,246,0.2)",
                  color: "#60A5FA",
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{
            borderTop: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Hỏi về AuraRing..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="flex-1 bg-transparent text-sm outline-none py-1"
            style={{ color: isDark ? "#F1F5F9" : "#0F172A" }}
            aria-label="Nhập câu hỏi"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
                       disabled:opacity-40 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
            style={{
              background: input.trim()
                ? "linear-gradient(135deg, #3B82F6, #6366F1)"
                : isDark
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.06)",
            }}
            aria-label="Gửi tin nhắn"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Toggle button */}
      <button
        id="chatbot-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Đóng chat" : "Mở chat tư vấn AuraRing"}
        aria-expanded={open}
        className="relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center
                   transition-all duration-300 hover:scale-110 active:scale-95 focus-visible:outline-none
                   focus-visible:ring-2 focus-visible:ring-blue-500"
        style={{
          background: "linear-gradient(135deg, #3B82F6, #6366F1)",
          boxShadow: "0 8px 32px rgba(99,102,241,0.4)",
        }}
      >
        {/* Unread badge */}
        {unread > 0 && !open && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold
                       flex items-center justify-center text-white"
            style={{ background: "#EF4444" }}
          >
            {unread}
          </span>
        )}

        {/* Icon transition */}
        <span
          className="absolute transition-all duration-300"
          style={{
            opacity: open ? 1 : 0,
            transform: open ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.5)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </span>
        <span
          className="absolute transition-all duration-300"
          style={{
            opacity: open ? 0 : 1,
            transform: open ? "rotate(-90deg) scale(0.5)" : "rotate(0deg) scale(1)",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </span>
      </button>
    </div>
  );
}
