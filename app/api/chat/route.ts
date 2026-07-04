import { type NextRequest, NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  message: string;
  history?: ChatMessage[];
}

const SYSTEM_PROMPT = `Bạn là trợ lý AI của AuraRing — nhẫn thông minh theo dõi sức khỏe của HELICORP (Healthy Living Corporation).

**Về AuraRing:**
- Nhẫn thông minh titan siêu mỏng 2.3mm, nhẹ 3.8g
- Cảm biến: Nhịp tim PPG (±1 bpm), SpO2 (±1%), Nhiệt độ (0.05°C), HRV (SDNN & rMSSD), gia tốc kế 6-axis, nhịp thở gián tiếp
- Pin 7 ngày (thường) / 5 ngày (intensive), sạc không dây 60 phút
- Chống nước IP68 (50m)
- Kết nối Bluetooth 5.3, đồng bộ Apple Health / Google Fit / Strava
- Kích thước: Size 6–13 US, màu: Midnight Black, Arctic Silver, Deep Navy
- Bộ xử lý ARM Cortex-M33, lưu 14 ngày offline, mã hóa AES-256
- App: iOS 16+ / Android 10+
- Giá: chưa công bố, đang nhận đặt trước với ưu đãi 20%

**Nguyên tắc trả lời:**
1. Trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp.
2. Dùng đa dạng mẫu câu, tránh lặp lại cấu trúc.
3. Nếu được hỏi về giá hoặc ngày ra mắt, nói rõ giá chưa công bố và mời đăng ký nhận thông báo.
4. Chỉ dựa vào thông tin trong phần mô tả sản phẩm; không bịa thêm thông số.
5. Nếu câu hỏi không liên quan đến AuraRing/HELICORP, nhẹ nhàng chuyển hướng và đề nghị hỏi về sản phẩm.
6. Trả lời súc tích trong 3–4 câu trừ khi cần giải thích kỹ thuật chi tiết.
7. Dùng emoji vừa phải để tăng cảm giác thân thiện.`;

async function callGemini(
  message: string,
  history: ChatMessage[]
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY chưa được cấu hình");

  // Build contents array for Gemini
  const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

  // Add history
  for (const msg of history) {
    contents.push({
      role: msg.role === "assistant" ? "assistant" : "user",
      parts: [{ text: msg.content }],
    });
  }

  // Add current message
  contents.push({
    role: "user",
    parts: [{ text: message }],
  });

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents,
        generationConfig: {
          maxOutputTokens: 512,
          temperature: 0.7,
          topP: 0.9,
        },
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    console.error("[Chat API] Gemini error:", errText);
    throw new Error("Lỗi từ Gemini API");
  }

  const data = (await res.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
    error?: { message: string };
  };

  if (data.error) throw new Error(data.error.message);

  const reply =
    data.candidates?.[0]?.content?.parts?.[0]?.text ??
    "Xin lỗi, tôi không thể trả lời lúc này. Vui lòng thử lại!";

  return reply;
}

// Fallback response when no API key configured
function getFallbackResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("pin") || lower.includes("battery")) {
    return "AuraRing có thời lượng pin lên đến **7 ngày** trong chế độ bình thường và 5 ngày khi dùng intensive. Dock sạc không dây giúp đầy pin chỉ trong 60 phút! ⚡";
  }
  if (lower.includes("spo2") || lower.includes("oxy") || lower.includes("nồng độ")) {
    return "SpO2 của AuraRing được đo tự động mỗi 30 phút với độ chính xác **±1%** sử dụng công nghệ Red + IR LED. Ngoài ra bạn có thể đo theo yêu cầu bất kỳ lúc nào 💧";
  }
  if (lower.includes("nước") || lower.includes("water") || lower.includes("ip")) {
    return "AuraRing đạt chuẩn **IP68** — chống nước ở độ sâu 50m. Bạn có thể bơi lội, tắm hoặc đi mưa hoàn toàn yên tâm! 💦";
  }
  if (lower.includes("giá") || lower.includes("price") || lower.includes("bao nhiêu")) {
    return "Giá chính thức của AuraRing chưa được công bố. Đăng ký danh sách chờ hôm nay để nhận **ưu đãi 20%** khi ra mắt và được vận chuyển trong đợt đầu tiên! 🎉";
  }
  if (lower.includes("nhịp tim") || lower.includes("heart")) {
    return "Cảm biến PPG Optical v3 của AuraRing đo nhịp tim **mỗi giây** với độ chính xác ±1 bpm — đạt 99.5% trong thử nghiệm lâm sàng. Cảnh báo ngay khi phát hiện bất thường 🫀";
  }
  if (lower.includes("ngủ") || lower.includes("sleep")) {
    return "AuraRing phân tách chi tiết các giai đoạn ngủ REM, sâu và nông theo thời gian thực. Mô hình AI Sleep Scoring đạt 94% tương quan với thiết bị polysomnography y tế 🌙";
  }
  if (lower.includes("màu") || lower.includes("size") || lower.includes("kích thước")) {
    return "AuraRing có 3 màu: **Midnight Black**, **Arctic Silver**, **Deep Navy**. Kích thước từ US 6–13 (đường kính 16–22mm). Dày chỉ 2.3mm và nặng 3.8g 💍";
  }

  return "Cảm ơn bạn đã hỏi! Tôi là trợ lý AI của AuraRing. Bạn có thể hỏi tôi về tính năng cảm biến, thông số kỹ thuật, pin, chống nước, hay cách đặt trước nhẫn. Tôi sẽ cố gắng trả lời chính xác nhất 😊";
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestBody;

    if (!body.message || typeof body.message !== "string") {
      return NextResponse.json(
        { error: "Tin nhắn không hợp lệ" },
        { status: 400 }
      );
    }

    if (body.message.trim().length > 1000) {
      return NextResponse.json(
        { error: "Tin nhắn quá dài (tối đa 1000 ký tự)" },
        { status: 400 }
      );
    }

    const history = Array.isArray(body.history) ? body.history.slice(-10) : [];

    let reply: string;

    if (process.env.GEMINI_API_KEY) {
      reply = await callGemini(body.message, history);
    } else {
      // Graceful fallback when no API key
      console.warn("[Chat API] GEMINI_API_KEY not set — using fallback responses");
      reply = getFallbackResponse(body.message);
    }

    return NextResponse.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Lỗi server";
    console.error("[Chat API] Error:", message);
    return NextResponse.json(
      { error: "Xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
