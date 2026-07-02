"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";

// Stats shown floating in hero
const HERO_STATS = [
  { value: "98%", label: "Độ chính xác SpO2", icon: "💧" },
  { value: "7 ngày", label: "Thời lượng pin", icon: "⚡" },
  { value: "2.3mm", label: "Siêu mỏng", icon: "💍" },
  { value: "24/7", label: "Theo dõi liên tục", icon: "🫀" },
];

export function Hero() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    // Fade in hero elements on mount
    const items = el.querySelectorAll(".hero-animate");
    items.forEach((item, i) => {
      setTimeout(() => {
        (item as HTMLElement).style.opacity = "1";
        (item as HTMLElement).style.transform = "translateY(0)";
      }, 100 + i * 120);
    });
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden mesh-bg pt-20"
      style={{
        background: isDark
          ? "linear-gradient(180deg, #050B18 0%, #0A1628 60%, #050B18 100%)"
          : "linear-gradient(180deg, #EFF6FF 0%, #F8FAFC 60%, #EFF6FF 100%)",
      }}
    >
      {/* Ambient grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? `linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
               linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)`
            : `linear-gradient(rgba(59,130,246,0.06) 1px, transparent 1px),
               linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Radial glow center */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="container-xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left — Copy */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl lg:max-w-none">
            {/* Badge */}
            <div
              className="hero-animate inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase mb-8"
              style={{
                opacity: 0,
                transform: "translateY(20px)",
                transition: "opacity 0.7s, transform 0.7s",
                background: isDark
                  ? "rgba(99,102,241,0.15)"
                  : "rgba(99,102,241,0.08)",
                border: "1px solid rgba(99,102,241,0.3)",
                color: "#818CF8",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Sắp ra mắt — Đặt trước với giá ưu đãi
            </div>

            {/* Heading */}
            <h1
              className="hero-animate text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6"
              style={{
                opacity: 0,
                transform: "translateY(20px)",
                transition: "opacity 0.7s, transform 0.7s",
                color: isDark ? "#F1F5F9" : "#0F172A",
              }}
            >
              Sức khoẻ của bạn,{" "}
              <span className="gradient-text block md:inline">
                ngay trên ngón tay
              </span>
            </h1>

            {/* Sub-heading */}
            <p
              className="hero-animate text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
              style={{
                opacity: 0,
                transform: "translateY(20px)",
                transition: "opacity 0.7s, transform 0.7s",
                color: isDark ? "#94A3B8" : "#475569",
              }}
            >
              <strong className="font-semibold" style={{ color: isDark ? "#CBD5E1" : "#334155" }}>AuraRing</strong> theo dõi nhịp tim, SpO2, giấc ngủ và
              mức năng lượng liên tục 24/7 — trong thiết kế nhẫn titan siêu
              mỏng 2.3mm không cần sạc hàng ngày.
            </p>

            {/* CTA Buttons */}
            <div
              className="hero-animate flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
              style={{
                opacity: 0,
                transform: "translateY(20px)",
                transition: "opacity 0.7s, transform 0.7s",
              }}
            >
              <a
                href="#newsletter"
                id="hero-cta-primary"
                className="btn-primary"
                style={{ fontSize: "16px", padding: "16px 32px" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                Đặt trước ngay
              </a>
              <a
                href="#features"
                id="hero-cta-secondary"
                className="btn-secondary"
                style={{ fontSize: "16px", padding: "16px 32px" }}
              >
                Khám phá tính năng
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Trust indicators */}
            <div
              className="hero-animate flex items-center gap-6 mt-10 pt-10"
              style={{
                opacity: 0,
                transform: "translateY(20px)",
                transition: "opacity 0.7s, transform 0.7s",
                borderTop: isDark
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <div className="flex flex-col">
                <span
                  className="text-2xl font-bold"
                  style={{ color: isDark ? "#F1F5F9" : "#0F172A" }}
                >
                  10,000+
                </span>
                <span className="text-xs" style={{ color: isDark ? "#64748B" : "#94A3B8" }}>
                  người đã đăng ký chờ
                </span>
              </div>
              <div
                className="w-px h-10"
                style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                  <span
                    className="text-sm font-semibold ml-1"
                    style={{ color: isDark ? "#F1F5F9" : "#0F172A" }}
                  >
                    4.9
                  </span>
                </div>
                <span className="text-xs" style={{ color: isDark ? "#64748B" : "#94A3B8" }}>
                  từ 320 beta tester
                </span>
              </div>
            </div>
          </div>

          {/* Right — Product Visual */}
          <div className="flex-1 flex flex-col items-center gap-8 w-full max-w-lg">
            {/* Ring image */}
            <div
              className="hero-animate relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96"
              style={{
                opacity: 0,
                transform: "translateY(20px)",
                transition: "opacity 0.9s, transform 0.9s",
              }}
            >
              {/* Outer glow rings */}
              <div
                className="absolute inset-0 rounded-full animate-pulse-ring"
                style={{
                  background: "radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)",
                }}
              />
              <div
                className="absolute inset-8 rounded-full animate-pulse-ring"
                style={{
                  animationDelay: "1s",
                  background: "radial-gradient(ellipse, rgba(6,182,212,0.12) 0%, transparent 70%)",
                }}
              />

              {/* Product image */}
              <div className="relative w-full h-full animate-float rounded-full overflow-hidden">
                <Image
                  src="/aura-ring-hero.png"
                  alt="AuraRing — Nhẫn thông minh theo dõi sức khỏe của HELICORP"
                  fill
                  sizes="(max-width: 768px) 288px, (max-width: 1024px) 320px, 384px"
                  priority
                  className="object-contain drop-shadow-2xl"
                  style={{
                    filter: isDark
                      ? "drop-shadow(0 0 40px rgba(99,102,241,0.4))"
                      : "drop-shadow(0 8px 32px rgba(99,102,241,0.25))",
                  }}
                />
              </div>
            </div>

            {/* Stat Cards */}
            <div
              className="hero-animate grid grid-cols-2 gap-3 w-full"
              style={{
                opacity: 0,
                transform: "translateY(20px)",
                transition: "opacity 0.7s, transform 0.7s",
              }}
            >
              {HERO_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="glass rounded-2xl px-4 py-4 flex flex-col gap-1.5"
                >
                  <span className="text-xl">{stat.icon}</span>
                  <span
                    className="text-2xl font-bold tracking-tight"
                    style={{ color: isDark ? "#F1F5F9" : "#0F172A" }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="text-xs leading-snug"
                    style={{ color: isDark ? "#64748B" : "#94A3B8" }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce"
        style={{ color: isDark ? "#475569" : "#94A3B8" }}
        aria-hidden="true"
      >
        <span className="text-xs tracking-widest uppercase font-medium">Cuộn xuống</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}
