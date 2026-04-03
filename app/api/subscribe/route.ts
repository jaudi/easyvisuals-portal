import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Notify hello@financeplots.com
    await resend.emails.send({
      from: "FinancePlots <hello@financeplots.com>",
      to: "hello@financeplots.com",
      subject: "New subscriber: " + email,
      html: `<p>New subscriber: <strong>${email}</strong></p>`,
    });

    // Send welcome email to subscriber
    await resend.emails.send({
      from: "FinancePlots <hello@financeplots.com>",
      to: email,
      subject: "Welcome to FinancePlots",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#1d4ed8">Welcome to FinancePlots</h2>
          <p>Thanks for subscribing. You'll be the first to know about new tools and financial guides.</p>
          <p>In the meantime, explore our free tools at <a href="https://www.financeplots.com/tools">financeplots.com/tools</a></p>
          <p style="color:#6b7280;font-size:12px">FinancePlots · Not financial advice</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
