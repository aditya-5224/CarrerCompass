"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Activity, Clock, Zap, Star, FileText, Map, Link2, User, CheckCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import styles from "./profile.module.css";
import { getActivity, clearActivity, relativeTime, ActivityEvent } from "@/lib/activity";

// Icon map
const ICON_MAP: Record<string, React.ReactNode> = {
  resume:  <FileText  size={20} />,
  skill:   <Zap       size={20} />,
  roadmap: <Map       size={20} />,
  connect: <Link2     size={20} />,
  signin:  <CheckCircle size={20} />,
  profile: <User      size={20} />,
};

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted,    setMounted]    = useState(false);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    setMounted(true);
    if (!loading && !user) router.push("/auth");
  }, [user, loading, router]);

  useEffect(() => {
    setActivities(getActivity());
    // Refresh every 5 s in case user opens new tabs
    const id = setInterval(() => setActivities(getActivity()), 5000);
    return () => clearInterval(id);
  }, []);

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
  const initial     = displayName.charAt(0).toUpperCase();

  const containerVariants = {
    hidden:   { opacity: 0 },
    visible:  { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };
  const itemVariants = {
    hidden:   { opacity: 0, y: 20 },
    visible:  { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className={styles.container}>
      {/* Background */}
      <div className={styles.aurora}>
        <div className={`${styles.orb} ${styles.orb1}`} />
        <div className={`${styles.orb} ${styles.orb2}`} />
        <div className={`${styles.orb} ${styles.orb3}`} />
      </div>

      <div className={styles.content}>
        <motion.div className={styles.header} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link href="/" className={styles.backBtn}>
            <ArrowLeft size={18} /> Back to Dashboard
          </Link>
        </motion.div>

        <motion.div className={styles.profileCard} variants={containerVariants} initial="hidden" animate="visible">

          {/* ── User Info ── */}
          <motion.div className={styles.userInfo} variants={itemVariants}>
            <div className={styles.avatarContainer}>
              {user.photoURL
                ? <img src={user.photoURL} alt="Profile" className={styles.avatarImage} />
                : <span>{initial}</span>
              }
            </div>
            <div className={styles.userDetails}>
              <h1 className={styles.userName}>{displayName}</h1>
              <p className={styles.userEmail}>{user.email}</p>
              <div className={styles.statsRow}>
                <div className={styles.statBadge}><Zap size={14} className={styles.statIcon} /> Pro Member</div>
                <div className={styles.statBadge}><Star size={14} className={styles.statIcon} /> Level 5</div>
                <div className={styles.statBadge}><Activity size={14} className={styles.statIcon} /> {activities.length} Actions</div>
              </div>
            </div>
          </motion.div>

          {/* ── Activity Feed ── */}
          <motion.div variants={itemVariants} id="activity">
            <div className={styles.activityHeader}>
              <h2 className={styles.sectionTitle}>
                <Activity className={styles.titleIcon} /> Recent Activity
              </h2>
              {activities.length > 0 && (
                <button
                  className={styles.clearBtn}
                  onClick={() => { clearActivity(); setActivities([]); }}
                  title="Clear all activity"
                >
                  <Trash2 size={14} /> Clear
                </button>
              )}
            </div>

            <div className={styles.activityList}>
              {activities.length === 0 ? (
                <div className={styles.emptyActivity}>
                  <Activity size={32} className={styles.emptyIcon} />
                  <p>No activity yet — start exploring to see your history here.</p>
                  <Link href="/" className={styles.exploreBtn}>Go to Dashboard →</Link>
                </div>
              ) : (
                activities.map((event) => (
                  <div key={event.id} className={styles.activityItem}>
                    <div className={styles.activityIconWrapper}>
                      {ICON_MAP[event.icon] ?? <CheckCircle size={20} />}
                    </div>
                    <div className={styles.activityContent}>
                      <h3 className={styles.activityTitle}>{event.title}</h3>
                      <p className={styles.activityDesc}>{event.description}</p>
                      <span className={styles.activityTime}>
                        <Clock size={12} /> {relativeTime(event.timestamp)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
