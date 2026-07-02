import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

interface NewsletterPayload {
  name: string;
  email: string;
  phone?: string;
  interest?: string;
}

const INTEREST_LABELS: Record<string, string> = {
  general: "Theo dõi sức khỏe tổng quát",
  sleep: "Cải thiện giấc ngủ",
  fitness: "Hiệu suất thể thao",
  recovery: "Phục hồi & stress",
  medical: "Mục đích y tế / kiểm tra sức khỏe",
};

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  return /^(\+84|0)[3-9]\d{8}$/.test(phone.replace(/\s/g, ""));
}

function sanitize(str: string): string {
  return str.trim().slice(0, 500);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as NewsletterPayload;

    // --- Validate ---
    const errors: Record<string, string> = {};

    const name = sanitize(body.name ?? "");
    const email = sanitize(body.email ?? "");
    const phone = sanitize(body.phone ?? "");
    const interest = sanitize(body.interest ?? "general");

    if (!name || name.length < 2) {
      errors.name = "Tên phải có ít nhất 2 ký tự";
    }
    if (!email) {
      errors.email = "Email là bắt buộc";
    } else if (!validateEmail(email)) {
      errors.email = "Email không hợp lệ";
    }
    if (phone && !validatePhone(phone)) {
      errors.phone = "Số điện thoại không hợp lệ";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    const interestLabel = INTEREST_LABELS[interest] ?? interest;
    const resendApiKey = process.env.RESEND_API_KEY;
    const ownerEmail = process.env.OWNER_EMAIL;
    const fromEmail = process.env.FROM_EMAIL ?? "AuraRing <onboarding@resend.dev>";

    // --- Send emails via Resend (if configured) ---
    if (resendApiKey && ownerEmail) {
      const resend = new Resend(resendApiKey);

      // 1. Notification email to owner
      const ownerResult = await resend.emails.send({
        from: fromEmail,
        to: ownerEmail,
        subject: `[AuraRing] Đăng ký mới — ${name}`,
        html: `
          <div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;background:#050B18;color:#F1F5F9;padding:32px;border-radius:16px;">
            <h2 style="color:#60A5FA;margin-bottom:24px;">🔔 Đăng ký mới từ landing page</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:10px 0;color:#64748B;width:140px;">Họ và tên</td><td style="padding:10px 0;font-weight:600;">${name}</td></tr>
              <tr><td style="padding:10px 0;color:#64748B;">Email</td><td style="padding:10px 0;"><a href="mailto:${email}" style="color:#60A5FA;">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding:10px 0;color:#64748B;">Điện thoại</td><td style="padding:10px 0;">${phone}</td></tr>` : ""}
              <tr><td style="padding:10px 0;color:#64748B;">Quan tâm đến</td><td style="padding:10px 0;">${interestLabel}</td></tr>
              <tr><td style="padding:10px 0;color:#64748B;">Thời gian</td><td style="padding:10px 0;">${new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</td></tr>
            </table>
            <p style="margin-top:24px;color:#475569;font-size:13px;">Email này được gửi tự động từ AuraRing Landing Page.</p>
          </div>
        `,
      });

      if (ownerResult.error) {
        console.error("[Newsletter API] Owner email error:", ownerResult.error);
      }

      // 2. Confirmation email to subscriber
      const confirmResult = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: "Chào mừng bạn đến với danh sách chờ AuraRing! 🎉",
        html: `
          <div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;background:#050B18;color:#F1F5F9;padding:32px;border-radius:16px;">
            <div style="text-align:center;margin-bottom:32px;">
              <h1 style="font-size:28px;background:linear-gradient(135deg,#60A5FA,#6366F1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin:0;">AuraRing</h1>
              <p style="color:#64748B;margin:8px 0 0;">by HELICORP</p>
            </div>
            <h2 style="color:#F1F5F9;">Đăng ký thành công, ${name}! 🎉</h2>
            <p style="color:#94A3B8;line-height:1.7;">Cảm ơn bạn đã tham gia danh sách chờ AuraRing. Bạn sẽ là một trong những người đầu tiên nhận được:</p>
            <ul style="color:#94A3B8;line-height:2;padding-left:20px;">
              <li>🏷️ <strong style="color:#F1F5F9;">Giá ưu đãi 20%</strong> khi ra mắt chính thức</li>
              <li>📦 <strong style="color:#F1F5F9;">Ưu tiên giao hàng</strong> trong đợt đầu tiên</li>
              <li>📱 Thông tin chi tiết về tính năng và thông số kỹ thuật</li>
              <li>💬 Hỗ trợ 1-1 từ đội ngũ HELICORP</li>
            </ul>
            <div style="background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.2);border-radius:12px;padding:20px;margin:24px 0;">
              <p style="margin:0;color:#818CF8;font-weight:600;">Lĩnh vực bạn quan tâm: ${interestLabel}</p>
              <p style="margin:8px 0 0;color:#64748B;font-size:14px;">Chúng tôi sẽ gửi nội dung phù hợp nhất với nhu cầu của bạn.</p>
            </div>
            <p style="color:#475569;font-size:13px;margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.06);">
              Bạn nhận được email này vì đã đăng ký tại <a href="https://helicorp-landing.vercel.app" style="color:#60A5FA;">helicorp-landing.vercel.app</a>.
            </p>
          </div>
        `,
      });

      if (confirmResult.error) {
        console.error("[Newsletter API] Confirmation email error:", confirmResult.error);
      }
    } else {
      // Dev mode — log to console when Resend not configured
      console.log("[Newsletter API] New signup (Resend not configured):", {
        name,
        email,
        phone: phone || "—",
        interest: interestLabel,
        timestamp: new Date().toISOString(),
      });
      console.log("[Newsletter API] Set RESEND_API_KEY and OWNER_EMAIL in .env.local to enable emails.");
    }

    // --- Also forward to webhook if configured ---
    const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name, email, phone: phone || undefined,
            interest, source: "AuraRing Landing Page",
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (webhookErr) {
        console.error("[Newsletter API] Webhook request failed:", webhookErr);
      }
    }

    return NextResponse.json(
      {
        message: "Đăng ký thành công! Chúng tôi sẽ gửi thông tin chi tiết về đợt ra mắt tới email của bạn.",
        data: { name, email, interest },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[Newsletter API] Unexpected error:", err);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
