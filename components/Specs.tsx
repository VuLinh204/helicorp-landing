"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { Gem, Microscope, Zap, Brain } from "lucide-react";

const SPECS = [
  {
    category: "Thiết kế",
    icon: Gem,
    color: "#A78BFA",
    colorLight: "rgba(167,139,250,0.12)",
    items: [
      { label: "Chất liệu", value: "Titan Grade 5", sub: "Aerospace-grade" },
      { label: "Độ dày", value: "2.3mm", sub: "Siêu mỏng nhất thị trường" },
      { label: "Trọng lượng", value: "3.8g", sub: "Size M" },
      { label: "Chỉ số nước", value: "IP68", sub: "Chống nước 50m" },
      { label: "Màu sắc", value: "3 màu", sub: "Black · Silver · Navy" },
      { label: "Kích thước", value: "Size 6–13", sub: "Đường kính 16–22mm" },
    ],
  },
  {
    category: "Cảm biến",
    icon: Microscope,
    color: "#34D399",
    colorLight: "rgba(52,211,153,0.12)",
    items: [
      { label: "Nhịp tim", value: "±1 bpm", sub: "PPG Optical v3 — 1Hz liên tục" },
      { label: "SpO2", value: "±1%", sub: "Red + IR LED — mỗi 30 phút" },
      { label: "Nhiệt độ", value: "0.05°C", sub: "Độ nhạy NTC Sensor" },
      { label: "Gia tốc kế", value: "6-axis IMU", sub: "Bước chân & hoạt động" },
      { label: "HRV", value: "SDNN & rMSSD", sub: "Tự động khi ngủ" },
      { label: "Nhịp thở", value: "RRI-derived", sub: "Gián tiếp qua PPG" },
    ],
  },
  {
    category: "Pin & Kết nối",
    icon: Zap,
    color: "#FBBF24",
    colorLight: "rgba(251,191,36,0.12)",
    items: [
      { label: "Thời lượng pin", value: "7 ngày", sub: "5 ngày chế độ intensive" },
      { label: "Sạc đầy", value: "60 phút", sub: "Wireless charging dock" },
      { label: "Bluetooth", value: "5.3 LE", sub: "Tầm kết nối ~30m" },
      { label: "App", value: "iOS & Android", sub: "iOS 16+ / Android 10+" },
      { label: "Đồng bộ", value: "3 nền tảng", sub: "Apple Health · Google Fit · Strava" },
      { label: "Dung lượng pin", value: "18mAh", sub: "Li-Ion custom form factor" },
    ],
  },
  {
    category: "Phần mềm & AI",
    icon: Brain,
    color: "#60A5FA",
    colorLight: "rgba(96,165,250,0.12)",
    items: [
      { label: "Bộ xử lý", value: "ARM Cortex-M33", sub: "64MHz onboard" },
      { label: "Lưu trữ offline", value: "14 ngày", sub: "Dữ liệu không cần mạng" },
      { label: "AI Sleep Score", value: "94%", sub: "Tương quan polysomnography" },
      { label: "Cập nhật", value: "OTA", sub: "Firmware qua app" },
      { label: "Mã hóa", value: "AES-256", sub: "End-to-end encryption" },
      { label: "Dữ liệu", value: "Vietnam Server", sub: "Có thể xóa bất kỳ lúc nào" },
    ],
  },
];

const COMPARISON = [
  { feature: "Nhịp tim 24/7", aura: true, competitor1: true, competitor2: true },
  { feature: "SpO2 tự động", aura: true, competitor1: true, competitor2: false },
  { feature: "Giấc ngủ AI", aura: true, competitor1: false, competitor2: true },
  { feature: "HRV chính xác cao", aura: true, competitor1: false, competitor2: false },
  { feature: "Nhiệt độ cơ thể", aura: true, competitor1: true, competitor2: false },
  { feature: "2.3mm siêu mỏng", aura: true, competitor1: false, competitor2: false },
  { feature: "Pin 7 ngày", aura: true, competitor1: false, competitor2: true },
  { feature: "IP68 50m", aura: true, competitor1: false, competitor2: true },
];

export function Specs() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (i: number) => {
    setActiveTab(i);
    setAnimKey((k) => k + 1);
  };

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    [headingRef, contentRef, tableRef].forEach((ref) => {
      const el = ref.current;
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              el.classList.add("revealed");
              obs.unobserve(el);
            }
          });
        },
        { threshold: 0.1 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const activeGroup = SPECS[activeTab];

  return (
    <section
      id="specs"
      className="py-28 md:py-36 relative overflow-hidden"
      style={{
        background: isDark
          ? "linear-gradient(180deg, #080F1F 0%, #050B18 100%)"
          : "linear-gradient(180deg, #EFF6FF 0%, #F8FAFC 100%)",
      }}
    >
      {/* Decorative line top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px"
        style={{
          background: isDark
            ? "linear-gradient(90deg, transparent, rgba(6,182,212,0.4), transparent)"
            : "linear-gradient(90deg, transparent, rgba(6,182,212,0.2), transparent)",
        }}
      />

      <div className="container-xl">
        {/* Section header */}
        <div ref={headingRef} className="reveal text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-5"
            style={{
              background: isDark ? "rgba(6,182,212,0.12)" : "rgba(6,182,212,0.08)",
              border: "1px solid rgba(6,182,212,0.2)",
              color: "#22D3EE",
            }}
          >
            ✦ Thông số kỹ thuật
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight mb-5"
            style={{ color: isDark ? "#F1F5F9" : "#0F172A" }}
          >
            Chi tiết được{" "}
            <span className="gradient-text">tính toán kỹ lưỡng</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: "#64748B" }}
          >
            Mỗi thông số của AuraRing được lựa chọn để đảm bảo sự cân bằng hoàn hảo
            giữa hiệu suất đo lường và thời lượng pin — không thỏa hiệp.
          </p>
        </div>

        {/* Tab + Content Panel */}
        <div ref={contentRef} className="reveal mb-16">
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: isDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.8)",
              border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.06)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Tab bar */}
            <div
              className="flex overflow-x-auto"
              style={{
                borderBottom: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
              }}
            >
              {SPECS.map((group, i) => {
                const Icon = group.icon;
                const isActive = i === activeTab;
                return (
                  <button
                    key={group.category}
                    onClick={() => handleTabChange(i)}
                    className="flex items-center gap-2.5 px-6 py-5 whitespace-nowrap font-semibold text-sm transition-all duration-300 flex-1 justify-center relative cursor-pointer select-none"
                    style={{
                      color: isActive ? group.color : isDark ? "#475569" : "#94A3B8",
                      background: isActive
                        ? (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)")
                        : "transparent",
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
                      style={{
                        background: isActive ? group.colorLight : "transparent",
                      }}
                    >
                      <Icon
                        className="w-4 h-4 stroke-[2px]"
                        style={{ color: isActive ? group.color : isDark ? "#475569" : "#94A3B8" }}
                      />
                    </div>
                    {group.category}
                    {/* Active underline */}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t"
                        style={{ background: group.color }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Spec content — key triggers re-animation on tab change */}
            <div key={animKey} className="p-6 md:p-8 animate-tab-enter">
              {/* Active group header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ background: activeGroup.colorLight }}
                >
                  <activeGroup.icon
                    className="w-5 h-5 stroke-[2px]"
                    style={{ color: activeGroup.color }}
                  />
                </div>
                <div>
                  <h3
                    className="font-bold text-lg"
                    style={{ color: isDark ? "#F1F5F9" : "#0F172A" }}
                  >
                    {activeGroup.category}
                  </h3>
                  <p className="text-xs" style={{ color: "#64748B" }}>
                    {activeGroup.items.length} thông số
                  </p>
                </div>
              </div>

              {/* Specs grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {activeGroup.items.map((item, idx) => (
                  <div
                    key={item.label}
                    className="spec-card-enter rounded-2xl p-4 flex flex-col gap-1"
                    style={{
                      background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                      border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.05)",
                      animationDelay: `${idx * 55}ms`,
                    }}
                  >
                    <span
                      className="text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#64748B" }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="text-xl font-bold leading-tight"
                      style={{ color: activeGroup.color }}
                    >
                      {item.value}
                    </span>
                    <span
                      className="text-xs leading-snug"
                      style={{ color: isDark ? "#475569" : "#94A3B8" }}
                    >
                      {item.sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table — redesigned */}
        <div ref={tableRef} className="reveal-scale">
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: isDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.8)",
              border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.06)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Header */}
            <div
              className="px-6 md:px-8 py-6"
              style={{
                borderBottom: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <h3
                className="text-xl font-bold mb-1"
                style={{ color: isDark ? "#F1F5F9" : "#0F172A" }}
              >
                So sánh với đối thủ
              </h3>
              <p className="text-sm" style={{ color: "#64748B" }}>
                AuraRing vs. các nhẫn thông minh phổ biến nhất hiện nay
              </p>
            </div>

            {/* Column headers */}
            <div
              className="grid grid-cols-4 px-6 md:px-8 py-4"
              style={{
                background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
                borderBottom: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <div className="col-span-1" />
              <div className="text-center">
                <span className="text-sm font-bold gradient-text">AuraRing</span>
              </div>
              <div
                className="text-center text-sm font-semibold"
                style={{ color: isDark ? "#475569" : "#94A3B8" }}
              >
                Đối thủ A
              </div>
              <div
                className="text-center text-sm font-semibold"
                style={{ color: isDark ? "#475569" : "#94A3B8" }}
              >
                Đối thủ B
              </div>
            </div>

            {/* Rows */}
            <div className="divide-y" style={{ borderColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}>
              {COMPARISON.map((row, i) => (
                <div
                  key={row.feature}
                  className="grid grid-cols-4 items-center px-6 md:px-8 py-3.5"
                  style={{
                    background: i % 2 === 0 ? "transparent" : (isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)"),
                  }}
                >
                  <span
                    className="text-sm font-medium col-span-1"
                    style={{ color: isDark ? "#CBD5E1" : "#334155" }}
                  >
                    {row.feature}
                  </span>

                  {/* AuraRing — highlighted */}
                  <div className="flex justify-center">
                    <span
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
                      style={{
                        background: row.aura ? "rgba(16,185,129,0.18)" : "rgba(239,68,68,0.08)",
                        color: row.aura ? "#10B981" : "#EF4444",
                        boxShadow: row.aura ? "0 0 14px rgba(16,185,129,0.25)" : "none",
                      }}
                    >
                      {row.aura ? "✓" : "✕"}
                    </span>
                  </div>

                  {/* Competitor 1 */}
                  <div className="flex justify-center">
                    <span
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm"
                      style={{
                        color: row.competitor1
                          ? (isDark ? "#94A3B8" : "#64748B")
                          : (isDark ? "#374151" : "#CBD5E1"),
                      }}
                    >
                      {row.competitor1 ? "✓" : "—"}
                    </span>
                  </div>

                  {/* Competitor 2 */}
                  <div className="flex justify-center">
                    <span
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm"
                      style={{
                        color: row.competitor2
                          ? (isDark ? "#94A3B8" : "#64748B")
                          : (isDark ? "#374151" : "#CBD5E1"),
                      }}
                    >
                      {row.competitor2 ? "✓" : "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer note */}
            <div
              className="px-6 md:px-8 py-4 flex items-center gap-2"
              style={{
                borderTop: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.05)",
                background: isDark ? "rgba(16,185,129,0.04)" : "rgba(16,185,129,0.03)",
              }}
            >
              <span className="text-lg">🏆</span>
              <p className="text-xs font-medium" style={{ color: isDark ? "#34D399" : "#059669" }}>
                AuraRing dẫn đầu 8/8 tiêu chí — không đối thủ nào đạt trên 5/8
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
