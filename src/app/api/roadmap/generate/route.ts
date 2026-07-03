import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

type GeminiCandidate = {
  content?: {
    parts?: Array<{
      text?: string;
    }>;
  };
};

type GeminiResponse = {
  candidates?: GeminiCandidate[];
};

type RoadmapData = {
  title: string;
  tagline: string;
  overview: string;
  totalDuration: string;
  difficulty: string;
  jobOutcomes: string[];
  keyTools: string[];
  phases: Array<{
    title: string;
    duration: string;
    overview?: string;
    steps: Array<{
      title: string;
      duration: string;
      outcome: string;
      description?: string;
      subtasks?: string[];
      resources: string[];
      skills?: string[];
    }>;
  }>;
};

function extractBalancedJsonObject(text: string) {
  const startIndex = text.indexOf("{");
  if (startIndex === -1) {
    return undefined;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = startIndex; index < text.length; index += 1) {
    const char = text[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return text.slice(startIndex, index + 1);
      }
    }
  }

  return undefined;
}

function extractJsonText(text: string) {
  const cleaned = text
    .replace(/^```[a-zA-Z]*\s*/g, "")
    .replace(/```$/g, "")
    .trim();

  try {
    return JSON.parse(cleaned) as RoadmapData;
  } catch (firstErr) {
    const match = extractBalancedJsonObject(cleaned);
    if (!match) {
      throw new Error("Gemini did not return valid JSON.");
    }

    let candidate = match;

    try {
      candidate = candidate.replace(/'([^']*)'/g, '"$1"');
      candidate = candidate.replace(/([,{\s])([A-Za-z0-9_\-]+)\s*:/g, '$1"$2":');
      candidate = candidate.replace(/,\s*([}\]])/g, '$1');

      return JSON.parse(candidate) as RoadmapData;
    } catch (secondErr) {
      const err = new Error(
        `Failed to parse JSON output from Gemini. Tried candidate: ${candidate.slice(0, 200)}...`
      );
      (err as any).cause = secondErr || firstErr;
      throw err;
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { career?: string };
    const career = body.career?.trim();

    if (!career) {
      return NextResponse.json({ error: "career is required." }, { status: 400 });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY in environment variables." }, { status: 500 });
    }

    const client = new GoogleGenerativeAI(geminiApiKey);

    const prompt = [
      "You are a career education expert.",
      `Generate a highly detailed roadmap for someone who wants to become a \"${career}\".`,
      "Return ONLY a valid JSON object. Do not include markdown fences, code blocks, or explanation.",
      "Use this exact schema:",
      JSON.stringify(
        {
          title: "Career title",
          tagline: "One inspiring sentence about this career path",
          overview: "2-3 sentence overview of the career and what this roadmap covers",
          totalDuration: "e.g. 8-12 months",
          difficulty: "Beginner / Intermediate / Advanced",
          jobOutcomes: ["Job title 1", "Job title 2", "Job title 3"],
          keyTools: ["Tool 1", "Tool 2", "Tool 3", "Tool 4", "Tool 5"],
          phases: [
            {
              title: "Phase title",
              duration: "e.g. 3-4 weeks",
              overview: "1-2 sentences describing this phase",
              steps: [
                {
                  title: "Step title",
                  duration: "e.g. 1 week",
                  outcome: "What you'll be able to do after this step (1 sentence)",
                  description: "Detailed 2-3 sentence explanation of what this step involves and why it matters",
                  subtasks: ["Specific task 1", "Specific task 2", "Specific task 3", "Specific task 4"],
                  resources: ["Resource 1", "Resource 2", "Resource 3"],
                  skills: ["Skill 1", "Skill 2", "Skill 3"]
                }
              ]
            }
          ]
        },
        null,
        2
      ),
      "Requirements:",
      "- Provide exactly 5-6 phases covering the full journey from beginner to job-ready.",
      "- Each phase should have 3-5 steps.",
      `- Make it highly specific to the \"${career}\" career, with real tools, frameworks, and concepts.`,
      "- Make subtasks concrete and actionable.",
      "- Resources should be real, well-known tools/platforms/docs.",
      "- Skills should be specific technical or professional skills.",
      "- Total duration should be realistic for someone learning part-time.",
    ].join("\n");

    // Use the official SDK and the gemini-3-flash-preview model.
    const modelClient = client.getGenerativeModel({ model: "gemini-3-flash-preview" });
    const sdkResponse = await modelClient.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    // SDK responses can vary slightly in shape; try to extract text defensively.
    const sdkAny = sdkResponse as any;
    const responseText =
      (typeof sdkAny?.response?.text === "function" ? sdkAny.response.text() : undefined) ||
      (typeof sdkAny?.text === "function" ? sdkAny.text() : undefined) ||
      (typeof sdkAny?.responseText === "string" ? sdkAny.responseText : undefined);
    const outputText =
      (typeof responseText === "string" ? responseText.trim() : undefined) ||
      sdkAny?.candidates?.[0]?.content?.parts?.map((p: any) => p.text || "").join("\n").trim() ||
      sdkAny?.candidates?.[0]?.text ||
      sdkAny?.output?.[0]?.content?.parts?.map((p: any) => p.text || "").join("\n").trim() ||
      (typeof sdkAny === "string" ? sdkAny : undefined);

    if (!outputText) {
      if (sdkAny?.response?.promptFeedback) {
        console.error("Gemini promptFeedback:", JSON.stringify(sdkAny.response.promptFeedback, null, 2));
      }
      console.error("SDK response:", JSON.stringify(sdkAny, null, 2).slice(0, 4000));
      return NextResponse.json({ error: "Gemini returned an empty response." }, { status: 500 });
    }

    const roadmap = extractJsonText(outputText);
    return NextResponse.json({ roadmap });
  } catch (error) {
    console.error("Roadmap generation route error:", error);
    return NextResponse.json(
      { error: "Unexpected server error while generating the roadmap." },
      { status: 500 }
    );
  }
}