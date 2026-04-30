"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ChevronDown } from "lucide-react";
import styles from "../app/HomePage.module.css";

export default function Hero() {
  return (
    <motion.div 
      className={styles.heroSection}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.header}>
        <motion.span 
          className={styles.pill}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Sparkles size={16} />
          Intelligence Beyond Limits
        </motion.span>
        
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Career<br />Compass</h1>
          <div className={styles.titleModel}>
            <iframe 
              width="100%" 
              height="100%" 
              src="https://sketchfab.com/models/cdd32ea3d698442db9bc1a6ba6cff26b/embed?autostart=1&internal=1&tracking=0&ui_ar=0&ui_infos=0&ui_snapshots=1&ui_stop=0&ui_theatre=1&ui_watermark=0&transparent=1&preload=1&autospin=0.8" 
              title="3D Background Compass" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              style={{ pointerEvents: 'none' }}
            ></iframe>
          </div>
        </div>
        
        <p className={styles.subtitle}>
          The future of career engineering. Precision-driven paths powered by the next generation of AI. 
          Upload your resume, build tailored roadmaps, and match with the industry's best opportunities all in one place.
        </p>
      </div>

      <motion.div 
        className={styles.iframeCard}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <div className={styles.videoLabel}>Tutorial Video!</div>
        <div className={styles.iframeWrapper}>
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&controls=1&showinfo=0&rel=0" 
            title="Career Compass Intro" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
      </motion.div>
      
      <motion.div 
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={32} />
        </motion.div>
        <span>Scroll to Explore</span>
      </motion.div>
    </motion.div>
  );
}
