export type StudentProfile = {
  name: string;
  rollNumber: string;
  email: string;
  phone: string;
  course: string;
  branch: string;
  semester: number;
  academicYear: string;
  fatherName: string;
  motherName: string;
  dob: string;
  cgpa: number;
  creditsEarned: number;
  overallAttendance: number;
  totalSubjects: number;
  totalClasses: number;
};

export type AttendanceSubject = {
  subjectCode: string;
  subjectName: string;
  faculty: string;
  totalClasses: number;
  present: number;
  absent: number;
  percentage: number;
  status: "Good" | "Average" | "Poor";
};

export type MonthlyAttendance = {
  month: string;
  present: number;
  total: number;
  percentage: number;
};

export type CalendarDay = {
  date: string;
  label: string;
  status: "present" | "absent" | "holiday";
};

export type SemesterAttendance = {
  semester: number;
  overallPercentage: number;
  totalClasses: number;
  present: number;
  absent: number;
  subjects: AttendanceSubject[];
  monthlySummary: MonthlyAttendance[];
  calendar: CalendarDay[];
};

export type MarksRecord = {
  subjectCode: string;
  subjectName: string;
  internal: number;
  external: number;
  total: number;
  grade: string;
  credits: number;
};

export type MarksSemester = {
  semester: number;
  sgpa: number;
  cgpa: number;
  totalCredits: number;
  subjects: MarksRecord[];
};

export const studentProfile: StudentProfile = {
  name: "Priya Sharma",
  rollNumber: "21003CS105",
  email: "priya.sharma@university.edu",
  phone: "+91 98765 43210",
  course: "B. Tech",
  branch: "Computer Science and Engineering",
  semester: 6,
  academicYear: "2025-26",
  fatherName: "Ramesh Sharma",
  motherName: "Anita Sharma",
  dob: "15 March 2004",
  cgpa: 8.54,
  creditsEarned: 128,
  overallAttendance: 82,
  totalSubjects: 7,
  totalClasses: 180,
};

export const attendanceSemesters: SemesterAttendance[] = [
  {
    semester: 6,
    overallPercentage: 82,
    totalClasses: 180,
    present: 147,
    absent: 33,
    subjects: [
      {
        subjectCode: "CS601",
        subjectName: "Data Structures & Algorithms",
        faculty: "Dr. Ritu Verma",
        totalClasses: 24,
        present: 22,
        absent: 2,
        percentage: 92,
        status: "Good",
      },
      {
        subjectCode: "CS602",
        subjectName: "Operating Systems",
        faculty: "Prof. Amit Singh",
        totalClasses: 26,
        present: 20,
        absent: 6,
        percentage: 77,
        status: "Average",
      },
      {
        subjectCode: "CS603",
        subjectName: "Database Management Systems",
        faculty: "Dr. Neha Jain",
        totalClasses: 24,
        present: 18,
        absent: 6,
        percentage: 75,
        status: "Average",
      },
      {
        subjectCode: "MA601",
        subjectName: "Probability & Statistics",
        faculty: "Dr. Sunita Rao",
        totalClasses: 20,
        present: 18,
        absent: 2,
        percentage: 90,
        status: "Good",
      },
      {
        subjectCode: "EI601",
        subjectName: "Microprocessors",
        faculty: "Prof. Suresh Kumar",
        totalClasses: 22,
        present: 14,
        absent: 8,
        percentage: 64,
        status: "Poor",
      },
      {
        subjectCode: "CS604",
        subjectName: "Software Engineering",
        faculty: "Dr. Kavita Mehta",
        totalClasses: 24,
        present: 21,
        absent: 3,
        percentage: 88,
        status: "Good",
      },
      {
        subjectCode: "HS601",
        subjectName: "Professional Communication",
        faculty: "Ms. Priya Kaur",
        totalClasses: 20,
        present: 19,
        absent: 1,
        percentage: 95,
        status: "Good",
      },
    ],
    monthlySummary: [
      { month: "Jan", present: 38, total: 44, percentage: 86 },
      { month: "Feb", present: 35, total: 42, percentage: 83 },
      { month: "Mar", present: 28, total: 34, percentage: 82 },
      { month: "Apr", present: 23, total: 26, percentage: 88 },
    ],
    calendar: [
      { date: "2026-04-01", label: "1", status: "present" },
      { date: "2026-04-02", label: "2", status: "present" },
      { date: "2026-04-03", label: "3", status: "absent" },
      { date: "2026-04-04", label: "4", status: "present" },
      { date: "2026-04-05", label: "5", status: "present" },
      { date: "2026-04-06", label: "6", status: "present" },
      { date: "2026-04-07", label: "7", status: "present" },
      { date: "2026-04-08", label: "8", status: "absent" },
      { date: "2026-04-09", label: "9", status: "present" },
      { date: "2026-04-10", label: "10", status: "present" },
      { date: "2026-04-11", label: "11", status: "present" },
      { date: "2026-04-12", label: "12", status: "present" },
      { date: "2026-04-13", label: "13", status: "present" },
      { date: "2026-04-14", label: "14", status: "absent" },
      { date: "2026-04-15", label: "15", status: "present" },
      { date: "2026-04-16", label: "16", status: "present" },
      { date: "2026-04-17", label: "17", status: "present" },
      { date: "2026-04-18", label: "18", status: "present" },
      { date: "2026-04-19", label: "19", status: "absent" },
      { date: "2026-04-20", label: "20", status: "present" },
      { date: "2026-04-21", label: "21", status: "present" },
      { date: "2026-04-22", label: "22", status: "present" },
      { date: "2026-04-23", label: "23", status: "present" },
      { date: "2026-04-24", label: "24", status: "present" },
      { date: "2026-04-25", label: "25", status: "present" },
      { date: "2026-04-26", label: "26", status: "absent" },
      { date: "2026-04-27", label: "27", status: "present" },
      { date: "2026-04-28", label: "28", status: "present" },
      { date: "2026-04-29", label: "29", status: "present" },
      { date: "2026-04-30", label: "30", status: "present" },
    ],
  },
  {
    semester: 5,
    overallPercentage: 88,
    totalClasses: 172,
    present: 152,
    absent: 20,
    subjects: [
      {
        subjectCode: "CS501",
        subjectName: "Computer Networks",
        faculty: "Dr. Ritu Verma",
        totalClasses: 24,
        present: 21,
        absent: 3,
        percentage: 88,
        status: "Good",
      },
      {
        subjectCode: "CS502",
        subjectName: "Theory of Computation",
        faculty: "Prof. Anil Kumar",
        totalClasses: 24,
        present: 22,
        absent: 2,
        percentage: 92,
        status: "Good",
      },
      {
        subjectCode: "EE501",
        subjectName: "Digital Electronics",
        faculty: "Dr. Kavita Mehta",
        totalClasses: 22,
        present: 19,
        absent: 3,
        percentage: 86,
        status: "Good",
      },
      {
        subjectCode: "HS501",
        subjectName: "Organizational Behavior",
        faculty: "Ms. Priya Kaur",
        totalClasses: 20,
        present: 19,
        absent: 1,
        percentage: 95,
        status: "Good",
      },
      {
        subjectCode: "CS503",
        subjectName: "Compiler Design",
        faculty: "Prof. Suresh Kumar",
        totalClasses: 22,
        present: 17,
        absent: 5,
        percentage: 77,
        status: "Average",
      },
    ],
    monthlySummary: [
      { month: "Sep", present: 40, total: 44, percentage: 90 },
      { month: "Oct", present: 34, total: 40, percentage: 85 },
      { month: "Nov", present: 38, total: 42, percentage: 90 },
      { month: "Dec", present: 40, total: 46, percentage: 87 },
    ],
    calendar: [
      { date: "2025-12-01", label: "1", status: "present" },
      { date: "2025-12-02", label: "2", status: "present" },
      { date: "2025-12-03", label: "3", status: "present" },
      { date: "2025-12-04", label: "4", status: "absent" },
      { date: "2025-12-05", label: "5", status: "present" },
      { date: "2025-12-06", label: "6", status: "present" },
      { date: "2025-12-07", label: "7", status: "present" },
      { date: "2025-12-08", label: "8", status: "present" },
      { date: "2025-12-09", label: "9", status: "present" },
      { date: "2025-12-10", label: "10", status: "present" },
      { date: "2025-12-11", label: "11", status: "present" },
      { date: "2025-12-12", label: "12", status: "absent" },
      { date: "2025-12-13", label: "13", status: "present" },
      { date: "2025-12-14", label: "14", status: "present" },
      { date: "2025-12-15", label: "15", status: "present" },
      { date: "2025-12-16", label: "16", status: "present" },
      { date: "2025-12-17", label: "17", status: "present" },
      { date: "2025-12-18", label: "18", status: "present" },
      { date: "2025-12-19", label: "19", status: "absent" },
      { date: "2025-12-20", label: "20", status: "present" },
      { date: "2025-12-21", label: "21", status: "present" },
      { date: "2025-12-22", label: "22", status: "present" },
      { date: "2025-12-23", label: "23", status: "present" },
      { date: "2025-12-24", label: "24", status: "present" },
      { date: "2025-12-25", label: "25", status: "holiday" },
      { date: "2025-12-26", label: "26", status: "present" },
      { date: "2025-12-27", label: "27", status: "present" },
      { date: "2025-12-28", label: "28", status: "present" },
      { date: "2025-12-29", label: "29", status: "present" },
      { date: "2025-12-30", label: "30", status: "present" },
      { date: "2025-12-31", label: "31", status: "present" },
    ],
  },
];

export const marksSemesters: MarksSemester[] = [
  {
    semester: 6,
    sgpa: 8.6,
    cgpa: 8.54,
    totalCredits: 24,
    subjects: [
      {
        subjectCode: "CS601",
        subjectName: "Data Structures & Algorithms",
        internal: 24,
        external: 48,
        total: 72,
        grade: "A+",
        credits: 4,
      },
      {
        subjectCode: "CS602",
        subjectName: "Operating Systems",
        internal: 20,
        external: 40,
        total: 60,
        grade: "B+",
        credits: 4,
      },
      {
        subjectCode: "CS603",
        subjectName: "Database Management Systems",
        internal: 22,
        external: 44,
        total: 66,
        grade: "A",
        credits: 4,
      },
      {
        subjectCode: "MA601",
        subjectName: "Probability & Statistics",
        internal: 23,
        external: 46,
        total: 69,
        grade: "A+",
        credits: 3,
      },
      {
        subjectCode: "EI601",
        subjectName: "Microprocessors",
        internal: 18,
        external: 38,
        total: 56,
        grade: "B",
        credits: 3,
      },
      {
        subjectCode: "CS604",
        subjectName: "Software Engineering",
        internal: 25,
        external: 47,
        total: 72,
        grade: "A+",
        credits: 3,
      },
      {
        subjectCode: "HS601",
        subjectName: "Professional Communication",
        internal: 24,
        external: 46,
        total: 70,
        grade: "A+",
        credits: 3,
      },
    ],
  },
  {
    semester: 5,
    sgpa: 8.9,
    cgpa: 8.52,
    totalCredits: 23,
    subjects: [
      {
        subjectCode: "CS501",
        subjectName: "Computer Networks",
        internal: 23,
        external: 47,
        total: 70,
        grade: "A+",
        credits: 4,
      },
      {
        subjectCode: "CS502",
        subjectName: "Theory of Computation",
        internal: 24,
        external: 48,
        total: 72,
        grade: "A+",
        credits: 4,
      },
      {
        subjectCode: "EE501",
        subjectName: "Digital Electronics",
        internal: 21,
        external: 43,
        total: 64,
        grade: "A",
        credits: 3,
      },
      {
        subjectCode: "HS501",
        subjectName: "Organizational Behavior",
        internal: 24,
        external: 45,
        total: 69,
        grade: "A+",
        credits: 3,
      },
      {
        subjectCode: "CS503",
        subjectName: "Compiler Design",
        internal: 20,
        external: 42,
        total: 62,
        grade: "B+",
        credits: 3,
      },
    ],
  },
];
