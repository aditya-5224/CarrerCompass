/**
 * Activity tracker — stores user actions in localStorage so
 * they can be displayed on the profile dashboard.
 */

export interface ActivityEvent {
  id: string;
  title: string;
  description: string;
  icon: "resume" | "skill" | "roadmap" | "connect" | "signin" | "profile";
  timestamp: number; // ms epoch
}

const KEY = "cc_activity_log";
const MAX  = 20; // keep last 20 events

export function trackActivity(event: Omit<ActivityEvent, "id" | "timestamp">) {
  if (typeof window === "undefined") return;
  const existing: ActivityEvent[] = getActivity();
  const newEvent: ActivityEvent = {
    ...event,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  const updated = [newEvent, ...existing].slice(0, MAX);
  try {
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {
    // storage full — ignore
  }
}

export function getActivity(): ActivityEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ActivityEvent[]) : [];
  } catch {
    return [];
  }
}

export function clearActivity() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

/** Human-readable relative time */
export function relativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
