# RULE.md — Quy chuẩn dự án AuraRing Landing Page (HELICORP Vòng 2)

File này tổng hợp toàn bộ quy tắc, checklist và bài học đã rút ra trong quá trình làm bài test. AI Agent khi tiếp tục làm việc trên project PHẢI đọc và tuân thủ file này trước khi code bất kỳ phần nào.

---

## 1. BỐI CẢNH DỰ ÁN

- Bài test: Thực tập sinh IT Phát triển Website — HELICORP (Healthy Living Corporation)
- Sản phẩm: **AuraRing** — nhẫn thông minh theo dõi sức khỏe (nhịp tim, giấc ngủ, SpO2, mức năng lượng)
- Stack: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Deploy: Vercel — `https://helicorp-landing-rho.vercel.app/`
- Deadline nộp bài: **18:00 ngày 4/7/2026**

---

## 2. YÊU CẦU BẮT BUỘC CỦA ĐỀ BÀI (không được bỏ)

1. Hero Section, Feature Section, Specs Section, Form đăng ký nhận tin
2. Responsive hoàn hảo Desktop + Mobile, không vỡ layout
3. **Google PageSpeed Insights (Mobile) ≥ 85/100** — đây là điều kiện cứng, ưu tiên cao nhất trong giai đoạn cuối
4. Meta Tags đầy đủ: title, description, Open Graph (og:title, og:description, og:image, og:url), favicon
5. Git quản lý bằng GitHub, repo Public, commit rõ ràng, chia nhánh khoa học
6. Deploy chạy thực tế trên Vercel

### Điểm cộng (đã/đang làm, thứ tự ưu tiên)
1. Chatbot AI tư vấn sản phẩm (Gemini/OpenAI API, qua Next.js API Route để giấu key)
2. Webhook + validate dữ liệu form thực tế
3. Dark Mode
4. Scroll Animation (tiết chế, không lạm dụng)
5. (Nếu còn thời gian) theo dõi hành vi click/scroll, Skeleton Loading

**Bỏ qua nếu hết thời gian:** E-commerce mini, Scrollytelling/Parallax — không đánh đổi lấy chất lượng phần bắt buộc, đặc biệt là điểm PageSpeed.

---

## 3. QUY ƯỚC COMMIT MESSAGE (Conventional Commits)

Cấu trúc: `<type>: <mô tả ngắn gọn, viết thường>`

| Type | Dùng khi |
|---|---|
| `feat` | Thêm tính năng mới |
| `fix` | Sửa lỗi |
| `style` | Chỉnh CSS/giao diện, không đổi logic |
| `refactor` | Tái cấu trúc code, không thêm/sửa tính năng |
| `perf` | Tối ưu hiệu năng (liên quan PageSpeed) |
| `docs` | Cập nhật README, comment |
| `chore` | Việc cấu hình, cài đặt thư viện |
| `build` | Cấu hình build/deploy |

**Quy tắc nhánh:**
- `main` — nhánh production, luôn ổn định, đã deploy
- `dev` — nhánh phát triển chính
- `feat/xxx`, `fix/xxx` — nhánh cho từng việc cụ thể nếu cần

**Lưu ý kỹ thuật khi commit trên máy Windows/PowerShell:**
- Chạy `git config --global user.email` và `user.name` TRƯỚC khi commit lần đầu trên máy mới, nếu không sẽ bị lỗi "Author identity unknown"
- Dán từng lệnh git MỘT DÒNG MỘT, đợi chạy xong rồi mới dán lệnh tiếp theo — tránh dán nhiều dòng liền nhau vì PowerShell dễ dính lệnh gây lỗi cú pháp
- Nếu `git push` báo `src refspec main does not match any` → kiểm tra bằng `git log --oneline`, khả năng cao là nhánh đó CHƯA CÓ COMMIT NÀO, phải commit trước rồi mới push được

---

## 4. QUY TẮC THIẾT KẾ UI/UX

- **Icon:** dùng thư viện icon vector chuẩn (`lucide-react` ưu tiên vì nhẹ, tương thích tốt với Next.js). **TUYỆT ĐỐI KHÔNG dùng emoji làm icon** (💧⚡💍) — bị vỡ/hiển thị ô trống trên nhiều hệ thống, không đồng bộ về style
- Icon phải đồng nhất: cùng size theo cấp độ, cùng stroke-width, cùng theo palette màu của trang — không để icon "trôi nổi" giữa khoảng trắng, nên có container/background riêng
- **Tránh layout đơn điệu:** không để tất cả card cùng kích thước/bố cục giống hệt nhau lặp lại gây nhàm chán. Nên có 1 điểm nhấn chính (hero stat to hơn) + card phụ nhỏ xung quanh, dùng CSS Grid span bất đối xứng
- Thêm chiều sâu thị giác tiết chế: subtle gradient border, glow nhẹ quanh icon, hover micro-interaction (scale 1.02-1.05) — nhưng **không lạm dụng nhiều hiệu ứng cùng lúc** gây rối mắt và ảnh hưởng performance
- Layout bất đối xứng ở desktop nên fallback về grid đơn giản ở mobile, tránh vỡ layout
- Animation khi scroll nên có stagger (xuất hiện lần lượt), không đồng loạt cùng lúc

---

## 5. CHECKLIST TỐI ƯU PAGESPEED (quan trọng nhất giai đoạn cuối)

### Ngưỡng chuẩn cần đạt (Mobile)
| Chỉ số | Ngưỡng tốt | Ghi chú |
|---|---|---|
| Performance score | ≥ 85 | Bắt buộc theo đề bài |
| LCP (Largest Contentful Paint) | < 2.5s | Ảnh/text lớn nhất hiển thị |
| TBT (Total Blocking Time) | < 200ms | JS chặn main thread |
| CLS (Cumulative Layout Shift) | ~0 | Không bị nhảy layout |
| FCP (First Contentful Paint) | < 1.8s | Pixel đầu tiên xuất hiện |

### Bài học đã rút ra — LỖI NGHIÊM TRỌNG cần tránh lặp lại

**⚠️ Lỗi "trắng trang" do hydration/mounted-check sai vị trí:**
Khi làm Dark Mode, kỹ thuật check `mounted` state (để tránh hydration mismatch) CHỈ được áp dụng cho phần tử cụ thể liên quan theme (vd: icon toggle sáng/tối). **TUYỆT ĐỐI KHÔNG được bọc toàn bộ `{children}` ở cấp `layout.tsx` hoặc cấp page trong điều kiện `if (!mounted) return null`** — lỗi này từng khiến LCP tăng vọt từ 4.1s lên 13.6s và filmstrip trắng hoàn toàn 2 khung hình đầu tiên. Luôn kiểm tra kỹ file `layout.tsx` và mọi Context Provider bọc quanh nội dung chính trước khi thêm bất kỳ client-side state check nào ở cấp cao.

**Trước khi sửa bất kỳ vấn đề PageSpeed nào, LUÔN xác định trước:**
1. Phần tử nào đang là LCP element (mở "Bảng chi tiết về LCP" trong báo cáo hoặc dùng Performance tab của DevTools)
2. Đọc kỹ file `layout.tsx`, component Dark Mode, component Chatbot để tìm điều kiện render chặn cả trang
3. Không đoán mò / áp dụng tối ưu chung chung khi chưa xác định nguyên nhân gốc — đặc biệt khi các vấn đề nhỏ lẻ liệt kê trong báo cáo không đủ giải thích cho 1 chỉ số bất thường cao (vd: TBT 29.850ms hoặc LCP 13.6s là mức bất thường, không phải "chưa tối ưu ảnh" thông thường)

### Checklist kỹ thuật cụ thể

- [ ] **Font:** dùng `next/font/google` hoặc `next/font/local` (self-host), không load qua CDN/`<link>` thủ công. Chỉ khai báo đúng font-weight thực sự dùng (vd: chỉ 400 và 700), tránh load toàn bộ dải weight 100-900. Dùng đúng subset (`vietnamese`/`latin`) cần thiết, tránh subset thừa gây file nặng bất thường (từng gặp file font 83.88 KiB bất thường)
- [ ] **Ảnh:** dùng `next/image`, ảnh hero có `priority`, đúng kích thước hiển thị, format WebP/AVIF, `loading="lazy"` cho ảnh dưới fold
- [ ] **Chatbot widget:** lazy-load bằng `next/dynamic` với `ssr: false`, chỉ khởi tạo/gọi API khi user thực sự mở widget — không load/gọi API ngay lúc trang vừa vào
- [ ] **CSS:** không import CSS thừa cho cả trang khi chỉ 1 phần cần; tận dụng code-splitting CSS theo route/component của Next.js
- [ ] **JS cũ/polyfill thừa:** cấu hình `browserslist` trong `package.json` chỉ target trình duyệt hiện đại:
  ```json
  "browserslist": ["> 0.5%", "last 2 versions", "not dead"]
  ```
- [ ] **Forced reflow:** rà soát code JS đọc `offsetWidth/offsetHeight/getBoundingClientRect()` ngay sau khi set style — tách việc đọc/ghi DOM bằng `requestAnimationFrame` nếu có
- [ ] **Vercel Deployment Protection:** kiểm tra trong Vercel Dashboard → Project Settings → Deployment Protection phải TẮT hoặc để Public, nếu không bot PageSpeed không crawl được, gây đo sai

### Quy trình xác minh trước khi báo "đã xong"

1. `npm run build && npm start`
2. Mở Chrome ẩn danh (tránh cache/extension nhiễu)
3. DevTools → Network → throttle "Slow 4G" → Performance tab → record → reload
4. Xác nhận bằng mắt: không có khung hình trắng kéo dài, LCP marker xuất hiện trong ngưỡng hợp lý
5. Chỉ báo hoàn thành sau khi tự đo xác nhận, không suy đoán

---

## 6. QUY TRÌNH GIT PUSH LÊN GITHUB (tham khảo nhanh)

```bash
git config --global user.email "your-email@gmail.com"
git config --global user.name "Vu Ngoc Khanh Linh"

git add -A
git commit -m "chore: mô tả việc vừa làm"
git remote add origin https://github.com/VuLinh204/helicorp-landing.git
git push -u origin main

git checkout -b dev
git push -u origin dev
```

Sau đó mỗi lần code xong 1 phần:
```bash
git add -A
git commit -m "feat: mô tả"
git push
```


---

## 7. TRƯỚC KHI NỘP BÀI — CHECKLIST CUỐI

- [ ] Điểm PageSpeed Insights (Mobile) ≥ 85, đã chụp ảnh màn hình kết quả
- [ ] Repo GitHub đã để **Public**
- [ ] README.md mô tả đầy đủ project, công nghệ, hướng dẫn chạy
- [ ] Link deploy Vercel chạy được thực tế, không lỗi
- [ ] Meta tags đầy đủ (kiểm tra bằng cách xem page source hoặc share thử link lên Facebook/Zalo xem preview)
- [ ] Đã có minh chứng (ảnh/gif) cho các phần điểm cộng đã làm
- [ ] Email nộp bài đúng format: `[TTS IT WEBSITE - HỌ & TÊN - NỘP SẢN PHẨM VÒNG 2]` gửi về `tuyendung@helicorp.vn` trước 18:00 ngày 4/7/2026
