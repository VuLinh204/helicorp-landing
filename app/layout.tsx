import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://helicorp-landing-rho.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "AuraRing — Nhẫn Thông Minh Theo Dõi Sức Khỏe | HELICORP",
    template: "%s | AuraRing by HELICORP",
  },
  description:
    "AuraRing theo dõi nhịp tim, giấc ngủ, SpO2 và mức năng lượng 24/7. Công nghệ sức khỏe tiên tiến trong thiết kế nhẫn siêu mỏng — chỉ 2.3mm. Bởi HELICORP — Healthy Living Corporation.",
  keywords: [
    "nhẫn thông minh",
    "smart ring",
    "theo dõi sức khỏe",
    "nhịp tim",
    "giấc ngủ",
    "SpO2",
    "AuraRing",
    "HELICORP",
    "Healthy Living",
    "wearable health tracker",
  ],
  authors: [{ name: "HELICORP — Healthy Living Corporation" }],
  creator: "HELICORP",
  publisher: "HELICORP",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: BASE_URL,
    siteName: "AuraRing by HELICORP",
    title: "AuraRing — Nhẫn Thông Minh Theo Dõi Sức Khỏe",
    description:
      "AuraRing theo dõi nhịp tim, giấc ngủ, SpO2 và mức năng lượng 24/7. Công nghệ sức khỏe tiên tiến, thiết kế siêu mỏng 2.3mm. Bởi HELICORP.",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "AuraRing — Nhẫn Thông Minh Theo Dõi Sức Khỏe bởi HELICORP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AuraRing — Nhẫn Thông Minh Theo Dõi Sức Khỏe",
    description:
      "AuraRing theo dõi nhịp tim, giấc ngủ, SpO2 và mức năng lượng 24/7 trong thiết kế nhẫn siêu mỏng.",
    images: ["/og-image.webp"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable} suppressHydrationWarning>
      <head>

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#050B18" />
      </head>
      <body className="min-h-screen antialiased overflow-x-hidden" suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
