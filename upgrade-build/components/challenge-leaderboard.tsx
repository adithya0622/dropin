"use client";

import { motion } from "framer-motion";
import { Trophy, Crown, Flame } from "lucide-react";

const leaderboardData = [
  { rank: 1, name: "Alex Chen", xp: 4850, streak: 42, avatar: "🎯" },
  { rank: 2, name: "Priya Sharma", xp: 4620, streak: 38, avatar: "💡" },
  { rank: 3, name: "Marcus Dev", xp: 4390, streak: 35, avatar: "⚡" },
  { rank: 4, name: "Luna Park", xp: 4120, streak: 28, avatar: "🚀" },
  { rank: 5, name: "Your Name", xp: 3850, streak: 25, avatar: "👨", isUser: true },
  { rank: 6, name: "Dev Kumar", xp: 3620, streak: 22, avatar: "🧠" },
  { rank: 7, name: "Sarah Tech", xp: 3390, streak: 19, avatar: "🎨" },
  { rank: 8, name: "James Code", xp: 3120, streak: 18, avatar: "💻" },
  { rank: 9, name: "Nina Hacker", xp: 2890, streak: 16, avatar: "🔐" },
  { rank: 10, name: "Tom Builder", xp: 2620, streak: 14, avatar: "🏗️" },
];

export function ChallengeLeaderboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="luxury-card-3d border-gold/30 p-6"
    >
      <h3 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
        🏆 Competitive Leaderboard
      </h3>

      <div className="space-y-2">
        {leaderboardData.map((player, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02, x: 4 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`flex items-center justify-between p-3 rounded-lg transition border ${
              player.isUser
                ? "bg-gradient-to-r from-gold/20 to-gold/10 border-gold/60"
                : idx < 3
                ? "bg-gradient-to-r from-neon-blue/10 to-neon-purple/5 border-neon-blue/30"
                : "bg-slate-800/30 border-slate-700/30"
            } hover:border-gold/80`}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center justify-center gap-1 w-8">
                {idx === 0 ? (
                  <Crown className="w-5 h-5 text-gold" />
                ) : idx === 1 ? (
                  <Trophy className="w-5 h-5 text-slate-300" />
                ) : idx < 3 ? (
                  <span className="text-sm font-bold text-neon-blue">#{player.rank}</span>
                ) : (
                  <span className="text-sm text-slate-400">#{player.rank}</span>
                )}
              </div>

              <div className="text-2xl">{player.avatar}</div>

              <div className="flex-1">
                <p className={`text-sm font-semibold ${player.isUser ? "text-gold" : "text-slate-200"}`}>
                  {player.name} {player.isUser && "🎮"}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{player.xp} XP</span>
                  <Flame className="w-3 h-3 text-orange-500" />
                  <span className="text-xs text-orange-500">{player.streak}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {idx < 3 && <span className="text-xl">⭐</span>}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        className="w-full mt-4 py-2 bg-gradient-to-r from-gold to-gold/80 rounded-lg font-bold text-slate-900 hover:shadow-lg transition"
      >
        📊 View Full Leaderboard
      </motion.button>
    </motion.div>
  );
}
