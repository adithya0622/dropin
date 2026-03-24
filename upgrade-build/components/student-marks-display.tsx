"use client";

import { useEffect, useState } from "react";
import { useApi, StudentMarksResponse } from "@/hooks/use-upgrade-api";

interface StudentMarksProps {
  studentId: number;
  classId: string;
  courseId: string;
  token?: string;
}

export default function StudentMarksDisplay({
  studentId,
  classId,
  courseId,
  token,
}: StudentMarksProps) {
  const { getStudentMarks, loading, error } = useApi();
  const [marks, setMarks] = useState<StudentMarksResponse | null>(null);

  useEffect(() => {
    const fetchMarks = async () => {
      const result = await getStudentMarks(studentId, classId, courseId, token);
      if (result) {
        setMarks(result);
      }
    };

    fetchMarks();
  }, [studentId, classId, courseId, token, getStudentMarks]);

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 animate-pulse">
        <p className="text-blue-700">Loading marks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700 font-medium">Error loading marks</p>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!marks) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <p className="text-gray-600">No marks data available</p>
      </div>
    );
  }

  // Separate numeric marks from metadata
  const marksEntries = Object.entries(marks.marks)
    .filter(([key]) => !["Student Id", "Class", "Name"].includes(key))
    .map(([key, value]) => ({
      subject: key,
      marks: typeof value === "number" ? value : 0,
    }));

  const totalMarks = marksEntries.reduce((sum, item) => sum + item.marks, 0);

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Marks Summary</h2>
        <p className="text-blue-100">Course: {courseId}</p>
        <p className="text-blue-100">Class: {classId}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {marksEntries.map((item) => {
          const percentage = totalMarks > 0 ? (item.marks / totalMarks) * 100 : 0;
          return (
            <div key={item.subject} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800">{item.subject}</h3>
                <span className="text-lg font-bold text-indigo-600">{item.marks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <p className="text-sm text-indigo-600 mb-1">Total Marks</p>
        <p className="text-3xl font-bold text-indigo-700">{totalMarks}</p>
      </div>
    </div>
  );
}
