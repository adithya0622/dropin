"use client";

import useSWR from "swr";
import { api } from "@/utils/api";

export function useProfile() {
  return useSWR("profile", api.user.profile);
}

export function useSkillProgress() {
  return useSWR("skill-progress", api.skills.progress);
}

export function useRecentUpgrades() {
  return useSWR("recent-upgrades", api.skills.recentUpgrades);
}

export function useAIRecommendations(enabled = true) {
  return useSWR(enabled ? "ai-recommendations" : null, api.ai.recommendations);
}
