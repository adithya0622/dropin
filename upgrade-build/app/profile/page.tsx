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

        {/* Right Column */}
        <div className="space-y-6">
          <JobReadinessScore score={82} />
          <ShareableProfileQR userId="user-auristra-12345" />
        </div>
      </div>

      {/* Full Width */}
      <MoodRecommendations />

      {/* Stats Footer */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="luxury-card-3d border-gold/20 bg-gradient-to-br from-gold/5 via-luxury-dark to-neon-purple/5 shadow-lg p-6"
      >
        <h3 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
          📊 Your Stats
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div whileHover={{ scale: 1.05 }} className="text-center p-3 rounded-lg bg-neon-blue/10 border border-neon-blue/20">
            <p className="text-2xl font-bold text-neon-blue">23</p>
            <p className="text-xs text-slate-400 mt-1">Challenges Won</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="text-center p-3 rounded-lg bg-neon-purple/10 border border-neon-purple/20">
            <p className="text-2xl font-bold text-neon-purple">3850</p>
            <p className="text-xs text-slate-400 mt-1">Total XP</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="text-center p-3 rounded-lg bg-gold/10 border border-gold/20">
            <p className="text-2xl font-bold text-gold">12</p>
            <p className="text-xs text-slate-400 mt-1">Skills Mastered</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="text-center p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-2xl font-bold text-emerald-400">95%</p>
            <p className="text-xs text-slate-400 mt-1">Completion Rate</p>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center py-6"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg font-bold text-white hover:shadow-lg transition"
        >
          🚀 Share with Employers
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
