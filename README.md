# AuraRing — Smart Health Ring Landing Page

Landing page giới thiệu sản phẩm **AuraRing**, nhẫn thông minh theo dõi sức khỏe (nhịp tim, giấc ngủ, SpO2, mức năng lượng). Dự án được thực hiện cho bài test **Vòng 2 - Thực tập sinh IT Phát triển Website** tại HELICORP.

## Công nghệ sử dụng

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** cho styling
- Deploy trên **Vercel**

## Cấu trúc dự án

```
app/            # Route chính (page.tsx, layout.tsx, globals.css)
components/     # Các component UI (Hero, Features, Specs, Form, Chatbot...)
lib/            # Hàm tiện ích, config, gọi API
public/         # Hình ảnh, favicon
```

## Chạy local

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

## Build production

```bash
npm run build
npm start
```

## Tính năng chính

- Hero Section, Feature highlights, Thông số kỹ thuật, Form đăng ký nhận tin
- Responsive đầy đủ Desktop/Mobile
- Tối ưu Performance đạt PageSpeed Insights (Mobile) ≥ 85/100
- Cấu hình Meta Tags đầy đủ (Title, Description, Open Graph)
- Điểm cộng: Chatbot AI tư vấn sản phẩm (Gemini API), Dark Mode, Scroll Animation, Webhook validate dữ liệu form
