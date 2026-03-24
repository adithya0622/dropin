"use client";

import { motion } from "framer-motion";
import { TrendingUp, Zap } from "lucide-react";

export function BeatYesterday() {
  const yesterdayChallenge = {
    skill: "React Hooks",
    difficulty: "Hard",
    xp: 500,
    time: "45 min",
  };

  const todayChallenge = {
    skill: "Advanced React Hooks",
    difficulty: "Expert",
    xp: 750,
    time: "60 min",
    bonus: "2x XP Bonus",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="luxury-card-3d border-neon-purple/30 p-6"
    >
      <h3 className="text-lg font-bold text-neon-purple mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        Beat Yesterday
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Yesterday */}
        <div>
          <p className="text-xs text-slate-400 uppercase mb-3 font-semibold">Yesterday's Challenge ✓</p>
          <motion.div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <p className="text-sm font-bold text-emerald-400 mb-3">{yesterdayChallenge.skill}</p>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Difficulty:</span>
                <span className="text-emerald-400 font-bold">{yesterdayChallenge.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span>⭐ Reward:</span>
                <span className="text-gold font-bold">{yesterdayChallenge.xp} XP</span>
              </div>
              <div className="flex justify-between">
                <span>⏱️ Time:</span>
                <span className="text-slate-300">{yesterdayChallenge.time}</span>
              </div>
            </div>

            <button className="w-full mt-3 py-2 bg-emerald-500/20 rounded text-emerald-400 text-xs font-semibold hover:bg-emerald-500/30 transition">
              📊 View Results
            </button>
          </motion.div>
        </div>

        {/* Today */}
        <div>
          <p className="text-xs text-slate-400 uppercase mb-3 font-semibold">Today's Challenge 🚀</p>
          <motion.div className="p-4 rounded-lg bg-neon-purple/10 border-2 border-neon-purple/60">
            <p className="text-sm font-bold text-neon-purple mb-3">{todayChallenge.skill}</p>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Difficulty:</span>
                <span className="text-gold font-bold">{todayChallenge.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span>⭐ Reward:</span>
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-gold font-bold"
                >
                  {todayChallenge.xp} XP {todayChallenge.bonus}
                </motion.span>
              </div>
              <div className="flex justify-between">
                <span>⏱️ Time:</span>
                <span className="text-slate-300">{todayChallenge.time}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-3 py-2 bg-gradient-to-r from-neon-purple to-gold rounded text-white font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Accept Challenge
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-700/50">
        <p className="text-xs text-slate-400 text-center">
          💡 Tip: Each day gets progressively harder to maximize learning!
        </p>
      </div>
    </motion.div>
  );
}
