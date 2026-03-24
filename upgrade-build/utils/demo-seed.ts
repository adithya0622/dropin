"use client";

import type { UserProfile, SkillProgress, UpgradeItem, RecommendationPath } from "@/types";

export interface DemoData {
  profile: UserProfile;
  skillProgress: SkillProgress[];
  upgrades: UpgradeItem[];
  recommendations: RecommendationPath[];
  seedTimestamp: number;
}

const DEMO_DATA_STORAGE_KEY = "upgrade_demo_data";
const DEMO_STORAGE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const demoSeedData: DemoData = {
  profile: {
    id: "demo-user-001",
    name: "Demo Champion AURISTRA'26",
    email: "demo@auristra.ai",
    avatarUrl: "https://api.dicebear.com/9.x/identicon/svg?seed=AURISTRA26DEMO",
    skills: ["React", "Next.js", "AI", "TypeScript", "Tailwind CSS"],
    streak: 45,
    level: 18,
    challengesCompleted: 28,
  },
  skillProgress: [
    {
      skill: "React",
      level: 85,
      target: 95,
      trend: [55, 62, 70, 78, 85],
    },
    {
      skill: "Next.js",
      level: 78,
      target: 92,
      trend: [45, 54, 62, 70, 78],
    },
    {
      skill: "AI Engineering",
      level: 72,
      target: 90,
      trend: [38, 48, 58, 65, 72],
    },
    {
      skill: "TypeScript",
      level: 88,
      target: 95,
      trend: [65, 72, 78, 84, 88],
    },
  ],
  upgrades: [
    {
      id: "demo-1",
      title: "Built full-stack Next.js app with AI features",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 1 day ago
      impact: "+18%",
    },
    {
      id: "demo-2",
      title: "Mastered React concurrent rendering patterns",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 3 days ago
      impact: "+14%",
    },
    {
      id: "demo-3",
      title: "Completed AI prompt engineering challenge",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 5 days ago
      impact: "+12%",
    },
  ],
  recommendations: [
    {
      title: "AI Product Engineer (4-Week Sprint)",
      rationale: "Your React + Next.js + AI combo is 2x faster upskilling than industry average. Ship production-grade AI products with real impact.",
      eta: "4 weeks",
      confidence: 0.96,
    },
    {
      title: "Full-Stack Mastery Track",
      rationale: "Bridge your frontend expertise with backend systems. Deploy globally with confidence.",
      eta: "3 weeks",
      confidence: 0.92,
    },
    {
      title: "Technical Leadership Path",
      rationale: "Ready to mentor. Your skill velocity shows leadership potential.",
      eta: "2 weeks",
      confidence: 0.88,
    },
  ],
  seedTimestamp: Date.now(),
};

export function seedDemoData(): DemoData {
  try {
    if (typeof window === "undefined") return demoSeedData;

    // Store demo data in localStorage with expiry
    const dataToStore = {
      ...demoSeedData,
      seedTimestamp: Date.now(),
    };

    localStorage.setItem(DEMO_DATA_STORAGE_KEY, JSON.stringify(dataToStore));

    return dataToStore;
  } catch (error) {
    console.error("Failed to seed demo data:", error);
    return demoSeedData;
  }
}

export function getDemoData(): DemoData | null {
  try {
    if (typeof window === "undefined") return null;

    const stored = localStorage.getItem(DEMO_DATA_STORAGE_KEY);
    if (!stored) return null;

    const data = JSON.parse(stored) as DemoData;

    // Check if data has expired (24 hours)
    if (Date.now() - data.seedTimestamp > DEMO_STORAGE_EXPIRY) {
      clearDemoData();
      return null;
    }

    return data;
  } catch (error) {
    console.error("Failed to retrieve demo data:", error);
    return null;
  }
}

export function clearDemoData(): void {
  try {
    if (typeof window === "undefined") return;
    localStorage.removeItem(DEMO_DATA_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear demo data:", error);
  }
}

export function isDemoActive(): boolean {
  return getDemoData() !== null;
}

export function getTimeRemainingOnDemo(): number {
  const data = getDemoData();
  if (!data) return 0;

  const timeRemaining = DEMO_STORAGE_EXPIRY - (Date.now() - data.seedTimestamp);
  return Math.max(0, timeRemaining);
}

export function getTimeRemainingFormatted(): string {
  const remaining = getTimeRemainingOnDemo();
  if (remaining === 0) return "Expired";

  const hours = Math.floor(remaining / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
