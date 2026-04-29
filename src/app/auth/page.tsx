"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  Search, Sparkles, Shield, AlertCircle, Mail, Lock, User,
  ArrowRight, Eye, EyeOff, RotateCcw, Check, X, KeyRound, CheckCircle2, ArrowLeft
} from "lucide-react";
import styles from "./AuthPage.module.css";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type AuthMode = "signin" | "signup";

/* ─── Password strength ─── */
interface PasswordRule { label: string; test: (pw: string) => boolean; }

const PASSWORD_RULES: PasswordRule[] = [
  { label: "At least 6 characters", test: (pw) => pw.length >= 6 },
  { label: "Contains uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "Contains lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { label: "Contains a number", test: (pw) => /\d/.test(pw) },
  { label: "Contains special character", test: (pw) => /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;'/]/.test(pw) },
];

function getStrength(pw: string) {
  if (!pw) return { percent: 0, label: "", color: "#334155" };
  const passed = PASSWORD_RULES.filter((r) => r.test(pw)).length;
  if (passed <= 1) return { percent: 20, label: "Weak", color: "#ef4444" };
  if (passed <= 2) return { percent: 40, label: "Fair", color: "#f97316" };
  if (passed <= 3) return { percent: 60, label: "Medium", color: "#eab308" };
  if (passed <= 4) return { percent: 80, label: "Good", color: "#22c55e" };
  return { percent: 100, label: "Strong", color: "#10b981" };
}

const flipVariants: any = {
  enter: (direction: number) => ({
    rotateY: direction > 0 ? 90 : -90,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    rotateY: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
  },
  exit: (direction: number) => ({
    rotateY: direction > 0 ? -90 : 90,
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.35, ease: "easeIn" },
  }),
};

export default function AuthPage() {
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [flipDirection, setFlipDirection] = useState(1);
  const [mode, setMode] = useState<AuthMode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const strength = useMemo(() => getStrength(password), [password]);
  const ruleResults = useMemo(() => PASSWORD_RULES.map((r) => ({ ...r, passed: r.test(password) })), [password]);

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

  useEffect(() => {
    let unsubscribe: any;

    // Check if already logged in normally
    unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        window.location.href = "/";
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      
      // Fire and forget database save to remove lag!
      saveUserToDB({
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        uid: result.user.uid
      }).catch(console.error);
      
      window.location.href = "/";
    } catch (err: any) {
      console.error("RAW GOOGLE ERROR:", err);
      // Avoid showing error if user just closed the popup manually
      if (err.code !== "auth/popup-closed-by-user") {
        setError(`[Google Login Error] ${err.message || err.toString()}`);
      }
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "signup") {
        if (!name.trim()) { setError("Name is required."); setLoading(false); return; }
        if (password.length < 6) { setError("Password must be at least 6 characters."); setLoading(false); return; }

        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });
        // Fire and forget to remove lag
        saveUserToDB({ email: result.user.email, displayName: name, photoURL: null, uid: result.user.uid }).catch(console.error);
        window.location.href = "/";
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "/";
      }
    } catch (err: any) {
      const code = err.code || "";
      if (code === "auth/operation-not-allowed") setError("Email/Password sign-in is disabled in Firebase Console. Enable it under Authentication → Sign-in method.");
      else if (code === "auth/email-already-in-use") setError("This email is already registered. Switch to Sign In.");
      else if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") setError("Invalid email or password.");
      else if (code === "auth/weak-password") setError("Password must be at least 6 characters.");
      else if (code === "auth/invalid-email") setError("Please enter a valid email address.");
      else setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    setFlipDirection(flipped ? -1 : 1);
    setFlipped(!flipped);
    setError("");
    setSuccessMsg("");
    setForgotMode(false);
  };

  const switchMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setError("");
    setSuccessMsg("");
    setName("");
    setEmail("");
    setPassword("");
    setForgotMode(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setSuccessMsg("Password reset link sent! Check your email inbox (and spam folder).");
    } catch (err: any) {
      const code = err.code || "";
      if (code === "auth/user-not-found") setError("No account found with this email.");
      else if (code === "auth/invalid-email") setError("Please enter a valid email.");
      else setError(err.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  /* particles — fixed positions to avoid SSR hydration mismatch */
  const particles = [
    { id: 0, x: 5, y: 12, size: 3, dur: 18, delay: 0 },
    { id: 1, x: 15, y: 85, size: 2, dur: 22, delay: 1 },
    { id: 2, x: 25, y: 45, size: 4, dur: 15, delay: 2 },
    { id: 3, x: 35, y: 20, size: 2.5, dur: 20, delay: 0.5 },
    { id: 4, x: 45, y: 70, size: 3.5, dur: 17, delay: 3 },
    { id: 5, x: 55, y: 30, size: 2, dur: 25, delay: 1.5 },
    { id: 6, x: 65, y: 90, size: 4, dur: 14, delay: 4 },
    { id: 7, x: 75, y: 55, size: 3, dur: 19, delay: 2.5 },
    { id: 8, x: 85, y: 15, size: 2.5, dur: 21, delay: 0.8 },
    { id: 9, x: 92, y: 65, size: 3.5, dur: 16, delay: 3.5 },
    { id: 10, x: 10, y: 50, size: 2, dur: 23, delay: 5 },
    { id: 11, x: 30, y: 75, size: 4.5, dur: 13, delay: 1.2 },
    { id: 12, x: 50, y: 10, size: 3, dur: 18, delay: 4.5 },
    { id: 13, x: 70, y: 40, size: 2, dur: 26, delay: 2.8 },
    { id: 14, x: 88, y: 80, size: 3.5, dur: 15, delay: 0.3 },
    { id: 15, x: 20, y: 60, size: 2.5, dur: 20, delay: 5.5 },
    { id: 16, x: 40, y: 95, size: 3, dur: 17, delay: 1.8 },
    { id: 17, x: 60, y: 25, size: 4, dur: 22, delay: 3.2 },
  ];

  return (
    <div className={styles.container}>
      {/* ═══ Background ═══ */}
      <div className={styles.bgAurora}>
        <motion.div className={styles.auroraOrb1}
          animate={{ x: [0, 100, -80, 0], y: [0, -60, 50, 0], scale: [1, 1.2, 0.85, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }} />
        <motion.div className={styles.auroraOrb2}
          animate={{ x: [0, -90, 60, 0], y: [0, 70, -50, 0], scale: [1, 0.85, 1.25, 1] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }} />
        <motion.div className={styles.auroraOrb3}
          animate={{ x: [0, 60, -100, 0], y: [0, -80, 60, 0], scale: [1, 1.15, 0.8, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
      </div>
      <div className={styles.particles}>
        {particles.map((p) => (
          <motion.div key={p.id} className={styles.particle}
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            animate={{ y: [0, -35, 12, -25, 0], x: [0, 18, -12, 8, 0], opacity: [0.15, 0.55, 0.25, 0.6, 0.15] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }} />
        ))}
      </div>
      <div className={styles.gridOverlay} />

      {/* ═══ Hero ═══ */}
      <motion.div className={styles.heroContent}
        initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}>
        <motion.div className={styles.badge}
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}>
          <div className={styles.badgeDot} />
          Next-Gen AI Core : CarrerCompass 1.0
        </motion.div>
        <motion.h1 className={styles.title}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}>
          Carrer<br />Compass.
        </motion.h1>
        <motion.p className={styles.heroDescription}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}>
          Harness the power of advanced AI to navigate your career path with precision. 
          Analyze market trends, optimize your resume, and connect with opportunities instantly.
        </motion.p>
        <div className={styles.features}>
          <motion.div className={styles.featureItem}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}>
            <span className={styles.featureTitle}>AI-Powered Precision</span>
            <span className={styles.featureDesc}>Get tailored career recommendations in milliseconds.</span>
          </motion.div>
          <motion.div className={styles.featureItem}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}>
            <span className={styles.featureTitle}>Secure & Private</span>
            <span className={styles.featureDesc}>Your data is protected by industry-leading security.</span>
          </motion.div>
        </div>
      </motion.div>

      {/* ═══ Flip Card (AnimatePresence-based — no backface issues) ═══ */}
      <div className={styles.flipContainer} style={{ perspective: "1400px" }}>
        <AnimatePresence mode="wait" custom={flipDirection}>
          {!flipped ? (
            /* ══ FRONT — Google ══ */
            <motion.div
              key="front"
              className={styles.authCard}
              custom={flipDirection}
              variants={flipVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <div className={styles.cardGlow} />

              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Elevate Your Future.</h2>
                <p className={styles.cardDesc}>
                  Join the elite circle of professionals using AI to dominate their career goals.
                </p>
                <span className={styles.creditsPlug}>Get 50 Launch Credits Free.</span>
              </div>

              {error && (
                <div style={{ background: "rgba(255,0,0,0.2)", border: "2px solid red", padding: "15px", borderRadius: "8px", margin: "10px 0", color: "white", fontSize: "0.85rem", wordWrap: "break-word" }}>
                  <strong>Error Details:</strong><br/>
                  {error}
                </div>
              )}

              <motion.button onClick={handleGoogleSignIn} className={styles.googleBtn}
                disabled={loading} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Search size={20} />
                {loading ? "Connecting..." : "Continue with Google"}
              </motion.button>

              <div className={styles.flipPrompt}>
                <span>Prefer email & password?</span>
                <button type="button" className={styles.flipBtn} onClick={handleFlip}>
                  <RotateCcw size={16} />
                  Flip to Sign In
                </button>
              </div>

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
            </motion.div>
          ) : (
            /* ══ BACK — Email / Password ══ */
            <motion.div
              key="back"
              className={styles.authCard}
              custom={flipDirection}
              variants={flipVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <div className={styles.cardGlow} />

              {/* ─── FORGOT PASSWORD VIEW ─── */}
              {forgotMode ? (
                <>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>Reset Password.</h2>
                    <p className={styles.cardDesc}>
                      Enter your email and we&apos;ll send you a password reset link.
                    </p>
                  </div>

                  {error && (
                    <div className={styles.errorMsg}>
                      <AlertCircle size={18} />
                      <span>{error}</span>
                    </div>
                  )}

                  {successMsg ? (
                    <motion.div className={styles.successMsg}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}>
                      <CheckCircle2 size={22} />
                      <span>{successMsg}</span>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleForgotPassword} className={styles.authForm}>
                      <div className={styles.inputGroup}>
                        <div className={styles.inputIcon}><Mail size={18} /></div>
                        <input type="email" placeholder="Your registered email" value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className={styles.inputField} required autoComplete="email" />
                      </div>
                      <motion.button type="submit" className={styles.submitBtn}
                        disabled={loading} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        {loading ? "Sending..." : "Send Reset Link"}
                        <KeyRound size={18} />
                      </motion.button>
                    </form>
                  )}

                  <button type="button" className={styles.backToLogin}
                    onClick={() => { setForgotMode(false); setError(""); setSuccessMsg(""); }}>
                    <ArrowLeft size={16} />
                    Back to Sign In
                  </button>
                </>
              ) : (
                /* ─── NORMAL SIGN-IN / SIGN-UP VIEW ─── */
                <>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>
                      {mode === "signup" ? "Create Account." : "Welcome Back."}
                    </h2>
                    <p className={styles.cardDesc}>
                      {mode === "signup"
                        ? "Sign up with your email and password."
                        : "Sign in to continue your career journey."}
                    </p>
                  </div>

                  <div className={styles.modeTabs}>
                    <button className={`${styles.modeTab} ${mode === "signin" ? styles.modeTabActive : ""}`}
                      onClick={() => { setMode("signin"); setError(""); }}>Sign In</button>
                    <button className={`${styles.modeTab} ${mode === "signup" ? styles.modeTabActive : ""}`}
                      onClick={() => { setMode("signup"); setError(""); }}>Sign Up</button>
                  </div>

                  {error && (
                    <div className={styles.errorMsg}>
                      <AlertCircle size={18} />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleEmailAuth} className={styles.authForm}>
                    {mode === "signup" && (
                      <div className={styles.inputGroup}>
                        <div className={styles.inputIcon}><User size={18} /></div>
                        <input type="text" placeholder="Full Name" value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={styles.inputField} autoComplete="name" />
                      </div>
                    )}

                    <div className={styles.inputGroup}>
                      <div className={styles.inputIcon}><Mail size={18} /></div>
                      <input type="email" placeholder="Email Address" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.inputField} required autoComplete="email" />
                    </div>

                    <div className={styles.inputGroup}>
                      <div className={styles.inputIcon}><Lock size={18} /></div>
                      <input type={showPassword ? "text" : "password"} placeholder="Password"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        className={styles.inputField} required minLength={6}
                        autoComplete={mode === "signup" ? "new-password" : "current-password"} />
                      <button type="button" className={styles.eyeBtn}
                        onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {/* Forgot Password link (sign-in only) */}
                    {mode === "signin" && (
                      <div className={styles.forgotRow}>
                        <button type="button" className={styles.forgotLink}
                          onClick={() => { setForgotMode(true); setError(""); setResetEmail(email); }}>
                          Forgot Password?
                        </button>
                      </div>
                    )}

                    {/* Password strength (sign-up only) */}
                    {mode === "signup" && password.length > 0 && (
                      <motion.div className={styles.strengthWrap}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}>
                        <div className={styles.strengthHeader}>
                          <span>Password strength</span>
                          <span style={{ color: strength.color, fontWeight: 700 }}>{strength.label}</span>
                        </div>
                        <div className={styles.strengthTrack}>
                          <motion.div className={styles.strengthFill}
                            animate={{ width: `${strength.percent}%` }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            style={{ background: strength.color }} />
                        </div>
                        <ul className={styles.ruleList}>
                          {ruleResults.map((rule, i) => (
                            <motion.li key={i} className={rule.passed ? styles.rulePassed : styles.ruleFail}
                              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}>
                              {rule.passed
                                ? <Check size={14} className={styles.ruleIconPass} />
                                : <X size={14} className={styles.ruleIconFail} />}
                              <span>{rule.label}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}

                    <motion.button type="submit" className={styles.submitBtn}
                      disabled={loading} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      {loading ? "Processing..." : mode === "signup" ? "Create Account" : "Sign In"}
                      <ArrowRight size={18} />
                    </motion.button>
                  </form>

                  <div className={styles.flipPrompt}>
                    <span>Want to use Google instead?</span>
                    <button type="button" className={styles.flipBtn} onClick={handleFlip}>
                      <RotateCcw size={16} />
                      Flip to Google
                    </button>
                  </div>

                  <p className={styles.switchText}>
                    {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button type="button" className={styles.switchLink} onClick={switchMode}>
                      {mode === "signin" ? "Sign Up" : "Sign In"}
                    </button>
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
