"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  Briefcase, 
  ArrowLeft, 
  FileCheck, 
  Map, 
  FileText, 
  Users 
} from "lucide-react";
import styles from "./HomePage.module.css";

type ViewState = "selection" | "student" | "professional";

export default function Home() {
  const [view, setView] = useState<ViewState>("selection");

  const renderSelection = () => (
    <div className={styles.grid}>
      <div className={styles.card} onClick={() => setView("student")}>
        <div className={styles.iconWrapper}>
          <GraduationCap size={40} />
        </div>
        <h2 className={styles.cardTitle}>Student</h2>
        <p className={styles.cardDescription}>
          Explore academic roadmaps and test your skills to stay ahead in your studies.
        </p>
      </div>

      <div className={styles.card} onClick={() => setView("professional")}>
        <div className={styles.iconWrapper}>
          <Briefcase size={40} />
        </div>
        <h2 className={styles.cardTitle}>Professional</h2>
        <p className={styles.cardDescription}>
          Build a winning resume and find internships that match your expertise.
        </p>
      </div>
    </div>
  );

  const renderStudentOptions = () => (
    <>
      <button className={styles.backBtn} onClick={() => setView("selection")}>
        <ArrowLeft size={18} />
        Back to Selection
      </button>
      <div className={styles.grid}>
        <Link href="/student/skill-test" className={styles.card}>
          <div className={styles.iconWrapper}>
            <FileCheck size={40} />
          </div>
          <h2 className={styles.cardTitle}>Skill Test</h2>
          <p className={styles.cardDescription}>Assess your knowledge with our AI-powered objective tests.</p>
        </Link>
        <Link href="/student/roadmap" className={styles.card}>
          <div className={styles.iconWrapper}>
            <Map size={40} />
          </div>
          <h2 className={styles.cardTitle}>Roadmap Section</h2>
          <p className={styles.cardDescription}>Get a personalized learning path tailored to your career goals.</p>
        </Link>
      </div>
    </>
  );

  const renderProfessionalOptions = () => (
    <>
      <button className={styles.backBtn} onClick={() => setView("selection")}>
        <ArrowLeft size={18} />
        Back to Selection
      </button>
      <div className={styles.grid}>
        <Link href="/prof/resume-builder" className={styles.card}>
          <div className={styles.iconWrapper}>
            <FileText size={40} />
          </div>
          <h2 className={styles.cardTitle}>Resume Builder</h2>
          <p className={styles.cardDescription}>Create a high-impact resume using modern AI templates.</p>
        </Link>
        <Link href="/prof/internships" className={styles.card}>
          <div className={styles.iconWrapper}>
            <Users size={40} />
          </div>
          <h2 className={styles.cardTitle}>Matching Internships</h2>
          <p className={styles.cardDescription}>Discover opportunities that perfectly align with your profile.</p>
        </Link>
      </div>
    </>
  );

  return (
    <main className={styles.container}>
      <div style={{ width: '100%', maxWidth: '900px', display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Link href="/auth" className={styles.backBtn} style={{ margin: 0 }}>
          Sign In
        </Link>
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>Welcome to CarrerCompass</h1>
        <p className={styles.subtitle}>Choose your path and let AI guide your journey.</p>
      </div>

      {view === "selection" && renderSelection()}
      {view === "student" && renderStudentOptions()}
      {view === "professional" && renderProfessionalOptions()}
    </main>
  );
}
