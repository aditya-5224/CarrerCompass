"use client";

import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  CheckCircle2,
  CircleDashed,
  ClipboardList,
  Compass,
  Layers3,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import styles from "./roadmap.module.css";

type RoadmapStep = {
  title: string;
  duration: string;
  outcome: string;
  description?: string;
  subtasks?: string[];
  resources: string[];
  skills?: string[];
  complete?: boolean;
};

type RoadmapPhase = {
  title: string;
  duration: string;
  overview?: string;
  steps: RoadmapStep[];
};

type RoadmapData = {
  title: string;
  tagline: string;
  overview: string;
  totalDuration: string;
  difficulty: string;
  jobOutcomes: string[];
  keyTools: string[];
  phases: RoadmapPhase[];
};

type RouteResponse = {
  roadmap?: RoadmapData;
  error?: string;
};

const CAREER_PRESETS = [
  { label: "Software Engineer", icon: "⟨/⟩", colorIndex: 1 },
  { label: "Data Scientist", icon: "∑", colorIndex: 2 },
  { label: "UX/UI Designer", icon: "✦", colorIndex: 3 },
  { label: "Product Manager", icon: "◈", colorIndex: 4 },
  { label: "Cybersecurity Analyst", icon: "⊛", colorIndex: 5 },
  { label: "Digital Marketer", icon: "↗", colorIndex: 6 },
  { label: "Cloud Engineer", icon: "◎", colorIndex: 7 },
  { label: "Machine Learning Engineer", icon: "⧖", colorIndex: 0 },
];

const THEME_CLASSES = [
  styles.theme0,
  styles.theme1,
  styles.theme2,
  styles.theme3,
  styles.theme4,
  styles.theme5,
  styles.theme6,
  styles.theme7,
];

const PHASE_COLOR_CLASSES = [
  styles.phaseColor0,
  styles.phaseColor1,
  styles.phaseColor2,
  styles.phaseColor3,
  styles.phaseColor4,
  styles.phaseColor5,
  styles.phaseColor6,
  styles.phaseColor7,
];

function hashString(value: string) {
  let hash = 0;
  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash;
}

function getThemeClass(value: string) {
  return THEME_CLASSES[hashString(value || "career") % THEME_CLASSES.length];
}

function ProgressRing({ percent, themeClass, size = 64 }: { percent: number; themeClass: string; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} className={styles.progressRing} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={radius} className={styles.progressTrackCircle} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        className={`${styles.progressValueCircle} ${themeClass}`}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
      />
    </svg>
  );
}

function StepCard({
  step,
  index,
  accentClass,
  onToggle,
  expanded,
  onExpand,
}: {
  step: RoadmapStep;
  index: number;
  accentClass: string;
  onToggle: (index: number) => void;
  expanded: boolean;
  onExpand: (index: number) => void;
}) {
  const isComplete = Boolean(step.complete);

  return (
    <article className={`${styles.stepCard} ${accentClass} ${isComplete ? styles.stepCardComplete : ""} ${expanded ? styles.stepCardExpanded : ""}`}>
      <div
        className={styles.stepTopRow}
        onClick={() => onExpand(index)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onExpand(index);
          }
        }}
      >
        <div className={`${styles.stepIndex} ${isComplete ? styles.stepIndexComplete : ""}`}>
          {isComplete ? <CheckCircle2 size={18} /> : String(index + 1).padStart(2, "0")}
        </div>
        <div className={styles.stepHeaderCopy}>
          <h3>{step.title}</h3>
          <p>{step.outcome}</p>
        </div>
        <div className={styles.stepHeaderMeta}>
          <span className={styles.stepPill}>{step.duration}</span>
          <span className={styles.stepChevron}>{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {expanded ? (
        <div className={styles.stepExpandedBody}>
          {step.description ? <p className={styles.stepDescription}>{step.description}</p> : null}

          {step.subtasks?.length ? (
            <div className={styles.detailGroup}>
              <p className={styles.groupLabel}>Key Tasks</p>
              <div className={styles.taskList}>
                {step.subtasks.map((task) => (
                  <div key={task} className={styles.taskItem}>
                    <span className={styles.taskBullet}>›</span>
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className={styles.detailGroup}>
            <p className={styles.groupLabel}>Resources</p>
            <div className={styles.chipRow}>
              {step.resources.map((resource) => (
                <span key={resource} className={styles.resourceChip}>
                  {resource}
                </span>
              ))}
            </div>
          </div>

          {step.skills?.length ? (
            <div className={styles.detailGroup}>
              <p className={styles.groupLabel}>Skills Gained</p>
              <div className={styles.chipRow}>
                {step.skills.map((skill) => (
                  <span key={skill} className={styles.skillChip}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <button
            type="button"
            className={styles.toggleButton}
            onClick={(event) => {
              event.stopPropagation();
              onToggle(index);
            }}
          >
            {isComplete ? "✓ Mark Incomplete" : "Mark as Complete"}
          </button>
        </div>
      ) : null}
    </article>
  );
}

function PhaseBlock({
  phase,
  phaseIndex,
  accentClass,
  onToggle,
  completedMap,
}: {
  phase: RoadmapPhase;
  phaseIndex: number;
  accentClass: string;
  onToggle: (phaseIndex: number, stepIndex: number) => void;
  completedMap: Record<string, boolean>;
}) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const completed = phase.steps.filter((_, stepIndex) => completedMap[`${phaseIndex}-${stepIndex}`]).length;
  const total = phase.steps.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section className={styles.phaseBlock}>
      <div className={styles.phaseHeader}>
        <ProgressRing percent={percent} themeClass={accentClass} size={52} />
        <div className={styles.phaseHeaderCopy}>
          <div className={styles.phaseMetaRow}>
            <span className={styles.phaseLabel}>Phase {phaseIndex + 1}</span>
            <span className={`${styles.phaseDurationPill} ${accentClass}`}>{phase.duration}</span>
          </div>
          <h2>{phase.title}</h2>
          <p>
            {completed}/{total} steps · {percent}% complete
          </p>
        </div>
      </div>

      {phase.overview ? <p className={styles.phaseOverview}>{phase.overview}</p> : null}

      <div className={styles.timeline}>
        {phase.steps.map((step, stepIndex) => (
          <StepCard
            key={`${phaseIndex}-${stepIndex}-${step.title}`}
            step={{ ...step, complete: Boolean(completedMap[`${phaseIndex}-${stepIndex}`]) }}
            index={stepIndex}
            accentClass={accentClass}
            onToggle={() => onToggle(phaseIndex, stepIndex)}
            expanded={expandedStep === stepIndex}
            onExpand={(nextIndex) => setExpandedStep(expandedStep === nextIndex ? null : nextIndex)}
          />
        ))}
      </div>
    </section>
  );
}

export default function RoadmapPage() {
  const [career, setCareer] = useState("");
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [error, setError] = useState("");
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"roadmap" | "tools" | "outcomes">("roadmap");

  const totalSteps = roadmap ? roadmap.phases.reduce((sum, phase) => sum + phase.steps.length, 0) : 0;
  const completedCount = Object.values(completedMap).filter(Boolean).length;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;
  const remainingCount = totalSteps - completedCount;
  const themeClass = getThemeClass(roadmap?.title || career || "career");

  async function generateRoadmap(careerValue?: string) {
    const nextCareer = (careerValue ?? career).trim();

    if (!nextCareer || loading) {
      return;
    }

    setError("");
    setLoading(true);
    setLoadMsg("Analyzing career landscape...");
    setRoadmap(null);
    setCompletedMap({});

    const loadMessages = [
      "Analyzing career landscape...",
      "Mapping skill dependencies...",
      "Structuring learning phases...",
      "Curating resources and milestones...",
      "Finalizing your roadmap...",
    ];

    const interval = window.setInterval(() => {
      setLoadMsg((current) => {
        const index = loadMessages.indexOf(current);
        return loadMessages[Math.min(index + 1, loadMessages.length - 1)];
      });
    }, 1800);

    try {
      const response = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ career: nextCareer }),
      });

      const payload = (await response.json()) as RouteResponse;

      if (!response.ok || !payload.roadmap) {
        throw new Error(payload.error || "Failed to generate roadmap.");
      }

      setRoadmap(payload.roadmap);
      setActiveTab("roadmap");
      setCareer("");
    } catch (generationError) {
      console.error("Roadmap generation error:", generationError);
      setError(generationError instanceof Error ? generationError.message : "Failed to generate roadmap. Please try again.");
    } finally {
      window.clearInterval(interval);
      setLoadMsg("");
      setLoading(false);
    }
  }

  function toggleStep(phaseIndex: number, stepIndex: number) {
    const key = `${phaseIndex}-${stepIndex}`;
    setCompletedMap((current) => ({ ...current, [key]: !current[key] }));
  }

  function resetRoadmap() {
    setRoadmap(null);
    setCompletedMap({});
    setCareer("");
    setActiveTab("roadmap");
    setError("");
  }

  function markAllComplete() {
    if (!roadmap) {
      return;
    }

    const nextMap: Record<string, boolean> = {};
    roadmap.phases.forEach((phase, phaseIndex) => {
      phase.steps.forEach((_, stepIndex) => {
        nextMap[`${phaseIndex}-${stepIndex}`] = true;
      });
    });
    setCompletedMap(nextMap);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void generateRoadmap();
  }

  return (
    <div className={`${styles.page} ${themeClass}`}>
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
              <strong>{roadmap ? roadmap.title : "Build your path"}</strong>
            </div>
          </div>

          <div className={styles.progressBlock}>
            <div className={styles.progressRingRow}>
              <ProgressRing percent={progressPercent} themeClass={themeClass} size={42} />
              <div>
                <strong>{roadmap ? `${progressPercent}% complete` : "Ready to generate"}</strong>
                <span>{roadmap ? `${completedCount}/${totalSteps} steps complete` : "Type a career and generate a roadmap"}</span>
              </div>
            </div>
          </div>

          <div className={styles.navActions}>
            <button className={styles.secondaryButton} type="button" onClick={resetRoadmap}>
              Reset Progress
            </button>
            <button className={styles.secondaryButton} type="button" onClick={markAllComplete} disabled={!roadmap}>
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
              AI-powered career roadmap
            </span>
            <h1>{roadmap ? `${roadmap.title} learning path` : "Professional learning paths for real career growth."}</h1>
            <p>
              {roadmap
                ? roadmap.overview
                : "Enter a role, press Enter, and generate a structured roadmap with phases, resources, and progress tracking."}
            </p>

            <form className={styles.inputRow} onSubmit={handleSubmit}>
              <input
                value={career}
                onChange={(event) => {
                  setCareer(event.target.value);
                  setError("");
                }}
                placeholder="e.g. Software Engineer, Product Manager, Data Scientist"
                className={styles.input}
                type="text"
                aria-label="Career title"
              />
              <button type="submit" className={styles.primaryButton} disabled={loading || !career.trim()}>
                {loading ? "Generating..." : "Generate Roadmap"}
                <ArrowRight size={16} />
              </button>
            </form>

            {error ? <p className={styles.errorText}>{error}</p> : null}
            {loadMsg ? <p className={styles.notice}>{loadMsg}</p> : null}

            <div className={styles.suggestionRow}>
              {CAREER_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className={`${styles.suggestionChip} ${THEME_CLASSES[preset.colorIndex]}`}
                  onClick={() => {
                    setCareer(preset.label);
                    void generateRoadmap(preset.label);
                  }}
                >
                  <span className={styles.suggestionIcon}>{preset.icon}</span>
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.heroPanel}>
            {!roadmap ? (
              <div className={styles.heroEmptyState}>
                <div className={`${styles.heroMetricAccent} ${themeClass}`}>
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
                  <strong>{roadmap.totalDuration}</strong>
                </div>
                <div className={styles.heroMetric}>
                  <span>Track focus</span>
                  <strong>{roadmap.difficulty}</strong>
                </div>
                <div className={styles.heroMetric}>
                  <span>Remaining steps</span>
                  <strong>{remainingCount}</strong>
                </div>
                <div className={`${styles.heroMetricAccent} ${themeClass}`}>
                  <BadgeCheck size={18} />
                  <div>
                    <span>Current path</span>
                    <strong>{roadmap.title}</strong>
                  </div>
                </div>
                <div className={styles.detailPanel}>
                  <span className={styles.detailLabel}>Path details</span>
                  <p>{roadmap.tagline}</p>
                  <ul>
                    <li>{roadmap.overview}</li>
                    <li>{roadmap.jobOutcomes[0] || "Job-ready outcome"}</li>
                    <li>{roadmap.keyTools[0] || "Core tools"}</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </section>

        {loading ? (
          <section className={styles.loadingShell}>
            <div className={styles.loadingCard}>
              <div className={styles.loadingSpinner} />
              <strong>Generating roadmap...</strong>
              <p>Building a tailored path with milestones, resources, and completion flow.</p>
            </div>
          </section>
        ) : null}

        {roadmap ? (
          <>
            <section className={styles.statsGrid}>
              <article className={styles.statCard}>
                <Target size={18} />
                <div>
                  <span>Milestones</span>
                  <strong>{totalSteps}</strong>
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
                  <span>Remaining</span>
                  <strong>{remainingCount}</strong>
                </div>
              </article>
            </section>

            <section className={styles.tabsRow}>
              {[
                { id: "roadmap" as const, label: "Roadmap" },
                { id: "tools" as const, label: "Key Tools" },
                { id: "outcomes" as const, label: "Career Outcomes" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabButtonActive : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
              <button type="button" className={styles.newRoadmapButton} onClick={resetRoadmap}>
                New Roadmap
              </button>
            </section>

            {activeTab === "roadmap" ? (
              <section className={styles.roadmapSection}>
                {roadmap.phases.map((phase, phaseIndex) => (
                  <PhaseBlock
                    key={`${phaseIndex}-${phase.title}`}
                    phase={phase}
                    phaseIndex={phaseIndex}
                    accentClass={PHASE_COLOR_CLASSES[phaseIndex % PHASE_COLOR_CLASSES.length]}
                    onToggle={toggleStep}
                    completedMap={completedMap}
                  />
                ))}
                {progressPercent === 100 ? (
                  <div className={styles.completedBanner}>
                    <div className={styles.completedIcon}>🎉</div>
                    <h2>Roadmap Complete!</h2>
                    <p>Every milestone is done. Use this roadmap as your weekly maintenance plan while applying.</p>
                  </div>
                ) : null}
              </section>
            ) : null}

            {activeTab === "tools" ? (
              <section className={styles.infoCard}>
                <h2>Key Tools & Technologies</h2>
                <p>Core tools you'll master on this path</p>
                <div className={styles.toolGrid}>
                  {roadmap.keyTools.map((tool, index) => (
                    <div key={tool} className={`${styles.toolChip} ${THEME_CLASSES[index % THEME_CLASSES.length]}`}>
                      {tool}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {activeTab === "outcomes" ? (
              <section className={styles.infoCard}>
                <h2>Career Outcomes</h2>
                <p>Roles you can pursue after completing this roadmap</p>
                <div className={styles.outcomeList}>
                  {roadmap.jobOutcomes.map((job, index) => (
                    <div key={job} className={styles.outcomeItem}>
                      <div className={`${styles.outcomeIndex} ${THEME_CLASSES[index % THEME_CLASSES.length]}`}>
                        {index + 1}
                      </div>
                      <span>{job}</span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <section className={styles.bottomGrid}>
              <article className={styles.insightCard}>
                <div className={styles.sectionMiniHeader}>
                  <Sparkles size={16} />
                  <span>Path insights</span>
                </div>
                <ul className={styles.insightList}>
                  <li>{roadmap.overview}</li>
                  <li>{roadmap.tagline}</li>
                  <li>{roadmap.totalDuration}</li>
                </ul>
              </article>

              <article className={`${styles.insightCardAccent} ${themeClass}`}>
                <div className={styles.sectionMiniHeader}>
                  <CircleDashed size={16} />
                  <span>Current status</span>
                </div>
                <strong>{completedCount === totalSteps ? "Ready for job applications" : "Still in progress"}</strong>
                <p>
                  {completedCount === totalSteps
                    ? "Every step is complete. Use this roadmap as your weekly maintenance plan while applying."
                    : `You have ${remainingCount} milestone${remainingCount === 1 ? "" : "s"} left before this path is fully complete.`}
                </p>
              </article>
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}