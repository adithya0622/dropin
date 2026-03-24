"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";

export function ChallengeTimer() {
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useInterval(
    () => {
      setTime((t) => {
        if (t <= 0) {
          setIsRunning(false);
          return 25 * 60;
        }
        return t - 1;
      });
    },
    isRunning ? 1000 : null
  );

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const progress = ((25 * 60 - time) / (25 * 60)) * 100;

  const handleReset = () => {
    setTime(25 * 60);
    setIsRunning(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="luxury-card-3d border-neon-blue/30 p-6 text-center"
    >
      <h3 className="text-lg font-bold text-neon-blue mb-4 flex items-center justify-center gap-2">
        ⏱️ Challenge Timer
      </h3>

      <div className="relative w-48 h-48 mx-auto mb-6">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0, 245, 255, 0.1)" strokeWidth="8" />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#grad)"
            strokeWidth="8"
            strokeLinecap="round"
            animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
            transition={{ duration: 0.5 }}
            strokeDasharray="283"
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(0, 245, 255)" />
              <stop offset="100%" stopColor="rgb(168, 85, 247)" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            animate={{ scale: isRunning ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 1, repeat: isRunning ? Infinity : 0 }}
            className="text-5xl font-bold text-neon-blue"
          >
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </motion.div>
          <p className="text-xs text-slate-400 mt-1">Pomodoro Timer</p>
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsRunning(!isRunning)}
          className="px-6 py-2 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg font-semibold text-white hover:shadow-lg transition flex items-center gap-2"
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? "Pause" : "Start"}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="px-4 py-2 bg-slate-700 rounded-lg font-semibold text-slate-200 hover:bg-slate-600 transition flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </motion.button>
      </div>

      <p className="text-xs text-slate-400 mt-4">
        🎯 Focus for 25 min, then take a 5 min break for optimal learning!
      </p>
    </motion.div>
  );
}

function useInterval(callback: () => void, delay: number | null) {
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (delay === null) {
      if (intervalId) clearInterval(intervalId);
      return;
    }

    const id = setInterval(callback, delay);
    setIntervalId(id);
    return () => clearInterval(id);
  }, [delay, callback, intervalId]);
}
