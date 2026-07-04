"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Chatbot = dynamic(
  () => import("./Chatbot").then((mod) => mod.Chatbot),
  { ssr: false, loading: () => null }
);

export function ChatbotLazy() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = () => setReady(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(load, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = window.setTimeout(load, 1500);
    return () => window.clearTimeout(timer);
  }, []);

  if (!ready) return null;
  return <Chatbot />;
}
