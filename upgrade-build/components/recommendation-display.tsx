"use client";

import { useEffect, useState } from "react";
import { useApi, StudentRecommendationResponse } from "@/hooks/use-upgrade-api";

interface RecommendationProps {
  studentId: number;
  classId: string;
  courseId: string;
  token?: string;
}

export default function RecommendationDisplay({
  studentId,
  classId,
  courseId,
  token,
}: RecommendationProps) {
  const { getStudentRecommendation, loading, error } = useApi();
  const [recommendation, setRecommendation] = useState<StudentRecommendationResponse | null>(null);

  useEffect(() => {
    const fetchRecommendation = async () => {
      const result = await getStudentRecommendation(studentId, classId, courseId, token);
      if (result) {
        setRecommendation(result);
      }
    };

    fetchRecommendation();
  }, [studentId, classId, courseId, token, getStudentRecommendation]);

  if (loading) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 animate-pulse">
        <p className="text-green-700">Generating recommendations using ML...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700 font-medium">Error loading recommendations</p>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <p className="text-gray-600">No recommendations available</p>
      </div>
    );
  }

  // Parse recommendations (they may be semicolon-separated)
  const recommendations = recommendation.recommendation
    .split(";")
    .map((r) => r.trim())
    .filter((r) => r && r !== "No Recommendations");

  // Determine performance level based on total marks
  const getPerformanceLevel = (marks: number): { level: string; color: string; bgColor: string } => {
    if (marks >= 250) return { level: "Outstanding", color: "text-green-700", bgColor: "bg-green-100" };
    if (marks >= 225) return { level: "Excellent", color: "text-blue-700", bgColor: "bg-blue-100" };
    if (marks >= 200) return { level: "Good", color: "text-indigo-700", bgColor: "bg-indigo-100" };
    if (marks >= 175) return { level: "Satisfactory", color: "text-yellow-700", bgColor: "bg-yellow-100" };
    return { level: "Needs Improvement", color: "text-orange-700", bgColor: "bg-orange-100" };
  };

  const performance = getPerformanceLevel(recommendation.total_marks);

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">AI Recommendations</h2>
        <p className="text-green-100">Machine Learning powered recommendations for improvement</p>
      </div>

      <div className={`${performance.bgColor} border border-${performance.color.split("-")[1]}-200 rounded-lg p-4`}>
        <p className="text-sm text-gray-600 mb-1">Performance Level</p>
        <p className={`text-2xl font-bold ${performance.color}`}>{performance.level}</p>
        <p className="text-sm mt-2 text-gray-700">Total Score: {recommendation.total_marks} / 300</p>
      </div>

      {recommendations.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Suggested Improvements</h3>
          <ul className="space-y-2">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-700 text-sm font-medium mr-3 flex-shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {recommendations.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700 font-medium">🎉 Excellent Performance!</p>
          <p className="text-green-600 text-sm mt-1">No immediate improvements suggested. Keep up the great work!</p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-700">
          <span className="font-semibold">Note:</span> These recommendations are generated using ML-KNN algorithm based on your assessment performance.
        </p>
      </div>
    </div>
  );
}
