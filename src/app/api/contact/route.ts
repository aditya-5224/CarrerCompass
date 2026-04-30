import { MailtrapClient } from "mailtrap";
import { NextResponse } from "next/server";

const TOKEN = process.env.MAILTRAP_TOKEN;

export async function POST(req: Request) {
  try {
    const { name, email, phone, query } = await req.json();

    if (!TOKEN) {
      console.error("MAILTRAP_TOKEN is missing in environment variables.");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const client = new MailtrapClient({ token: TOKEN });

    const sender = {
      email: process.env.MAILTRAP_SENDER_EMAIL || "hello@demomailtrap.com",
      name: "CareerCompass Contact Form",
    };

    const recipients = [
      {
        email: process.env.CONTACT_RECEIVER_EMAIL || "your-gmail@example.com",
      }
    ];

    await client.send({
      from: sender,
      to: recipients,
      subject: `New CareerCompass Query from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        
        Query:
        ${query}
      `,
      category: "Contact Form",
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Mailtrap error:", error);
    return NextResponse.json({ error: error.message || "Failed to send email" }, { status: 500 });
  }
}
