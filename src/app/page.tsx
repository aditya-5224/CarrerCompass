"use client";

import React, { useState, useEffect } from "react";
import { useScroll, useTransform, useSpring } from "framer-motion";
import { motion } from "framer-motion";
import styles from "./HomePage.module.css";

// New Components
import Hero from "@/components/Hero";
import SelectionSection from "@/components/SelectionSection";
import Feedback from "@/components/Feedback";

type ViewState = "selection" | "student" | "professional";

export default function Home() {
  const [view, setView] = useState<ViewState>("selection");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [language, setLanguage] = useState<"en" | "hi">("en");

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

  const { scrollX, scrollY } = useScroll();
  const orbX = useSpring(useTransform(scrollX, [0, 1], [0, mousePos.x / 50]), { stiffness: 50, damping: 20 });
  const orbY = useSpring(useTransform(scrollY, [0, 1], [0, mousePos.y / 50]), { stiffness: 50, damping: 20 });

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
        {/* Component 1: Hero Section */}
        <Hero />

        {/* Component 2: Selection Cards */}
        <SelectionSection 
          view={view} 
          setView={setView} 
          language={language} 
          handleLanguageChange={handleLanguageChange} 
        />

        {/* Component 3: Feedback Form */}
        <Feedback />
      </div>
    </main>
  );
}
