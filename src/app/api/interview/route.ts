import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { messages, role, company, stage } = await req.json();

    if (!messages || !role) {
      return NextResponse.json({ error: "Messages and role are required." }, { status: 400 });
    }

    const systemInstruction = `You are an expert, professional AI interviewer at ${company || "a top technology company"}, interviewing for the role of ${role} (${stage || "General Round"}).

STRICT RULES:
- ALWAYS respond in English.
- ALWAYS ask exactly ONE clear question at the end of your message. Never end without a question.
- Give 1-2 lines of specific, constructive coaching feedback on the candidate's previous answer.
- Progress the interview naturally: start with introduction/behavioral, then move to technical questions.
- Keep responses concise (under 120 words total).
- After 6 questions, give a brief performance summary and write "INTERVIEW COMPLETE" at the end.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction,
    });

    type Msg = { role: "user" | "assistant"; content: string };
    const allMessages: Msg[] = messages;

    // Gemini history must start with 'user'. The first message in our array
    // is the AI greeting (role: "assistant"), so we skip leading model messages.
    const historyMessages = allMessages.slice(0, -1);
    const validHistory: { role: "user" | "model"; parts: { text: string }[] }[] = [];
    let foundFirstUser = false;

    for (const m of historyMessages) {
      if (!foundFirstUser && m.role !== "user") continue;
      foundFirstUser = true;
      validHistory.push({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      });
    }

    const chat = model.startChat({
      history: validHistory,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.75,
      },
    });

    const lastMessage = allMessages[allMessages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const text = result.response.text();

    return NextResponse.json({ content: text });
  } catch (error) {
    console.error("Interview API Error:", error);
    return NextResponse.json({ error: "Failed to process interview message." }, { status: 500 });
  }
}
