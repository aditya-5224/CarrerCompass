"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, CalendarDays, Briefcase, Sparkles } from "lucide-react";
import styles from "./OpportunityAlerts.module.css";

const years = [1, 2, 3, 4];

type AlertItem = {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  date: string;
  urgent?: boolean;
  link: string;
};

type AlertsResponse = {
  hackathons: AlertItem[];
  jpoAlerts: AlertItem[];
  communityEvents: AlertItem[];
  updatedAt: string;
};

const prioritySections = {
  early: ["hackathons", "communityEvents", "jpoAlerts"],
  later: ["jpoAlerts", "hackathons", "communityEvents"],
} as const;

export default function OpportunityAlerts() {
  const [selectedYear, setSelectedYear] = useState<number>(3);
  const [data, setData] = useState<AlertsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAlerts() {
      setLoading(true);
      try {
        const res = await fetch("/api/opportunity-alerts", { cache: "no-store" });
        if (!res.ok) throw new Error("Unable to fetch alerts");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError("Unable to load alerts. Try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadAlerts();
  }, []);

  const selectedPriority = selectedYear <= 2 ? prioritySections.early : prioritySections.later;

  const sortedSections = useMemo(() => {
    if (!data) return [] as Array<[string, AlertItem[]]>;
    const sections = [
      ["hackathons", data.hackathons],
      ["jpoAlerts", data.jpoAlerts],
      ["communityEvents", data.communityEvents],
    ] as const;
    return selectedPriority.map((key) => sections.find((section) => section[0] === key)!).filter(Boolean);
  }, [data, selectedPriority]);

  const urgentBanner = useMemo(() => {
    if (!data || selectedYear <= 2) return null;
    const urgentJpo = data.jpoAlerts.find((item) => item.urgent);
    return urgentJpo ? urgentJpo : null;
  }, [data, selectedYear]);

  return (
    <section className={styles.alertsCard} aria-label="Opportunity & Event Alerts">
      <div className={styles.alertsHeader}>
        <div>
          <p className={styles.alertsLabel}>Opportunity & Event Alerts</p>
          <h2 className={styles.alertsTitle}>Fresh campus opportunities for students</h2>
        </div>

        <div className={styles.yearSelector} role="group" aria-label="Select student year">
          {years.map((year) => (
            <button
              key={year}
              className={`${styles.yearButton} ${selectedYear === year ? styles.yearButtonActive : ""}`}
              type="button"
              onClick={() => setSelectedYear(year)}
            >
              Year {year}
            </button>
          ))}
        </div>
      </div>

      {urgentBanner && (
        <div className={styles.urgentBanner}>
          <Bell size={18} />
          <div>
            <p className={styles.urgentTitle}>{urgentBanner.title}</p>
            <p className={styles.urgentSubtitle}>{urgentBanner.subtitle}</p>
          </div>
          <a href={urgentBanner.link} target="_blank" rel="noreferrer" className={styles.learnMore}>View details</a>
        </div>
      )}

      <div className={styles.sectionGrid}>
        {loading ? (
          <div className={styles.loading}>Loading alerts...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          sortedSections.map(([sectionKey, items]) => {
            const title = sectionKey === "hackathons" ? "Hackathon Tracker" : sectionKey === "jpoAlerts" ? "JPO Alerts" : "Community Events";
            const icon = sectionKey === "hackathons" ? <Sparkles size={18} /> : sectionKey === "jpoAlerts" ? <Briefcase size={18} /> : <CalendarDays size={18} />;

            return (
              <div key={sectionKey} className={styles.alertSection}>
                <div className={styles.sectionTitleRow}>
                  <div className={styles.sectionHeading}>{icon} {title}</div>
                  <span className={styles.sectionTag}>{selectedYear <= 2 ? "Skill focus" : sectionKey === "jpoAlerts" ? "Placement priority" : "Stay updated"}</span>
                </div>
                <div className={styles.cardList}>
                  {items.slice(0, 3).map((item) => (
                    <a key={item.id} href={item.link} target="_blank" rel="noreferrer" className={styles.cardItem}>
                      <div className={styles.cardMeta}>
                        <span className={styles.cardTag}>{item.tag}</span>
                        <span className={styles.cardDate}>{item.date}</span>
                      </div>
                      <h3 className={styles.cardTitle}>{item.title}</h3>
                      <p className={styles.cardSubtitle}>{item.subtitle}</p>
                    </a>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {data && (
        <div className={styles.footerText}>Updated on {new Date(data.updatedAt).toLocaleDateString()}</div>
      )}
    </section>
  );
}
