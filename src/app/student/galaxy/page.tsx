"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, Building2, Rocket, Zap, ArrowRight, Star, X } from "lucide-react";
import Link from "next/link";
import styles from "./galaxy.module.css";
import { STREAMS, type Stream, type Company } from "./galaxyData";

// ── Company Modal ────────────────────────────────────────────────────────────
function CompanyModal({ company, onClose, streamColor }: { company: Company; onClose: () => void; streamColor: string }) {
  return (
    <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className={styles.modalCard}
        style={{ "--stream-color": streamColor } as React.CSSProperties}
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 40 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        onClick={e => e.stopPropagation()}
      >
        <button className={styles.modalClose} onClick={onClose}><X size={18} /></button>
        <div className={styles.modalLogoRow}>
          <div className={styles.modalLogo} style={{ background: company.color }}>{company.emoji}</div>
          <div>
            <h2 className={styles.modalName}>{company.name}</h2>
            <span className={styles.modalRole}>{company.role}</span>
          </div>
        </div>
        <p className={styles.modalAbout}>{company.about}</p>
        <div className={styles.modalPerksTitle}>What You Get:</div>
        <div className={styles.modalPerks}>
          {company.perks.map(p => (
            <div key={p} className={styles.modalPerk}>✦ {p}</div>
          ))}
        </div>
        <Link
          href={`/student/roadmap?career=${encodeURIComponent(company.role)}`}
          className={styles.modalCta}
          onClick={onClose}
        >
          <Zap size={14} /> Build Roadmap for this Role <ArrowRight size={14} />
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function CareerGalaxyPage() {
  const [selected, setSelected] = useState<Stream | null>(null);
  const [activeSem, setActiveSem] = useState(1);
  const [openCompany, setOpenCompany] = useState<Company | null>(null);

  const activeSemData = selected?.semesters.find(s => s.sem === activeSem);

  return (
    <div className={styles.page}>
      <div className={styles.bg}><div className={styles.orb1} /><div className={styles.orb2} /><div className={styles.orb3} /></div>

      <div className={styles.content}>
        <div className={styles.topBar}>
          <Link href="/" className={styles.backBtn}><ArrowLeft size={16} /> Back to Dashboard</Link>
          <p className={styles.eyebrow}>Career Galaxy Explorer</p>
          <h1 className={styles.mainTitle}>Chart Your Academic Universe</h1>
          <p className={styles.mainSub}>Pick any stream — see every semester, every skill, every opportunity waiting for you.</p>
        </div>

        {/* Stream Cards */}
        <div className={styles.streamGrid}>
          {STREAMS.map((stream, idx) => (
            <motion.button key={stream.id}
              className={`${styles.streamCard} ${selected?.id === stream.id ? styles.streamActive : ""}`}
              style={{ "--stream-color": stream.color, "--stream-glow": stream.glow } as React.CSSProperties}
              onClick={() => { setSelected(stream); setActiveSem(1); }}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }}
              whileHover={{ scale: 1.06, y: -8, boxShadow: `0 20px 40px ${stream.glow}` }}
              whileTap={{ scale: 0.96 }}
            >
              <motion.span className={styles.streamEmoji} whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.4 }}>
                {stream.emoji}
              </motion.span>
              <span className={styles.streamShort}>{stream.shortName}</span>
              <span className={styles.streamFull}>{stream.name}</span>
              <div className={styles.streamGlowRing} />
            </motion.button>
          ))}
        </div>

        {/* Detail Panel */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div key={selected.id} className={styles.detailPanel}
              style={{ "--stream-color": selected.color, "--stream-glow": selected.glow } as React.CSSProperties}
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
            >
              <div className={styles.panelHeader}>
                <div>
                  <h2 className={styles.panelTitle}>{selected.emoji} {selected.name}</h2>
                  <p className={styles.panelTagline}>{selected.tagline}</p>
                </div>
                <div className={styles.panelStats}>
                  <div className={styles.statChip}><Star size={13} /> {selected.salaryRange}</div>
                  <div className={styles.statChip}><Rocket size={13} /> {selected.opportunities.length} Career Paths</div>
                </div>
              </div>

              <div className={styles.panelBody}>
                {/* Left: Semesters */}
                <div className={styles.leftCol}>
                  <h3 className={styles.colTitle}><BookOpen size={15} /> {selected.semLabel} Journey</h3>
                  <div className={styles.semTabs}>
                    {selected.semesters.map(s => (
                      <motion.button key={s.sem}
                        className={`${styles.semTab} ${activeSem === s.sem ? styles.semTabActive : ""}`}
                        onClick={() => setActiveSem(s.sem)}
                        whileTap={{ scale: 0.92 }}
                      >
                        {s.label}
                      </motion.button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {activeSemData && (
                      <motion.div key={activeSem} className={styles.semDetail}
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div>
                          <p className={styles.subLabel}>📚 Subjects</p>
                          {activeSemData.subjects.map((sub, i) => (
                            <motion.div key={sub} className={styles.subjectChip}
                              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                            >{sub}</motion.div>
                          ))}
                        </div>
                        <div>
                          <p className={styles.subLabel}>⚡ Skills You Gain</p>
                          <div className={styles.skillChips}>
                            {activeSemData.skills.map((sk, i) => (
                              <motion.span key={sk} className={styles.skillPill}
                                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
                              >{sk}</motion.span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className={styles.collegeSection}>
                    <p className={styles.subLabel}>🏛️ Top Colleges</p>
                    <div className={styles.collegeList}>
                      {selected.topColleges.map(c => <span key={c} className={styles.collegeTag}>{c}</span>)}
                    </div>
                  </div>
                </div>

                {/* Right: Opportunities + Companies */}
                <div className={styles.rightCol}>
                  <h3 className={styles.colTitle}><Rocket size={15} /> Career Opportunities</h3>
                  <div className={styles.careerNodes}>
                    {selected.opportunities.map((opp, i) => (
                      <motion.div key={opp} className={styles.careerNode}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
                      >
                        <div className={styles.nodeOrb}>{i + 1}</div>
                        <span>{opp}</span>
                        {i < selected.opportunities.length - 1 && <div className={styles.nodeConnector} />}
                      </motion.div>
                    ))}
                  </div>

                  <h3 className={styles.colTitle} style={{ marginTop: "1.75rem" }}><Building2 size={15} /> Hiring Companies <span className={styles.clickHint}>← click to explore</span></h3>
                  <div className={styles.companyGrid}>
                    {selected.companies.map((c, i) => (
                      <motion.button key={c.name} className={styles.companyCard}
                        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        whileHover={{ scale: 1.06, y: -4, boxShadow: `0 10px 30px ${selected.glow}` }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setOpenCompany(c)}
                      >
                        <div className={styles.companyLogoSmall} style={{ background: c.color }}>{c.emoji}</div>
                        <div>
                          <div className={styles.companyName}>{c.name}</div>
                          <div className={styles.companyRole}>{c.role}</div>
                        </div>
                        <div className={styles.companyArrow}>→</div>
                      </motion.button>
                    ))}
                  </div>

                  <Link href={`/student/roadmap?career=${encodeURIComponent(selected.opportunities[0])}`} className={styles.ctaBtn}>
                    <Zap size={15} /> Generate My AI Roadmap <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!selected && (
          <motion.p className={styles.hint} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5 } }}>
            👆 Select any stream above to explore your complete journey
          </motion.p>
        )}
      </div>

      {/* Company Modal */}
      <AnimatePresence>
        {openCompany && (
          <CompanyModal company={openCompany} streamColor={selected?.color || "#818cf8"} onClose={() => setOpenCompany(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
