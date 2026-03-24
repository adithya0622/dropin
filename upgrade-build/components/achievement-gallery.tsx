"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";

const achievements = [
  { id: 1, emoji: "🎯", name: "First Step", desc: "Complete 1 challenge", unlocked: true },
  { id: 2, emoji: "🔥", name: "On Fire", desc: "7 day streak", unlocked: true },
  { id: 3, emoji: "⭐", name: "Star Performer", desc: "1000 XP in a week", unlocked: true },
  { id: 4, emoji: "🚀", name: "Rocket Launch", desc: "Complete React module", unlocked: false },
  { id: 5, emoji: "🧠", name: "Brain Master", desc: "100% on algorithm test", unlocked: false },
  { id: 6, emoji: "👨‍💼", name: "Job Ready", desc: "Job readiness 90%+", unlocked: false },
  { id: 7, emoji: "🏆", name: "Champion", desc: "Top 3 on leaderboard", unlocked: false },
  { id: 8, emoji: "💎", name: "Legendary", desc: "500 day streak", unlocked: false },
];

export function AchievementGallery() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="luxury-card-3d border-gold/30 p-6"
    >
      <h3 className="text-lg font-bold text-gold mb-6 flex items-center gap-2">
        🎖️ Achievement Gallery
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievements.map((achievement, idx) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: achievement.unlocked ? 1.1 : 1 }}
            className={`relative p-4 rounded-lg border-2 transition text-center ${
              achievement.unlocked
                ? "bg-gradient-to-br from-gold/20 to-gold/5 border-gold/60 hover:shadow-lg hover:shadow-gold/40"
                : "bg-slate-900/50 border-slate-700/50 opacity-60"
            }`}
          >
            {!achievement.unlocked && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                <Lock className="w-6 h-6 text-slate-600" />
              </div>
            )}

            <motion.div
              animate={achievement.unlocked ? { rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl mb-2"
            >
              {achievement.emoji}
            </motion.div>

            <p className="text-xs font-bold text-slate-200">{achievement.name}</p>
            <p className="text-xs text-slate-400 mt-1">{achievement.desc}</p>

            {achievement.unlocked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-2 text-xs text-gold font-semibold"
              >
                ✓ Unlocked
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-700/50">
        <p className="text-xs text-slate-400 text-center">
          3 more achievements to unlock! Keep grinding 💪
        </p>
      </div>
    </motion.div>
  );
}
