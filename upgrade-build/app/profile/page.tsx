"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudentAnalysis from "@/components/student-analysis";

export default function ProfilePage() {
  const router = useRouter();
  const [rollNo, setRollNo] = useState<number | null>(null);
  const [studentName, setStudentName] = useState<string>("");

  useEffect(() => {
    // Get student info from localStorage
    const storedRollNo = localStorage.getItem("student_roll_no");
    const storedName = localStorage.getItem("student_name");
    const token = localStorage.getItem("student_token");

    if (!storedRollNo || !token) {
      // Redirect to login if not authenticated
      router.push("/login");
      return;
    }

    setRollNo(parseInt(storedRollNo));
    setStudentName(storedName || "Student");
  }, [router]);

  if (!rollNo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <StudentAnalysis rollNo={rollNo} studentName={studentName} />
      </div>
    </div>
  );
}
  );
}
