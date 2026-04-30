"use client";

import { useMemo, useRef, useState } from "react";
import styles from "./resumeBuilder.module.css";
import { trackActivity } from "@/lib/activity";

function buildPlatforms(role: string, skills: string[]) {
  const q = encodeURIComponent(role || "Software Engineer");
  const skillQ = encodeURIComponent(skills.slice(0, 3).join(" ") || role);
  return [
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/jobs/search/?keywords=${q}&location=India`,
      icon: "in",
      color: "#0A66C2",
      badge: "🔥 Top Match",
      badgeClass: "topMatch",
      description: `Find ${role} openings where your LinkedIn profile and resume match perfectly.`,
    },
    {
      name: "Naukri",
      url: `https://www.naukri.com/${role.toLowerCase().replace(/\s+/g, "-")}-jobs`,
      icon: "N",
      color: "#FF5A5F",
      badge: "🔥 Top Match",
      badgeClass: "topMatch",
      description: `Naukri is India's #1 job portal. Search for ${role} roles directly.`,
    },
    {
      name: "Indeed",
      url: `https://in.indeed.com/jobs?q=${q}&l=India`,
      icon: "I",
      color: "#2557A7",
      badge: "🔥 Top Match",
      badgeClass: "topMatch",
      description: `Indeed aggregates thousands of ${role} postings from across the web.`,
    },
    {
      name: "Glassdoor",
      url: `https://www.glassdoor.co.in/Job/jobs.htm?sc.keyword=${q}`,
      icon: "G",
      color: "#0CAA41",
      badge: "🔥 Top Match",
      badgeClass: "topMatch",
      description: `Search ${role} jobs on Glassdoor and read verified company reviews.`,
    },
    {
      name: "Internshala",
      url: `https://internshala.com/jobs/${role.toLowerCase().replace(/\s+/g, "-")}-jobs/`,
      icon: "I",
      color: "#118AB2",
      badge: "✓ Good Fit",
      badgeClass: "goodFit",
      description: `Find ${role} internships and fresher jobs on Internshala — great for entry-level.`,
    },
    {
      name: "Wellfound",
      url: `https://wellfound.com/role/r/${role.toLowerCase().replace(/\s+/g, "-")}`,
      icon: "W",
      color: "#E24A4A",
      badge: "Also Try",
      badgeClass: "alsoTry",
      description: `Explore ${role} roles at funded startups on Wellfound (formerly AngelList).`,
    },
    {
      name: "Unstop",
      url: `https://unstop.com/jobs?search=${skillQ}`,
      icon: "U",
      color: "#9333EA",
      badge: "Also Try",
      badgeClass: "alsoTry",
      description: `Unstop lists competitions and job opportunities for ${role} profiles.`,
    },
  ];
}

type BuilderState = "idle" | "processing-file" | "generating";
type ResumeView = "tailored" | "original";

// Detect role and skills from text heuristically
function detectRoleAndSkills(text: string): { role: string; skills: string[] } {
  const roleKeywords: Record<string, string[]> = {
    "Software Engineer": ["software engineer", "software developer", "sde", "backend developer", "frontend developer", "full stack", "fullstack"],
    "Data Scientist": ["data scientist", "machine learning", "deep learning", "data science"],
    "Data Analyst": ["data analyst", "sql", "tableau", "power bi", "excel", "analytics"],
    "Product Manager": ["product manager", "product management", "pm ", "roadmap", "stakeholder"],
    "UI/UX Designer": ["ui/ux", "ux designer", "ui designer", "figma", "user experience"],
    "DevOps Engineer": ["devops", "ci/cd", "kubernetes", "docker", "jenkins", "aws"],
    "Cybersecurity Analyst": ["cybersecurity", "security analyst", "penetration testing", "soc"],
    "Cloud Engineer": ["cloud engineer", "aws", "azure", "gcp", "terraform"],
    "Business Analyst": ["business analyst", "requirements gathering", "process improvement"],
    "Marketing Manager": ["marketing", "seo", "campaign", "brand", "digital marketing"],
  };
  const skillsList = [
    "Python", "JavaScript", "TypeScript", "React", "Node.js", "Java", "C++", "SQL",
    "AWS", "Docker", "Kubernetes", "Git", "MongoDB", "PostgreSQL", "Go", "Rust",
    "Figma", "TensorFlow", "PyTorch", "Tableau", "Power BI", "Excel",
  ];
  const lower = text.toLowerCase();
  let detectedRole = "Software Engineer";
  for (const [role, keywords] of Object.entries(roleKeywords)) {
    if (keywords.some(k => lower.includes(k))) {
      detectedRole = role;
      break;
    }
  }
  const detectedSkills = skillsList.filter(s => lower.includes(s.toLowerCase()));
  return { role: detectedRole, skills: detectedSkills };
}

export default function ResumeBuilder() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tailoredResumeHtml, setTailoredResumeHtml] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [state, setState] = useState<BuilderState>("idle");
  const [activeView, setActiveView] = useState<ResumeView>("tailored");
  const [isDragging, setIsDragging] = useState(false);
  const [detectedRole, setDetectedRole] = useState("Software Engineer");
  const [detectedSkills, setDetectedSkills] = useState<string[]>(["Python", "JavaScript", "Data Structures"]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const platforms = buildPlatforms(detectedRole, detectedSkills);

  const isBusy = state !== "idle";
  const canTailor = useMemo(() => {
    return !isBusy && Boolean(resumeText.trim()) && Boolean(jobDescription.trim());
  }, [isBusy, resumeText, jobDescription]);

  const onFileChange = async (file?: File) => {
    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".docx")) {
      setError("Please upload a .docx resume file.");
      return;
    }

    setError("");
    setState("processing-file");

    try {
      const mammoth = await import("mammoth");
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });

      setFileName(file.name);
      setResumeText(result.value || "");
      setTailoredResumeHtml("");
      setActiveView("original");
      trackActivity({
        title: "Resume Uploaded",
        description: `Uploaded "${file.name}" for analysis.`,
        icon: "resume",
      });
    } catch (uploadError) {
      console.error("DOCX parsing error:", uploadError);
      setError("Could not read the DOCX file. Please try another file.");
    } finally {
      setState("idle");
    }
  };

  const handleTailor = async () => {
    if (!resumeText.trim()) {
      setError("Upload a resume before tailoring.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Paste a job description before tailoring.");
      return;
    }

    setError("");
    setState("generating");

    try {
      const response = await fetch("/api/resume-builder/tailor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      const payload = (await response.json()) as {
        error?: string;
        tailoredResumeHtml?: string;
      };

      if (!response.ok || !payload.tailoredResumeHtml) {
        throw new Error(payload.error || "Failed to tailor resume.");
      }

      setTailoredResumeHtml(payload.tailoredResumeHtml);
      setActiveView("tailored");

      // Detect role & skills from the job description to build smart search URLs
      const combined = jobDescription + " " + resumeText;
      const { role, skills } = detectRoleAndSkills(combined);
      setDetectedRole(role);
      setDetectedSkills(skills.length > 0 ? skills : ["Software Engineering"]);

      trackActivity({
        title: "Resume Tailored",
        description: `AI tailored your resume for a ${role} role.`,
        icon: "resume",
      });
    } catch (submitError) {
      console.error("Tailoring error:", submitError);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not generate a tailored resume."
      );
    } finally {
      setState("idle");
    }
  };

  const handleCopyTailored = async () => {
    if (!tailoredResumeHtml) {
      return;
    }

    try {
      const plainText = tailoredResumeHtml
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      await navigator.clipboard.writeText(plainText);
    } catch (clipboardError) {
      console.error("Clipboard error:", clipboardError);
      setError("Could not copy resume to clipboard.");
    }
  };

  const handleDownloadTailored = async () => {
    if (!tailoredResumeHtml) {
      return;
    }

    setState("generating");
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      // Create an off-screen iframe to render the HTML properly without polluting the main page's CSS
      const iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.width = "800px"; // Fixed A4-like width
      iframe.style.height = "2500px"; // Very tall to prevent scrollbars cutting off content
      iframe.style.top = "-9999px";
      iframe.style.left = "-9999px";
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(tailoredResumeHtml);
        doc.close();
      }

      // Wait a moment for styles to apply
      await new Promise((resolve) => setTimeout(resolve, 800));

      const element = doc?.body;
      if (element) {
        // Enforce base styling
        element.style.padding = "12mm";
        element.style.backgroundColor = "white";
        element.style.color = "black";
        element.style.fontSize = "10.5pt";
        element.style.boxSizing = "border-box";
        // Force width to match A4 proportions (800px width -> ~1131px height)
        element.style.width = "800px";
        element.style.margin = "0";

        const applyStyles = (size: number, padding: number) => {
          element.style.padding = `${padding}mm`;
          element.style.fontSize = `${size}pt`;
          element.querySelectorAll("*").forEach((el: any) => {
            if (el.tagName !== "H1" && el.tagName !== "H2") {
              el.style.fontSize = `${size}pt`;
            }
            el.style.color = "black";
            el.style.lineHeight = "1.2";
          });
        };

        applyStyles(10.5, 12);

        // Auto-fit algorithm: shrink font and padding if content is too tall
        // 800px width * (297/210) = 1131px target height
        let currentSize = 10.5;
        let currentPadding = 12;
        
        while (element.scrollHeight > 1131 && currentSize > 6.5) {
          currentSize -= 0.5;
          currentPadding -= 0.5;
          applyStyles(currentSize, currentPadding);
        }

        // 1. Render the HTML to a canvas
        const canvas = await html2canvas(element, {
          scale: 2, // High resolution
          useCORS: true,
          windowWidth: 800,
          window: iframe.contentWindow || undefined,
        });

        // 2. Create the PDF
        const pdf = new jsPDF("portrait", "mm", "a4");

        // 3. Calculate scaling to fit perfectly on ONE page
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // Ratio to fit width
        const ratioWidth = pdfWidth / canvasWidth;
        // Ratio to fit height
        const ratioHeight = pdfHeight / canvasHeight;
        
        // Use the smaller ratio so it fits entirely on ONE page
        const ratio = Math.min(ratioWidth, ratioHeight);

        const finalWidth = canvasWidth * ratio;
        const finalHeight = canvasHeight * ratio;

        // Center it horizontally if it's scaled by height
        const marginX = (pdfWidth - finalWidth) / 2;
        const marginY = 0; // Stick to top

        pdf.addImage(imgData, "JPEG", marginX, marginY, finalWidth, finalHeight);
        pdf.save("tailored-resume.pdf");
      }

      document.body.removeChild(iframe);
    } catch (err) {
      console.error("PDF download error:", err);
      setError("Could not download PDF.");
    } finally {
      setState("idle");
    }
  };

  const displayText = activeView === "tailored" ? tailoredResumeHtml : resumeText;

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Professional Toolkit</p>
          <h1 className={styles.title}>AI Resume Builder</h1>
          <p className={styles.subtitle}>
            Upload your resume, paste a job description, and generate an ATS-focused tailored version.
          </p>
        </header>

        <div className={styles.formGrid}>
          <div className={styles.panel}>
            <label className={styles.label} htmlFor="resume-upload">
              Upload Resume (.docx)
            </label>
            <div
              className={`${styles.uploadZone} ${isDragging ? styles.dragging : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                const droppedFile = event.dataTransfer.files?.[0];
                void onFileChange(droppedFile);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              <input
                ref={fileInputRef}
                id="resume-upload"
                type="file"
                accept=".docx"
                className={styles.hiddenInput}
                onChange={(event) => void onFileChange(event.target.files?.[0])}
              />
              {state === "processing-file" ? (
                <p className={styles.uploadText}>Reading resume file...</p>
              ) : fileName ? (
                <p className={styles.uploadText}>Ready: {fileName}</p>
              ) : (
                <p className={styles.uploadText}>Drag and drop or click to select your DOCX resume</p>
              )}
            </div>
          </div>

          <div className={styles.panel}>
            <label className={styles.label} htmlFor="job-description">
              Job Description
            </label>
            <textarea
              id="job-description"
              className={styles.textarea}
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste the job description here..."
            />
          </div>
        </div>

        <div className={styles.actionsRow}>
          {error ? <p className={styles.error}>{error}</p> : <span className={styles.hint}>Tip: use a full JD for better tailoring.</span>}
          <button className={styles.primaryButton} onClick={handleTailor} disabled={!canTailor}>
            {state === "generating" ? "Tailoring..." : "Tailor Resume"}
          </button>
        </div>

        <section className={styles.resultShell}>
          <div className={styles.resultTopBar}>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeView === "tailored" ? styles.activeTab : ""}`}
                onClick={() => setActiveView("tailored")}
                disabled={!tailoredResumeHtml}
              >
                Tailored Resume
              </button>
              <button
                className={`${styles.tab} ${activeView === "original" ? styles.activeTab : ""}`}
                onClick={() => setActiveView("original")}
                disabled={!resumeText}
              >
                Original Resume
              </button>
            </div>

            <div className={styles.exportActions}>
              <button className={styles.secondaryButton} onClick={handleCopyTailored} disabled={!tailoredResumeHtml}>
                Copy Tailored
              </button>
              <button className={styles.secondaryButton} onClick={handleDownloadTailored} disabled={!tailoredResumeHtml || state === "generating"}>
                {state === "generating" ? "Generating PDF..." : "Download PDF"}
              </button>
            </div>
          </div>

          {activeView === "tailored" && displayText ? (
            <iframe
              title="Tailored Resume Preview"
              className={styles.resumeFrame}
              sandbox=""
              srcDoc={displayText}
            />
          ) : (
            <pre className={styles.resumePreview}>{resumeText || "Your resume preview will appear here."}</pre>
          )}
        </section>

        {activeView === "tailored" && tailoredResumeHtml && (
          <div className={styles.jobCardsSection}>
            <div className={styles.jobCardsHeader}>
              <div className={styles.jobCardsHeaderLeft}>
                <div className={styles.searchIconWrapper}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <div>
                  <h2 className={styles.jobCardsTitle}>Apply Now — Matched Platforms</h2>
                  <p className={styles.jobCardsSubtitle}>AI-curated job boards matched to your tailored resume</p>
                </div>
              </div>
              <button className={styles.refreshBtn}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 1 0 2.63-6.36L21 8"></path></svg>
                Refresh
              </button>
            </div>

            <div className={styles.detectedInfoBar}>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>DETECTED ROLE</span>
                <span className={styles.infoPillRole}>{detectedRole}</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>KEY SKILLS</span>
                <div className={styles.skillsList}>
                  {detectedSkills.slice(0, 5).map(skill => (
                    <span key={skill} className={styles.infoPillSkill}>{skill}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.jobCardsGrid}>
              {platforms.map(platform => (
                <div key={platform.name} className={styles.jobCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardBrand}>
                      <div className={styles.brandIcon} style={{ backgroundColor: platform.color }}>
                        {platform.icon}
                      </div>
                      <span className={styles.brandName}>{platform.name}</span>
                    </div>
                    <span className={`${styles.badge} ${styles[platform.badgeClass]}`}>
                      {platform.badge}
                    </span>
                  </div>
                  <p className={styles.cardDescription}>{platform.description}</p>
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.searchLink}
                  >
                    Search Jobs &rarr;
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
