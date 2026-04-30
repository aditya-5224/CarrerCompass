"use client";

import { useState } from "react";
import styles from "./SOSButton.module.css";

export default function SOSButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSOS = async () => {
    // Confirm before sending
    if (!window.confirm("Are you sure you want to trigger an Emergency SOS?")) {
      return;
    }

    setLoading(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/sos", {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to send SOS");
      setStatus("success");
      
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      console.error(err);
      setStatus("error");
      
      setTimeout(() => setStatus("idle"), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.sosContainer}>
      {status === "success" && (
        <div className={styles.alertSuccess}>SOS Alert Sent!</div>
      )}
      {status === "error" && (
        <div className={styles.alertError}>Failed to send SOS.</div>
      )}
      <button 
        onClick={handleSOS} 
        disabled={loading}
        className={`${styles.sosButton} ${loading ? styles.loading : ""}`}
        aria-label="Trigger Emergency SOS"
      >
        {loading ? "Sending..." : "SOS"}
      </button>
    </div>
  );
}
