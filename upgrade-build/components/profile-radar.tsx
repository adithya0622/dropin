"use client";

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const skillData = [
  { skill: "Frontend", value: 88 },
  { skill: "Backend", value: 76 },
  { skill: "DevOps", value: 65 },
  { skill: "Mobile", value: 82 },
  { skill: "AI/ML", value: 71 },
  { skill: "Design", value: 79 },
];

export function ProfileRadar() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="luxury-card-3d border-neon-blue/30 p-6"
    >
      <h3 className="text-lg font-bold text-neon-blue mb-4 flex items-center gap-2">
        🎯 Skills Radar
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={skillData}>
          <PolarGrid stroke="rgba(0, 245, 255, 0.2)" />
          <PolarAngleAxis dataKey="skill" tick={{ fill: "rgb(148, 163, 184)", fontSize: 12 }} />
          <PolarRadiusAxis stroke="rgba(0, 245, 255, 0.3)" />
          <Radar
            name="Proficiency"
            dataKey="value"
            stroke="rgb(0, 245, 255)"
            fill="rgba(0, 245, 255, 0.1)"
            animationDuration={1500}
          />
        </RadarChart>
      </ResponsiveContainer>
      <p className="text-xs text-slate-400 mt-4 text-center">Swipe to rotate • Tap skills to improve</p>
    </motion.div>
  );
}
