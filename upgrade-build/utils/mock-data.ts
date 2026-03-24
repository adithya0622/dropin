import { RecommendationPath, SkillProgress, UpgradeItem, UserProfile } from "@/types";

export const mockProfile: UserProfile = {
  id: "u_001",
  name: "Auristra Learner",
  email: "learner@auristra.ai",
  avatarUrl: "https://api.dicebear.com/9.x/identicon/svg?seed=AURISTRA26",
  skills: ["Prompt Engineering", "Data Storytelling", "Python", "Cloud Basics"],
  streak: 19,
  level: 12,
  challengesCompleted: 34,
};

export const mockSkillProgress: SkillProgress[] = [
  { skill: "Python", level: 74, target: 90, trend: [58, 62, 66, 70, 74] },
  { skill: "ML", level: 61, target: 88, trend: [42, 48, 53, 58, 61] },
  { skill: "SQL", level: 81, target: 92, trend: [70, 72, 76, 79, 81] },
  { skill: "UI/UX", level: 55, target: 80, trend: [32, 39, 43, 50, 55] },
];

export const mockUpgrades: UpgradeItem[] = [
  { id: "1", title: "Python async fundamentals", date: "2026-03-20", impact: "+8%" },
  { id: "2", title: "Prompt chain optimization", date: "2026-03-18", impact: "+6%" },
  { id: "3", title: "SQL indexing challenge", date: "2026-03-15", impact: "+5%" },
];

export const mockRecommendations: RecommendationPath[] = [
  {
    title: "AI Product Engineer Sprint",
    rationale: "Your ML momentum is rising; pair it with UI/UX to ship real products.",
    eta: "3 weeks",
    confidence: 0.91,
  },
  {
    title: "Data Storytelling Booster",
    rationale: "Strong SQL baseline can translate to better portfolio-ready narratives.",
    eta: "10 days",
    confidence: 0.86,
  },
  {
    title: "Cloud Deployment Track",
    rationale: "Bridge your coding gains with deploy skills for full-stack readiness.",
    eta: "2 weeks",
    confidence: 0.83,
  },
];
