"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Zap } from "lucide-react";

const skills = [
  "React Hooks",
  "TypeScript",
  "Database Design",
  "API Design",
  "CSS Grid",
  "Performance",
  "Testing",
  "DevOps",
];

export function ChallengeRoulette() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const randomSkill = skills[Math.floor(Math.random() * skills.length)];
    setSelectedSkill(randomSkill);

    setTimeout(() => {
      setIsSpinning(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="luxury-card-3d border-neon-purple/30 p-6 text-center"
    >
      <h3 className="text-lg font-bold text-neon-purple mb-4 flex items-center justify-center gap-2">
        🎡 Daily Skill Roulette
      </h3>

      <motion.div
        animate={{ rotate: isSpinning ? 360 : 0 }}
        transition={{ duration: isSpinning ? 1.5 : 0.3 }}
        className="relative w-40 h-40 mx-auto mb-6"
      >
        <div className="absolute inset-0 rounded-full border-4 border-neon-purple/50 bg-gradient-to-br from-neon-purple/20 to-gold/20 flex items-center justify-center">
          <div className="text-center">
            {selectedSkill ? (
              <div>
                <p className="text-2xl font-bold text-gold">{selectedSkill}</p>
                <p className="text-xs text-slate-400 mt-1">Today's Challenge</p>
              </div>
            ) : (
              <p className="text-slate-400">?</p>
            )}
          </div>
        </div>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSpin}
        disabled={isSpinning}
        className="px-8 py-3 bg-gradient-to-r from-neon-purple to-gold rounded-lg font-bold text-white hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
      >
        <Zap className="w-4 h-4" />
        {isSpinning ? "Spinning..." : "Spin Wheel"}
      </motion.button>

      {selectedSkill && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 pt-4 border-t border-slate-700/50"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="w-full py-2 bg-gradient-to-r from-gold/20 to-gold/10 border border-gold/50 rounded-lg text-gold font-semibold hover:border-gold/80 transition"
          >
            ⚡ Accept Challenge
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
