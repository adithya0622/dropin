"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeatmapDay {
  date: string;
  streak: number;
  level: "none" | "low" | "medium" | "high" | "extreme";
}

export function ProfileHeatmap() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [heatmapData, setHeatmapData] = useState<HeatmapDay[]>([]);

  useEffect(() => {
    // Generate mock heatmap data (GitHub-style)
    const data: HeatmapDay[] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(1);

    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      const streak = Math.floor(Math.random() * 10);
      const levels: ("none" | "low" | "medium" | "high" | "extreme")[] = [
        "none",
        "low",
        "medium",
        "high",
        "extreme",
      ];
      const level = levels[Math.floor(streak / 2)];

      data.push({ date: dateStr, streak, level });
    }
    setHeatmapData(data);
  }, [currentMonth]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "none":
        return "bg-slate-800";
      case "low":
        return "bg-blue-900";
      case "medium":
        return "bg-neon-blue/50";
      case "high":
        return "bg-neon-blue";
      case "extreme":
        return "bg-neon-purple";
      default:
        return "bg-slate-800";
    }
  };

  const monthStr = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      className="luxury-card border border-neon-blue/20 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-neon-blue">Skill Heatmap</h3>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
            }
            className="p-2 hover:bg-neon-blue/10 rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-slate-400 px-3 py-2">{monthStr}</span>
          <button
            onClick={() =>
              setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
            }
            className="p-2 hover:bg-neon-blue/10 rounded-lg transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Heatmap Grid - Mobile optimized */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {heatmapData.map((day, idx) => (
          <motion.div
            key={day.date}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`${getLevelColor(day.level)} aspect-square rounded-md cursor-pointer transition-all border border-slate-600/30 flex items-center justify-center text-xs font-bold text-white hover:border-neon-blue/50`}
            title={`${day.date}: ${day.streak} practices`}
          >
            {day.streak > 0 && day.streak}
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-between text-xs text-slate-400 mb-4">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-slate-800 rounded"></div>
          <div className="w-3 h-3 bg-blue-900 rounded"></div>
          <div className="w-3 h-3 bg-neon-blue/50 rounded"></div>
          <div className="w-3 h-3 bg-neon-blue rounded"></div>
          <div className="w-3 h-3 bg-neon-purple rounded"></div>
        </div>
        <span>More</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-neon-blue/10 p-3 rounded-lg text-center">
          <div className="text-xl font-bold text-neon-blue">
            {heatmapData.filter((d) => d.streak > 0).length}
          </div>
          <div className="text-xs text-slate-400">Active Days</div>
        </div>
        <div className="bg-neon-purple/10 p-3 rounded-lg text-center">
          <div className="text-xl font-bold text-neon-purple">
            {Math.max(...heatmapData.map((d) => d.streak))}
          </div>
          <div className="text-xs text-slate-400">Max Streak</div>
        </div>
        <div className="bg-gold/10 p-3 rounded-lg text-center">
          <div className="text-xl font-bold text-gold">
            {heatmapData.reduce((sum, d) => sum + d.streak, 0)}
          </div>
          <div className="text-xs text-slate-400">Total Practice</div>
        </div>
      </div>
    </motion.div>
  );
}
