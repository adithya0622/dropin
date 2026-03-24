"use client";

import { useState, useCallback } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export interface StudentMarks {
  [key: string]: {
    original: number;
    converted: number;
  };
}

export interface RecommendationResponse {
  success: boolean;
  student_id: number;
  student_name: string;
  class_id: string;
  course_id: string;
  total_marks: number;
  marks: StudentMarks;
  recommendation: string;
  recommendation_list: string[];
  steps_to_improve: string[];
}

export interface LoginResponse {
  success: boolean;
  token: string;
  roll_no: number;
  student_name: string;
  total_marks: number;
  message: string;
}

export interface LeaderboardEntry {
  "Student Id": number;
  Name: string;
  Class: string;
  Total: number;
}

export function useStudent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const apiCall = useCallback(
    async <T = any>(
      endpoint: string,
      method: "GET" | "POST" = "GET",
      body?: any,
      authToken?: string
    ): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (authToken) {
          headers["Authorization"] = `Bearer ${authToken}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Unknown error" }));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        console.error("API Error:", errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ===== Authentication =====
  const login = useCallback(
    async (rollNo: number, password: string): Promise<LoginResponse | null> => {
      const result = await apiCall<LoginResponse>("/login", "POST", {
        roll_no: rollNo,
        password: password,
      });

      if (result && result.success) {
        setToken(result.token);
        // Store in localStorage
        localStorage.setItem("student_token", result.token);
        localStorage.setItem("student_roll_no", result.roll_no.toString());
        localStorage.setItem("student_name", result.student_name);
      }

      return result;
    },
    [apiCall]
  );

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem("student_token");
    localStorage.removeItem("student_roll_no");
    localStorage.removeItem("student_name");
  }, []);

  // ===== Student Data =====
  const getStudentAnalysis = useCallback(
    async (rollNo: number, authToken?: string): Promise<RecommendationResponse | null> => {
      const useToken = authToken || token || localStorage.getItem("student_token") || undefined;
      return apiCall<RecommendationResponse>(
        "/recommend",
        "POST",
        { roll_no: rollNo },
        useToken
      );
    },
    [token, apiCall]
  );

  const getLeaderboard = useCallback(
    async (limit: number = 10): Promise<{ leaderboard: LeaderboardEntry[] } | null> => {
      return apiCall(`/leaderboard?limit=${limit}`, "GET");
    },
    [apiCall]
  );

  const getTopFive = useCallback(async () => {
    return apiCall("/top-five", "GET");
  }, [apiCall]);

  const healthCheck = useCallback(async () => {
    return apiCall("/health", "GET");
  }, [apiCall]);

  return {
    loading,
    error,
    token,
    login,
    logout,
    getStudentAnalysis,
    getLeaderboard,
    getTopFive,
    healthCheck,
  };
}
