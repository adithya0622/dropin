export interface SkillProgress {
  skill: string;
  level: number;
  target: number;
  trend: number[];
}

export interface UpgradeItem {
  id: string;
  title: string;
  date: string;
  impact: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  skills: string[];
  streak: number;
  level: number;
  challengesCompleted: number;
}

export interface RecommendationPath {
  title: string;
  rationale: string;
  eta: string;
  confidence: number;
}
