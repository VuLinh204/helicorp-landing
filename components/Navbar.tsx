"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";

const NAV_LINKS = [
  { label: "Tính năng", href: "#features" },
  { label: "Thông số", href: "#specs" },
  { label: "Đặt hàng", href: "#newsletter" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Active section detection
      const sections = ["features", "specs", "newsletter"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(`#${id}`);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const isToggleClick = toggleButtonRef.current?.contains(target);
      const isMenuClick = menuRef.current?.contains(target);

      if (isToggleClick || isMenuClick) {
        return;
      }

      if (headerRef.current && !headerRef.current.contains(target)) {
        setMenuOpen(false);
        return;
      }

      if (menuOpen) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <header
      ref={headerRef}
      id="navbar"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? isDark
            ? "rgba(5, 11, 24, 0.85)"
            : "rgba(248, 250, 252, 0.85)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? isDark
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid rgba(0,0,0,0.06)"
          : "none",
      }}
    >
      <div className="container-xl">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            id="navbar-logo"
            className="flex items-center gap-2.5 group"
            aria-label="HELICORP — Trang chủ"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{
                background: "linear-gradient(135deg, #3B82F6, #6366F1)",
              }}
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
            <div>
              <span
                className="text-lg font-bold tracking-tight"
                style={{
                  color: isDark ? "#F1F5F9" : "#0F172A",
                  fontFamily: "var(--font-inter, Inter, sans-serif)",
                }}
              >
                HELI<span className="gradient-text">CORP</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Điều hướng chính">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                id={`nav-${link.href.replace("#", "")}`}
                className={`nav-link text-sm font-medium transition-colors duration-200 ${
                  activeSection === link.href ? "active" : ""
                }`}
                style={{
                  color:
                    activeSection === link.href
                      ? "#60A5FA"
                      : isDark
                      ? "#94A3B8"
                      : "#475569",
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="#newsletter"
              id="navbar-cta"
              className="hidden md:flex btn-primary text-sm py-2.5 px-5"
              style={{ fontSize: "14px", padding: "10px 20px", borderRadius: "10px" }}
            >
              Đặt trước ngay
            </a>

            {/* Mobile menu button */}
            <button
              ref={toggleButtonRef}
              type="button"
              id="mobile-menu-toggle"
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-colors"
              style={{
                background: isDark
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.06)",
                color: isDark ? "#F1F5F9" : "#0F172A",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((o) => !o);
              }}
              aria-label="Mở menu"
              aria-expanded={menuOpen}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                {menuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        ref={menuRef}
        id="mobile-menu"
        className="md:hidden transition-all duration-300 overflow-hidden"
        style={{
          maxHeight: menuOpen ? "300px" : "0",
          opacity: menuOpen ? 1 : 0,
          background: isDark ? "rgba(5, 11, 24, 0.95)" : "rgba(248, 250, 252, 0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: isDark
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div className="container-xl py-6 flex flex-col gap-5">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-base font-medium transition-colors duration-200"
              style={{ color: isDark ? "#94A3B8" : "#475569" }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#newsletter"
            className="btn-primary w-fit text-sm"
            style={{ fontSize: "14px", padding: "10px 20px", borderRadius: "10px" }}
            onClick={() => setMenuOpen(false)}
          >
            Đặt trước ngay
          </a>
        </div>
      </div>
    </header>
  );
}
