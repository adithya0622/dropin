"use client";

import { motion } from "framer-motion";

export function StreakCounter({ days = 47 }: { days?: number }) {
  const streakBars = Array.from({ length: 7 }, (_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    completed: Math.random() > 0.2,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="luxury-card-3d border-gold/30 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gold flex items-center gap-2">
          🔥 {days} Day Streak!
        </h3>
        <span className="text-3xl">🎯</span>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {streakBars.map((bar, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.1 }}
            className={`h-16 rounded-lg flex flex-col items-center justify-center text-xs font-bold transition ${
              bar.completed
                ? "bg-gradient-to-t from-gold/40 to-gold/20 border border-gold/60"
                : "bg-slate-700/30 border border-slate-600/30"
            }`}
          >
            <span className={bar.completed ? "text-gold text-lg" : "text-slate-500"}>
              {bar.completed ? "✓" : "·"}
            </span>
            <span className="text-slate-400 mt-1">{bar.day}</span>
          </motion.div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-400">
          <span>This Month</span>
          <span>{days} / 31 days</span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(days / 31) * 100}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-gold to-neon-purple rounded-full"
          />
        </div>
      </div>

      <p className="text-xs text-gold mt-4 font-semibold">🎁 +15 XP per day!</p>
    </motion.div>
  );
}
