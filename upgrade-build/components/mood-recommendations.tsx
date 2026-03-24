"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useState } from "react";

const moods = [
  {
    emoji: "😤",
    text: "Feeling Stuck?",
    videos: [
      { title: "Debugging Tips", duration: "3:45" },
      { title: "Problem Solving", duration: "2:30" },
    ],
  },
  {
    emoji: "😴",
    text: "Tired?",
    videos: [
      { title: "Quick Energy Boost", duration: "1:15" },
      { title: "Focus Techniques", duration: "4:20" },
    ],
  },
  {
    emoji: "🚀",
    text: "Ready to Level Up?",
    videos: [
      { title: "Advanced Patterns", duration: "8:15" },
      { title: "System Design", duration: "6:45" },
    ],
  },
  {
    emoji: "💡",
    text: "Need Ideas?",
    videos: [
      { title: "Project Ideas", duration: "5:30" },
      { title: "Real-World Apps", duration: "7:10" },
    ],
  },
];

export function MoodRecommendations() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="luxury-card-3d border-gold/30 p-6"
    >
      <h3 className="text-lg font-bold text-gold mb-4">💭 How are you feeling?</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {moods.map((mood, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedMood(selectedMood === idx ? null : idx)}
            className={`p-4 rounded-lg transition border-2 flex flex-col items-center justify-center gap-2 ${
              selectedMood === idx
                ? "border-gold bg-gold/20"
                : "border-gold/30 bg-gold/5 hover:border-gold/60"
            }`}
          >
            <span className="text-3xl">{mood.emoji}</span>
            <span className="text-xs font-semibold text-slate-200">{mood.text}</span>
          </motion.button>
        ))}
      </div>

      {selectedMood !== null && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <p className="text-sm text-slate-400 mb-3">Recommended micro-videos:</p>
          {moods[selectedMood].videos.map((video, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02, x: 4 }}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gold/10 to-neon-purple/10 border border-gold/30 hover:border-gold/60 transition group"
            >
              <div className="flex items-center gap-3">
                <Play className="w-4 h-4 text-gold group-hover:scale-110 transition" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-200">{video.title}</p>
                  <p className="text-xs text-slate-400">{video.duration}</p>
                </div>
              </div>
              <span className="text-xs text-gold font-bold group-hover:translate-x-1 transition">→</span>
            </motion.button>
          ))}
        </motion.div>
      )}

      <p className="text-xs text-slate-400 mt-4 text-center italic">
        "Every master was once a learner who didn't give up"
      </p>
    </motion.div>
  );
}
