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

const resumeTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Single Page Resume</title>
  <style>
    @page {
      margin: 2.5cm !important;
      size: A4;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      font-family: "Calibri", "Arial", sans-serif;
      font-size: 12.75pt;
      line-height: 1.05;
      margin: 0;
      padding: 0;
      color: #000;
      width: 100%;
    }
    h1 {
      font-size: 30pt;
      font-weight: bold;
      margin: 0 0 1pt 0;
      text-align: center;
    }
    .address {
      font-size: 11.25pt;
      text-align: center;
      margin-bottom: 3pt;
      display: block;
    }
    .address div {
      display: inline;
      margin-right: 4pt;
    }
    .section {
      margin-top: 4pt;
      margin-bottom: 3pt;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .section h2 {
      font-size: 13.5pt;
      font-weight: bold;
      border-bottom: 1px solid #000;
      margin-bottom: 1pt;
      padding-bottom: 0pt;
      text-transform: uppercase;
      page-break-after: avoid;
    }
    .entry {
      margin-bottom: 3pt;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .bold { font-weight: bold; }
    .italic { font-style: italic; }
    .right { float: right; }
    ul {
      margin: 2pt 0 4pt 10pt;
      padding: 0;
      list-style-type: disc;
    }
    ul li {
      margin-bottom: 1pt;
      line-height: 1.1;
    }
    .tabular {
      display: table;
      width: 100%;
      margin: 0.5pt 0;
    }
    .tabular-row {
      display: table-row;
    }
    .tabular-label {
      display: table-cell;
      font-weight: bold;
      padding-right: 6pt;
      width: 70pt;
      vertical-align: top;
    }
    .tabular-content {
      display: table-cell;
      vertical-align: top;
    }
    .project-item {
      margin-bottom: 2pt;
    }
    p {
      margin: 0 0 3pt 0;
      line-height: 1.1;
    }
    a {
      color: #0563C1;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <h1>{{NAME}}</h1>
  <div class="address">
    <div>{{DESIGNATION}}</div>
    <div><b>Phone:</b> {{PHONE}}</div>
    <div><b>Email:</b> <a href="mailto:{{EMAIL}}">{{EMAIL}}</a></div>
    <div><b>LinkedIn:</b> <a href="{{LINKEDIN}}">{{LINKEDIN}}</a></div>
  </div>
  <div class="section">
    <h2>Summary</h2>
    <p>{{OBJECTIVE}}</p>
  </div>
  <br>
  <div class="section">
    <h2>Experience</h2>
    {{EXPERIENCE}}
  </div>
  <br>
  <div class="section">
    <h2>Education</h2>
    {{EDUCATION}}
  </div>
  <br>
  <div class="section">
    <h2>Skills</h2>
    {{SKILLS}}
  </div>
  <br>
  <div class="section">
    <h2>Projects</h2>
    {{PROJECTS}}
  </div>
  <br>
  <div class="section">
    <h2>Licenses & Certifications</h2>
    {{LICENCE_CERTIFICATIONS}}
  </div>
</body>
</html>
`;

type ResumeFields = {
  NAME?: string;
  DESIGNATION?: string;
  PHONE?: string;
  LOCATION?: string;
  EMAIL?: string;
  LINKEDIN?: string;
  WEBSITE?: string;
  OBJECTIVE?: string;
  EDUCATION?: string;
  SKILLS?: string;
  EXPERIENCE?: string;
  PROJECTS?: string;
  LICENCE_CERTIFICATIONS?: string;
  CERTIFICATIONS?: string;
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

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      resumeText?: string;
      jobDescription?: string;
    };

    const resumeText = body.resumeText?.trim();
    const jobDescription = body.jobDescription?.trim();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "resumeText and jobDescription are required." },
        { status: 400 }
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY in environment variables." },
        { status: 500 }
      );
    }

    const prompt = [
      "You are an expert ATS resume tailoring assistant.",
      "Tailor the resume for the provided job description and return STRICT JSON only.",
      "Do not add markdown fences or explanatory text.",
      "Use the exact schema below and preserve strong, specific bullets.",
      "",
      "Expected JSON schema:",
      JSON.stringify(
        {
          NAME: "",
          DESIGNATION: "",
          PHONE: "",
          LOCATION: "",
          EMAIL: "",
          LINKEDIN: "",
          WEBSITE: "",
          OBJECTIVE: "",
          EDUCATION:
            '<div class="entry"><div class="bold">Degree <span class="right">Year</span></div><div class="italic">University</div></div><br>',
          SKILLS:
            '<div class="tabular"><div class="tabular-row"><div class="tabular-label">Programming:</div><div class="tabular-content">Language1, Language2</div></div></div><br>',
          EXPERIENCE:
            '<div class="entry"><div class="bold">Role <span class="right">Start - End</span></div><div class="italic">Company</div><ul><li>Impact bullet 1</li><li>Impact bullet 2</li></ul></div><br>',
          PROJECTS:
            '<div class="project-item"><div class="bold">Project Name</div><div><b>Technologies:</b> Stack</div><ul><li>Impact bullet</li></ul></div><br>',
          LICENCE_CERTIFICATIONS:
            '<div class="entry"><div class="bold">Certification</div><div>Description and issuing body</div></div><br>',
        },
        null,
        2
      ),
      "",
      "Original Resume:",
      resumeText,
      "",
      "Job Description:",
      jobDescription,
    ].join("\n");

    // Build SDK client and attempt generation with retry/backoff and fallback models.
    const client = new GoogleGenerativeAI(geminiApiKey);

    const fallbackModels = [
      "gemini-3-flash-preview",
      "gemini-2.0-flash",
      "text-bison-001",
    ];

    async function sleep(ms: number) {
      return new Promise((res) => setTimeout(res, ms));
    }

    async function tryGenerate(promptText: string) {
      const maxAttemptsPerModel = 2;
      const baseBackoffMs = 800;

      for (const model of fallbackModels) {
        try {
          const modelClient = client.getGenerativeModel({ model });

          for (let attempt = 1; attempt <= maxAttemptsPerModel; attempt++) {
            try {
              const sdkRes = await modelClient.generateContent({
                contents: [{ role: "user", parts: [{ text: promptText }] }],
              });
              return { sdkRes, model };
            } catch (err) {
              console.error(`Generate error (model=${model} attempt=${attempt}):`, err instanceof Error ? err.message : err);
              if (attempt < maxAttemptsPerModel) {
                const backoff = baseBackoffMs * Math.pow(2, attempt - 1);
                await sleep(backoff + Math.floor(Math.random() * 200));
              }
            }
          }
        } catch (outerErr) {
          console.error(`Model selection/SDK error for model=${model}:`, outerErr instanceof Error ? outerErr.stack : outerErr);
        }
      }

      for (const model of fallbackModels) {
        try {
          const restResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: promptText }] }],
              }),
            }
          );

          const restText = await restResponse.text();
          if (!restResponse.ok) {
            console.error(`REST fallback failed for model=${model}:`, restResponse.status, restText.slice(0, 2000));
            continue;
          }

          return { sdkRes: { responseText: restText, model }, model };
        } catch (restErr) {
          console.error(`REST fallback error for model=${model}:`, restErr instanceof Error ? restErr.stack : restErr);
        }
      }

      return { error: "All models failed or are unavailable." };
    }

    const genResult = await tryGenerate(prompt);

    if ((genResult as any).error) {
      return NextResponse.json({ error: (genResult as any).error }, { status: 502 });
    }

    const sdkResponse = (genResult as any).sdkRes as unknown;

    // Extract text defensively from SDK response.
    const sdkAny = sdkResponse as any;
    const responseText =
      (typeof sdkAny?.responseText === "string" ? sdkAny.responseText : undefined) ||
      (typeof sdkAny?.response?.text === "function" ? sdkAny.response.text() : undefined) ||
      (typeof sdkAny?.text === "function" ? sdkAny.text() : undefined);
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
      console.error("SDK response shape:", JSON.stringify(sdkAny, null, 2).slice(0, 4000));
      return NextResponse.json(
        { error: "Gemini returned an empty response." },
        { status: 500 }
      );
    }

    console.error("Resume output preview:", String(outputText).slice(0, 2000));

    const cleanedOutput = outputText?.replace(/^```[a-zA-Z]*\s*/g, "").replace(/```$/g, "").trim();
    console.error("Resume cleaned preview:", cleanedOutput.slice(0, 2000));

    let fields: ResumeFields;
    try {
      fields = JSON.parse(cleanedOutput || "") as ResumeFields;
    } catch (firstErr) {
      const jsonCandidate = extractBalancedJsonObject(cleanedOutput || "");
      if (!jsonCandidate) {
        console.error("Resume SDK output (non-JSON):", String(outputText).slice(0, 2000));
        return NextResponse.json({ error: "Gemini did not return valid JSON." }, { status: 500 });
      }

      let candidate = jsonCandidate;

      try {
        candidate = candidate.replace(/'([^']*)'/g, '"$1"');
        candidate = candidate.replace(/([,{\s])([A-Za-z0-9_\-]+)\s*:/g, '$1"$2":');
        candidate = candidate.replace(/,\s*([}\]])/g, '$1');

        fields = JSON.parse(candidate) as ResumeFields;
      } catch (secondErr) {
        const err = new Error(
          `Failed to parse JSON output from Gemini. Tried candidate: ${candidate.slice(0, 200)}...`
        );
        (err as any).cause = secondErr || firstErr;
        console.error("Failed to parse JSON candidate for resume:", err);
        return NextResponse.json({ error: "Failed to parse Gemini JSON output." }, { status: 500 });
      }
    }

    const sanitizeSection = (html: string | undefined, fallback: string) => {
      if (!html || !html.trim()) {
        return fallback;
      }
      return html.trim();
    };

    const addNumberingToSection = (html: string) => {
      const entries = html.split('<div class="entry">');
      if (entries.length <= 1) {
        return html;
      }

      let numberedHtml = entries[0];
      for (let i = 1; i < entries.length; i += 1) {
        let entryContent = entries[i];
        if (entryContent.includes('<div class="bold">')) {
          entryContent = entryContent.replace('<div class="bold">', `<div class="bold">${i}. `);
        } else {
          entryContent = `${i}. ${entryContent}`;
        }
        numberedHtml += `<div class="entry">${entryContent}`;
      }
      return numberedHtml;
    };

    const html = resumeTemplate
      .replace(/{{NAME}}/g, fields.NAME || "")
      .replace(/{{DESIGNATION}}/g, fields.DESIGNATION || "")
      .replace(/{{PHONE}}/g, fields.PHONE || "")
      .replace(/{{LOCATION}}/g, fields.LOCATION || "")
      .replace(/{{EMAIL}}/g, fields.EMAIL || "")
      .replace(/{{LINKEDIN}}/g, fields.LINKEDIN || "")
      .replace(/{{WEBSITE}}/g, fields.WEBSITE || "")
      .replace(/{{OBJECTIVE}}/g, fields.OBJECTIVE || "")
      .replace(
        /{{EDUCATION}}/g,
        addNumberingToSection(
          sanitizeSection(fields.EDUCATION, '<div class="entry"><div>No education information available.</div></div>')
        )
      )
      .replace(/{{SKILLS}}/g, sanitizeSection(fields.SKILLS, "<div>No skills information available.</div>"))
      .replace(
        /{{EXPERIENCE}}/g,
        addNumberingToSection(
          sanitizeSection(fields.EXPERIENCE, '<div class="entry"><div>No experience information available.</div></div>')
        )
      )
      .replace(
        /{{PROJECTS}}/g,
        sanitizeSection(fields.PROJECTS, '<div class="project-item"><div>No projects information available.</div></div>')
      )
      .replace(
        /{{LICENCE_CERTIFICATIONS}}/g,
        addNumberingToSection(
          sanitizeSection(
            fields.LICENCE_CERTIFICATIONS || fields.CERTIFICATIONS,
            '<div class="entry"><div>No certifications available.</div></div>'
          )
        )
      );

    return NextResponse.json({ tailoredResumeHtml: html });
  } catch (error) {
    console.error("Tailor route error:", error);
    return NextResponse.json(
      { error: "Unexpected server error while tailoring resume." },
      { status: 500 }
    );
  }
}