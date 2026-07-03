"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, ArrowLeft, Sparkles, Monitor, Smile, Frown, Meh,
  Mic, MicOff, Volume2, VolumeX, Play
} from "lucide-react";
import Link from "next/link";
import styles from "./interview.module.css";
import { motion, AnimatePresence } from "framer-motion";

// ─── Hardcoded Question Bank (API-free demo mode) ───────────────────────────
const QUESTION_BANK: Record<string, string[]> = {
  "Google": [
    "Tell me about yourself and why you want to work at Google.",
    "Explain the time complexity of QuickSort vs MergeSort. When would you prefer one over the other?",
    "Design a URL shortener like bit.ly. Walk me through your architecture.",
    "You're given a system handling 1 million requests per second. How do you scale it?",
    "Tell me about a time you disagreed with your team lead. How did you handle it?",
    "What is the difference between a process and a thread? Give a real-world analogy.",
    "How would you detect a cycle in a linked list? Write the algorithm out loud.",
    "What's your biggest technical weakness and what are you doing to fix it?",
  ],
  "Amazon": [
    "Tell me about yourself and why Amazon.",
    "Describe a situation where you took ownership of a failing project. What was the outcome?",
    "How do you handle a situation where the customer's requirement conflicts with your technical feasibility?",
    "Design Amazon's product recommendation system at a high level.",
    "Tell me about a time you delivered results under extreme pressure.",
    "Explain CAP theorem and where Amazon's DynamoDB sits in it.",
    "How would you implement a rate limiter for an API? Walk me through the code logic.",
    "Where do you see yourself in 5 years and how does Amazon fit into that vision?",
  ],
  "Meta": [
    "Tell me about yourself and your interest in Meta.",
    "How would you design Facebook's News Feed ranking algorithm?",
    "Tell me about a project where you moved fast and broke something. What did you learn?",
    "Explain the difference between SQL and NoSQL databases with examples.",
    "How would you detect fake accounts at scale? What signals would you use?",
    "Tell me about your most technically complex project.",
    "How does React's Virtual DOM work? Why is it faster than direct DOM manipulation?",
    "What's a technical decision you regret and what would you do differently?",
  ],
  "Microsoft": [
    "Tell me about yourself and why Microsoft.",
    "How does garbage collection work in languages like Java or C#?",
    "Design a collaborative document editing system like Google Docs.",
    "Tell me about a time you mentored or helped a colleague grow technically.",
    "What is the difference between REST and GraphQL? When would you use each?",
    "How would you implement authentication using JWT tokens? What are the security risks?",
    "Tell me about a time you had to learn a new technology very quickly.",
    "If you could redesign one Microsoft product, what would it be and how?",
  ],
  "default": [
    "Tell me about yourself and why you're excited about this role.",
    "What is your strongest technical skill and how have you applied it professionally?",
    "Describe a challenging bug you fixed. How did you approach debugging it?",
    "What is Object-Oriented Programming? Explain its four core principles with examples.",
    "How do you ensure the quality of your code? Walk me through your process.",
    "Tell me about a time you missed a deadline. What happened and what did you learn?",
    "Explain REST APIs — what makes an API RESTful?",
    "Where do you want to be in your career in the next 2-3 years?",
  ],
};

function getQuestions(company: string): string[] {
  return QUESTION_BANK[company] || QUESTION_BANK["default"];
}

type Message = { role: "user" | "assistant"; content: string };
type Expression = "Neutral" | "Confident" | "Nervous" | "Smiling";

// ─── MatchRing component ─────────────────────────────────────────────────────
function ScoreMeter({ value, label }: { value: number; label: string }) {
  const r = 28; const c = 2 * Math.PI * r;
  return (
    <div className={styles.meter}>
      <svg width={70} height={70}>
        <circle cx={35} cy={35} r={r} className={styles.meterTrack} />
        <circle cx={35} cy={35} r={r} className={styles.meterFill}
          strokeDasharray={c} strokeDashoffset={c - (value / 100) * c}
          strokeLinecap="round" transform="rotate(-90 35 35)" />
      </svg>
      <div className={styles.meterText}>
        <span className={styles.meterVal}>{value}</span>
      </div>
      <span className={styles.meterLabel}>{label}</span>
    </div>
  );
}

export default function InterviewPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [step, setStep] = useState<"setup" | "chat">("setup");
  const [apiError, setApiError] = useState("");

  // Setup
  const [role, setRole] = useState("Software Engineer");
  const [company, setCompany] = useState("Google");
  const [experience, setExperience] = useState("Fresher");
  const [userName, setUserName] = useState("");

  // Webcam
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [expression, setExpression] = useState<Expression>("Neutral");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const expressionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [faceapi, setFaceapi] = useState<any>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const loadLibAndModels = async () => {
      try {
        const lib = await import("@vladmandic/face-api");
        setFaceapi(lib);
        const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model/";
        await Promise.all([
          lib.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          lib.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        console.log("Face API models loaded successfully");
      } catch (err) {
        console.error("Failed to load Face API models:", err);
      }
    };
    loadLibAndModels();
  }, []);

  // Voice
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Demo mode (local question queue)
  const [questionIndex, setQuestionIndex] = useState(0);
  const [demoMode, setDemoMode] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── Webcam ─────────────────────────────────────────────────────────────────
  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      streamRef.current = stream;

      if (faceapi && modelsLoaded) {
        const detect = async () => {
          if (!streamRef.current) return;
          if (videoRef.current && videoRef.current.readyState >= 2) {
            try {
              const detections = await faceapi.detectSingleFace(
                videoRef.current,
                new faceapi.TinyFaceDetectorOptions()
              ).withFaceExpressions();

              if (detections) {
                const expressions = detections.expressions;
                let highestExp = "neutral";
                let highestScore = 0;
                for (const [exp, score] of Object.entries(expressions)) {
                  if ((score as number) > highestScore) {
                    highestScore = score as number;
                    highestExp = exp;
                  }
                }

                let mappedExp: Expression = "Neutral";
                if (highestExp === "happy") {
                  mappedExp = "Smiling";
                } else if (["sad", "fearful", "angry", "disgusted"].includes(highestExp)) {
                  mappedExp = "Nervous";
                } else {
                  if (expressions.happy > 0.08) {
                    mappedExp = "Confident";
                  } else {
                    mappedExp = "Neutral";
                  }
                }
                setExpression(mappedExp);
              }
            } catch (e) {
              console.error("Error detecting face expressions:", e);
            }
          }
          expressionTimerRef.current = setTimeout(detect, 500) as any;
        };
        detect();
      } else {
        const exprs: Expression[] = ["Neutral", "Confident", "Nervous", "Smiling"];
        expressionTimerRef.current = setInterval(() => {
          setExpression(exprs[Math.floor(Math.random() * exprs.length)]);
        }, 4000) as any;
      }
    } catch {
      alert("Please allow camera access for visual coaching.");
    }
  }, [faceapi, modelsLoaded]);

  const stopWebcam = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (expressionTimerRef.current) {
      clearInterval(expressionTimerRef.current);
      clearTimeout(expressionTimerRef.current);
      expressionTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => stopWebcam(), [stopWebcam]);

  // ── TTS ────────────────────────────────────────────────────────────────────
  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!voiceEnabled || typeof window === "undefined") { onEnd?.(); return; }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.95;
    utt.pitch = 1;
    utt.onstart = () => setIsSpeaking(true);
    utt.onend = () => { setIsSpeaking(false); onEnd?.(); };
    utt.onerror = () => { setIsSpeaking(false); onEnd?.(); };
    window.speechSynthesis.speak(utt);
  }, [voiceEnabled]);

  // ── STT ────────────────────────────────────────────────────────────────────
  const startListening = useCallback(() => {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) { alert("Voice recognition not supported. Use Chrome."); return; }
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.onstart = () => setIsListening(true);
    rec.onresult = (e: any) => {
      setInput(e.results[0][0].transcript);
      setIsListening(false);
    };
    rec.onerror = rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;
    rec.start();
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  // ── Push an AI message and optionally speak it ─────────────────────────────
  const pushAIMessage = useCallback((text: string, cb?: () => void) => {
    setMessages(prev => [...prev, { role: "assistant", content: text }]);
    speak(text, cb);
  }, [speak]);

  // ── Start Interview ────────────────────────────────────────────────────────
  const startInterview = useCallback(async () => {
    setStep("chat");
    setQuestionIndex(0);
    setMessages([]);
    if (webcamEnabled) await startWebcam();

    const greeting = `Hello ${userName || "there"}! Welcome to your ${company} interview for the ${role} position. I'm your AI interviewer today. Let's begin! ${getQuestions(company)[0]}`;

    setDemoMode(true);
    setQuestionIndex(1); // next question will be index 1
    pushAIMessage(greeting);
  }, [userName, role, company, webcamEnabled, startWebcam, pushAIMessage]);

  // ── Send Answer ───────────────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    if (!input.trim() || loading || isSpeaking) return;
    const userMsg = input.trim();
    setInput("");
    setApiError("");

    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    if (demoMode) {
      // ── Demo Mode: use local question bank, no API ──
      await new Promise(r => setTimeout(r, 800));
      const questions = getQuestions(company);
      const feedbacks = [
        "Good answer! You showed clear thinking.",
        "Solid response. Try to add a specific example next time.",
        "Great structure! Your reasoning was logical.",
        "Good point! Make sure to elaborate on technical depth.",
        "Excellent! That demonstrated strong problem-solving skills.",
      ];
      const feedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];

      if (questionIndex < questions.length) {
        const reply = `${feedback}\n\nNext question: ${questions[questionIndex]}`;
        setQuestionIndex(qi => qi + 1);
        setMessages([...newMessages, { role: "assistant", content: reply }]);
        speak(reply);
      } else {
        const finalMsg = "Excellent interview! You've completed all rounds. Let me pull up your performance report now. Overall, you showed strong technical knowledge and good communication skills. Well done!";
        setMessages([...newMessages, { role: "assistant", content: finalMsg }]);
        speak(finalMsg, () => setTimeout(() => setShowReport(true), 800));
      }
      setLoading(false);
    } else {
      // ── Live Mode: call Gemini API ──
      try {
        const res = await fetch("/api/interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: newMessages, role, company, stage: "Technical & Behavioral" }),
        });
        const data = await res.json();
        if (data.content) {
          setMessages([...newMessages, { role: "assistant", content: data.content }]);
          speak(data.content);
        } else {
          setApiError(data.error || "No response from AI. Switching to demo mode.");
          setDemoMode(true);
        }
      } catch {
        setApiError("Network error – switched to offline demo mode.");
        setDemoMode(true);
      } finally {
        setLoading(false);
      }
    }
  }, [input, loading, isSpeaking, messages, demoMode, company, questionIndex, role, speak]);

  // ── Report data ───────────────────────────────────────────────────────────
  const reportData = {
    readiness: 84, confidence: 79, clarity: 88, technical: 81,
    verdict: "Strong Hire ✅",
    tips: ["Elaborate on system design answers", "Add more quantified examples", "Practice behavioral frameworks (STAR)"],
  };

  // ── Render: Setup ──────────────────────────────────────────────────────────
  const renderSetup = () => (
    <motion.div className={styles.setupView} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
      <div className={styles.setupHeader}>
        <h1>AI Interview Lab</h1>
        <p>Company-specific interview simulation with live AI coaching.</p>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Your Name</label>
        <input className={styles.textInput} value={userName} onChange={e => setUserName(e.target.value)} placeholder="e.g. Krishna" />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Target Role</label>
        <select className={styles.select} value={role} onChange={e => setRole(e.target.value)}>
          <option>Software Engineer</option>
          <option>Data Scientist</option>
          <option>Frontend Developer</option>
          <option>Backend Developer</option>
          <option>Full Stack Developer</option>
          <option>UI/UX Designer</option>
          <option>Product Manager</option>
        </select>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Target Company</label>
        <select className={styles.select} value={company} onChange={e => setCompany(e.target.value)}>
          <option>Google</option>
          <option>Amazon</option>
          <option>Meta</option>
          <option>Microsoft</option>
          <option>TCS / Infosys</option>
          <option>Early-stage Startup</option>
        </select>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Experience Level</label>
        <select className={styles.select} value={experience} onChange={e => setExperience(e.target.value)}>
          <option>Fresher</option>
          <option>Junior (1-2 years)</option>
          <option>Mid-level (3-5 years)</option>
        </select>
      </div>

      <div className={styles.toggleRow}>
        <div className={`${styles.toggle} ${webcamEnabled ? styles.toggleActive : ""}`} onClick={() => setWebcamEnabled(v => !v)}>
          <div className={styles.toggleBall} />
          <span>📷 Visual Coaching {webcamEnabled ? (modelsLoaded ? "ON (Ready)" : "ON (Loading...)") : "OFF"}</span>
        </div>
        <div className={`${styles.toggle} ${voiceEnabled ? styles.toggleActive : ""}`} onClick={() => setVoiceEnabled(v => !v)}>
          <div className={styles.toggleBall} />
          <span>🎙️ Voice Mode {voiceEnabled ? "ON" : "OFF"}</span>
        </div>
      </div>

      <button className={styles.startBtn} onClick={startInterview}>
        <Play size={18} /> Begin Interview Session
      </button>
    </motion.div>
  );

  // ── Render: Chat ──────────────────────────────────────────────────────────
  const renderChat = () => (
    <div className={`${styles.container} ${webcamEnabled ? styles.wideContainer : ""}`}>
      <div className={styles.chatMain}>
        <header className={styles.header}>
          <div className={styles.titleGroup}>
            <h1>🏢 {company} Interview</h1>
            <span className={styles.roleTag}>{role}</span>
          </div>
          <div className={styles.headerRight}>
            {isSpeaking && (
              <div className={styles.speakingPill}>
                <Volume2 size={14} /> AI Speaking...
              </div>
            )}
            <div className={styles.statusPill}><div className={styles.statusDot} />Live Session</div>
            <button className={styles.reportBtn} onClick={() => setShowReport(true)}>End & Report</button>
          </div>
        </header>

        <div className={styles.chatArea}>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`${styles.message} ${msg.role === "user" ? styles.user : styles.interviewer}`}>
              {msg.content}
            </motion.div>
          ))}
          {loading && (
            <div className={styles.typing}>
              <div className={styles.dot} /><div className={styles.dot} /><div className={styles.dot} />
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {apiError && (
          <div className={styles.errorBanner}>
            ⚠️ {apiError}
            <button onClick={() => setApiError("")}>✕</button>
          </div>
        )}

        <div className={styles.inputArea}>
          <div className={styles.inputWrapper}>
            <input className={styles.input} value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={isListening ? "🔴 Listening..." : "Type or speak your answer..."}
              disabled={loading || isSpeaking}
            />
            <button
              className={`${styles.micBtn} ${isListening ? styles.micActive : ""}`}
              onClick={isListening ? stopListening : startListening}
              disabled={loading || isSpeaking}
              title="Voice Input"
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <button className={styles.sendBtn} onClick={handleSend} disabled={loading || !input.trim() || isSpeaking}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {webcamEnabled && (
        <div className={styles.visualPanel}>
          <div className={styles.videoWrapper}>
            <video ref={videoRef} autoPlay playsInline muted className={styles.webcam} />
            <div className={styles.videoOverlay}>
              <div className={styles.scanLine} />
              <div className={styles.faceBounds} />
            </div>
            <div className={styles.camLabel}>🔴 LIVE</div>
          </div>

          <div className={styles.analysisCard}>
            <div className={styles.cardTop}><Monitor size={14} /><span>LIVE EXPRESSION ANALYSIS</span></div>
            <div className={styles.expressionValue}>
              {expression === "Confident" && <Sparkles size={18} className={styles.expIcon} />}
              {expression === "Smiling" && <Smile size={18} className={styles.expIcon} />}
              {expression === "Neutral" && <Meh size={18} className={styles.expIcon} />}
              {expression === "Nervous" && <Frown size={18} className={styles.expIcon} />}
              <strong>{expression}</strong>
            </div>
            <div className={styles.coachTips}>
              <p className={styles.tipLabel}>AI COACH TIP:</p>
              <p className={styles.tipText}>
                {expression === "Nervous" && "Take a breath. Maintain eye contact and relax your shoulders."}
                {expression === "Confident" && "Perfect! Your body language is matching your words."}
                {expression === "Neutral" && "Good focus. A subtle smile increases perceived confidence."}
                {expression === "Smiling" && "Great energy! You're building excellent rapport."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ── Render: Report ────────────────────────────────────────────────────────
  const renderReport = () => (
    <div className={styles.reportOverlay}>
      <motion.div className={styles.reportCard} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}>
        <h2 className={styles.reportTitle}>Interview Performance Report</h2>
        <p className={styles.reportSubtitle}>{userName || "Candidate"} — {role} at {company}</p>

        <div className={styles.metersRow}>
          <ScoreMeter value={reportData.readiness} label="Readiness" />
          <ScoreMeter value={reportData.confidence} label="Confidence" />
          <ScoreMeter value={reportData.clarity} label="Clarity" />
          <ScoreMeter value={reportData.technical} label="Technical" />
        </div>

        <div className={styles.verdictBadge}>{reportData.verdict}</div>

        <div className={styles.tipsSection}>
          <h3>Improvement Areas</h3>
          {reportData.tips.map((tip, i) => (
            <div key={i} className={styles.tipRow}>• {tip}</div>
          ))}
        </div>

        <button className={styles.finishBtn} onClick={() => window.location.reload()}>
          Start New Session
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className={styles.page}>
      <div style={{ position: "absolute", top: "1.5rem", left: "1.5rem", zIndex: 10 }}>
        <Link href="/" style={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", fontSize: "0.9rem" }}>
          <ArrowLeft size={16} /> Exit Lab
        </Link>
      </div>

      <AnimatePresence mode="wait">
        {step === "setup" ? renderSetup() : renderChat()}
      </AnimatePresence>

      {showReport && renderReport()}
    </div>
  );
}
