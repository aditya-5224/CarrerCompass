import { NextResponse } from "next/server";

const mockAlerts = {
  hackathons: [
    {
      id: "hack-001",
      title: "Inter-College Hackathon: Build for Social Impact",
      subtitle: "Team registrations closing soon. Open to all 1st/2nd year students.",
      tag: "Online + Offline",
      date: "Deadline: Jul 12",
      urgent: false,
      link: "https://devfolio.co",
    },
    {
      id: "hack-002",
      title: "Unstop AI Challenge: Campus Innovation Track",
      subtitle: "Top performers get internship shortlisting and certificates.",
      tag: "Online",
      date: "Deadline: Jul 18",
      urgent: false,
      link: "https://unstop.com",
    },
    {
      id: "hack-003",
      title: "College Coding Sprint: Live campus contest",
      subtitle: "Limited seats for teams from neighboring colleges.",
      tag: "Offline",
      date: "Event: Jul 20",
      urgent: false,
      link: "https://example.com",
    },
  ],
  jpoAlerts: [
    {
      id: "jpo-001",
      title: "Urgent Drive: Product Analyst Internship",
      subtitle: "Eligibility: 3rd/4th year only. Apply before Jul 10.",
      tag: "JPO",
      date: "Deadline: Jul 10",
      urgent: true,
      link: "https://example.com",
    },
    {
      id: "jpo-002",
      title: "Campus Hiring: Sales & Marketing Executive",
      subtitle: "Open for eligible final year students with 60%+ score.",
      tag: "JPO",
      date: "Deadline: Jul 22",
      urgent: false,
      link: "https://example.com",
    },
    {
      id: "jpo-003",
      title: "Drive: QA Test Engineer",
      subtitle: "Freshers with good logical reasoning can apply.",
      tag: "JPO",
      date: "Deadline: Jul 25",
      urgent: false,
      link: "https://example.com",
    },
  ],
  communityEvents: [
    {
      id: "event-001",
      title: "AI Bootcamp: 2-day hands-on workshop",
      subtitle: "Open to all years; focus on prompt engineering and MLOps.",
      tag: "Workshop",
      date: "Jul 14",
      urgent: false,
      link: "https://example.com",
    },
    {
      id: "event-002",
      title: "Campus Community Meetup: Student Startups",
      subtitle: "Learn from founders and build your idea pitch.",
      tag: "Community",
      date: "Jul 16",
      urgent: false,
      link: "https://example.com",
    },
    {
      id: "event-003",
      title: "Tech Talk: Cloud Careers & Internships",
      subtitle: "Free session with recruiters and alumni mentors.",
      tag: "Webinar",
      date: "Jul 19",
      urgent: false,
      link: "https://example.com",
    },
  ],
};

export async function GET() {
  return NextResponse.json({ ...mockAlerts, updatedAt: new Date().toISOString() });
}
