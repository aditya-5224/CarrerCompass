"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { 
  GraduationCap, 
  Briefcase, 
  ArrowLeft, 
  FileCheck, 
  Map, 
  FileText, 
  Users,
  Sparkles,
  Globe
} from "lucide-react";
import styles from "./HomePage.module.css";

type ViewState = "selection" | "student" | "professional";

const MotionLink = motion.create(Link);

export default function Home() {
  const [view, setView] = useState<ViewState>("selection");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Load user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load saved language preference
  useEffect(() => {
    const saved = localStorage.getItem("careercompass-lang");
    if (saved === "en" || saved === "hi") setLanguage(saved);
  }, []);

  const handleLanguageChange = (lang: "en" | "hi") => {
    setLanguage(lang);
    localStorage.setItem("careercompass-lang", lang);
  };

  // Parallax effect for orbs
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  const orbX = useSpring(useTransform(useScroll().scrollX, [0, 1], [0, mousePos.x / 50]), { stiffness: 50, damping: 20 });
  const orbY = useSpring(useTransform(useScroll().scrollY, [0, 1], [0, mousePos.y / 50]), { stiffness: 50, damping: 20 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
    }
  };

  const renderSelection = () => (
    <motion.div 
      className={styles.grid}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      key="selection"
    >
      <motion.div 
        className={styles.card} 
        onClick={() => setView("student")}
        variants={itemVariants}
        whileHover={{ y: -15, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={styles.cardInner}>
          <div className={styles.iconWrapper}>
            <GraduationCap size={48} />
          </div>
          <h2 className={styles.cardTitle}>Student</h2>
          <p className={styles.cardDescription}>
            Unlock your academic potential with personalized roadmaps and AI assessments.
          </p>
        </div>
      </motion.div>

      <motion.div 
        className={styles.card} 
        onClick={() => setView("professional")}
        variants={itemVariants}
        whileHover={{ y: -15, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={styles.cardInner}>
          <div className={styles.iconWrapper}>
            <Briefcase size={48} />
          </div>
          <h2 className={styles.cardTitle}>Professional</h2>
          <p className={styles.cardDescription}>
            Engineered for excellence. Build resumes that get noticed and find your dream role.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderStudentOptions = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      key="student"
      style={{ width: '100%' }}
    >
      <div className={styles.studentTopBar}>
        <motion.button 
          className={styles.backBtn} 
          onClick={() => setView("selection")}
          whileHover={{ x: -8 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ArrowLeft size={20} />
          Exit to Overview
        </motion.button>

        <motion.div 
          className={styles.langSwitcher}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Globe size={18} className={styles.langIcon} />
          <button
            className={`${styles.langBtn} ${language === "en" ? styles.langBtnActive : ""}`}
            onClick={() => handleLanguageChange("en")}
          >
            English
          </button>
          <div className={styles.langDivider} />
          <button
            className={`${styles.langBtn} ${language === "hi" ? styles.langBtnActive : ""}`}
            onClick={() => handleLanguageChange("hi")}
          >
            हिन्दी
          </button>
        </motion.div>
      </div>

      <motion.div 
        className={styles.grid}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <MotionLink 
          href="/student/skill-test" 
          className={styles.card}
          variants={itemVariants}
          whileHover={{ y: -15, scale: 1.02 }}
        >
          <div className={styles.cardInner}>
            <div className={styles.iconWrapper}>
              <FileCheck size={48} />
            </div>
            <h2 className={styles.cardTitle}>{language === "hi" ? "कौशल परीक्षा" : "Skill Test"}</h2>
            <p className={styles.cardDescription}>
              {language === "hi" 
                ? "AI-आधारित परिस्थितिजन्य मूल्यांकन से अपनी विशेषज्ञता को सत्यापित करें।" 
                : "Validate your expertise with situational AI assessments."}
            </p>
          </div>
        </MotionLink>
        <MotionLink 
          href="/student/roadmap" 
          className={styles.card}
          variants={itemVariants}
          whileHover={{ y: -15, scale: 1.02 }}
        >
          <div className={styles.cardInner}>
            <div className={styles.iconWrapper}>
              <Map size={48} />
            </div>
            <h2 className={styles.cardTitle}>{language === "hi" ? "पथप्रदर्शक" : "Pathfinder"}</h2>
            <p className={styles.cardDescription}>
              {language === "hi" 
                ? "आपके विशिष्ट करियर लक्ष्यों के अनुसार गतिशील शिक्षण रोडमैप।" 
                : "Dynamic learning roadmaps tailored to your specific career goals."}
            </p>
          </div>
        </MotionLink>
      </motion.div>
    </motion.div>
  );

  const renderProfessionalOptions = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      key="professional"
      style={{ width: '100%' }}
    >
      <motion.button 
        className={styles.backBtn} 
        onClick={() => setView("selection")}
        whileHover={{ x: -8 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <ArrowLeft size={20} />
        Exit to Overview
      </motion.button>
      <motion.div 
        className={styles.grid}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <MotionLink 
          href="/prof/resume-builder" 
          className={styles.card}
          variants={itemVariants}
          whileHover={{ y: -15, scale: 1.02 }}
        >
          <div className={styles.cardInner}>
            <div className={styles.iconWrapper}>
              <FileText size={48} />
            </div>
            <h2 className={styles.cardTitle}>Resume Lab</h2>
            <p className={styles.cardDescription}>AI-driven resume optimization with real-time feedback loops.</p>
          </div>
        </MotionLink>
        <MotionLink 
          href="/prof/internships" 
          className={styles.card}
          variants={itemVariants}
          whileHover={{ y: -15, scale: 1.02 }}
        >
          <div className={styles.cardInner}>
            <div className={styles.iconWrapper}>
              <Users size={48} />
            </div>
            <h2 className={styles.cardTitle}>Connect</h2>
            <p className={styles.cardDescription}>Direct pathways to internships that match your verified skill set.</p>
          </div>
        </MotionLink>
      </motion.div>
    </motion.div>
  );

  return (
    <main className={styles.container}>
      {/* Dynamic Background Orbs */}
      <div className={styles.aurora}>
        <motion.div 
          className={`${styles.orb} ${styles.orb1}`}
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -30, 30, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ x: orbX, y: orbY }}
        />
        <motion.div 
          className={`${styles.orb} ${styles.orb2}`}
          animate={{
            x: [0, -40, 40, 0],
            y: [0, 50, -50, 0],
            scale: [1, 0.9, 1.1, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ x: orbX, y: orbY }}
        />
        <motion.div 
          className={`${styles.orb} ${styles.orb3}`}
          animate={{
            x: [0, 60, -60, 0],
            y: [0, 40, -40, 0],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ x: orbX, y: orbY }}
        />
      </div>

      <div className={styles.content}>
        <motion.div 
          className={styles.topRow}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {isAuthLoading ? (
            <div className={styles.signInBtn} style={{ opacity: 0.5 }}>
              Loading...
            </div>
          ) : currentUser ? (
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <Link 
                href="/profile" 
                target="_blank"
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  width: "40px", 
                  height: "40px", 
                  borderRadius: "50%", 
                  background: "linear-gradient(135deg, #4f46e5, #ec4899)", 
                  color: "white", 
                  fontWeight: "bold", 
                  textDecoration: "none", 
                  boxShadow: "0 4px 10px rgba(79, 70, 229, 0.3)",
                  fontSize: "1.2rem",
                  transition: "transform 0.2s ease"
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"} 
                onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                title="View Profile"
              >
                {currentUser?.photoURL ? (
                  <img src={currentUser.photoURL} alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                ) : (
                  (currentUser?.displayName || currentUser?.email || "U")[0].toUpperCase()
                )}
              </Link>
              <button 
                onClick={async () => {
                  await signOut(auth);
                  window.location.reload();
                }} 
                className={styles.signInBtn}
                style={{ background: "rgba(255, 50, 50, 0.2)", border: "1px solid rgba(255, 50, 50, 0.4)" }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/auth" className={styles.signInBtn}>
              Enter Platform
            </Link>
          )}
        </motion.div>

        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span 
            className={styles.pill}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Sparkles size={16} />
            Intelligence Beyond Limits
          </motion.span>
          <h1 className={styles.title}>Carrer<br />Compass</h1>
          <p className={styles.subtitle}>
            The future of career engineering. Precision-driven paths powered by the next generation of AI.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {view === "selection" && renderSelection()}
          {view === "student" && renderStudentOptions()}
          {view === "professional" && renderProfessionalOptions()}
        </AnimatePresence>
      </div>
    </main>
  );
}
