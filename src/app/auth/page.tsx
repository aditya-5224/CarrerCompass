"use client";

import React, { useState } from "react";
import { 
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Search, Sparkles, Shield, AlertCircle } from "lucide-react";
import styles from "./AuthPage.module.css";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const saveUserToDB = async (userData: { email: string | null; displayName: string | null; photoURL: string | null; uid: string }) => {
    try {
      await fetch("/api/auth/save-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userData.email,
          name: userData.displayName || userData.email?.split("@")[0],
          image: userData.photoURL,
          uid: userData.uid
        }),
      });
    } catch (err) {
      console.error("Failed to save user to MongoDB:", err);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        await saveUserToDB({
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          uid: result.user.uid
        });
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.heroContent}>
        <div className={styles.badge}>
          <div className={styles.badgeDot}></div>
          Next-Gen AI Core : CarrerCompass 1.0
        </div>
        <h1 className={styles.title}>
          Carrer<br />Compass.
        </h1>
        <p className={styles.heroDescription}>
          Harness the power of advanced AI to navigate your career path with precision. 
          Analyze market trends, optimize your resume, and connect with opportunities instantly.
        </p>

        <div className={styles.features}>
          <div className={styles.featureItem}>
            <span className={styles.featureTitle}>AI-Powered Precision</span>
            <span className={styles.featureDesc}>Get tailored career recommendations in milliseconds.</span>
          </div>
          <div className={styles.featureItem}>
            <span className={styles.featureTitle}>Secure & Private</span>
            <span className={styles.featureDesc}>Your data is protected by industry-leading security.</span>
          </div>
        </div>
      </div>

      <div className={styles.authCard}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Elevate Your Future.</h2>
          <p className={styles.cardDesc}>
            Join the elite circle of professionals using AI to dominate their career goals.
          </p>
          <span className={styles.creditsPlug}>Get 50 Launch Credits Free.</span>
        </div>

        {error && (
          <div className={styles.errorMsg}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <button 
          onClick={handleGoogleSignIn} 
          className={styles.googleBtn} 
          disabled={loading}
        >
          <Search size={20} />
          {loading ? "Connecting..." : "Continue with Google"}
        </button>

        <div className={styles.cardFooter}>
          <div className={styles.footerItem}>
            <Sparkles className={styles.footerIcon} size={18} />
            Unlimited Insight
          </div>
          <div className={styles.footerItem}>
            <Shield className={styles.footerIconBlue} size={18} />
            Privacy First
          </div>
        </div>
      </div>
    </div>
  );
}
