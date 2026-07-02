"use client";

import { useTheme } from "./ThemeProvider";

const FOOTER_LINKS = {
  "Sản phẩm": [
    { label: "Tính năng", href: "#features" },
    { label: "Thông số kỹ thuật", href: "#specs" },
    { label: "So sánh", href: "#specs" },
    { label: "Đặt trước", href: "#newsletter" },
  ],
  "Công ty": [
    { label: "Về HELICORP", href: "#" },
    { label: "Sứ mệnh", href: "#" },
    { label: "Đội ngũ", href: "#" },
    { label: "Tuyển dụng", href: "#" },
  ],
  "Hỗ trợ": [
    { label: "Câu hỏi thường gặp", href: "#" },
    { label: "Chính sách bảo mật", href: "#" },
    { label: "Điều khoản sử dụng", href: "#" },
    { label: "Liên hệ", href: "#" },
  ],
};

const SOCIAL = [
  {
    label: "Facebook",
    href: "#",
    path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
    type: "fill",
  },
  {
    label: "Twitter / X",
    href: "#",
    path: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z",
    type: "fill",
  },
  {
    label: "Instagram",
    href: "#",
    type: "instagram",
  },
];

export function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const year = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="relative overflow-hidden"
      style={{
        background: isDark
          ? "linear-gradient(180deg, #050B18 0%, #030810 100%)"
          : "linear-gradient(180deg, #EFF6FF 0%, #E2EBFF 100%)",
        borderTop: isDark
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid rgba(0,0,0,0.07)",
      }}
    >
      {/* Gradient accent line */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.6) 35%, rgba(6,182,212,0.6) 65%, transparent 100%)",
        }}
      />

      <div className="container-xl" style={{ paddingTop: "72px", paddingBottom: "40px" }}>
        {/* Main grid: brand + 3 link columns */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-14">
          {/* Brand */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                    fill="white"
                    fillOpacity="0.3"
                  />
                  <path
                    d="M12 6C9.24 6 7 8.24 7 11s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"
                    fill="white"
                    fillOpacity="0.6"
                  />
                  <circle cx="12" cy="11" r="2" fill="white" />
                </svg>
              </div>
              <span
                className="text-lg font-bold tracking-tight"
                style={{ color: isDark ? "#F1F5F9" : "#0F172A" }}
              >
                HELI<span className="gradient-text">CORP</span>
              </span>
            </div>

            {/* Tagline */}
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: isDark ? "#64748B" : "#64748B" }}
            >
              <strong
                className="font-semibold block mb-1"
                style={{ color: isDark ? "#94A3B8" : "#475569" }}
              >
                Healthy Living Corporation
              </strong>
              Chúng tôi tin rằng mỗi người đều có quyền hiểu sức khoẻ của mình một cách sâu sắc và chủ động.
            </p>

            {/* Social icons */}
            <div className="flex gap-2.5">
              {SOCIAL.map(({ label, href, type, path }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                    color: isDark ? "#94A3B8" : "#64748B",
                  }}
                >
                  {type === "instagram" ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d={path!} />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} className="lg:col-span-1 min-w-0">
              <h3
                className="text-xs font-bold tracking-widest uppercase mb-5"
                style={{ color: isDark ? "#475569" : "#94A3B8" }}
              >
                {title}
              </h3>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors duration-200 hover:text-indigo-400 cursor-pointer"
                      style={{ color: isDark ? "#94A3B8" : "#475569" }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 pb-4"
          style={{
            borderTop: isDark
              ? "1px solid rgba(255,255,255,0.05)"
              : "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <p
            className="text-xs text-center sm:text-left"
            style={{ color: isDark ? "#475569" : "#94A3B8" }}
          >
            © {year} HELICORP — Healthy Living Corporation. Mọi quyền được bảo lưu.
          </p>

          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span
              className="text-xs"
              style={{ color: isDark ? "#475569" : "#94A3B8" }}
            >
              Tất cả hệ thống hoạt động bình thường
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
