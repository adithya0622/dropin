"use client";

import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { Trophy } from "lucide-react";
import { useState } from "react";
import { ChallengeRoulette } from "@/components/challenge-roulette";
import { ChallengeLeaderboard } from "@/components/challenge-leaderboard";
import { ChallengeTimer } from "@/components/challenge-timer";
import { AchievementGallery } from "@/components/achievement-gallery";
import { BeatYesterday } from "@/components/beat-yesterday";

export default function ChallengesPage() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 pb-24 md:pb-6"
    >
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}

      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="luxury-card-3d border-neon-purple/30 shadow-lg p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-gold bg-clip-text text-transparent">
              <Trophy className="h-8 w-8 icon-glow text-gold" />
              Skill Challenges
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Master skills with interactive challenges designed for AURISTRA&apos;26 judges
            </p>
          </div>
        </div>
      </motion.section>

      {/* Beat Yesterday + Timer Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BeatYesterday />
        <div className="flex flex-col justify-center">
          <ChallengeTimer />
        </div>
      </div>

      {/* Roulette */}
      <ChallengeRoulette />

      {/* Achievements */}
      <AchievementGallery />

      {/* Leaderboard */}
      <ChallengeLeaderboard />

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center py-6"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowConfetti(true)}
          className="px-8 py-3 bg-gradient-to-r from-neon-purple to-gold rounded-lg font-bold text-white hover:shadow-lg transition"
        >
          🚀 Start Your Challenge Journey
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
