"use client";

import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import styles from "./internships.module.css";
import { trackActivity } from "@/lib/activity";

// ─── Types ─────────────────────────────────────────────────────────────────

interface Platform {
  name: string;
  icon: string;
  gradient: string;
  description: string;
  url: string;
  category: "top" | "internship" | "startup" | "global";
  categoryLabel: string;
  matchScore: number; // 0–100
}

interface ResumeAnalysis {
  role: string;
  level: "fresher" | "mid" | "senior";
  skills: string[];
  experience: string;
}

// ─── Role / Skill detection ─────────────────────────────────────────────────

const ROLE_MAP: Record<string, string[]> = {
  "Software Engineer":      ["software engineer", "software developer", "sde", "programmer", "full stack", "fullstack", "full-stack"],
  "Frontend Developer":     ["frontend", "front-end", "react", "vue", "angular", "ui developer"],
  "Backend Developer":      ["backend", "back-end", "node.js", "django", "spring boot", "express"],
  "Data Scientist":         ["data scientist", "machine learning", "deep learning", "nlp", "data science"],
  "Data Analyst":           ["data analyst", "analytics", "tableau", "power bi", "excel analyst"],
  "DevOps Engineer":        ["devops", "ci/cd", "jenkins", "kubernetes", "terraform", "docker"],
  "Cloud Engineer":         ["cloud engineer", "aws architect", "azure", "gcp", "cloud computing"],
  "UI/UX Designer":         ["ui/ux", "ux designer", "user experience", "figma", "wireframe"],
  "Product Manager":        ["product manager", "product management", "product owner", "roadmap"],
  "Cybersecurity Analyst":  ["cybersecurity", "security analyst", "penetration testing", "soc analyst"],
  "ML Engineer":            ["machine learning engineer", "mlops", "model training", "pytorch", "tensorflow"],
  "Business Analyst":       ["business analyst", "requirements", "process improvement", "brd"],
  "Marketing Manager":      ["marketing", "seo", "campaign", "brand management", "digital marketing"],
};

const SKILLS_DB = [
  "Python","JavaScript","TypeScript","React","Next.js","Node.js","Java","C++","C#","Go","Rust",
  "SQL","MongoDB","PostgreSQL","MySQL","Redis","GraphQL","REST API","Docker","Kubernetes",
  "AWS","Azure","GCP","Terraform","Git","GitHub","CI/CD","Jenkins","Linux",
  "TensorFlow","PyTorch","Scikit-learn","Pandas","NumPy","Tableau","Power BI","Excel",
  "Figma","Adobe XD","HTML","CSS","SASS","Tailwind","Bootstrap","Redux","Vue","Angular",
  "Spring Boot","Django","Flask","Express","FastAPI","Firebase","Supabase",
];

function analyseResume(text: string): ResumeAnalysis {
  const lower = text.toLowerCase();

  // Role detection
  let role = "Software Engineer";
  for (const [r, keywords] of Object.entries(ROLE_MAP)) {
    if (keywords.some((k) => lower.includes(k))) { role = r; break; }
  }

  // Skills
  const skills = SKILLS_DB.filter((s) => lower.includes(s.toLowerCase()));

  // Level
  const yrsMatch = lower.match(/(\d+)\s*\+?\s*years?\s+(?:of\s+)?experience/i);
  const years = yrsMatch ? parseInt(yrsMatch[1], 10) : 0;
  const level: ResumeAnalysis["level"] =
    years >= 5 ? "senior" : years >= 2 ? "mid" : "fresher";

  // Experience snippet
  const experience =
    years > 0 ? `${years}+ years of experience` : "Fresher / Entry-level";

  return { role, level, skills, experience };
}

// ─── Platform builder ───────────────────────────────────────────────────────

function buildPlatforms(analysis: ResumeAnalysis): Platform[] {
  const { role, level, skills } = analysis;
  const q  = encodeURIComponent(role);
  const sq = encodeURIComponent(skills.slice(0, 3).join(" ") || role);
  const slug = role.toLowerCase().replace(/\s+/g, "-");

  // Scoring helpers
  const isEntry  = level === "fresher";
  const isSenior = level === "senior";
  const hasCode  = skills.some((s) => ["Python","JavaScript","Java","C++","React","Node.js"].includes(s));

  return [
    {
      name: "LinkedIn Jobs",
      icon: "in",
      gradient: "linear-gradient(135deg,#0A66C2,#004182)",
      description: `Best for ${role} roles with verified company profiles and networking.`,
      url: `https://www.linkedin.com/jobs/search/?keywords=${q}&location=India`,
      category: "top" as const,
      categoryLabel: "🔥 Top Match",
      matchScore: isSenior ? 98 : 88,
    },
    {
      name: "Naukri.com",
      icon: "N",
      gradient: "linear-gradient(135deg,#FF5A5F,#c0392b)",
      description: `India's #1 portal — millions of verified ${role} openings.`,
      url: `https://www.naukri.com/${slug}-jobs`,
      category: "top" as const,
      categoryLabel: "🔥 Top Match",
      matchScore: 92,
    },
    {
      name: "Internshala",
      icon: "I",
      gradient: "linear-gradient(135deg,#118AB2,#06405c)",
      description: isEntry
        ? `Perfect for freshers — ${role} internships & entry jobs.`
        : `Good source of contract & project-based ${role} roles.`,
      url: `https://internshala.com/jobs/${slug}-jobs/`,
      category: "internship" as const,
      categoryLabel: "🎓 Internships",
      matchScore: isEntry ? 95 : 70,
    },
    {
      name: "Unstop",
      icon: "U",
      gradient: "linear-gradient(135deg,#9333EA,#5b21b6)",
      description: `Hackathons, competitions & fresher jobs — great for ${role} starters.`,
      url: `https://unstop.com/jobs?search=${sq}`,
      category: "internship" as const,
      categoryLabel: "🎓 Internships",
      matchScore: isEntry ? 85 : 60,
    },
    {
      name: "Indeed India",
      icon: "I",
      gradient: "linear-gradient(135deg,#2557A7,#1a3a75)",
      description: `Aggregates ${role} listings from thousands of company career pages.`,
      url: `https://in.indeed.com/jobs?q=${q}&l=India`,
      category: "global" as const,
      categoryLabel: "🌍 Global",
      matchScore: 80,
    },
    {
      name: "Glassdoor",
      icon: "G",
      gradient: "linear-gradient(135deg,#0CAA41,#087030)",
      description: `${role} jobs + verified salaries and company culture insights.`,
      url: `https://www.glassdoor.co.in/Job/jobs.htm?sc.keyword=${q}`,
      category: "global" as const,
      categoryLabel: "🌍 Global",
      matchScore: 78,
    },
    {
      name: "Wellfound",
      icon: "W",
      gradient: "linear-gradient(135deg,#E24A4A,#9b2020)",
      description: `Startup-focused board — ${hasCode ? "great for your tech skills" : "interesting for your profile"}.`,
      url: `https://wellfound.com/role/r/${slug}`,
      category: "startup" as const,
      categoryLabel: "🚀 Startups",
      matchScore: hasCode ? 82 : 65,
    },
    {
      name: "Foundit",
      icon: "F",
      gradient: "linear-gradient(135deg,#FF6B35,#c43e10)",
      description: `Formerly Monster India — trusted for ${role} mid-to-senior roles.`,
      url: `https://www.foundit.in/srp/results?query=${q}`,
      category: "top" as const,
      categoryLabel: "🔥 Top Match",
      matchScore: isSenior ? 88 : 72,
    },
  ].sort((a, b) => b.matchScore - a.matchScore);
}

// ─── Component ──────────────────────────────────────────────────────────────

type PageState = "upload" | "analysing" | "results";

const CATEGORIES = [
  { id: "all",        label: "All Platforms" },
  { id: "top",        label: "🔥 Top Match"  },
  { id: "internship", label: "🎓 Internships" },
  { id: "startup",    label: "🚀 Startups"   },
  { id: "global",     label: "🌍 Global"     },
];

export default function ConnectPage() {
  const [user,         setUser]         = useState<any>(null);
  const [pageState,    setPageState]    = useState<PageState>("upload");
  const [analysis,     setAnalysis]     = useState<ResumeAnalysis | null>(null);
  const [platforms,    setPlatforms]    = useState<Platform[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isDragging,   setIsDragging]   = useState(false);
  const [fileName,     setFileName]     = useState("");
  const [clicked,      setClicked]      = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const firstName = user?.displayName?.split(" ")[0] || "there";

  // ── File handling ──────────────────────────────────────────────────────────
  const processFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".docx")) {
      alert("Please upload a .docx file.");
      return;
    }
    setFileName(file.name);
    setPageState("analysing");

    try {
      const mammoth     = await import("mammoth");
      const arrayBuffer = await file.arrayBuffer();
      const { value }   = await mammoth.extractRawText({ arrayBuffer });

      // Small artificial delay for UX feel
      await new Promise((r) => setTimeout(r, 1800));

      const result = analyseResume(value);
      setAnalysis(result);
      setPlatforms(buildPlatforms(result));
      setPageState("results");
    } catch {
      alert("Could not read the file. Please try again.");
      setPageState("upload");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void processFile(file);
  };

  const handleOpen = (platform: Platform) => {
    setClicked(platform.name);
    setTimeout(() => setClicked(null), 1200);
    trackActivity({
      title: `Opened ${platform.name}`,
      description: `Searched for ${analysis?.role ?? "jobs"} on ${platform.name}.`,
      icon: "connect",
    });
    window.open(platform.url, "_blank", "noopener,noreferrer");
  };

  const reset = () => {
    setPageState("upload");
    setAnalysis(null);
    setPlatforms([]);
    setFileName("");
    setActiveCategory("all");
    if (fileRef.current) fileRef.current.value = "";
  };

  const filtered = activeCategory === "all"
    ? platforms
    : platforms.filter((p) => p.category === activeCategory);

  const levelColor: Record<string, string> = {
    fresher: "#a5b4fc",
    mid:     "#34d399",
    senior:  "#fbbf24",
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <main className={styles.page}>
      <div className={styles.bg}><div className={styles.orb1} /><div className={styles.orb2} /></div>

      <div className={styles.shell}>
        <Link href="/" className={styles.backBtn}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Back to Home
        </Link>

        {/* ── Header ── */}
        <header className={styles.header}>
          <div className={styles.userGreet}>
            {user?.photoURL
              ? <img src={user.photoURL} alt="avatar" className={styles.avatar} />
              : <div className={styles.avatarFallback}>{(user?.displayName || user?.email || "U")[0].toUpperCase()}</div>
            }
            <div>
              <p className={styles.eyebrow}>Hey {firstName} 👋</p>
              <h1 className={styles.title}>Connect to Opportunities</h1>
              <p className={styles.subtitle}>
                Upload your resume — we'll analyse it and show platforms where <em>your profile</em> matches best.
              </p>
            </div>
          </div>
        </header>

        {/* ══════════ UPLOAD STATE ══════════ */}
        {pageState === "upload" && (
          <section
            className={`${styles.uploadZone} ${isDragging ? styles.dragging : ""}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" accept=".docx" className={styles.hiddenInput} onChange={handleFileChange} />

            <div className={styles.uploadIconWrapper}>
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
            </div>

            <h2 className={styles.uploadTitle}>Upload Your Resume</h2>
            <p className={styles.uploadSubtitle}>Drag & drop or click to select your <strong>.docx</strong> file</p>
            <span className={styles.uploadHint}>We'll detect your role, skills & experience level — then match you to the best platforms.</span>
          </section>
        )}

        {/* ══════════ ANALYSING STATE ══════════ */}
        {pageState === "analysing" && (
          <section className={styles.analysingWrapper}>
            <div className={styles.analysingSpinner}>
              <div className={styles.spinnerRing} />
              <div className={styles.spinnerCore}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"/>
                </svg>
              </div>
            </div>
            <h2 className={styles.analysingTitle}>Analysing your resume…</h2>
            <p className={styles.analysingFile}>{fileName}</p>
            <p className={styles.analysingSubtitle}>Detecting role · Extracting skills · Calculating match scores</p>
            <div className={styles.analysingSteps}>
              {["Reading document","Detecting role","Extracting skills","Calculating matches"].map((step, i) => (
                <div key={step} className={styles.step}>
                  <div className={styles.stepDot} style={{ animationDelay: `${i * 0.4}s` }} />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ══════════ RESULTS STATE ══════════ */}
        {pageState === "results" && analysis && (
          <>
            {/* Analysis card */}
            <section className={styles.analysisCard}>
              <div className={styles.analysisCardLeft}>
                <div className={styles.analysisIconBadge}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/></svg>
                </div>
                <div>
                  <p className={styles.analysisFileLabel}>Analysed: <strong>{fileName}</strong></p>
                  <div className={styles.analysisRow}>
                    <span className={styles.analysisChip} style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc", borderColor: "rgba(99,102,241,0.35)" }}>
                      🎯 {analysis.role}
                    </span>
                    <span className={styles.analysisChip} style={{ background: "rgba(52,211,153,0.1)", color: levelColor[analysis.level], borderColor: `${levelColor[analysis.level]}50` }}>
                      📊 {analysis.level.charAt(0).toUpperCase() + analysis.level.slice(1)}
                    </span>
                    <span className={styles.analysisChip} style={{ background: "rgba(251,191,36,0.1)", color: "#fbbf24", borderColor: "rgba(251,191,36,0.3)" }}>
                      🕐 {analysis.experience}
                    </span>
                  </div>
                  <div className={styles.skillsRow}>
                    {analysis.skills.slice(0, 8).map((s) => (
                      <span key={s} className={styles.skillPill}>{s}</span>
                    ))}
                    {analysis.skills.length > 8 && (
                      <span className={styles.skillPill} style={{ color: "#94a3b8" }}>+{analysis.skills.length - 8} more</span>
                    )}
                  </div>
                </div>
              </div>
              <button className={styles.reuploadBtn} onClick={reset}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>
                Re-upload
              </button>
            </section>

            {/* Category Filter */}
            <div className={styles.categoryBar}>
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  className={`${styles.catBtn} ${activeCategory === c.id ? styles.catBtnActive : ""}`}
                  onClick={() => setActiveCategory(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Platform Cards */}
            <div className={styles.grid}>
              {filtered.map((platform) => (
                <div
                  key={platform.name}
                  className={`${styles.card} ${clicked === platform.name ? styles.cardClicked : ""}`}
                  onClick={() => handleOpen(platform)}
                >
                  {/* Match score ribbon */}
                  <div className={styles.matchRibbon}>
                    <div
                      className={styles.matchBar}
                      style={{
                        width: `${platform.matchScore}%`,
                        background:
                          platform.matchScore >= 90
                            ? "linear-gradient(90deg,#34d399,#059669)"
                            : platform.matchScore >= 75
                            ? "linear-gradient(90deg,#818cf8,#4f46e5)"
                            : "linear-gradient(90deg,#fbbf24,#d97706)",
                      }}
                    />
                  </div>

                  <div className={styles.cardTopRow}>
                    <div className={styles.brandIcon} style={{ background: platform.gradient }}>
                      {platform.icon}
                    </div>
                    <div className={styles.matchBadge} style={{
                      color: platform.matchScore >= 90 ? "#34d399" : platform.matchScore >= 75 ? "#a5b4fc" : "#fbbf24",
                      borderColor: platform.matchScore >= 90 ? "rgba(52,211,153,0.3)" : platform.matchScore >= 75 ? "rgba(99,102,241,0.3)" : "rgba(251,191,36,0.3)",
                      background: platform.matchScore >= 90 ? "rgba(52,211,153,0.08)" : platform.matchScore >= 75 ? "rgba(99,102,241,0.08)" : "rgba(251,191,36,0.08)",
                    }}>
                      {platform.matchScore}% Match
                    </div>
                  </div>

                  <h3 className={styles.cardName}>{platform.name}</h3>
                  <p className={styles.cardDesc}>{platform.description}</p>

                  <div className={styles.cardFooter}>
                    <span className={styles.catBadge}>{platform.categoryLabel}</span>
                    <span className={styles.cardArrow}>
                      {clicked === platform.name
                        ? <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                        : <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className={styles.footerNote}>
              Platforms ranked by match score based on your detected role <strong>{analysis.role}</strong> and {analysis.skills.length} extracted skills.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
