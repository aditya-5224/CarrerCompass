"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Activity, 
  CheckCircle, 
  Clock, 
  Award,
  Zap,
  Star,
  Map
} from "lucide-react";
import Link from "next/link";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (!mounted || loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading Profile...</p>
      </div>
    );
  }

  if (!user) return null;

  const displayName = user.displayName || user.email?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className={styles.container}>
      {/* Background Aurora */}
      <div className={styles.aurora}>
        <div className={`${styles.orb} ${styles.orb1}`} />
        <div className={`${styles.orb} ${styles.orb2}`} />
        <div className={`${styles.orb} ${styles.orb3}`} />
      </div>

      <div className={styles.content}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link href="/" className={styles.backBtn}>
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </motion.div>

        <motion.div 
          className={styles.profileCard}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* User Info Section */}
          <motion.div className={styles.userInfo} variants={itemVariants}>
            <div className={styles.avatarContainer}>
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className={styles.avatarImage} />
              ) : (
                <span>{initial}</span>
              )}
            </div>
            
            <div className={styles.userDetails}>
              <h1 className={styles.userName}>{displayName}</h1>
              <p className={styles.userEmail}>{user.email}</p>
              <div className={styles.statsRow}>
                <div className={styles.statBadge}>
                  <Zap size={14} className={styles.statIcon} />
                  Pro Member
                </div>
                <div className={styles.statBadge}>
                  <Star size={14} className={styles.statIcon} />
                  Level 5
                </div>
              </div>
            </div>
          </motion.div>

          {/* Activity Section */}
          <motion.div variants={itemVariants}>
            <h2 className={styles.sectionTitle}>
              <Activity className={styles.titleIcon} />
              Recent Activity
            </h2>
            
            <div className={styles.activityList}>
              <div className={styles.activityItem}>
                <div className={styles.activityIconWrapper}>
                  <CheckCircle size={24} />
                </div>
                <div className={styles.activityContent}>
                  <h3 className={styles.activityTitle}>Signed In Successfully</h3>
                  <p className={styles.activityDesc}>Authenticated via Firebase and ready to explore.</p>
                  <span className={styles.activityTime}>
                    <Clock size={12} /> Just now
                  </span>
                </div>
              </div>

              <div className={styles.activityItem}>
                <div className={styles.activityIconWrapper}>
                  <Award size={24} />
                </div>
                <div className={styles.activityContent}>
                  <h3 className={styles.activityTitle}>Completed Initial Assessment</h3>
                  <p className={styles.activityDesc}>Scored 85% on React Fundamentals.</p>
                  <span className={styles.activityTime}>
                    <Clock size={12} /> 2 days ago
                  </span>
                </div>
              </div>

              <div className={styles.activityItem}>
                <div className={styles.activityIconWrapper}>
                  <Map size={24} />
                </div>
                <div className={styles.activityContent}>
                  <h3 className={styles.activityTitle}>Unlocked Career Roadmap</h3>
                  <p className={styles.activityDesc}>Generated Full-Stack Developer path based on assessment.</p>
                  <span className={styles.activityTime}>
                    <Clock size={12} /> 2 days ago
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
