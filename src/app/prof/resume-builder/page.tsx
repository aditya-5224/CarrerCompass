"use client";

import { useMemo, useRef, useState } from "react";
import styles from "./resumeBuilder.module.css";

type BuilderState = "idle" | "processing-file" | "generating";
type ResumeView = "tailored" | "original";

export default function ResumeBuilder() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tailoredResumeHtml, setTailoredResumeHtml] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [state, setState] = useState<BuilderState>("idle");
  const [activeView, setActiveView] = useState<ResumeView>("tailored");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const plainText = tailoredResumeHtml
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<[^>]+>/g, "\n")
        .replace(/\n\s*\n/g, "\n\n")
        .trim();

      const response = await fetch("/api/resume-builder/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: plainText })
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "tailored-resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
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
      </section>
    </main>
  );
}
