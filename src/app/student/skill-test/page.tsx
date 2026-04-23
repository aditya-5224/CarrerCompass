"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpenText,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Target,
  Timer,
} from "lucide-react";
import styles from "./skill-test.module.css";

type BucketKey =
  | "numerical"
  | "verbal"
  | "spatial"
  | "social"
  | "leadership"
  | "creative"
  | "mechanical"
  | "detail"
  | "ethics"
  | "strategic"
  | "cultural"
  | "deductive"
  | "language"
  | "analytical";

type Option = {
  id: string;
  label: string;
  text: string;
  score: number;
};

type Question = {
  id: number;
  section: string;
  prompt: string;
  focus: string;
  psychological: string;
  careerDomain: string;
  hiddenInsight: string;
  confidence: number;
  impacts: Array<{ key: BucketKey; weight: number }>;
  options: Option[];
};

type BucketMeta = {
  label: string;
  color: string;
  roles: string[];
  summary: string;
};

const bucketMeta: Record<BucketKey, BucketMeta> = {
  numerical: {
    label: "Numerical Reasoning",
    color: "#66e3ff",
    roles: ["Data Analyst", "Actuary", "Financial Analyst"],
    summary: "Sees patterns, proportions, and logical growth quickly.",
  },
  verbal: {
    label: "Verbal Reasoning",
    color: "#8b9cff",
    roles: ["Lawyer", "Researcher", "Communications Strategist"],
    summary: "Reads nuance, implication, and logical structure in language.",
  },
  spatial: {
    label: "Spatial Reasoning",
    color: "#ffad66",
    roles: ["Architect", "UI/UX Designer", "Product Designer"],
    summary: "Handles rotation, layout, and visual structure comfortably.",
  },
  social: {
    label: "Social Insight",
    color: "#7ee787",
    roles: ["Counselor", "Teacher", "Community Manager"],
    summary: "Notices emotional context and social dynamics fast.",
  },
  leadership: {
    label: "Leadership",
    color: "#f7c64e",
    roles: ["Product Manager", "Team Lead", "Operations Manager"],
    summary: "Balances people, priorities, and execution pressure.",
  },
  creative: {
    label: "Creative Synthesis",
    color: "#ff7eb6",
    roles: ["Marketing Strategist", "Brand Designer", "Content Strategist"],
    summary: "Blends research and aesthetics into a strong concept.",
  },
  mechanical: {
    label: "Mechanical Reasoning",
    color: "#c6a0ff",
    roles: ["Mechanical Engineer", "Technician", "Field Engineer"],
    summary: "Understands force, motion, and systems reliably.",
  },
  detail: {
    label: "Detail & Accuracy",
    color: "#5eead4",
    roles: ["QA Analyst", "Accountant", "HR Specialist"],
    summary: "Catches small mismatches and works methodically.",
  },
  ethics: {
    label: "Ethics & Integrity",
    color: "#fb7185",
    roles: ["Auditor", "Compliance Officer", "HR Generalist"],
    summary: "Shows long-term judgment when rules and pressure collide.",
  },
  strategic: {
    label: "Strategic Thinking",
    color: "#f97316",
    roles: ["Entrepreneur", "Project Lead", "Business Analyst"],
    summary: "Chooses risk with a measured view of consequences.",
  },
  cultural: {
    label: "Cultural Intelligence",
    color: "#38bdf8",
    roles: ["Teacher", "Counselor", "DEI Specialist"],
    summary: "Reads cultural context before judging behavior.",
  },
  deductive: {
    label: "Deductive Logic",
    color: "#a78bfa",
    roles: ["Researcher", "Policy Analyst", "Legal Analyst"],
    summary: "Follows premises carefully and avoids jumpy conclusions.",
  },
  language: {
    label: "Language Precision",
    color: "#34d399",
    roles: ["Editor", "PR Coordinator", "Scholarship Advisor"],
    summary: "Uses formal, professional language with care.",
  },
  analytical: {
    label: "Analytical Thinking",
    color: "#60a5fa",
    roles: ["Software Engineer", "Data Scientist", "Business Analyst"],
    summary: "Integrates evidence, trends, and logic into action.",
  },
};

const questions: Question[] = [
  {
    id: 1,
    section: "Numerical Trend Recognition",
    prompt:
      "A student club's social media followers grow as follows: 3, 9, 21, 45, 93. What is the next month target based on this logical progression?",
    focus: "Numerical Reasoning",
    psychological: "Investigative / Thinker",
    careerDomain: "Analytical & Technical",
    hiddenInsight:
      "Separates calculated logic from ambitious guessing under pressure.",
    confidence: 0.95,
    impacts: [{ key: "numerical", weight: 1 }],
    options: [
      { id: "a", label: "A", text: "189", score: 1 },
      { id: "b", label: "B", text: "141", score: 0.2 },
      { id: "c", label: "C", text: "195", score: 0.3 },
      { id: "d", label: "D", text: "120", score: 0.1 },
    ],
  },
  {
    id: 2,
    section: "The Missing Section",
    prompt:
      "A teacher's feedback on your report says: 'Your arguments are technically sound, but the final conclusion feels somewhat detached from your primary evidence.' What is the teacher's core suggestion?",
    focus: "Verbal Reasoning",
    psychological: "Investigative / Social",
    careerDomain: "Social & Psychological",
    hiddenInsight:
      "Measures the ability to detect logical gaps in a written argument.",
    confidence: 0.9,
    impacts: [{ key: "verbal", weight: 1 }],
    options: [
      { id: "a", label: "A", text: "Improve your grammar and spelling.", score: 0.1 },
      { id: "b", label: "B", text: "Strengthen the logical link between your facts and your summary.", score: 1 },
      { id: "c", label: "C", text: "Find more evidence to support a new topic.", score: 0.4 },
      { id: "d", label: "D", text: "The topic is too complex for the evidence provided.", score: 0.2 },
    ],
  },
  {
    id: 3,
    section: "Spatial Event Planning",
    prompt:
      "You must set up 10 booths in a school gym. Two large pillars block the center. If you mentally rotate the booths to create a circular flow around the pillars, how many 2x2 meter booths can fit in a 10x10 meter area while maintaining a 2-meter walking path throughout?",
    focus: "Space Relations",
    psychological: "Realistic / Doer",
    careerDomain: "Analytical & Technical",
    hiddenInsight: "Correlates spatial ability with physical problem-solving speed.",
    confidence: 0.95,
    impacts: [{ key: "spatial", weight: 1 }],
    options: [
      { id: "a", label: "A", text: "12", score: 0.4 },
      { id: "b", label: "B", text: "10", score: 1 },
      { id: "c", label: "C", text: "8", score: 0.6 },
      { id: "d", label: "D", text: "6", score: 0.3 },
    ],
  },
  {
    id: 4,
    section: "The Group Conflict",
    prompt:
      "During a rehearsal for a group presentation, a teammate makes a sarcastic joke about your section of the work. The rest laugh. You feel this undermines your role as leader. How do you respond?",
    focus: "Social + Leadership",
    psychological: "Enterprising + Social",
    careerDomain: "Leadership & Business",
    hiddenInsight:
      "Separates task focus from relationship management under stress.",
    confidence: 0.92,
    impacts: [
      { key: "leadership", weight: 0.6 },
      { key: "social", weight: 0.4 },
    ],
    options: [
      {
        id: "a",
        label: "A",
        text: "Wait until the rehearsal finishes, then speak to the teammate privately about the team's focus.",
        score: 1,
      },
      {
        id: "b",
        label: "B",
        text: "Make a joke back at yourself to show the team you are easygoing.",
        score: 0.6,
      },
      {
        id: "c",
        label: "C",
        text: "Immediately stop the rehearsal to remind everyone of the grading criteria.",
        score: 0.4,
      },
      {
        id: "d",
        label: "D",
        text: "Ignore the comment and continue with increased focus.",
        score: 0.3,
      },
    ],
  },
  {
    id: 5,
    section: "Abstract Pattern Sequence",
    prompt:
      "Sequence: Circle inside Square, Square inside Triangle, Triangle inside Hexagon. What completes the series?",
    focus: "Abstract Reasoning",
    psychological: "Investigative / Thinker",
    careerDomain: "Analytical & Technical",
    hiddenInsight:
      "Predicts success in non-verbal problem-solving and pattern recognition.",
    confidence: 0.95,
    impacts: [{ key: "analytical", weight: 1 }],
    options: [
      { id: "a", label: "A", text: "Hexagon inside Circle", score: 0.2 },
      { id: "b", label: "B", text: "Hexagon inside Octagon", score: 1 },
      { id: "c", label: "C", text: "Octagon inside Square", score: 0.4 },
      { id: "d", label: "D", text: "Square inside Circle", score: 0.3 },
    ],
  },
  {
    id: 6,
    section: "Mechanical Advantage",
    prompt:
      "To lift a 50kg crate using a long wooden plank as a lever, where should the pivot point (fulcrum) be placed to use the least amount of physical force?",
    focus: "Mechanical Reasoning",
    psychological: "Realistic / Doer",
    careerDomain: "Analytical & Technical",
    hiddenInsight:
      "Predicts comfort with physical systems, tools, and vocational tasks.",
    confidence: 0.95,
    impacts: [{ key: "mechanical", weight: 1 }],
    options: [
      { id: "a", label: "A", text: "Closest to your hands.", score: 0.2 },
      { id: "b", label: "B", text: "Exactly in the middle.", score: 0.5 },
      { id: "c", label: "C", text: "Closest to the heavy crate.", score: 1 },
      { id: "d", label: "D", text: "Force remains constant regardless of placement.", score: 0 },
    ],
  },
  {
    id: 7,
    section: "Data Interpretation",
    prompt:
      "Club attendance Month 1: 20, Month 2: 30, Month 3: 15. In Month 3, a mandatory exam session was held the same day. A teammate says, 'The club is dying.' What is your logical conclusion?",
    focus: "Analytical Reasoning",
    psychological: "Investigative / Thinker",
    careerDomain: "Analytical & Technical",
    hiddenInsight:
      "Measures whether you isolate a confounding variable before jumping to conclusions.",
    confidence: 0.9,
    impacts: [{ key: "analytical", weight: 1 }],
    options: [
      { id: "a", label: "A", text: "The teammate is right; interest is declining.", score: 0.2 },
      {
        id: "b",
        label: "B",
        text: "The exam is a confounding variable; we must test Month 4 without exams to know the trend.",
        score: 1,
      },
      { id: "c", label: "C", text: "We should change the club topic to something more exciting.", score: 0.3 },
      { id: "d", label: "D", text: "The growth in Month 2 was a fluke.", score: 0.4 },
    ],
  },
  {
    id: 8,
    section: "The Design Dilemma",
    prompt:
      "You are designing a logo for a local charity. They want 'traditional,' but your research shows a 'modern' logo will attract 40% more young donors.",
    focus: "Creative + Analytical",
    psychological: "Artistic + Investigative",
    careerDomain: "Creative & Business",
    hiddenInsight:
      "Measures how well you synthesize conflicting evidence into one strong solution.",
    confidence: 0.94,
    impacts: [
      { key: "creative", weight: 0.6 },
      { key: "analytical", weight: 0.4 },
    ],
    options: [
      {
        id: "a",
        label: "A",
        text: "Create a hybrid logo using a classic symbol in a clean, modern style.",
        score: 1,
      },
      { id: "b", label: "B", text: "Follow the instructions exactly to ensure the client is happy.", score: 0.6 },
      { id: "c", label: "C", text: "Use the modern style only, as you are the expert.", score: 0.4 },
      { id: "d", label: "D", text: "Create two different logos and let them choose without giving your opinion.", score: 0.5 },
    ],
  },
  {
    id: 9,
    section: "Clerical Accuracy Check",
    prompt:
      "Compare these two student lists of IDs: List 1: 4492-X, 3921-A, 8820-Z, 1102-B. List 2: 4492-X, 3921-A, 8802-Z, 1102-B. How many errors are there in List 2?",
    focus: "Perceptual Speed and Accuracy",
    psychological: "Conventional / Organizer",
    careerDomain: "Leadership & Technical",
    hiddenInsight:
      "High scores predict success in detail-oriented, systematic environments.",
    confidence: 0.95,
    impacts: [{ key: "detail", weight: 1 }],
    options: [
      { id: "a", label: "A", text: "0", score: 0.1 },
      { id: "b", label: "B", text: "1", score: 1 },
      { id: "c", label: "C", text: "2", score: 0.2 },
      { id: "d", label: "D", text: "3", score: 0.1 },
    ],
  },
  {
    id: 10,
    section: "The Ethical Slide",
    prompt:
      "You realize a teammate accidentally inflated your group's project success in a report to the teacher. Your teacher has already given the group an 'A'. What do you do?",
    focus: "Integrity + Strategic",
    psychological: "Conventional + Social",
    careerDomain: "Leadership & Business",
    hiddenInsight:
      "Tests long-term integrity risk instead of short-term comfort.",
    confidence: 0.92,
    impacts: [
      { key: "ethics", weight: 0.7 },
      { key: "social", weight: 0.3 },
    ],
    options: [
      {
        id: "a",
        label: "A",
        text: "Inform the teacher privately and offer to fix the data, even if the grade changes.",
        score: 1,
      },
      { id: "b", label: "B", text: "Say nothing; it was an accident and the outcome was good.", score: 0.1 },
      { id: "c", label: "C", text: "Correct the teammate in private but leave the grade as is.", score: 0.5 },
      { id: "d", label: "D", text: "Hope the teacher doesn't notice and work extra hard on the next project to earn the grade.", score: 0.3 },
    ],
  },
  {
    id: 11,
    section: "Logical Syllogism",
    prompt:
      "All successful artists are creative. Some students are successful artists. Therefore, some students are creative. Is this:",
    focus: "Deductive Reasoning",
    psychological: "Investigative",
    careerDomain: "Analytical & Social",
    hiddenInsight:
      "Shows resistance to optimism bias by following premises precisely.",
    confidence: 0.95,
    impacts: [{ key: "deductive", weight: 1 }],
    options: [
      { id: "a", label: "A", text: "Always True", score: 1 },
      { id: "b", label: "B", text: "Always False", score: 0 },
      { id: "c", label: "C", text: "Uncertain", score: 0.2 },
    ],
  },
  {
    id: 12,
    section: "The Feedback Loop",
    prompt:
      "You worked with Ashley on a project. She was frustrated and quiet. If her anger is due to the difficult math tasks, you can help. What is your first step?",
    focus: "Social + Analytical",
    psychological: "Social",
    careerDomain: "Social & Psychological",
    hiddenInsight:
      "Measures perspective-taking and the quality of your first social move.",
    confidence: 0.93,
    impacts: [
      { key: "social", weight: 0.7 },
      { key: "leadership", weight: 0.3 },
    ],
    options: [
      { id: "a", label: "A", text: "Ask Ashley if she needs help with the project tasks.", score: 0.7 },
      { id: "b", label: "B", text: "Let her know you perceive her frustration and ask if she wants to talk.", score: 1 },
      { id: "c", label: "C", text: "Finish the project tasks yourself to reduce her stress.", score: 0.4 },
      { id: "d", label: "D", text: "Tell the teacher she is being difficult and ask for a new partner.", score: 0.1 },
    ],
  },
  {
    id: 13,
    section: "Language Consistency",
    prompt:
      "Which sentence is most professional for a student scholarship application?",
    focus: "Language Usage",
    psychological: "Conventional / Organizer",
    careerDomain: "Leadership & Business",
    hiddenInsight:
      "Measures attention to detail and awareness of formal communication standards.",
    confidence: 0.92,
    impacts: [
      { key: "language", weight: 0.7 },
      { key: "detail", weight: 0.3 },
    ],
    options: [
      { id: "a", label: "A", text: "I want this because your the best school in the city.", score: 0 },
      { id: "b", label: "B", text: "My objective is to utilize my competencies in a way that provides value to your organization.", score: 1 },
      { id: "c", label: "C", text: "I can do the work better then any other student in my class.", score: 0.1 },
      { id: "d", label: "D", text: "I'm normally able to 'get into someone's shoes' and experience their emotions.", score: 0.6 },
    ],
  },
  {
    id: 14,
    section: "Abstract Reasoning: Matrix Completion",
    prompt:
      "The PDF's visual prompt shows a 3x3 grid where shapes rotate 90 degrees clockwise in each step. Which choice best completes the final square?",
    focus: "Abstract Reasoning",
    psychological: "Investigative",
    careerDomain: "Analytical & Technical",
    hiddenInsight:
      "This visual logic task checks whether you can continue the rule without getting lost in surface detail.",
    confidence: 0.95,
    impacts: [
      { key: "spatial", weight: 0.6 },
      { key: "analytical", weight: 0.4 },
    ],
    options: [
      { id: "a", label: "A", text: "Continue the same clockwise rotation to complete the matrix.", score: 1 },
      { id: "b", label: "B", text: "Freeze the previous shape and repeat it unchanged.", score: 0.3 },
      { id: "c", label: "C", text: "Rotate only the inner shape while leaving the outer shape fixed.", score: 0.6 },
      { id: "d", label: "D", text: "Swap the shapes without following the rotation rule.", score: 0.2 },
    ],
  },
  {
    id: 15,
    section: "The Expert Trap",
    prompt:
      "You know the correct answer to a lab problem, but your group leader is explaining it incorrectly. How do you respond?",
    focus: "Social + Strategic",
    psychological: "Social + Enterprising",
    careerDomain: "Leadership & Business",
    hiddenInsight:
      "Evaluates social regulation: modifying behavior to achieve the best group outcome.",
    confidence: 0.9,
    impacts: [
      { key: "social", weight: 0.6 },
      { key: "leadership", weight: 0.4 },
    ],
    options: [
      {
        id: "a",
        label: "A",
        text: "Politely ask a question that highlights the error, allowing the leader to discover the correction themselves.",
        score: 1,
      },
      { id: "b", label: "B", text: "State the correct answer out loud immediately so the group doesn't waste time.", score: 0.6 },
      { id: "c", label: "C", text: "Say nothing; it's better to follow the leader even if they are wrong.", score: 0.4 },
      { id: "d", label: "D", text: "Correct the leader and then report them to the teacher for poor management.", score: 0.2 },
    ],
  },
  {
    id: 16,
    section: "Mechanical Gears",
    prompt:
      "If the first gear in a system of four connected gears rotates clockwise, which direction does the fourth gear rotate?",
    focus: "Mechanical Reasoning",
    psychological: "Realistic / Doer",
    careerDomain: "Analytical & Technical",
    hiddenInsight: "Each gear reverses direction, so the chain logic matters.",
    confidence: 0.95,
    impacts: [{ key: "mechanical", weight: 1 }],
    options: [
      { id: "a", label: "A", text: "Clockwise", score: 0.2 },
      { id: "b", label: "B", text: "Counter-clockwise", score: 1 },
      { id: "c", label: "C", text: "It doesn't move", score: 0 },
      { id: "d", label: "D", text: "It alternates", score: 0.4 },
    ],
  },
  {
    id: 17,
    section: "Strategic Risk",
    prompt:
      "Your club has 3 months of money left. You can do a 'Safe' small sale with guaranteed $50 profit or an 'Ambitious' event with $500 potential profit but a 50% risk of losing all current funds.",
    focus: "Leadership + Strategic",
    psychological: "Enterprising + Investigative",
    careerDomain: "Leadership & Business",
    hiddenInsight:
      "Distinguishes risk aversion from strategic innovation under uncertainty.",
    confidence: 0.9,
    impacts: [
      { key: "strategic", weight: 0.7 },
      { key: "leadership", weight: 0.3 },
    ],
    options: [
      { id: "a", label: "A", text: "Survey members to see what would make them attend the Ambitious event to reduce risk.", score: 1 },
      { id: "b", label: "B", text: "Do the Ambitious event; high risk is the only way to save the club.", score: 0.8 },
      { id: "c", label: "C", text: "Do the Safe sale to ensure the club stays open as long as possible.", score: 0.5 },
      { id: "d", label: "D", text: "Close the club now and save the money for next year.", score: 0.2 },
    ],
  },
  {
    id: 18,
    section: "The New Student",
    prompt:
      "A new student from a different culture joins your group. They are quiet and don't make eye contact. You:",
    focus: "Psychology + Cultural Intelligence",
    psychological: "Social + Openness",
    careerDomain: "Social & Psychological",
    hiddenInsight:
      "Checks whether you scan for cultural cues before labeling someone shy.",
    confidence: 0.92,
    impacts: [
      { key: "cultural", weight: 0.8 },
      { key: "social", weight: 0.2 },
    ],
    options: [
      { id: "a", label: "A", text: "Research their culture's communication norms before judging their participation.", score: 1 },
      { id: "b", label: "B", text: "Speak louder and more slowly to ensure they understand you.", score: 0.3 },
      { id: "c", label: "C", text: "Assume they are shy and do the talking for them.", score: 0.4 },
      { id: "d", label: "D", text: "Tell them eye contact is necessary for leadership roles.", score: 0.1 },
    ],
  },
  {
    id: 19,
    section: "Arithmetic Reasoning",
    prompt:
      "A student store buys pens for $0.50 and sells them for $1.20. If they sell 40 pens but 5 pens are stolen, what is their total profit?",
    focus: "Numerical Reasoning",
    psychological: "Investigative",
    careerDomain: "Analytical & Technical",
    hiddenInsight:
      "Checks whether you account for costs, not just visible sales revenue.",
    confidence: 0.95,
    impacts: [
      { key: "numerical", weight: 0.7 },
      { key: "detail", weight: 0.3 },
    ],
    options: [
      { id: "a", label: "A", text: "$28.00", score: 0.2 },
      { id: "b", label: "B", text: "$25.50", score: 1 },
      { id: "c", label: "C", text: "$23.00", score: 0.4 },
      { id: "d", label: "D", text: "$30.00", score: 0.3 },
    ],
  },
  {
    id: 20,
    section: "The Leadership Choice",
    prompt:
      "You must pick 3 people for your debate team. Do you pick:",
    focus: "Leadership + Team Composition",
    psychological: "Enterprising + Conventional",
    careerDomain: "Leadership & Business",
    hiddenInsight:
      "Shows whether you scan for competencies instead of comfort when building a team.",
    confidence: 0.92,
    impacts: [
      { key: "leadership", weight: 0.6 },
      { key: "detail", weight: 0.4 },
    ],
    options: [
      { id: "a", label: "A", text: "Your 3 best friends so you can work together easily.", score: 0.3 },
      { id: "b", label: "B", text: "The 3 students with the highest history grades.", score: 0.7 },
      { id: "c", label: "C", text: "One great speaker, one great researcher, and one person who is good at organizing notes.", score: 1 },
      { id: "d", label: "D", text: "People who haven't had a chance to be on a team yet to be fair.", score: 0.6 },
    ],
  },
];

const bucketOrder: BucketKey[] = [
  "analytical",
  "numerical",
  "verbal",
  "spatial",
  "social",
  "leadership",
  "creative",
  "mechanical",
  "detail",
  "ethics",
  "strategic",
  "cultural",
  "deductive",
  "language",
];

export default function SkillTest() {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [notice, setNotice] = useState<string | null>(null);

  const answeredCount = Object.keys(answers).length;
  const currentQuestion = questions[activeIndex];
  const currentAnswer = answers[currentQuestion?.id];

  const results = useMemo(() => {
    const totals: Record<BucketKey, { score: number; max: number }> = {
      numerical: { score: 0, max: 0 },
      verbal: { score: 0, max: 0 },
      spatial: { score: 0, max: 0 },
      social: { score: 0, max: 0 },
      leadership: { score: 0, max: 0 },
      creative: { score: 0, max: 0 },
      mechanical: { score: 0, max: 0 },
      detail: { score: 0, max: 0 },
      ethics: { score: 0, max: 0 },
      strategic: { score: 0, max: 0 },
      cultural: { score: 0, max: 0 },
      deductive: { score: 0, max: 0 },
      language: { score: 0, max: 0 },
      analytical: { score: 0, max: 0 },
    };

    let totalScore = 0;
    let maxScore = 0;

    questions.forEach((question) => {
      const selectedOption = question.options.find((option) => option.id === answers[question.id]);
      const bestOption = Math.max(...question.options.map((option) => option.score));
      const resolvedScore = selectedOption?.score ?? 0;

      totalScore += resolvedScore * question.confidence;
      maxScore += bestOption * question.confidence;

      question.impacts.forEach((impact) => {
        totals[impact.key].score += resolvedScore * impact.weight * question.confidence;
        totals[impact.key].max += bestOption * impact.weight * question.confidence;
      });
    });

    const bucketScores = bucketOrder.map((key) => ({
      key,
      label: bucketMeta[key].label,
      color: bucketMeta[key].color,
      summary: bucketMeta[key].summary,
      roles: bucketMeta[key].roles,
      percent: totals[key].max > 0 ? Math.round((totals[key].score / totals[key].max) * 100) : 0,
    }));

    const sortedBuckets = [...bucketScores].sort((left, right) => right.percent - left.percent);
    const overallScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    return {
      bucketScores,
      sortedBuckets,
      overallScore,
    };
  }, [answers]);

  const primaryBucket = results.sortedBuckets[0];
  const secondaryBucket = results.sortedBuckets[1];
  const weakestBucket = [...results.sortedBuckets].sort((left, right) => left.percent - right.percent)[0];

  const recommendationRoles = useMemo(() => {
    const roles = results.sortedBuckets.slice(0, 3).flatMap((bucket) => bucket.roles);
    return Array.from(new Set(roles)).slice(0, 4);
  }, [results.sortedBuckets]);

  const summaryTone = useMemo(() => {
    if (!finished) {
      return "Work through each scenario at your own pace. You can move back and revise answers before you submit.";
    }

    if (results.overallScore >= 85) {
      return "You look highly aligned with analytical and leadership-heavy roles that reward structured judgment and fast pattern recognition.";
    }

    if (results.overallScore >= 70) {
      return "You show solid aptitude across several areas. Your strongest lanes are starting to emerge clearly.";
    }

    return "Your profile is still forming. Use the result breakdown to see which thinking style is already strong and which skills need more practice.";
  }, [finished, results.overallScore]);

  const handleSelect = (optionId: string) => {
    setNotice(null);
    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: optionId,
    }));
  };

  const goToQuestion = (index: number) => {
    setActiveIndex(index);
    setNotice(null);
  };

  const handleNext = () => {
    setNotice(null);
    if (activeIndex === questions.length - 1) {
      if (answeredCount !== questions.length) {
        const firstUnanswered = questions.findIndex((question) => !answers[question.id]);
        setNotice(`Please answer question ${firstUnanswered + 1} before finishing.`);
        if (firstUnanswered >= 0) {
          setActiveIndex(firstUnanswered);
        }
        return;
      }

      setFinished(true);
      return;
    }

    setActiveIndex((current) => current + 1);
  };

  const handlePrevious = () => {
    setNotice(null);
    setActiveIndex((current) => Math.max(current - 1, 0));
  };

  const restart = () => {
    setStarted(false);
    setFinished(false);
    setActiveIndex(0);
    setAnswers({});
    setNotice(null);
  };

  const startAssessment = () => {
    setStarted(true);
    setFinished(false);
    setActiveIndex(0);
    setNotice(null);
  };

  const currentBestOption = currentQuestion.options.reduce((winner, option) =>
    option.score > winner.score ? option : winner
  );

  return (
    <div className={styles.page}>
      <div className={styles.auroraPrimary} />
      <div className={styles.auroraSecondary} />

      <main className={styles.shell}>
        <aside className={styles.sidebar}>
          <div className={styles.brand}>
            <div className={styles.brandMark}>
              <BrainCircuit size={22} />
            </div>
            <div>
              <p className={styles.kicker}>CareerCompass</p>
              <h1>Skill Test</h1>
            </div>
          </div>

          <div className={styles.sidebarPanel}>
            <div className={styles.panelHeading}>
              <Sparkles size={16} />
              <span>Assessment snapshot</span>
            </div>
            <div className={styles.snapshotGrid}>
              <article className={styles.snapshotCard}>
                <span>Questions</span>
                <strong>{questions.length}</strong>
              </article>
              <article className={styles.snapshotCard}>
                <span>Answered</span>
                <strong>{answeredCount}</strong>
              </article>
              <article className={styles.snapshotCard}>
                <span>Status</span>
                <strong>{finished ? "Done" : started ? "In progress" : "Ready"}</strong>
              </article>
              <article className={styles.snapshotCard}>
                <span>Fit score</span>
                <strong>{finished ? `${results.overallScore}%` : "—"}</strong>
              </article>
            </div>
          </div>

          {started && (
            <div className={styles.sidebarPanel}>
              <div className={styles.panelHeading}>
                <Target size={16} />
                <span>Question map</span>
              </div>
              <div className={styles.navigator}>
                {questions.map((question, index) => {
                  const isCurrent = index === activeIndex;
                  const isAnswered = Boolean(answers[question.id]);

                  return (
                    <button
                      key={question.id}
                      type="button"
                      className={[
                        styles.navigatorButton,
                        isCurrent ? styles.navigatorButtonActive : "",
                        isAnswered ? styles.navigatorButtonAnswered : "",
                      ].join(" ")}
                      onClick={() => goToQuestion(index)}
                    >
                      <span>{index + 1}</span>
                      <strong>{question.section}</strong>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className={styles.sidebarPanel}>
            <div className={styles.panelHeading}>
              <BookOpenText size={16} />
              <span>How it works</span>
            </div>
            <ul className={styles.legendList}>
              <li>Each answer contributes to an aptitude lane based on the PDF weighting system.</li>
              <li>Finish the full set to unlock your career fit and strength profile.</li>
              <li>You can jump back to any question before submitting.</li>
            </ul>
          </div>
        </aside>

        <section className={styles.content}>
          {!started ? (
            <div className={styles.heroCard}>
              <div className={styles.heroCopy}>
                <span className={styles.heroTag}>Based on the attached PDF</span>
                <h2>Interactive aptitude and reasoning assessment</h2>
                <p>
                  This version turns the question set into a polished, scenario-driven test with
                  progress tracking, weighted scoring, and a career-fit summary at the end.
                </p>
              </div>

              <div className={styles.heroStats}>
                <article>
                  <Timer size={18} />
                  <div>
                    <strong>8-12 min</strong>
                    <span>Focus-friendly pacing</span>
                  </div>
                </article>
                <article>
                  <BarChart3 size={18} />
                  <div>
                    <strong>Weighted scoring</strong>
                    <span>Profiles strengths by lane</span>
                  </div>
                </article>
                <article>
                  <BadgeCheck size={18} />
                  <div>
                    <strong>Career mapping</strong>
                    <span>Shows aligned roles instantly</span>
                  </div>
                </article>
              </div>

              <div className={styles.heroActions}>
                <button type="button" className={styles.primaryButton} onClick={startAssessment}>
                  Start skill test
                  <ArrowRight size={16} />
                </button>
                <button type="button" className={styles.secondaryButton} onClick={() => setStarted(true)}>
                  Preview questions
                </button>
              </div>
            </div>
          ) : finished ? (
            <div className={styles.resultsWrap}>
              <div className={styles.resultsHero}>
                <div>
                  <span className={styles.heroTag}>Assessment complete</span>
                  <h2>{results.overallScore}% overall fit</h2>
                  <p>{summaryTone}</p>
                </div>
                <button type="button" className={styles.secondaryButton} onClick={restart}>
                  <RotateCcw size={16} />
                  Retake
                </button>
              </div>

              <div className={styles.resultsGrid}>
                <article className={styles.resultsPanel}>
                  <div className={styles.panelHeading}>
                    <Sparkles size={16} />
                    <span>Top strengths</span>
                  </div>
                  <div className={styles.strengthList}>
                    {results.sortedBuckets.slice(0, 5).map((bucket) => (
                      <div className={styles.strengthItem} key={bucket.key}>
                        <div className={styles.strengthLabelRow}>
                          <strong>{bucket.label}</strong>
                          <span>{bucket.percent}%</span>
                        </div>
                        <div className={styles.barTrack}>
                          <span className={styles.barFill} style={{ width: `${bucket.percent}%`, background: bucket.color }} />
                        </div>
                        <p>{bucket.summary}</p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className={styles.resultsPanel}>
                  <div className={styles.panelHeading}>
                    <Target size={16} />
                    <span>Best-fit roles</span>
                  </div>
                  <div className={styles.roleGrid}>
                    {recommendationRoles.map((role) => (
                      <div className={styles.roleCard} key={role}>
                        <span>Recommended</span>
                        <strong>{role}</strong>
                      </div>
                    ))}
                  </div>
                  <div className={styles.noteCard}>
                    <strong>Strongest lane</strong>
                    <p>
                      {primaryBucket?.label} and {secondaryBucket?.label} stood out the most.
                    </p>
                  </div>
                  <div className={styles.noteCard}>
                    <strong>Area to practice</strong>
                    <p>
                      {weakestBucket?.label} is currently your lightest lane, so that is the best place to
                      improve if you want a more balanced profile.
                    </p>
                  </div>
                </article>
              </div>

              <article className={styles.resultsPanel}>
                <div className={styles.panelHeading}>
                  <BookOpenText size={16} />
                  <span>Question review</span>
                </div>
                <div className={styles.reviewList}>
                  {questions.map((question) => {
                    const selectedOption = question.options.find((option) => option.id === answers[question.id]);
                    const benchmarkOption = question.options.reduce((winner, option) =>
                      option.score > winner.score ? option : winner
                    );

                    return (
                      <div className={styles.reviewCard} key={question.id}>
                        <div className={styles.reviewHeader}>
                          <strong>
                            {question.id}. {question.section}
                          </strong>
                          <span>{question.focus}</span>
                        </div>
                        <p>{question.prompt}</p>
                        <div className={styles.reviewMeta}>
                          <span>
                            Your answer: {selectedOption ? `${selectedOption.label} - ${selectedOption.text}` : "Skipped"}
                          </span>
                          <span>
                            Benchmark: {benchmarkOption.label} - {benchmarkOption.text}
                          </span>
                        </div>
                        <div className={styles.reviewInsight}>
                          <strong>Why it matters</strong>
                          <p>{question.hiddenInsight}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            </div>
          ) : (
            <div className={styles.questionStage}>
              <div className={styles.progressWrap}>
                <div className={styles.progressHeader}>
                  <span>
                    Question {activeIndex + 1} of {questions.length}
                  </span>
                  <span>{Math.round(((activeIndex + 1) / questions.length) * 100)}%</span>
                </div>
                <div className={styles.progressTrack}>
                  <span
                    className={styles.progressFill}
                    style={{ width: `${((activeIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {notice && <div className={styles.notice}>{notice}</div>}

              <article className={styles.questionCard}>
                <div className={styles.questionHeader}>
                  <div>
                    <span className={styles.heroTag}>{currentQuestion.section}</span>
                    <h2>{currentQuestion.prompt}</h2>
                  </div>
                  <div className={styles.questionBadge}>
                    <strong>{currentQuestion.focus}</strong>
                    <span>{Math.round(currentQuestion.confidence * 100)}% confidence</span>
                  </div>
                </div>

                <div className={styles.optionGrid}>
                  {currentQuestion.options.map((option) => {
                    const isSelected = currentAnswer === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={[
                          styles.optionCard,
                          isSelected ? styles.optionCardSelected : "",
                        ].join(" ")}
                        onClick={() => handleSelect(option.id)}
                        aria-pressed={isSelected}
                      >
                        <div className={styles.optionTopRow}>
                          <span className={styles.optionLabel}>{option.label}</span>
                          <span className={styles.optionScore}>{Math.round(option.score * 100)}% fit</span>
                        </div>
                        <p>{option.text}</p>
                      </button>
                    );
                  })}
                </div>

                <div className={styles.questionInfoGrid}>
                  <div className={styles.infoCard}>
                    <span>Psychological mapping</span>
                    <strong>{currentQuestion.psychological}</strong>
                  </div>
                  <div className={styles.infoCard}>
                    <span>Career domain</span>
                    <strong>{currentQuestion.careerDomain}</strong>
                  </div>
                  <div className={styles.infoCard}>
                    <span>Hidden insight</span>
                    <strong>{currentQuestion.hiddenInsight}</strong>
                  </div>
                </div>

                <div className={styles.questionControls}>
                  <button type="button" className={styles.secondaryButton} onClick={handlePrevious} disabled={activeIndex === 0}>
                    <ChevronLeft size={16} />
                    Back
                  </button>

                  <div className={styles.controlHint}>
                    <span>Benchmark answer</span>
                    <strong>
                      {currentBestOption.label} - {currentBestOption.text}
                    </strong>
                  </div>

                  <button type="button" className={styles.primaryButton} onClick={handleNext}>
                    {activeIndex === questions.length - 1 ? "Finish assessment" : "Next question"}
                    <ChevronRight size={16} />
                  </button>
                </div>
              </article>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
