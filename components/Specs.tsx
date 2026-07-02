"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

const SPECS = [
  {
    category: "Thiết kế & Vật liệu",
    icon: "💍",
    items: [
      { label: "Chất liệu", value: "Titan Grade 5 (aerospace)" },
      { label: "Độ dày", value: "2.3mm — siêu mỏng nhất thị trường" },
      { label: "Trọng lượng", value: "3.8g (size M)" },
      { label: "Màu sắc", value: "Midnight Black · Arctic Silver · Deep Navy" },
      { label: "Kích thước", value: "Size 6–13 (US) / 16–22mm (đường kính)" },
      { label: "Chỉ số nước", value: "IP68 — chống nước 50m" },
    ],
  },
  {
    category: "Cảm biến & Đo lường",
    icon: "🔬",
    items: [
      { label: "Nhịp tim", value: "PPG Optical v3 — 1Hz liên tục, ±1 bpm" },
      { label: "SpO2", value: "Red + IR LED — đo mỗi 30 phút, ±1%" },
      { label: "Nhiệt độ", value: "NTC Sensor — độ nhạy 0.05°C" },
      { label: "Gia tốc kế", value: "6-axis IMU — bước chân, hoạt động" },
      { label: "HRV", value: "SDNN & rMSSD — tự động khi ngủ" },
      { label: "Nhịp thở", value: "RRI-derived — gián tiếp qua PPG" },
    ],
  },
  {
    category: "Pin & Kết nối",
    icon: "⚡",
    items: [
      { label: "Dung lượng pin", value: "18mAh Li-Ion (custom form factor)" },
      { label: "Thời lượng", value: "7 ngày (chế độ thường), 5 ngày (intensive)" },
      { label: "Sạc", value: "Wireless dock — đầy trong 60 phút" },
      { label: "Kết nối", value: "Bluetooth 5.3 LE (tầm ~30m)" },
      { label: "App", value: "iOS 16+ / Android 10+" },
      { label: "Đồng bộ", value: "Apple Health · Google Fit · Strava" },
    ],
  },
  {
    category: "Phần mềm & AI",
    icon: "🧠",
    items: [
      { label: "Bộ xử lý onboard", value: "ARM Cortex-M33 @ 64MHz" },
      { label: "Storage", value: "14 ngày dữ liệu offline" },
      { label: "AI Sleep Score", value: "Mô hình học máy — 94% tương quan polysomnography" },
      { label: "Cập nhật", value: "OTA firmware qua app" },
      { label: "Mã hóa", value: "AES-256 end-to-end" },
      { label: "GDPR", value: "Dữ liệu lưu server Vietnam · Có thể xóa bất kỳ lúc nào" },
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

function SpecGroup({
  group,
  delay,
}: {
  group: (typeof SPECS)[0];
  delay: number;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("revealed");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="reveal glass rounded-3xl overflow-hidden"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Group header */}
      <div
        className="px-6 py-4 flex items-center gap-3"
        style={{
          background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
          borderBottom: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <span className="text-2xl">{group.icon}</span>
        <h3
          className="font-bold text-base"
          style={{ color: isDark ? "#CBD5E1" : "#1E293B" }}
        >
          {group.category}
        </h3>
      </div>

      {/* Items */}
      <div className="divide-y"
        style={{ borderColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
      >
        {group.items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 px-6 py-3.5 group
                       hover:bg-white/[0.02] dark:hover:bg-white/[0.02] transition-colors"
          >
            <span
              className="sm:w-40 text-sm font-medium flex-shrink-0"
              style={{ color: isDark ? "#475569" : "#64748B" }}
            >
              {item.label}
            </span>
            <span
              className="text-sm flex-1"
              style={{ color: isDark ? "#CBD5E1" : "#334155" }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Specs() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const headingRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    [headingRef, tableRef].forEach((ref) => {
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
        { threshold: 0.15 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

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
        <div ref={headingRef} className="reveal text-center mb-20">
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
            style={{ color: isDark ? "#64748B" : "#64748B" }}
          >
            Mỗi thông số của AuraRing được lựa chọn để đảm bảo sự cân bằng hoàn hảo
            giữa hiệu suất đo lường và thời lượng pin — không thỏa hiệp.
          </p>
        </div>

        {/* Spec Groups Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          {SPECS.map((group, i) => (
            <SpecGroup key={group.category} group={group} delay={i * 100} />
          ))}
        </div>

        {/* Comparison Table */}
        <div ref={tableRef} className="reveal-scale">
          <div
            className="glass rounded-3xl overflow-hidden"
            style={{
              border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.06)",
            }}
          >
            {/* Table header */}
            <div
              className="px-6 py-5"
              style={{
                borderBottom: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <h3
                className="text-lg font-bold mb-1"
                style={{ color: isDark ? "#F1F5F9" : "#0F172A" }}
              >
                So sánh với đối thủ
              </h3>
              <p className="text-sm" style={{ color: isDark ? "#475569" : "#64748B" }}>
                AuraRing vs. các nhẫn thông minh phổ biến nhất hiện nay
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    style={{
                      background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                      borderBottom: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    <th
                      className="text-left px-6 py-4 text-sm font-semibold"
                      style={{ color: isDark ? "#64748B" : "#94A3B8", width: "40%" }}
                    >
                      Tính năng
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold w-20">
                      <span className="gradient-text">AuraRing</span>
                    </th>
                    <th
                      className="px-6 py-4 text-center text-sm font-semibold w-20"
                      style={{ color: isDark ? "#475569" : "#94A3B8" }}
                    >
                      Đối thủ A
                    </th>
                    <th
                      className="px-6 py-4 text-center text-sm font-semibold w-20"
                      style={{ color: isDark ? "#475569" : "#94A3B8" }}
                    >
                      Đối thủ B
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr
                      key={row.feature}
                      style={{
                        borderBottom:
                          i < COMPARISON.length - 1
                            ? isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(0,0,0,0.04)"
                            : "none",
                        background: i % 2 === 0 ? "transparent" : isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)",
                      }}
                    >
                      <td
                        className="px-6 py-4 text-sm"
                        style={{ color: isDark ? "#94A3B8" : "#475569" }}
                      >
                        {row.feature}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm"
                          style={{
                            background: row.aura ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.1)",
                            color: row.aura ? "#10B981" : "#64748B",
                          }}
                        >
                          {row.aura ? "✓" : "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm"
                          style={{
                            background: row.competitor1 ? "rgba(255,255,255,0.06)" : "transparent",
                            color: row.competitor1 ? (isDark ? "#94A3B8" : "#475569") : (isDark ? "#374151" : "#CBD5E1"),
                          }}
                        >
                          {row.competitor1 ? "✓" : "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm"
                          style={{
                            background: row.competitor2 ? "rgba(255,255,255,0.06)" : "transparent",
                            color: row.competitor2 ? (isDark ? "#94A3B8" : "#475569") : (isDark ? "#374151" : "#CBD5E1"),
                          }}
                        >
                          {row.competitor2 ? "✓" : "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
