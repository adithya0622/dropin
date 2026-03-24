import { useState, useCallback } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface StudentMarksResponse {
  student_id: number;
  class_id: string;
  course_id: string;
  marks: Record<string, number | string>;
}

export interface StudentRecommendationResponse {
  student_id: number;
  class_id: string;
  course_id: string;
  recommendation: string;
  total_marks: number;
}

export interface StudentProfile {
  student_id: number;
  name: string;
  class_id: string;
  course_id: string;
  total_marks: number;
  recommendation: string;
}

export interface LeaderboardEntry {
  'Student Id': number;
  Name: string;
  Class: string;
  Total?: number;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  student_id: number;
  student_name: string;
}

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiCall = useCallback(
    async <T = any>(
      endpoint: string,
      method: 'GET' | 'POST' = 'GET',
      body?: any,
      token?: string
    ): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
          throw new Error(errorData.detail || `HTTP ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        console.error('API Error:', errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Authentication endpoints
  const login = useCallback(
    async (studentId: number): Promise<LoginResponse | null> => {
      return apiCall('/api/auth/login', 'POST', { student_id: studentId });
    },
    [apiCall]
  );

  // Student data endpoints
  const getStudentMarks = useCallback(
    async (
      studentId: number,
      classId: string,
      courseId: string,
      token?: string
    ): Promise<StudentMarksResponse | null> => {
      return apiCall(
        '/api/student/marks',
        'POST',
        { student_id: studentId, class_id: classId, course_id: courseId },
        token
      );
    },
    [apiCall]
  );

  const getStudentRecommendation = useCallback(
    async (
      studentId: number,
      classId: string,
      courseId: string,
      token?: string
    ): Promise<StudentRecommendationResponse | null> => {
      return apiCall(
        '/api/student/recommendation',
        'POST',
        { student_id: studentId, class_id: classId, course_id: courseId },
        token
      );
    },
    [apiCall]
  );

  const getStudentProfile = useCallback(
    async (studentId: number, token?: string): Promise<StudentProfile | null> => {
      return apiCall(`/api/student/profile/${studentId}`, 'GET', undefined, token);
    },
    [apiCall]
  );

  const getLeaderboard = useCallback(
    async (courseId: string = 'Default', limit: number = 10, token?: string) => {
      return apiCall(
        `/api/students/leaderboard?course_id=${courseId}&limit=${limit}`,
        'GET',
        undefined,
        token
      );
    },
    [apiCall]
  );

  const getCourses = useCallback(async () => {
    return apiCall('/api/courses', 'GET');
  }, [apiCall]);

  const healthCheck = useCallback(async () => {
    return apiCall('/health', 'GET');
  }, [apiCall]);

  return {
    loading,
    error,
    login,
    getStudentMarks,
    getStudentRecommendation,
    getStudentProfile,
    getLeaderboard,
    getCourses,
    healthCheck,
  };
}
