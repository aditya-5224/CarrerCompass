"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Download,
  FileText,
  GraduationCap,
  ShieldCheck,
  User,
  ArrowRight,
  X,
} from "lucide-react";
import jsPDF from "jspdf";
import styles from "./AcademicPortal.module.css";
import {
  studentProfile,
  attendanceSemesters,
  marksSemesters,
  type MarksSemester,
  type SemesterAttendance,
} from "@/data/studentERP";

const TABS = [
  { id: "details", label: "Student Details", icon: User },
  { id: "attendance", label: "Attendance Record", icon: CalendarDays },
  { id: "marks", label: "Marks / Academic Record", icon: GraduationCap },
] as const;

type TabId = (typeof TABS)[number]["id"];

type StatusType = "Good" | "Average" | "Poor";

function getStatusClass(status: StatusType) {
  switch (status) {
    case "Good":
      return styles.subjectGood;
    case "Average":
      return styles.subjectAverage;
    case "Poor":
      return styles.subjectPoor;
    default:
      return "";
  }
}

function getAttendanceTone(percent: number) {
  if (percent >= 85) return { label: "Excellent attendance", tone: styles.statusBannerGood };
  if (percent >= 75) return { label: "Attendance is stable, keep improving.", tone: styles.statusBannerAverage };
  return { label: "Attendance below safe threshold — immediate attention needed.", tone: styles.statusBanner };
}

function exportAttendancePdf(activeAttendance: SemesterAttendance) {
  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(18);
  doc.text("Academic Portal — Attendance Summary", 16, 24);
  doc.setFontSize(12);
  doc.text(`Student: ${studentProfile.name} (${studentProfile.rollNumber})`, 16, 36);
  doc.text(`Semester ${activeAttendance.semester} · Overall ${activeAttendance.overallPercentage}%`, 16, 44);
  doc.text("", 16, 50);
  doc.setFontSize(11);

  activeAttendance.subjects.forEach((subject, index) => {
    const y = 56 + index * 8;
    doc.text(
      `${subject.subjectCode} - ${subject.subjectName} | Present: ${subject.present}/${subject.totalClasses} | ${subject.percentage}% | ${subject.status}`,
      16,
      y
    );
  });

  doc.save(`${studentProfile.rollNumber}-attendance.pdf`);
}

export default function AcademicPortal() {
  const [activeTab, setActiveTab] = useState<TabId>("attendance");
  const [selectedSemester, setSelectedSemester] = useState<number>(attendanceSemesters[0].semester);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMarksSemester, setSelectedMarksSemester] = useState<number>(marksSemesters[0].semester);
  const [reportOpen, setReportOpen] = useState(false);

  const activeAttendance = useMemo(
    () => attendanceSemesters.find((item) => item.semester === selectedSemester) ?? attendanceSemesters[0],
    [selectedSemester]
  );

  const filteredSubjects = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return activeAttendance.subjects;

    return activeAttendance.subjects.filter((subject) =>
      subject.subjectName.toLowerCase().includes(query) ||
      subject.subjectCode.toLowerCase().includes(query) ||
      subject.faculty.toLowerCase().includes(query)
    );
  }, [activeAttendance.subjects, searchTerm]);

  const activeMarks = useMemo(
    () => marksSemesters.find((item) => item.semester === selectedMarksSemester) ?? marksSemesters[0],
    [selectedMarksSemester]
  );

  const marksSGPA = useMemo(() => activeMarks.sgpa, [activeMarks]);
  const marksCGPA = useMemo(() => activeMarks.cgpa, [activeMarks]);
  const marksCredits = useMemo(() => activeMarks.totalCredits, [activeMarks]);

  const { label: attendanceToneLabel, tone: attendanceToneClass } = getAttendanceTone(activeAttendance.overallPercentage);

  return (
    <section className={styles.portalCard} aria-label="Academic Portal">
      <div className={styles.portalHeader}>
        <div className={styles.portalHeadline}>
          <span className={styles.portalLabel}>Academic Portal</span>
          <h2 className={styles.portalTitle}>College ERP student dashboard</h2>
          <p className={styles.portalIntro}>
            A polished academic portal for attendance, marks, and student profile management. Designed for an Indian college ERP experience with clear navigation, meaningful insights and a responsive layout.
          </p>
        </div>

        <div className={styles.portalActions}>
          <a href="/" className={styles.backToDashboard}>
            <ArrowRight size={16} /> Back to Dashboard
          </a>
        </div>
      </div>

      <div className={styles.tabList} role="tablist" aria-label="Academic Portal Tabs">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabButtonActive : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={18} aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className={styles.panel}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className={styles.tabPanel}
        >
          {activeTab === "details" && (
            <div className={styles.detailGrid}>
              <div className={styles.profileCard}>
                <div className={styles.profileTop}>
                  <div className={styles.profileAvatar} aria-hidden="true">
                    {studentProfile.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div className={styles.profileMeta}>
                    <p className={styles.profileTag}>{studentProfile.course}</p>
                    <h3 className={styles.profileName}>{studentProfile.name}</h3>
                    <p className={styles.profileSubtitle}>{studentProfile.branch}</p>
                    <p className={styles.profileSubtitle}>Semester {studentProfile.semester} • Academic Year {studentProfile.academicYear}</p>
                  </div>
                </div>

                <div className={styles.quickStats}>
                  <div className={styles.quickStat}>
                    <p className={styles.quickStatLabel}>Overall Attendance</p>
                    <p className={styles.quickStatValue}>{studentProfile.overallAttendance}%</p>
                  </div>
                  <div className={styles.quickStat}>
                    <p className={styles.quickStatLabel}>Total Subjects</p>
                    <p className={styles.quickStatValue}>{studentProfile.totalSubjects}</p>
                  </div>
                  <div className={styles.quickStat}>
                    <p className={styles.quickStatLabel}>Current CGPA</p>
                    <p className={styles.quickStatValue}>{studentProfile.cgpa}</p>
                  </div>
                  <div className={styles.quickStat}>
                    <p className={styles.quickStatLabel}>Credits Earned</p>
                    <p className={styles.quickStatValue}>{studentProfile.creditsEarned}</p>
                  </div>
                </div>
              </div>

              <div className={styles.profileCard}>
                <div className={styles.infoBlock}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Roll Number</span>
                    <span className={styles.infoValue}>{studentProfile.rollNumber}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Email</span>
                    <span className={styles.infoValue}>{studentProfile.email}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Phone</span>
                    <span className={styles.infoValue}>{studentProfile.phone}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Father / Mother</span>
                    <span className={styles.infoValue}>{studentProfile.fatherName} / {studentProfile.motherName}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Date of Birth</span>
                    <span className={styles.infoValue}>{studentProfile.dob}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "attendance" && (
            <div className={styles.panel}>
              <div className={styles.attendanceToolbar}>
                <div className={styles.filterRow}>
                  <label className="sr-only" htmlFor="semester-select">Semester</label>
                  <select
                    id="semester-select"
                    className={styles.filterSelect}
                    value={selectedSemester}
                    onChange={(event) => setSelectedSemester(Number(event.target.value))}
                  >
                    {attendanceSemesters.map((semester) => (
                      <option key={semester.semester} value={semester.semester}>
                        Semester {semester.semester}
                      </option>
                    ))}
                  </select>

                  <label className="sr-only" htmlFor="attendance-search">Search subject</label>
                  <input
                    id="attendance-search"
                    type="search"
                    className={styles.filterInput}
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search by subject or faculty"
                  />

                  <button
                    type="button"
                    className={styles.exportButton}
                    onClick={() => exportAttendancePdf(activeAttendance)}
                  >
                    <Download size={16} aria-hidden="true" />
                    Export to PDF
                  </button>
                </div>
              </div>

              <div className={styles.attendanceSummary}>
                <div className={styles.attendanceCard}>
                  <p className={styles.attendanceLabel}>Overall Attendance</p>
                  <p className={styles.attendanceValue}>{activeAttendance.overallPercentage}%</p>
                  <p className={styles.attendanceSmall}>{activeAttendance.present}/{activeAttendance.totalClasses} classes attended</p>
                </div>
                <div className={styles.attendanceCard}>
                  <p className={styles.attendanceLabel}>Subject count</p>
                  <p className={styles.attendanceValue}>{activeAttendance.subjects.length}</p>
                  <p className={styles.attendanceSmall}>Tracked across current semester subjects</p>
                </div>
                <div className={styles.attendanceCard}>
                  <p className={styles.attendanceLabel}>Attendance Goal</p>
                  <p className={styles.attendanceValue}>75%+</p>
                  <p className={styles.attendanceSmall}>Secure exam eligibility with consistent attendance.</p>
                </div>
              </div>

              <div className={attendanceToneClass} role="status" aria-live="polite">
                <ShieldCheck size={20} aria-hidden="true" />
                <span>{attendanceToneLabel}</span>
              </div>

              <div className={styles.attendanceBlocks}>
                <div className={styles.subjectTableWrapper}>
                  <table className={styles.subjectTable} aria-label="Attendance subject table">
                    <thead>
                      <tr>
                        <th scope="col">Subject Code</th>
                        <th scope="col">Subject</th>
                        <th scope="col">Faculty</th>
                        <th scope="col">Total</th>
                        <th scope="col">Present</th>
                        <th scope="col">Absent</th>
                        <th scope="col">%</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubjects.map((subject) => (
                        <tr key={subject.subjectCode}>
                          <td>{subject.subjectCode}</td>
                          <td>{subject.subjectName}</td>
                          <td>{subject.faculty}</td>
                          <td>{subject.totalClasses}</td>
                          <td>{subject.present}</td>
                          <td>{subject.absent}</td>
                          <td>{subject.percentage}%</td>
                          <td>
                            <span className={`${styles.subjectStatus} ${getStatusClass(subject.status)}`}>
                              {subject.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className={styles.calendarCard}>
                  <div className={styles.calendarTitle}>
                    <CalendarDays size={18} /> Monthly attendance overview
                  </div>
                  <div className={styles.calendarGrid}>
                    {activeAttendance.calendar.slice(0, 28).map((day) => (
                      <div
                        key={day.date}
                        className={`${styles.calendarDay} ${
                          day.status === "present" ? styles.calendarPresent : day.status === "absent" ? styles.calendarAbsent : styles.calendarHoliday
                        }`}
                      >
                        {day.label}
                      </div>
                    ))}
                  </div>
                  <div className={styles.calendarLegend}>
                    <span className={styles.legendItem}>
                      <span className={`${styles.legendDot} ${styles.legendPresent}`} aria-hidden="true" /> Present
                    </span>
                    <span className={styles.legendItem}>
                      <span className={`${styles.legendDot} ${styles.legendAbsent}`} aria-hidden="true" /> Absent
                    </span>
                    <span className={styles.legendItem}>
                      <span className={`${styles.legendDot} ${styles.legendHoliday}`} aria-hidden="true" /> Holiday
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.monthlyGrid}>
                {activeAttendance.monthlySummary.map((month) => (
                  <div key={month.month} className={styles.monthCard}>
                    <p className={styles.monthName}>{month.month}</p>
                    <p className={styles.monthProgress}>{month.percentage}%</p>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${month.percentage}%` }} />
                    </div>
                    <p className={styles.attendanceSmall}>{month.present} of {month.total} classes attended</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "marks" && (
            <div className={styles.panel}>
              <div className={styles.attendanceToolbar}>
                <div className={styles.filterRow}>
                  <label className="sr-only" htmlFor="marks-semester">Marks semester</label>
                  <select
                    id="marks-semester"
                    className={styles.filterSelect}
                    value={selectedMarksSemester}
                    onChange={(event) => setSelectedMarksSemester(Number(event.target.value))}
                  >
                    {marksSemesters.map((semester) => (
                      <option key={semester.semester} value={semester.semester}>
                        Semester {semester.semester}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.marksSummary}>
                <div className={styles.marksCard}>
                  <p className={styles.marksCardTitle}>SGPA</p>
                  <p className={styles.marksCardValue}>{marksSGPA}</p>
                </div>
                <div className={styles.marksCard}>
                  <p className={styles.marksCardTitle}>CGPA</p>
                  <p className={styles.marksCardValue}>{marksCGPA}</p>
                </div>
                <div className={styles.marksCard}>
                  <p className={styles.marksCardTitle}>Credits</p>
                  <p className={styles.marksCardValue}>{marksCredits}</p>
                </div>
              </div>

              <div className={styles.marksTableWrapper}>
                <table className={styles.marksTable} aria-label="Marks record table">
                  <thead>
                    <tr>
                      <th scope="col">Subject</th>
                      <th scope="col">Internal</th>
                      <th scope="col">External</th>
                      <th scope="col">Total</th>
                      <th scope="col">Grade</th>
                      <th scope="col">Credits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeMarks.subjects.map((subject) => (
                      <tr key={subject.subjectCode}>
                        <td>{subject.subjectName}</td>
                        <td>{subject.internal}</td>
                        <td>{subject.external}</td>
                        <td>{subject.total}</td>
                        <td>
                          <span className={styles.gradeBadge}>{subject.grade}</span>
                        </td>
                        <td>{subject.credits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.progressRow}>
                {activeMarks.subjects.map((subject) => {
                  const percent = Math.round((subject.total / 100) * 100);
                  return (
                    <div key={subject.subjectCode} className={styles.progressItem}>
                      <div className={styles.progressLabelRow}>
                        <span>{subject.subjectCode}</span>
                        <span className={styles.progressText}>{percent}%</span>
                      </div>
                      <div className={styles.progressLine}>
                        <div className={styles.progressBarLevel} style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <button type="button" className={styles.detailedReportButton} onClick={() => setReportOpen(true)}>
                <FileText size={16} aria-hidden="true" />
                View Detailed Report
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {reportOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="report-title">
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <div>
                <h3 id="report-title" className={styles.modalTitle}>Detailed Academic Report</h3>
                <p className={styles.modalSectionText}>Semester {activeMarks.semester} marks breakdown and subject performance details.</p>
              </div>
              <button type="button" className={styles.modalClose} onClick={() => setReportOpen(false)}>
                <X size={18} aria-hidden="true" /> Close
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalSection}>
                <span className={styles.modalSectionHeading}>Student</span>
                <p className={styles.modalSectionText}>{studentProfile.name} • {studentProfile.rollNumber} • Semester {activeMarks.semester}</p>
              </div>

              <div className={styles.modalSection}>
                <span className={styles.modalSectionHeading}>Summary</span>
                <p className={styles.modalSectionText}>This report shows the latest internal and external marks along with total scores. Use it to identify strong subjects and academic focus areas.</p>
              </div>

              <div className={styles.marksTableWrapper}>
                <table className={styles.modalTable} aria-label="Detailed report table">
                  <thead>
                    <tr>
                      <th scope="col">Subject</th>
                      <th scope="col">Internal</th>
                      <th scope="col">External</th>
                      <th scope="col">Total</th>
                      <th scope="col">Grade</th>
                      <th scope="col">Credits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeMarks.subjects.map((subject) => (
                      <tr key={subject.subjectCode}>
                        <td>{subject.subjectName}</td>
                        <td>{subject.internal}</td>
                        <td>{subject.external}</td>
                        <td>{subject.total}</td>
                        <td>{subject.grade}</td>
                        <td>{subject.credits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
