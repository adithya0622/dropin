"use client";

import { motion } from "framer-motion";
import { Zap, Briefcase } from "lucide-react";

export function JobReadinessScore({ score = 82 }: { score?: number }) {
  const jobMatches = [
    { title: "Senior Frontend Dev", company: "Meta", match: 95 },
    { title: "Full Stack Engineer", company: "Airbnb", match: 88 },
    { title: "Backend Developer", company: "Spotify", match: 76 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="luxury-card-3d border-neon-purple/30 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-neon-purple flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Job Readiness
        </h3>
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl font-bold bg-gradient-to-r from-neon-purple to-gold bg-clip-text text-transparent"
        >
          {score}%
        </motion.div>
      </div>

      <div className="space-y-3 mb-6">
        {jobMatches.map((job, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02, x: 4 }}
            className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-neon-purple/10 to-gold/5 border border-neon-purple/20 hover:border-neon-purple/40 transition cursor-pointer group"
          >
            <div>
              <p className="text-sm font-semibold text-slate-200 group-hover:text-neon-purple transition">
                {job.title}
              </p>
              <p className="text-xs text-slate-400">{job.company}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-neon-purple">{job.match}%</span>
              <Zap className="w-4 h-4 text-gold" />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full py-3 bg-gradient-to-r from-neon-purple to-gold rounded-lg font-bold text-white hover:shadow-lg transition"
      >
        📊 View Job Board
      </motion.button>

      <p className="text-xs text-slate-400 mt-3 text-center">
        Complete 3 more challenges to unlock senior roles 🚀
      </p>
    </motion.div>
  );
}
