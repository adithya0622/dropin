import { mockProfile, mockRecommendations, mockSkillProgress, mockUpgrades } from "@/utils/mock-data";

type Json = Record<string, unknown> | unknown[];

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

async function safeFetch<T>(path: string, init?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }

    return (await res.json()) as T;
  } catch {
    if (fallback !== undefined) return fallback;
    throw new Error(`Unable to fetch ${path}`);
  }
}

export const api = {
  auth: {
    login: (payload: Json) => safeFetch("/api/auth/login", { method: "POST", body: JSON.stringify(payload) }),
    register: (payload: Json) =>
      safeFetch("/api/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  },
  user: {
    profile: () => safeFetch("/api/auth/profile", undefined, mockProfile),
  },
  skills: {
    progress: () => safeFetch("/api/skills/progress", undefined, mockSkillProgress),
    recentUpgrades: () => safeFetch("/api/skills/upgrades", undefined, mockUpgrades),
  },
  ai: {
    recommendations: () => safeFetch("/api/ai-recommendations", undefined, mockRecommendations),
  },
};
