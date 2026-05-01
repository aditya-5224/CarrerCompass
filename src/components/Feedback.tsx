"use client";

import React from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import styles from "../app/HomePage.module.css";

export default function Feedback() {
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      query: formData.get("query"),
    };

    try {
      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
        {
          from_name: data.name,
          from_email: data.email,
          phone_number: data.phone,
          message: data.query,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ""
      );

      if (result.status !== 200) {
        throw new Error("Failed to send email");
      }

      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  return (
    <motion.section 
      className={styles.contactSection}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      id="contact"
    >
      <div className={styles.contactHeader}>
        <h2 className={styles.contactTitle}>Submit your query</h2>
        <p className={styles.contactDesc}>
          Have questions or want to collaborate? Our team is here to help you navigate your journey.
        </p>
      </div>

      <div className={styles.contactContainer}>
        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Your Name</label>
            <input type="text" name="name" className={styles.input} placeholder="Jane Smith" required />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Email (optional)</label>
            <input type="email" name="email" className={styles.input} placeholder="jane@example.com" />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Phone Number</label>
            <input type="tel" name="phone" className={styles.input} placeholder="+1 (555) 000-0000" required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Your Query</label>
            <textarea name="query" className={styles.textarea} placeholder="Tell us about your experience or ask a question..." rows={4} required />
          </div>

          {status === "error" && (
            <p style={{ color: "#ef4444", fontSize: "0.9rem", margin: "0.5rem 0" }}>{errorMsg}</p>
          )}

          {status === "success" && (
            <p style={{ color: "#10b981", fontSize: "0.9rem", margin: "0.5rem 0" }}>Query submitted successfully! We'll get back to you soon.</p>
          )}

          <motion.button 
            type="submit" 
            className={styles.submitBtn}
            disabled={status === "loading"}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ opacity: status === "loading" ? 0.7 : 1 }}
          >
            {status === "loading" ? "Submitting..." : "Submit Query"}
          </motion.button>
        </form>
      </div>
    </motion.section>
  );
}
