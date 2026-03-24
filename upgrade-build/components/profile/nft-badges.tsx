"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Trophy, Zap } from "lucide-react";
import { toast } from "sonner";

interface Badge {
  id: string;
  title: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earned: boolean;
  earnedDate?: string;
}

export function NFTBadges() {
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: "1",
      title: "First 100 XP",
      icon: "🎯",
      rarity: "common",
      earned: true,
      earnedDate: "2026-03-15",
    },
    {
      id: "2",
      title: "7-Day Streak",
      icon: "🔥",
      rarity: "rare",
      earned: true,
      earnedDate: "2026-03-20",
    },
    {
      id: "3",
      title: "React Master",
      icon: "⚛️",
      rarity: "epic",
      earned: true,
      earnedDate: "2026-03-10",
    },
    {
      id: "4",
      title: "Full Stack Pro",
      icon: "🚀",
      rarity: "legendary",
      earned: false,
    },
    {
      id: "5",
      title: "Mentor 3 Friends",
      icon: "👥",
      rarity: "epic",
      earned: false,
    },
    {
      id: "6",
      title: "Build in Public",
      icon: "🌍",
      rarity: "rare",
      earned: false,
    },
  ]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "from-slate-400 to-slate-600";
      case "rare":
        return "from-blue-400 to-blue-600";
      case "epic":
        return "from-neon-purple to-purple-600";
      case "legendary":
        return "from-gold to-yellow-600";
      default:
        return "from-slate-400 to-slate-600";
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-slate-500/50";
      case "rare":
        return "border-blue-500/50";
      case "epic":
        return "border-neon-purple/50";
      case "legendary":
        return "border-gold/50";
      default:
        return "border-slate-500/50";
    }
  };

  const shareBadge = (badge: Badge) => {
    const text = `I just earned "${badge.title}" on AURISTRA'26! 🏆 Check out my profile!`;
    toast.success("Share link copied to clipboard!");
    navigator.clipboard.writeText(
      `${window.location.origin}/profile?badge=${badge.id}`
    );
  };

  return (
    <motion.div
      className="luxury-card border border-gold/20 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-gold" />
        <h3 className="text-xl font-bold text-gold">Skill Badges (NFT)</h3>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {badges.map((badge, idx) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -4 }}
            className={`relative aspect-square rounded-2xl border-2 ${getRarityBorder(badge.rarity)} cursor-pointer`}
          >
            {/* Background gradient */}
            <div
              className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getRarityColor(badge.rarity)} opacity-20`}
            />

            {/* Badge content */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl ${
                !badge.earned ? "opacity-40" : ""
              }`}
            >
              <span className="text-4xl">{badge.icon}</span>
              {badge.earned && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-1 -right-1"
                >
                  <Zap className="w-4 h-4 text-gold fill-gold" />
                </motion.div>
              )}
            </div>

            {/* Share button on earned badges */}
            {badge.earned && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => shareBadge(badge)}
                className="absolute -bottom-2 -right-2 bg-neon-blue rounded-full p-2 border border-neon-blue/50 hover:border-neon-blue"
                title="Share badge"
              >
                <Share2 className="w-3 h-3" />
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Badge Info */}
      <div className="text-xs text-slate-400 text-center">
        <p>
          {badges.filter((b) => b.earned).length} of {badges.length} badges
          earned
        </p>
        <p className="mt-1">Share badges on LinkedIn & X to showcase skills!</p>
      </div>
    </motion.div>
  );
}
