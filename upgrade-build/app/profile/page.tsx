"use client";

import { motion } from "framer-motion";
import { ProfileRadar } from "@/components/profile-radar";
import { StreakCounter } from "@/components/streak-counter";
import { JobReadinessScore } from "@/components/job-readiness-score";
import { ShareableProfileQR } from "@/components/shareable-profile-qr";
import { MoodRecommendations } from "@/components/mood-recommendations";

export default function ProfilePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 pb-24 md:pb-6"
    >
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="luxury-card-3d border-neon-blue/30 shadow-lg p-6"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-6xl"
          >
            👨‍💼
          </motion.div>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-gold bg-clip-text text-transparent">
              Your Developer Profile
            </h1>
            <p className="text-slate-400 mt-2">
              Track your growth, showcase your skills, and land your dream role at AURISTRA&apos;26.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <ProfileRadar />
          <StreakCounter days={47} />
        </div>

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
