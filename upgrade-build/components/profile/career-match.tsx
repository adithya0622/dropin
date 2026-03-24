"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, TrendingUp } from "lucide-react";

interface JobRole {
  title: string;
  match: number;
  skills: string[];
}

export function CareerMatch() {
  const [topMatches, setTopMatches] = useState<JobRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<JobRole | null>(null);

  useEffect(() => {
    // Mock job roles with match scores
    const roles: JobRole[] = [
      {
        title: "Full Stack Developer",
        match: 92,
        skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
      },
      {
        title: "Frontend Engineer",
        match: 88,
        skills: ["React", "CSS", "TypeScript", "Tailwind"],
      },
      {
        title: "Product Engineer",
        match: 85,
        skills: ["System Design", "React", "SQL", "Figma"],
      },
      {
        title: "DevOps Engineer",
        match: 72,
        skills: ["Docker", "CI/CD", "AWS", "Kubernetes"],
      },
      {
        title: "Data Engineer",
        match: 68,
        skills: ["Python", "SQL", "ETL", "BigQuery"],
      },
    ];

    setTopMatches(roles.sort((a, b) => b.match - a.match));
    setSelectedRole(roles[0]);
  }, []);

  const CircularProgress = ({ percentage }: { percentage: number }) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-slate-700"
          />
          <motion.circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="text-neon-blue"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-neon-blue">{percentage}%</span>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      className="luxury-card border border-neon-purple/20 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Briefcase className="w-5 h-5 text-neon-purple" />
        <h3 className="text-xl font-bold text-neon-purple">Career Match</h3>
      </div>

      {selectedRole && (
        <motion.div
          key={selectedRole.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h4 className="font-bold text-lg mb-1">{selectedRole.title}</h4>
              <div className="flex gap-1 flex-wrap">
                {selectedRole.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2 py-1 rounded-full bg-neon-purple/20 text-neon-purple border border-neon-purple/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <CircularProgress percentage={selectedRole.match} />
          </div>
        </motion.div>
      )}

      {/* Role List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {topMatches.map((role, idx) => (
          <motion.button
            key={role.title}
            onClick={() => setSelectedRole(role)}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full text-left px-3 py-2 rounded-lg transition ${
              selectedRole?.title === role.title
                ? "bg-neon-purple/20 border border-neon-purple/50"
                : "hover:bg-neon-purple/10 border border-neon-purple/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{role.title}</span>
              <span className="text-xs font-bold text-neon-purple">
                {role.match}%
              </span>
            </div>
            <div className="w-full bg-slate-700 h-1 rounded-full mt-1 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-neon-purple to-neon-blue"
                initial={{ width: 0 }}
                animate={{ width: `${role.match}%` }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
              />
            </div>
          </motion.button>
        ))}
      </div>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 btn-purple text-sm font-semibold flex items-center justify-center gap-2"
      >
        <TrendingUp className="w-4 h-4" />
        Improve Match
      </motion.button>
    </motion.div>
  );
}
