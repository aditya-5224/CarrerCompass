"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenText,
  BrainCircuit,
  CheckCircle2,
  CircleDashed,
  ClipboardList,
  Compass,
  Layers3,
  PlayCircle,
  Rocket,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import styles from "./roadmap.module.css";

type RoadmapStep = {
  title: string;
  duration: string;
  resources: string[];
  outcome: string;
  complete: boolean;
};

type RoadmapTemplate = {
  title: string;
  subtitle: string;
  focus: string;
  estimate: string;
  color: string;
  steps: Omit<RoadmapStep, "complete">[];
};

type RoadmapDetails = {
  summary: string;
  weeklyCadence: string;
  portfolioTarget: string;
  checkpoint: string;
};

const roadmapTemplates: Record<string, RoadmapTemplate> = {
  "software engineer": {
    title: "Software Engineer",
    subtitle: "Build systems, ship products, and learn the stack employers actually use.",
    focus: "Frontend, backend, APIs, testing, and deployment",
    estimate: "6-10 months",
    color: "#7c8cff",
    steps: [
      {
        title: "Core Web Foundations",
        duration: "2 weeks",
        resources: ["MDN Web Docs", "freeCodeCamp", "JavaScript.info"],
        outcome: "Comfortable with HTML, CSS, JavaScript, and the browser runtime.",
      },
      {
        title: "Modern React Development",
        duration: "4 weeks",
        resources: ["React Docs", "Next.js Docs", "Frontend Mentor"],
        outcome: "Able to build reusable interfaces and connect pages to data flows.",
      },
      {
        title: "Backend APIs and Auth",
        duration: "4 weeks",
        resources: ["Node.js Docs", "Express", "Postman"],
        outcome: "Ship secure CRUD APIs with auth, validation, and error handling.",
      },
      {
        title: "Data Storage and Models",
        duration: "3 weeks",
        resources: ["MongoDB", "PostgreSQL", "Prisma"],
        outcome: "Design schemas and choose the right persistence layer for the job.",
      },
      {
        title: "Projects and Portfolio",
        duration: "4 weeks",
        resources: ["GitHub", "Vercel", "README templates"],
        outcome: "Publish polished projects that prove you can build and explain work.",
      },
      {
        title: "Interview Readiness",
        duration: "3 weeks",
        resources: ["LeetCode", "System Design Primer", "Pramp"],
        outcome: "Practice problem solving, tradeoffs, and communication under pressure.",
      },
    ],
  },
  "data scientist": {
    title: "Data Scientist",
    subtitle: "Turn raw data into models, experiments, and decisions people trust.",
    focus: "Python, statistics, machine learning, and storytelling",
    estimate: "6-12 months",
    color: "#4fd1c5",
    steps: [
      {
        title: "Python for Data Work",
        duration: "2 weeks",
        resources: ["Python Docs", "Pandas", "NumPy"],
        outcome: "Write scripts that clean, transform, and inspect data confidently.",
      },
      {
        title: "Statistics and Probability",
        duration: "3 weeks",
        resources: ["StatQuest", "Khan Academy", "OpenIntro"],
        outcome: "Understand distributions, significance, sampling, and uncertainty.",
      },
      {
        title: "Exploratory Analysis",
        duration: "3 weeks",
        resources: ["Seaborn", "Matplotlib", "Jupyter"],
        outcome: "Find trends, outliers, and relationships in messy datasets.",
      },
      {
        title: "Machine Learning Basics",
        duration: "4 weeks",
        resources: ["scikit-learn", "fast.ai", "Coursera"],
        outcome: "Train baseline models and evaluate them with real metrics.",
      },
      {
        title: "SQL and Data Pipelines",
        duration: "3 weeks",
        resources: ["SQLBolt", "Mode Analytics", "dbt"],
        outcome: "Pull clean features from databases and production workflows.",
      },
      {
        title: "Capstone and Communication",
        duration: "4 weeks",
        resources: ["Kaggle", "Notion", "Tableau"],
        outcome: "Tell a clear story with data and present a recommendation.",
      },
    ],
  },
  "ux/ui designer": {
    title: "UX/UI Designer",
    subtitle: "Design interfaces that are usable, memorable, and grounded in evidence.",
    focus: "Research, prototyping, design systems, and visual craft",
    estimate: "5-9 months",
    color: "#f472b6",
    steps: [
      {
        title: "Design Fundamentals",
        duration: "2 weeks",
        resources: ["Figma Basics", "Google Design", "Material Design"],
        outcome: "Learn hierarchy, spacing, typography, and composition principles.",
      },
      {
        title: "User Research",
        duration: "3 weeks",
        resources: ["Nielsen Norman Group", "Interview scripts", "Surveys"],
        outcome: "Collect insight before sketching solutions.",
      },
      {
        title: "Wireframes and Prototypes",
        duration: "3 weeks",
        resources: ["Figma", "FigJam", "Prototyping patterns"],
        outcome: "Move from rough flows to interactive mockups quickly.",
      },
      {
        title: "Design Systems",
        duration: "2 weeks",
        resources: ["Atomic design", "Tokens", "Accessibility"],
        outcome: "Build consistent components and accessible interfaces.",
      },
      {
        title: "Portfolio Case Studies",
        duration: "4 weeks",
        resources: ["Behance", "Dribbble", "Notion"],
        outcome: "Show process, not just screens.",
      },
      {
        title: "Motion and Polish",
        duration: "2 weeks",
        resources: ["Framer Motion", "LottieFiles", "After Effects"],
        outcome: "Add tasteful motion that improves clarity and brand feel.",
      },
    ],
  },
};

const genericTemplate: RoadmapTemplate = {
  title: "Career Track",
  subtitle: "A practical learning path built from fundamentals, projects, and proof of skill.",
  focus: "Foundations, tools, applied practice, and job readiness",
  estimate: "4-8 months",
  color: "#60a5fa",
  steps: [
    {
      title: "Foundations",
      duration: "2 weeks",
      resources: ["Official docs", "YouTube", "Roadmap.sh"],
      outcome: "Understand the basic language, tools, and workflow of the field.",
    },
    {
      title: "Core Tools",
      duration: "3 weeks",
      resources: ["Guided tutorials", "Exercises", "Community forums"],
      outcome: "Get comfortable with the standard tools professionals use every day.",
    },
    {
      title: "Small Projects",
      duration: "4 weeks",
      resources: ["GitHub", "Portfolio", "Practice briefs"],
      outcome: "Apply knowledge by building and shipping something concrete.",
    },
    {
      title: "Advanced Concepts",
      duration: "3 weeks",
      resources: ["Books", "Courses", "Case studies"],
      outcome: "Level up with deeper patterns, tradeoffs, and best practices.",
    },
    {
      title: "Portfolio and Proof",
      duration: "3 weeks",
      resources: ["Personal site", "GitHub", "Notion"],
      outcome: "Present your work clearly and make your progress visible.",
    },
    {
      title: "Interview and Networking",
      duration: "2 weeks",
      resources: ["LinkedIn", "Mock interviews", "Resume"],
      outcome: "Prepare for applications, interviews, and professional conversations.",
    },
  ],
};

const careerSuggestions = [
  "Software Engineer",
  "Data Scientist",
  "UX/UI Designer",
  "Cybersecurity Analyst",
  "Product Manager",
  "Digital Marketer",
];

function normalizeCareer(value: string) {
  return value.trim().toLowerCase();
}

function createRoadmap(career: string) {
  const normalized = normalizeCareer(career);
  const preset = roadmapTemplates[normalized];

  if (preset) {
    return preset;
  }

  return {
    ...genericTemplate,
    title: career,
    subtitle: `A tailored plan for building competence and portfolio proof in ${career}.`,
  };
}

function createRoadmapDetails(career: string, roadmap: RoadmapTemplate): RoadmapDetails {
  const role = career.trim() || roadmap.title;
  const lowerRole = role.toLowerCase();

  return {
    summary: `A tailored path for ${role} that breaks the journey into focused learning blocks, portfolio proof, and review cycles.`,
    weeklyCadence:
      lowerRole.includes("designer")
        ? "Spend the week sketching, prototyping, and reviewing one polished concept at a time."
        : lowerRole.includes("data")
          ? "Use each week to clean data, test assumptions, and document what the numbers actually mean."
          : "Reserve one deep-work block for learning, one for building, and one for reviewing what shipped.",
    portfolioTarget:
      lowerRole.includes("data")
        ? "Publish one analysis notebook, one dashboard, and one clear case study."
        : lowerRole.includes("designer")
          ? "Share one case study with research, wireframes, prototypes, and a final design system snapshot."
          : "Ship one project with a live demo, a README, and a short decision log for each milestone.",
    checkpoint:
      lowerRole.includes("engineer")
        ? "Every two weeks, review code quality, deployment stability, and what you can explain without notes."
        : lowerRole.includes("designer")
          ? "Every two weeks, test the design with a user, refine the flow, and compare it against accessibility checks."
          : "Every two weeks, review your output against the role outcome and adjust the next milestone accordingly.",
  };
}

function formatDuration(steps: RoadmapStep[]) {
  const count = steps.length;
  if (count <= 4) return "4-6 months";
  if (count <= 6) return "6-8 months";
  return "8-12 months";
}

export default function Roadmap() {
  const [careerInput, setCareerInput] = useState("");
  const [activeCareer, setActiveCareer] = useState("");
  const [path, setPath] = useState<RoadmapStep[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notice, setNotice] = useState<string>("");

  const roadmap = useMemo(
    () => (activeCareer ? createRoadmap(activeCareer) : genericTemplate),
    [activeCareer]
  );
  const roadmapDetails = useMemo(
    () => createRoadmapDetails(activeCareer || roadmap.title, roadmap),
    [activeCareer, roadmap]
  );

  const completedCount = path.filter((step) => step.complete).length;
  const progressPercent = path.length > 0 ? Math.round((completedCount / path.length) * 100) : 0;
  const remainingCount = path.length - completedCount;

  const focusedSteps = path.map((step, index) => ({
    ...step,
    index,
  }));

  function generateRoadmap(careerValue?: string) {
    const nextCareer = (careerValue ?? careerInput).trim();

    if (isGenerating) {
      return;
    }

    if (!nextCareer) {
      setNotice("Enter a career title to generate a roadmap.");
      return;
    }

    setNotice("Generating your roadmap...");
    setIsGenerating(true);

    window.setTimeout(() => {
      const nextRoadmap = createRoadmap(nextCareer);
      setActiveCareer(nextCareer);
      setPath(nextRoadmap.steps.map((step) => ({ ...step, complete: false })));
      setIsGenerated(true);
      setIsGenerating(false);
      setCareerInput("");
      setNotice(`Roadmap generated for ${nextCareer}.`);
    }, 650);
  }

  function toggleComplete(index: number) {
    setPath((current) =>
      current.map((step, stepIndex) =>
        stepIndex === index ? { ...step, complete: !step.complete } : step
      )
    );
  }

  function markAllComplete() {
    setPath((current) => current.map((step) => ({ ...step, complete: true })));
    setNotice("Every milestone has been marked complete.");
  }

  function resetRoadmap() {
    if (!activeCareer) {
      setNotice("Generate a roadmap first.");
      return;
    }

    const nextRoadmap = createRoadmap(activeCareer);
    setPath(nextRoadmap.steps.map((step) => ({ ...step, complete: false })));
    setNotice("Progress reset.");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    generateRoadmap();
  }

  return (
    <div className={styles.page}>
      <div className={styles.auroraOne} />
      <div className={styles.auroraTwo} />

      <nav className={styles.navbar}>
        <div className={styles.navInner}>
          <div className={styles.brand}>
            <div className={styles.brandMark}>
              <BrainCircuit size={20} />
            </div>
            <div>
              <span className={styles.brandLabel}>Career Compass</span>
              <strong>{activeCareer}</strong>
            </div>
          </div>

          <div className={styles.progressBlock}>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progressPercent}%`, background: roadmap.color }} />
            </div>
            <span>{isGenerated ? `Path Completion: ${progressPercent}%` : "Type a career and press Enter to generate"}</span>
          </div>

          <div className={styles.navActions}>
            <button className={styles.secondaryButton} type="button" onClick={resetRoadmap}>
              Reset Progress
            </button>
            <button className={styles.secondaryButton} type="button" onClick={markAllComplete}>
              Mark All Complete
            </button>
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div className={styles.heroCopy}>
            <span className={styles.pill}>
              <Sparkles size={14} />
              Personalized roadmap builder
            </span>
            <h1>{isGenerated ? `${roadmap.title} learning path` : "Professional learning paths for real career growth."}</h1>
            <p>
              {isGenerated
                ? roadmap.subtitle
                : "Enter a role, press Enter, and watch a structured roadmap appear with milestones, resources, and progress tracking."}
            </p>

            <form className={styles.inputRow} onSubmit={handleSubmit}>
              <input
                value={careerInput}
                onChange={(event) => {
                  setCareerInput(event.target.value);
                  setNotice("");
                }}
                placeholder="e.g. Software Engineer, Product Manager, Data Scientist"
                className={styles.input}
                type="text"
                aria-label="Career title"
              />
              <button type="submit" className={styles.primaryButton} disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Generate Roadmap"}
                <ArrowRight size={16} />
              </button>
            </form>

            {notice && <p className={styles.notice}>{notice}</p>}

            <div className={styles.suggestionRow}>
              {careerSuggestions.map((career) => (
                <button
                  key={career}
                  type="button"
                  className={styles.suggestionChip}
                  onClick={() => {
                    setCareerInput(career);
                    setNotice(`Press Enter to generate the ${career} roadmap.`);
                  }}
                >
                  {career}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.heroPanel}>
            {!isGenerated ? (
              <div className={styles.heroEmptyState}>
                <div className={styles.heroMetricAccent} style={{ borderColor: `${roadmap.color}44` }}>
                  <Compass size={18} />
                  <div>
                    <span>Ready when you are</span>
                    <strong>Press Enter to generate your path</strong>
                  </div>
                </div>
                <div className={styles.emptyPreviewCard}>
                  <BadgeCheck size={18} />
                  <div>
                    <strong>Interactive roadmap</strong>
                    <p>Milestones, resources, and progress tracking will appear here after generation.</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.heroMetric}>
                  <span>Estimated duration</span>
                  <strong>{roadmap.estimate}</strong>
                </div>
                <div className={styles.heroMetric}>
                  <span>Track focus</span>
                  <strong>{roadmap.focus}</strong>
                </div>
                <div className={styles.heroMetric}>
                  <span>Remaining steps</span>
                  <strong>{remainingCount}</strong>
                </div>
                <div className={styles.heroMetricAccent} style={{ borderColor: `${roadmap.color}44` }}>
                  <BadgeCheck size={18} />
                  <div>
                    <span>Current path</span>
                    <strong>{roadmap.title}</strong>
                  </div>
                </div>
                  <div className={styles.detailPanel} style={{ borderColor: `${roadmap.color}33` }}>
                    <span className={styles.detailLabel}>Path details</span>
                    <p>{roadmapDetails.summary}</p>
                    <ul>
                      <li>{roadmapDetails.weeklyCadence}</li>
                      <li>{roadmapDetails.portfolioTarget}</li>
                      <li>{roadmapDetails.checkpoint}</li>
                    </ul>
                  </div>
              </>
            )}
          </div>
        </section>

        <section className={styles.statsGrid}>
          <article className={styles.statCard}>
            <Target size={18} />
            <div>
              <span>Milestones</span>
              <strong>{path.length}</strong>
            </div>
          </article>
          <article className={styles.statCard}>
            <ClipboardList size={18} />
            <div>
              <span>Completed</span>
              <strong>{completedCount}</strong>
            </div>
          </article>
          <article className={styles.statCard}>
            <Trophy size={18} />
            <div>
              <span>Completion</span>
              <strong>{progressPercent}%</strong>
            </div>
          </article>
          <article className={styles.statCard}>
            <Layers3 size={18} />
            <div>
              <span>Completion estimate</span>
              <strong>{formatDuration(path)}</strong>
            </div>
          </article>
        </section>

        {!isGenerated && !isGenerating && (
          <section className={styles.roadmapSection}>
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.pillMuted}>
                  <Layers3 size={14} />
                  Awaiting input
                </span>
                <h2>No roadmap yet</h2>
                <p>Type a career title and press Enter to generate a structured learning path.</p>
              </div>
              <div className={styles.sectionMeta}>
                <Sparkles size={18} />
                <span>Interactive generation enabled</span>
              </div>
            </div>

            <div className={styles.emptyRoadmap}>
              <div className={styles.emptyRoadmapCard}>
                <ClipboardList size={18} />
                <strong>Milestones</strong>
                <p>They will populate here after you generate a roadmap.</p>
              </div>
              <div className={styles.emptyRoadmapCard}>
                <BookOpenText size={18} />
                <strong>Resources</strong>
                <p>Each milestone will include practical tools and references.</p>
              </div>
              <div className={styles.emptyRoadmapCard}>
                <Trophy size={18} />
                <strong>Progress</strong>
                <p>Your completion percentage will update as you mark steps done.</p>
              </div>
            </div>
          </section>
        )}

        {isGenerated && (
          <section className={styles.roadmapSection}>
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.pillMuted}>
                  <Compass size={14} />
                  AI-guided path
                </span>
                <h2>{roadmap.title} Roadmap</h2>
                <p>{roadmap.subtitle}</p>
              </div>
              <div className={styles.sectionMeta} style={{ borderColor: `${roadmap.color}44` }}>
                <PlayCircle size={18} />
                <span>{progressPercent >= 100 ? "Path completed" : "Track your progress in real time"}</span>
              </div>
            </div>

            <div className={styles.timeline}>
              {focusedSteps.map((step) => (
                <article
                  key={`${step.title}-${step.index}`}
                  className={[
                    styles.stepCard,
                    step.complete ? styles.stepCardComplete : "",
                    styles.stepCardReveal,
                  ].join(" ")}
                  style={{ animationDelay: `${step.index * 90}ms` }}
                >
                  <div className={styles.stepTopRow}>
                    <div className={styles.stepIndex} style={{ background: step.complete ? roadmap.color : "rgba(255,255,255,0.08)" }}>
                      {step.complete ? <CheckCircle2 size={18} /> : step.index + 1}
                    </div>
                    <button
                      type="button"
                      className={styles.toggleButton}
                      onClick={() => toggleComplete(step.index)}
                    >
                      {step.complete ? "Completed" : "Mark complete"}
                    </button>
                  </div>

                  <h3>{step.title}</h3>
                  <p>{step.outcome}</p>

                  <div className={styles.stepDetailBar}>
                    <span>Focus</span>
                    <strong>{step.complete ? "Lock in consistency" : "Complete this before moving forward"}</strong>
                  </div>

                  <div className={styles.stepMeta}>
                    <span>
                      <Rocket size={14} />
                      {step.duration}
                    </span>
                    <span>
                      <BookOpenText size={14} />
                      Practical resources
                    </span>
                  </div>

                  <div className={styles.resourceRow}>
                    {step.resources.map((resource) => (
                      <span key={resource} className={styles.resourceChip}>
                        {resource}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {isGenerating && (
          <section className={styles.loadingShell}>
            <div className={styles.loadingCard}>
              <div className={styles.loadingSpinner} />
              <strong>Generating roadmap...</strong>
              <p>Building a tailored path with milestones, resources, and completion flow.</p>
            </div>
          </section>
        )}

        <section className={styles.bottomGrid}>
          <article className={styles.insightCard}>
            <div className={styles.sectionMiniHeader}>
              <Sparkles size={16} />
              <span>Path insights</span>
            </div>
            <ul className={styles.insightList}>
              <li>{roadmapDetails.portfolioTarget}</li>
              <li>{roadmapDetails.weeklyCadence}</li>
              <li>{roadmapDetails.checkpoint}</li>
            </ul>
          </article>

          <article className={styles.insightCardAccent} style={{ borderColor: `${roadmap.color}44` }}>
            <div className={styles.sectionMiniHeader}>
              <CircleDashed size={16} />
              <span>Current status</span>
            </div>
            <strong>{completedCount === path.length ? "Ready for job applications" : "Still in progress"}</strong>
            <p>
              {completedCount === path.length
                ? "Every step is complete. Use this roadmap as your weekly maintenance plan while applying."
                : `You have ${remainingCount} milestone${remainingCount === 1 ? "" : "s"} left before this path is fully complete.`}
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
