"use client";

import { useEffect, useState } from "react";
import { useStudent, RecommendationResponse } from "@/hooks/use-student";

interface StudentAnalysisProps {
  rollNo: number;
  studentName?: string;
}

export default function StudentAnalysis({ rollNo, studentName }: StudentAnalysisProps) {
  const { getStudentAnalysis, loading, error } = useStudent();
  const [analysis, setAnalysis] = useState<RecommendationResponse | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      const result = await getStudentAnalysis(rollNo);
      if (result && result.success) {
        setAnalysis(result);
      }
    };

    fetchAnalysis();
  }, [rollNo, getStudentAnalysis]);

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 animate-pulse">
        <p className="text-blue-700 font-medium">Loading your analysis...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700 font-medium">Error loading analysis</p>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!analysis || !analysis.success) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <p className="text-gray-600">No analysis available</p>
      </div>
    );
  }

  // Determine performance level
  const getPerformanceLevel = (
    marks: number
  ): { level: string; color: string; bgColor: string; icon: string } => {
    if (marks >= 250) return { level: "Outstanding", color: "text-green-700", bgColor: "bg-green-100", icon: "🌟" };
    if (marks >= 225) return { level: "Excellent", color: "text-blue-700", bgColor: "bg-blue-100", icon: "⭐" };
    if (marks >= 200) return { level: "Good", color: "text-indigo-700", bgColor: "bg-indigo-100", icon: "👍" };
    if (marks >= 175) return { level: "Satisfactory", color: "text-yellow-700", bgColor: "bg-yellow-100", icon: "📊" };
    return { level: "Needs Improvement", color: "text-orange-700", bgColor: "bg-orange-100", icon: "📈" };
  };

  const performance = getPerformanceLevel(analysis.total_marks);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">{analysis.student_name}</h1>
        <p className="text-indigo-100">Roll: {analysis.student_id} • Class: {analysis.class_id}</p>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`${performance.bgColor} border border-gray-200 rounded-lg p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Performance Level</p>
              <p className={`text-2xl font-bold ${performance.color}`}>{performance.level}</p>
            </div>
            <span className="text-4xl">{performance.icon}</span>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Total Marks</p>
          <p className="text-3xl font-bold text-indigo-700">{analysis.total_marks}</p>
          <p className="text-xs text-gray-500 mt-2">out of 300</p>
        </div>
      </div>

      {/* Marks Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Marks Breakdown</h2>
        <div className="space-y-3">
          {Object.entries(analysis.marks).map(([subject, marks]) => {
            const totalPossible = 
              subject === "Mid Term" ? 25 :
              subject === "End Term" ? 50 :
              subject === "Assignment 1" ? 10 :
              subject === "Assignment 2" ? 10 :
              5; // Project

            const percentage = (marks.converted / totalPossible) * 100;

            return (
              <div key={subject}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-700">{subject}</span>
                  <span className="font-bold text-indigo-600">
                    {marks.converted} / {totalPossible}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Steps to Improve */}
      {analysis.steps_to_improve && analysis.steps_to_improve.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Steps to Improve</h2>
          <ul className="space-y-3">
            {analysis.steps_to_improve.map((step, idx) => (
              <li key={idx} className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mr-3 flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-gray-700 pt-0.5">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendation */}
      {analysis.recommendation && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-900 mb-2">AI Recommendation</h3>
          <p className="text-green-800">{analysis.recommendation}</p>
        </div>
      )}

      {/* No Improvements Needed */}
      {(!analysis.steps_to_improve || analysis.steps_to_improve.length === 0) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-green-700 font-medium">🎉 Excellent Performance!</p>
          <p className="text-green-600 text-sm mt-1">
            No immediate improvements suggested. Keep maintaining this excellent performance level!
          </p>
        </div>
      )}
    </div>
  );
}
