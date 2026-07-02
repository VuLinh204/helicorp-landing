"use client";

import { useState, useRef, useEffect, type FormEvent, type ChangeEvent } from "react";
import { CheckCircle, XCircle, PartyPopper, Sparkles, Check } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface FormState {
  name: string;
  email: string;
  phone: string;
  interest: string;
}

interface ToastState {
  message: string;
  type: "success" | "error";
  visible: boolean;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  if (!phone) return true; // optional
  return /^(\+84|0)[3-9]\d{8}$/.test(phone.replace(/\s/g, ""));
}

function Toast({ state }: { state: ToastState }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`toast ${state.type === "success" ? "toast-success" : "toast-error"} ${
        state.visible ? "show" : ""
      }`}
    >
      <span className="mr-2 inline-flex items-center">{state.type === "success" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}</span>
      {state.message}
    </div>
  );
}

export function NewsletterForm() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    interest: "general",
  });

  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "success",
    visible: false,
  });

  // Scroll animations
  useEffect(() => {
    const refs = [headingRef, formRef];
    const observers: IntersectionObserver[] = [];

    refs.forEach((ref) => {
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

  // User behavior tracking
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log("[HELICORP Analytics] Newsletter section viewed");
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 4000);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function validate(): boolean {
    const newErrors: Partial<FormState> = {};

    if (!form.name.trim()) {
      newErrors.name = "Vui lòng nhập họ và tên";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Tên phải có ít nhất 2 ký tự";
    }

    if (!form.email.trim()) {
      newErrors.email = "Vui lòng nhập địa chỉ email";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (form.phone && !validatePhone(form.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ (VD: 0912345678)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // User behavior tracking
    console.log("[HELICORP Analytics] Form submit attempted", {
      hasPhone: !!form.phone,
      interest: form.interest,
    });

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await res.json()) as { message?: string; error?: string };

      if (!res.ok) {
        showToast(data.error ?? "Đã có lỗi xảy ra. Vui lòng thử lại.", "error");
      } else {
        setSubmitted(true);
        console.log("[HELICORP Analytics] Newsletter signup success", { interest: form.interest });
        showToast(
          data.message ?? "Đăng ký thành công! Chúng tôi sẽ liên hệ sớm.",
          "success"
        );
      }
    } catch {
      showToast("Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.", "error");
    } finally {
      setLoading(false);
    }
  }

  const inputBase = `
    w-full px-4 py-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200
    focus:ring-2 focus:ring-blue-500/50
  `;

  const inputStyle = {
    backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
    color: isDark ? "#F1F5F9" : "#0F172A",
  };

  const inputErrorStyle = {
    ...inputStyle,
    border: "1px solid rgba(239,68,68,0.5)",
  };

  return (
    <section
      id="newsletter"
      ref={sectionRef}
      className="py-20 md:py-24 relative overflow-hidden"
      style={{
        background: isDark
          ? "linear-gradient(180deg, #050B18 0%, #080F1F 100%)"
          : "linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)",
      }}
    >
      {/* Decorative top line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px"
        style={{
          background: isDark
            ? "linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)"
            : "linear-gradient(90deg, transparent, rgba(99,102,241,0.2), transparent)",
        }}
      />

      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(ellipse at 50% 100%, rgba(99,102,241,0.08) 0%, transparent 60%)"
            : "radial-gradient(ellipse at 50% 100%, rgba(99,102,241,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="container-xl relative">
        <div className="max-w-2xl mx-auto">
          {/* Section header */}
          <div ref={headingRef} className="reveal text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-5"
              style={{
                background: isDark ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.08)",
                border: "1px solid rgba(99,102,241,0.2)",
                color: "#818CF8",
              }}
            >
              <Sparkles className="w-3 h-3" /> Đặt trước — Ưu đãi ra mắt
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight mb-5"
              style={{ color: isDark ? "#F1F5F9" : "#0F172A" }}
            >
              Nhận ưu đãi{" "}
              <span className="gradient-text">sớm nhất</span>
            </h2>
            <p
              className="text-lg"
              style={{ color: isDark ? "#64748B" : "#64748B" }}
            >
              Đăng ký danh sách chờ hôm nay — nhận giá ra mắt đặc biệt
              <strong className="font-semibold" style={{ color: isDark ? "#94A3B8" : "#475569" }}>
                {" "}giảm 20%
              </strong>{" "}
              và được vận chuyển trong đợt đầu tiên.
            </p>

            {/* Benefits pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {[
                "Giá ưu đãi 20%",
                "Giao hàng đợt 1",
                "Hỗ trợ 1-1",
                "Bảo hành 2 năm",
              ].map((benefit) => (
                <span
                  key={benefit}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{
                    background: isDark ? "rgba(16,185,129,0.1)" : "rgba(16,185,129,0.08)",
                    border: "1px solid rgba(16,185,129,0.2)",
                    color: "#34D399",
                  }}
                >
                  <Check className="w-3 h-3 flex-shrink-0" />
                  {benefit}
                </span>
              ))}
            </div>
          </div>

          {/* Form card */}
          <div
            ref={formRef}
            className="reveal glass rounded-3xl p-8 md:p-10"
            style={{
              border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
            }}
          >
            {submitted ? (
              /* Success state */
              <div className="flex flex-col items-center gap-6 py-8 text-center animate-scale-in">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-4xl animate-heartbeat"
                  style={{ background: "rgba(16,185,129,0.15)" }}
                >
                  <PartyPopper className="w-10 h-10" style={{ color: "#10B981" }} />
                </div>
                <div>
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ color: isDark ? "#F1F5F9" : "#0F172A" }}
                  >
                    Đăng ký thành công!
                  </h3>
                  <p style={{ color: isDark ? "#64748B" : "#64748B" }}>
                    Chào mừng{" "}
                    <strong style={{ color: isDark ? "#CBD5E1" : "#334155" }}>
                      {form.name}
                    </strong>{" "}
                    đến với danh sách chờ AuraRing. Chúng tôi sẽ gửi
                    thông tin chi tiết về đợt ra mắt tới{" "}
                    <strong style={{ color: isDark ? "#CBD5E1" : "#334155" }}>
                      {form.email}
                    </strong>
                    .
                  </p>
                </div>
                <div className="flex gap-3 flex-wrap justify-center">
                  {["10,234 người đã tham gia", "Đợt ra mắt Q3/2025"].map((txt) => (
                    <span
                      key={txt}
                      className="text-sm px-4 py-2 rounded-full"
                      style={{
                        background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                        color: isDark ? "#94A3B8" : "#64748B",
                      }}
                    >
                      {txt}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-sm underline underline-offset-4 transition-colors"
                  style={{ color: "#60A5FA" }}
                >
                  Đăng ký email khác
                </button>
              </div>
            ) : (
              /* Form */
              <form
                id="newsletter-form"
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-5"
                aria-label="Form đăng ký nhận tin AuraRing"
              >
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="form-name"
                    className="text-sm font-medium"
                    style={{ color: isDark ? "#94A3B8" : "#475569" }}
                  >
                    Họ và tên <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <input
                    id="form-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Nguyễn Văn A"
                    value={form.name}
                    onChange={handleChange}
                    className={inputBase}
                    style={errors.name ? inputErrorStyle : inputStyle}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "error-name" : undefined}
                  />
                  {errors.name && (
                    <span
                      id="error-name"
                      role="alert"
                      className="text-xs"
                      style={{ color: "#F87171" }}
                    >
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Email + Phone row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="form-email"
                      className="text-sm font-medium"
                      style={{ color: isDark ? "#94A3B8" : "#475569" }}
                    >
                      Email <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <input
                      id="form-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="email@example.com"
                      value={form.email}
                      onChange={handleChange}
                      className={inputBase}
                      style={errors.email ? inputErrorStyle : inputStyle}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "error-email" : undefined}
                    />
                    {errors.email && (
                      <span
                        id="error-email"
                        role="alert"
                        className="text-xs"
                        style={{ color: "#F87171" }}
                      >
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="form-phone"
                      className="text-sm font-medium"
                      style={{ color: isDark ? "#94A3B8" : "#475569" }}
                    >
                      Số điện thoại{" "}
                      <span className="text-xs opacity-60">(tuỳ chọn)</span>
                    </label>
                    <input
                      id="form-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="0912 345 678"
                      value={form.phone}
                      onChange={handleChange}
                      className={inputBase}
                      style={errors.phone ? inputErrorStyle : inputStyle}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "error-phone" : undefined}
                    />
                    {errors.phone && (
                      <span
                        id="error-phone"
                        role="alert"
                        className="text-xs"
                        style={{ color: "#F87171" }}
                      >
                        {errors.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Interest select */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="form-interest"
                    className="text-sm font-medium"
                    style={{ color: isDark ? "#94A3B8" : "#475569" }}
                  >
                    Bạn quan tâm nhất đến
                  </label>
                  <select
                    id="form-interest"
                    name="interest"
                    value={form.interest}
                    onChange={handleChange}
                    className={inputBase}
                    style={{
                      ...inputStyle,
                      cursor: "pointer",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748B' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 14px center",
                      backgroundSize: "18px",
                      paddingRight: "44px",
                      appearance: "none" as const,
                    }}
                  >
                    <option value="general">Theo dõi sức khỏe tổng quát</option>
                    <option value="sleep">Cải thiện giấc ngủ</option>
                    <option value="fitness">Hiệu suất thể thao</option>
                    <option value="recovery">Phục hồi & stress</option>
                    <option value="medical">Mục đích y tế / kiểm tra sức khỏe</option>
                  </select>
                </div>

                {/* Submit */}
                <button
                  id="newsletter-submit"
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full mt-2"
                  style={{
                    fontSize: "15px",
                    padding: "15px 28px",
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? (
                    <>
                      <span
                        className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                      />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                      </svg>
                      Đăng ký nhận thông tin
                    </>
                  )}
                </button>

                {/* Privacy note */}
                <p
                  className="text-xs text-center leading-relaxed"
                  style={{ color: isDark ? "#374151" : "#94A3B8" }}
                >
                  Bằng cách đăng ký, bạn đồng ý với{" "}
                  <a
                    href="#"
                    className="underline underline-offset-2 hover:opacity-80 transition-opacity"
                    style={{ color: isDark ? "#475569" : "#64748B" }}
                  >
                    Chính sách bảo mật
                  </a>{" "}
                  của HELICORP. Không spam, huỷ đăng ký bất kỳ lúc nào.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      <Toast state={toast} />
    </section>
  );
}
