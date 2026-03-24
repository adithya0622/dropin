"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Smartphone, TrendingUp, AlertCircle } from "lucide-react";

interface PassiveXPData {
  sourceLabel: string;
  xpGained: number;
  percentage: number;
  lastUpdated: string;
}

export function PassiveXP() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [totalPassiveXP, setTotalPassiveXP] = useState(1250);
  const [xpBreakdown, setXpBreakdown] = useState<PassiveXPData[]>([
    {
      sourceLabel: "Reading Tech News",
      xpGained: 450,
      percentage: 36,
      lastUpdated: "2 hours ago",
    },
    {
      sourceLabel: "GitHub Activity",
      xpGained: 380,
      percentage: 30,
      lastUpdated: "1 hour ago",
    },
    {
      sourceLabel: "Stack Overflow Browsing",
      xpGained: 280,
      percentage: 22,
      lastUpdated: "3 hours ago",
    },
    {
      sourceLabel: "Twitter Dev Posts",
      xpGained: 140,
      percentage: 12,
      lastUpdated: "30 min ago",
    },
  ]);

  useEffect(() => {
    if (!isEnabled) return;

    // Simulate passive XP accrual
    const interval = setInterval(() => {
      setTotalPassiveXP((prev) => prev + Math.floor(Math.random() * 10));
    }, 5000);

    return () => clearInterval(interval);
  }, [isEnabled]);

  const togglePassiveXP = () => {
    setIsEnabled(!isEnabled);
  };

  return (
    <motion.div
      className="luxury-card border border-gold/20 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Smartphone className="w-5 h-5 text-gold" />
        <h3 className="text-xl font-bold text-gold">Passive XP Mode</h3>
      </div>

      {/* Enable Toggle */}
      <div className="mb-4 p-3 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-gold" />
          <span className="text-sm font-medium">XP Tracking</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePassiveXP}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
            isEnabled ? "bg-gold/30" : "bg-slate-700"
          }`}
        >
          <motion.div
            animate={{ x: isEnabled ? 20 : 2 }}
            className="inline-block h-5 w-5 transform rounded-full bg-white"
          />
        </motion.button>
      </div>

      {/* Total XP Display */}
      {isEnabled && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-4 p-4 rounded-lg bg-gradient-to-r from-gold/10 to-yellow-500/10 border border-gold/30"
        >
          <p className="text-xs text-slate-400 mb-1">Today's Passive XP</p>
          <motion.p
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-3xl font-bold text-gold"
          >
            {totalPassiveXP}
          </motion.p>
          <p className="text-xs text-gold/70 mt-1">+{Math.floor(Math.random() * 20)} XP/min</p>
        </motion.div>
      )}

      {isEnabled ? (
        <>
          {/* Breakdown */}
          <div className="space-y-2 mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase">Sources</p>
            {xpBreakdown.map((item) => (
              <motion.div
                key={item.sourceLabel}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs"
              >
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">{item.sourceLabel}</span>
                  <span className="font-bold text-gold">{item.xpGained} XP</span>
                </div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-gold to-yellow-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                <p className="text-slate-500 text-xs mt-0.5">{item.lastUpdated}</p>
              </motion.div>
            ))}
          </div>

          {/* Info */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-300">
              Keep browsing tech content while learning! We track your activity privately.
            </p>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-slate-400">
          <p className="text-sm mb-2">Passive XP Mode Disabled</p>
          <p className="text-xs">Enable tracking to earn XP from your daily tech activities</p>
        </div>
      )}
    </motion.div>
  );
}
