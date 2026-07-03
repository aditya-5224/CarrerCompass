"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, 
  Briefcase, 
  ArrowLeft, 
  FileCheck, 
  Map, 
  FileText, 
  Users,
  Globe,
  Sparkles,
  Telescope
} from "lucide-react";
import styles from "../app/HomePage.module.css";

const MotionLink = motion.create(Link);

interface SelectionSectionProps {
  view: "selection" | "student" | "professional";
  setView: (view: "selection" | "student" | "professional") => void;
  language: "en" | "hi";
  handleLanguageChange: (lang: "en" | "hi") => void;
}

export default function SelectionSection({ view, setView, language, handleLanguageChange }: SelectionSectionProps) {
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
        <MotionLink 
          href="/student/galaxy" 
          className={styles.card}
          variants={itemVariants}
          whileHover={{ y: -15, scale: 1.02 }}
        >
          <div className={styles.cardInner}>
            <div className={styles.iconWrapper}>
              <Telescope size={48} />
            </div>
            <h2 className={styles.cardTitle}>{language === "hi" ? "करियर गैलेक्सी" : "Career Galaxy"}</h2>
            <p className={styles.cardDescription}>
              {language === "hi" 
                ? "अपनी स्ट्रीम का पूरा सफर — सेमेस्टर, स्किल्स और अवसर।" 
                : "Explore your full stream journey — subjects, skills & career opportunities."}
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
        <MotionLink 
          href="/prof/interview" 
          className={styles.card}
          variants={itemVariants}
          whileHover={{ y: -15, scale: 1.02 }}
        >
          <div className={styles.cardInner}>
            <div className={styles.iconWrapper}>
              <Sparkles size={48} />
            </div>
            <h2 className={styles.cardTitle}>Interview Lab</h2>
            <p className={styles.cardDescription}>Master the art of the interview with our elite AI coach.</p>
          </div>
        </MotionLink>
      </motion.div>
    </motion.div>
  );

  return (
    <div id="services" style={{ width: '100%' }}>
      <AnimatePresence mode="wait">
        {view === "selection" && renderSelection()}
        {view === "student" && renderStudentOptions()}
        {view === "professional" && renderProfessionalOptions()}
      </AnimatePresence>
    </div>
  );
}
