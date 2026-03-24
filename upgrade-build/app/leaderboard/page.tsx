"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, TrendingUp, Zap, Award } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  level: number;
  xp: number;
  streak: number;
  skills: number;
  badge: string;
}

export default function LeaderboardPage() {
  const leaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      name: "Alex Chen",
      level: 25,
      xp: 12500,
      streak: 42,
      skills: 18,
      badge: "🔥",
    },
    {
      rank: 2,
      name: "Jordan Smith",
      level: 23,
      xp: 11200,
      streak: 38,
      skills: 16,
      badge: "⭐",
    },
    {
      rank: 3,
      name: "Taylor Kim",
      level: 21,
      xp: 10100,
      streak: 35,
      skills: 15,
      badge: "💎",
    },
    {
      rank: 4,
      name: "Morgan Lee",
      level: 19,
      xp: 9200,
      streak: 30,
      skills: 14,
      badge: "🚀",
    },
    {
      rank: 5,
      name: "Casey Johnson",
      level: 18,
      xp: 8500,
      streak: 28,
      skills: 13,
      badge: "👑",
    },
    {
      rank: 6,
      name: "River Davis",
      level: 17,
      xp: 7800,
      streak: 25,
      skills: 12,
      badge: "🎯",
    },
    {
      rank: 7,
      name: "Blake Wilson",
      level: 16,
      xp: 7100,
      streak: 22,
      skills: 11,
      badge: "⚡",
    },
    {
      rank: 8,
      name: "Sage Martinez",
      level: 15,
      xp: 6500,
      streak: 20,
      skills: 10,
      badge: "🏅",
    },
  ];

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-400 to-yellow-600";
      case 2:
        return "from-slate-300 to-slate-500";
      case 3:
        return "from-orange-400 to-orange-600";
      default:
        return "from-slate-500 to-slate-700";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6" />;
      case 2:
        return <Medal className="w-6 h-6" />;
      case 3:
        return <Award className="w-6 h-6" />;
      default:
        return <span className="font-bold text-lg">#{rank}</span>;
    }
  };

  return (
    <section className="space-y-6 pb-24 md:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="luxury-card-3d border-gold/30 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-8 h-8 text-gold icon-glow" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gold via-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Global Leaderboard
          </h1>
        </div>
        <p className="text-slate-400">
          Top performers in skill acceleration • Updates live every 6 hours
        </p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="luxury-card border border-neon-blue/20 p-4 text-center"
        >
          <p className="text-xs text-slate-400 mb-1">Total Players</p>
          <p className="text-2xl font-bold text-neon-blue">2.4K+</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="luxury-card border border-neon-purple/20 p-4 text-center"
        >
          <p className="text-xs text-slate-400 mb-1">Avg Level</p>
          <p className="text-2xl font-bold text-neon-purple">18.5</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="luxury-card border border-gold/20 p-4 text-center"
        >
          <p className="text-xs text-slate-400 mb-1">Skills Earned</p>
          <p className="text-2xl font-bold text-gold">45.2K</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="luxury-card border border-emerald-500/20 p-4 text-center"
        >
          <p className="text-xs text-slate-400 mb-1">Active Today</p>
          <p className="text-2xl font-bold text-emerald-400">186</p>
        </motion.div>
      </div>

      {/* Leaderboard Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="luxury-card border border-gold/20 shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold/20 bg-gold/5">
                <th className="px-4 py-3 text-left text-gold font-semibold">Rank</th>
                <th className="px-4 py-3 text-left text-gold font-semibold">Player</th>
                <th className="px-4 py-3 text-center text-gold font-semibold">Level</th>
                <th className="px-4 py-3 text-center text-gold font-semibold">XP</th>
                <th className="px-4 py-3 text-center text-gold font-semibold">Streak</th>
                <th className="px-4 py-3 text-center text-gold font-semibold">Skills</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, idx) => (
                <motion.tr
                  key={entry.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`border-b border-slate-700/50 hover:bg-slate-800/30 transition ${
                    idx < 3 ? "bg-gradient-to-r from-slate-800/50 to-transparent" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br ${getMedalColor(entry.rank)} text-white font-bold`}
                    >
                      {getRankIcon(entry.rank)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{entry.badge}</span>
                      <span className="font-semibold text-white">{entry.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold text-neon-blue">{entry.level}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Zap className="w-4 h-4 text-gold" />
                      <span className="font-semibold text-gold">{entry.xp}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-lg">🔥</span>
                      <span className="font-semibold text-orange-400">{entry.streak}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-3 py-1 rounded-full bg-neon-purple/20 border border-neon-purple/30 text-neon-purple font-semibold text-xs">
                      {entry.skills}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="luxury-card border border-neon-purple/20 text-center py-8"
      >
        <TrendingUp className="w-8 h-8 text-neon-purple mx-auto mb-3 icon-glow" />
        <h3 className="text-xl font-bold text-neon-purple mb-2">Join the Competition</h3>
        <p className="text-slate-400 mb-4 text-sm">
          Complete challenges, earn XP, and climb the leaderboard rankings!
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-purple font-semibold"
        >
          Start Your Journey
        </motion.button>
      </motion.div>
    </section>
  );
}
