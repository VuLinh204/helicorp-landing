import { type NextRequest, NextResponse } from "next/server";

interface NewsletterPayload {
  name: string;
  email: string;
  phone?: string;
  interest?: string;
}

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

    // --- Forward to webhook (if configured) ---
    const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL;

    if (webhookUrl) {
      try {
        const webhookRes = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            phone: phone || undefined,
            interest,
            source: "AuraRing Landing Page",
            timestamp: new Date().toISOString(),
          }),
        });

        if (!webhookRes.ok) {
          console.error(
            "[Newsletter API] Webhook error:",
            webhookRes.status,
            await webhookRes.text()
          );
          // Don't expose webhook errors to client — log and continue
        }
      } catch (webhookErr) {
        console.error("[Newsletter API] Webhook request failed:", webhookErr);
      }
    } else {
      // Log locally when no webhook configured (dev mode)
      console.log("[Newsletter API] New signup (no webhook configured):", {
        name,
        email,
        phone: phone || "—",
        interest,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        message:
          "Đăng ký thành công! Chúng tôi sẽ gửi thông tin chi tiết về đợt ra mắt tới email của bạn.",
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
