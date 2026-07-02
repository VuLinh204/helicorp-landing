"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import { Droplets, Zap, Activity, HeartPulse } from "lucide-react";
import dynamic from "next/dynamic";

const Ring3D = dynamic(() => import("./Ring3D").then((mod) => mod.Ring3D), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-32 h-32 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
    </div>
  ),
});

// Stats shown floating in hero
const HERO_STATS = [
  { value: "7 ngày", label: "Thời lượng pin", icon: Zap, isHero: true },
  { value: "98%", label: "Độ chính xác SpO2", icon: Droplets },
  { value: "2.3mm", label: "Siêu mỏng", icon: Activity },
  { value: "24/7", label: "Theo dõi liên tục", icon: HeartPulse },
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
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden mesh-bg pt-32 pb-20"
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
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 60%)"
            : "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="container-xl relative z-10 flex flex-col items-center">
        {/* Top Header/Copy — Centered */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-12 lg:mb-16">
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
            className="hero-animate text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-8"
            style={{
              opacity: 0,
              transform: "translateY(20px)",
              transition: "opacity 0.7s, transform 0.7s",
              color: isDark ? "#F1F5F9" : "#0F172A",
            }}
          >
            Sức khoẻ của bạn,<br className="hidden md:block" />
            <span className="gradient-text"> ngay trên ngón tay</span>
          </h1>

          {/* Sub-heading */}
          <p
            className="hero-animate text-lg md:text-xl lg:text-2xl leading-relaxed mb-10 max-w-2xl mx-auto"
            style={{
              opacity: 0,
              transform: "translateY(20px)",
              transition: "opacity 0.7s, transform 0.7s",
              color: isDark ? "#94A3B8" : "#475569",
            }}
          >
            <strong className="font-semibold" style={{ color: isDark ? "#CBD5E1" : "#334155" }}>AuraRing</strong> theo dõi nhịp tim, SpO2, giấc ngủ và mức năng lượng liên tục 24/7 — trong thiết kế nhẫn titan siêu mỏng 2.3mm không cần sạc hàng ngày.
          </p>

          {/* CTA Buttons */}
          <div
            className="hero-animate flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center"
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
              style={{ fontSize: "16px", padding: "16px 36px" }}
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
              style={{ fontSize: "16px", padding: "16px 36px" }}
            >
              Khám phá tính năng
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Central Ring Image */}
        <div
          className="hero-animate relative w-64 h-64 md:w-96 md:h-96 lg:w-[480px] lg:h-[480px] my-8 lg:my-12 z-20"
          style={{
            opacity: 0,
            transform: "translateY(20px)",
            transition: "opacity 0.9s, transform 0.9s",
          }}
        >
          {/* Outer glow rings */}
          <div
            className="absolute inset-0 rounded-full animate-pulse-ring pointer-events-none"
            style={{
              background: "radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute inset-8 rounded-full animate-pulse-ring pointer-events-none"
            style={{
              animationDelay: "1s",
              background: "radial-gradient(ellipse, rgba(6,182,212,0.12) 0%, transparent 70%)",
            }}
          />

          {/* Product image with spin and float -> Replaced with 3D Ring */}
          <div className="absolute inset-0">
             <Ring3D />
          </div>
        </div>

        {/* Stat Cards Bento Grid — Horizontal below ring */}
        <div
          className="hero-animate w-full max-w-5xl mx-auto mt-8"
          style={{
            opacity: 0,
            transform: "translateY(20px)",
            transition: "opacity 0.7s, transform 0.7s",
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {HERO_STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="group glass rounded-2xl p-5 md:p-6 flex flex-col justify-between gap-6 relative transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(99,102,241,0.15)]"
                  style={{
                    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                       style={{ background: isDark ? "radial-gradient(circle at top right, rgba(99,102,241,0.12), transparent 70%)" : "radial-gradient(circle at top right, rgba(99,102,241,0.06), transparent 70%)" }}
                  />
                  
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm ${
                    i === 0 
                      ? (isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600') 
                      : (isDark ? 'bg-white/5 text-slate-300' : 'bg-slate-100 text-slate-600')
                  }`}>
                    <Icon className="w-6 h-6 stroke-[2px]" />
                  </div>
                  
                  <div className="flex flex-col gap-1.5 z-10">
                    <span
                      className="text-3xl font-bold tracking-tight tabular-nums"
                      style={{ color: isDark ? "#F1F5F9" : "#0F172A" }}
                    >
                      {stat.value}
                    </span>
                    <span
                      className="text-sm font-medium leading-snug"
                      style={{ color: isDark ? "#94A3B8" : "#64748B" }}
                    >
                      {stat.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce"
        style={{ color: isDark ? "#475569" : "#94A3B8" }}
        aria-hidden="true"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}
