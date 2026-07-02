"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";

import { HeartPulse, Moon, Droplets, Zap, Activity, Thermometer } from "lucide-react";

const FEATURES = [
  {
    id: "heart-rate",
    icon: HeartPulse,
    color: "#EF4444",
    colorLight: "rgba(239,68,68,0.12)",
    title: "Nhịp tim liên tục",
    description:
      "Cảm biến quang học thế hệ mới đo nhịp tim mỗi giây, phát hiện bất thường và cảnh báo ngay lập tức. Độ chính xác 99.5% trong thử nghiệm lâm sàng.",
    metrics: [
      { label: "Độ chính xác", value: 99.5 },
      { label: "Tần suất đo", value: 100 },
    ],
    badge: "PPG Optical v3",
  },
  {
    id: "sleep",
    icon: Moon,
    color: "#8B5CF6",
    colorLight: "rgba(139,92,246,0.12)",
    title: "Phân tích giấc ngủ",
    description:
      "Phân tách từng giai đoạn ngủ (REM, sâu, nông) theo thời gian thực. Đánh giá chất lượng và gợi ý cải thiện thói quen ngủ cá nhân hoá.",
    metrics: [
      { label: "Phát hiện REM", value: 94 },
      { label: "Chính xác giai đoạn", value: 91 },
    ],
    badge: "AI Sleep Scoring",
  },
  {
    id: "spo2",
    icon: Droplets,
    color: "#06B6D4",
    colorLight: "rgba(6,182,212,0.12)",
    title: "Nồng độ oxy SpO2",
    description:
      "Đo SpO2 tự động mỗi 30 phút và theo yêu cầu. Phát hiện giảm oxy khi ngủ — dấu hiệu sớm của chứng ngưng thở khi ngủ.",
    metrics: [
      { label: "Độ chính xác", value: 98 },
      { label: "Độ phân giải", value: 95 },
    ],
    badge: "Red + IR LED",
  },
  {
    id: "energy",
    icon: Zap,
    color: "#F59E0B",
    colorLight: "rgba(245,158,11,0.12)",
    title: "Chỉ số năng lượng",
    description:
      "Tổng hợp dữ liệu từ nhiều cảm biến để tính điểm năng lượng từ 0–100. Biết khi nào nên vận động mạnh, khi nào cần nghỉ phục hồi.",
    metrics: [
      { label: "Tương quan HRV", value: 92 },
      { label: "Dự báo hiệu suất", value: 88 },
    ],
    badge: "HRV + Accel",
  },
  {
    id: "hrv",
    icon: Activity,
    color: "#10B981",
    colorLight: "rgba(16,185,129,0.12)",
    title: "Biến thiên nhịp tim HRV",
    description:
      "HRV là chỉ số nhạy nhất về tình trạng phục hồi. AuraRing đo HRV khi ngủ và tổng hợp xu hướng dài hạn để bạn tối ưu lịch tập.",
    metrics: [
      { label: "Độ nhạy HRV", value: 96 },
      { label: "Tương quan lab", value: 93 },
    ],
    badge: "SDNN & rMSSD",
  },
  {
    id: "temp",
    icon: Thermometer,
    color: "#F97316",
    colorLight: "rgba(249,115,22,0.12)",
    title: "Nhiệt độ cơ thể",
    description:
      "Theo dõi biến động nhiệt độ da theo đêm — chỉ 0.05°C độ nhạy. Phát hiện sốt sớm, theo dõi chu kỳ sinh lý và biến động do stress.",
    metrics: [
      { label: "Độ nhạy (°C)", value: 97 },
      { label: "Độ ổn định", value: 99 },
    ],
    badge: "NTC Sensor 0.05°C",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof FEATURES)[0];
  index: number;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const cardRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("revealed");
            // Animate bars
            setTimeout(() => {
              barsRef.current.forEach((bar, i) => {
                if (bar) {
                  setTimeout(() => {
                    bar.style.width = bar.dataset.width ?? "0%";
                  }, i * 150);
                }
              });
            }, 400);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      id={`feature-${feature.id}`}
      className="reveal glass rounded-3xl p-6 flex flex-col gap-5 group cursor-default
                 hover:border-opacity-20 transition-all duration-300 hover:-translate-y-1"
      style={{
        transitionDelay: `${index * 80}ms`,
        border: isDark
          ? "1px solid rgba(255,255,255,0.07)"
          : "1px solid rgba(0,0,0,0.06)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.boxShadow = `0 16px 48px ${feature.colorLight}, 0 0 0 1px ${feature.color}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Icon + Badge */}
      <div className="flex items-start justify-between">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl
                     transition-transform duration-300 group-hover:scale-110"
          style={{ background: feature.colorLight }}
        >
          <feature.icon className="w-6 h-6 stroke-[2px]" style={{ color: feature.color }} />
        </div>
        <span
          className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full"
          style={{
            background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
            color: feature.color,
          }}
        >
          {feature.badge}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2.5 flex-1">
        <h3
          className="text-lg font-bold"
          style={{ color: isDark ? "#F1F5F9" : "#0F172A" }}
        >
          {feature.title}
        </h3>
        <p
          className="text-sm leading-relaxed flex-1"
          style={{ color: isDark ? "#64748B" : "#64748B" }}
        >
          {feature.description}
        </p>
      </div>

      {/* Metrics bars */}
      <div className="flex flex-col gap-3 pt-2 border-t"
        style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}
      >
        {feature.metrics.map((metric, i) => (
          <div key={metric.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span
                className="text-xs"
                style={{ color: isDark ? "#475569" : "#94A3B8" }}
              >
                {metric.label}
              </span>
              <span
                className="text-xs font-semibold"
                style={{ color: feature.color }}
              >
                {metric.value}%
              </span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{
                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
              }}
            >
              <div
                ref={(el) => {
                  if (el) barsRef.current[i] = el;
                }}
                className="h-full rounded-full stat-bar-fill"
                data-width={`${metric.value}%`}
                style={{
                  width: "0%",
                  background: `linear-gradient(90deg, ${feature.color}99, ${feature.color})`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Features() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const headingRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    [headingRef, imageRef].forEach((ref) => {
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
      id="features"
      className="py-28 md:py-36 relative overflow-hidden"
      style={{
        background: isDark
          ? "linear-gradient(180deg, #050B18 0%, #080F1F 100%)"
          : "linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)",
      }}
    >
      {/* Background accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px"
        style={{
          background: isDark
            ? "linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)"
            : "linear-gradient(90deg, transparent, rgba(99,102,241,0.2), transparent)",
        }}
      />

      <div className="container-xl">
        {/* Section header */}
        <div
          ref={headingRef}
          className="reveal text-center mb-20"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-5"
            style={{
              background: isDark ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.2)",
              color: "#818CF8",
            }}
          >
            ✦ Tính năng
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight mb-5"
            style={{ color: isDark ? "#F1F5F9" : "#0F172A" }}
          >
            Bộ cảm biến{" "}
            <span className="gradient-text">đẳng cấp y tế</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: isDark ? "#64748B" : "#64748B" }}
          >
            6 cảm biến sinh học tích hợp trong một chiếc nhẫn mỏng hơn đồng xu.
            Mỗi thông số đều được kiểm chứng độ chính xác trong điều kiện lâm sàng.
          </p>
        </div>

        {/* Feature image + cards layout */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left sticky product image */}
          <div className="lg:sticky lg:top-28 lg:w-80 xl:w-96 flex-shrink-0 mx-auto lg:mx-0">
            <div ref={imageRef} className="reveal-scale relative">
              <div
                className="rounded-3xl overflow-hidden relative aspect-[4/5]"
                style={{
                  background: isDark
                    ? "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.05))"
                    : "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(6,182,212,0.03))",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.07)"
                    : "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <Image
                  src="/aura-ring-features.png"
                  alt="AuraRing được đeo trên tay — cảm biến sức khỏe hoạt động"
                  fill
                  sizes="(max-width: 1024px) 100vw, 384px"
                  className="object-cover"
                  loading="lazy"
                />
                {/* Overlay badge */}
                <div
                  className="absolute bottom-4 left-4 right-4 glass rounded-2xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                      style={{ background: "rgba(239,68,68,0.15)" }}
                    >
                      <HeartPulse className="w-5 h-5 stroke-[2.5px]" style={{ color: "#EF4444" }} />
                    </div>
                    <div>
                      <div className="text-sm font-bold" style={{ color: "#F1F5F9" }}>
                        72 bpm
                      </div>
                      <div className="text-xs" style={{ color: "#64748B" }}>
                        Nhịp tim hiện tại
                      </div>
                    </div>
                    <div className="ml-auto">
                      <div className="flex gap-0.5 items-end h-6">
                        {[3, 5, 4, 6, 3, 5, 4, 6, 5, 4, 6, 5].map((h, i) => (
                          <div
                            key={i}
                            className="w-1 rounded-sm animate-pulse"
                            style={{
                              height: `${h * 3}px`,
                              background: "#EF4444",
                              animationDelay: `${i * 100}ms`,
                              opacity: 0.7 + (i % 3) * 0.1,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Feature grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map((feature, i) => (
              <FeatureCard key={feature.id} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
