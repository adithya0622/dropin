"use client";

import { useEffect, useState } from "react";
import { Zap, BarChart3, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { demoSeedData } from "@/utils/demo-seed";
import type { UserProfile, SkillProgress, UpgradeItem, RecommendationPath } from "@/types";

export default function DemoPage() {
  const [showConfetti, setShowConfetti] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [skills, setSkills] = useState<SkillProgress[]>([]);
  const [upgrades, setUpgrades] = useState<UpgradeItem[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationPath[]>([]);

  useEffect(() => {
    // Pre-seed all demo data
    setProfile(demoSeedData.profile);
    setSkills(demoSeedData.skillProgress);
    setUpgrades(demoSeedData.upgrades);
    setRecommendations(demoSeedData.recommendations);

    // Auto-hide confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-auristra-bg">
      {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Hero Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-emerald-400/50 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 p-6 text-center shadow-neon"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="animate-pulse text-emerald-400 text-2xl">●</span>
            <h1 className="text-2xl font-bold text-emerald-300">Demo Mode Active ✓</h1>
            <span className="animate-pulse text-emerald-400 text-2xl">●</span>
          </div>
          <p className="text-emerald-200 text-sm">
            Pre-seeded champion data • 24-hour persistence • Perfect for AURISTRA'26 judges
          </p>
        </motion.div>

        {/* Impact Metrics Card */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card grid grid-cols-2 gap-4 md:grid-cols-4"
          >
            <MetricCard label="Level" value={profile.level.toString()} icon={<Zap className="h-5 w-5 text-cyan-400" />} />
            <MetricCard label="Streak" value={`${profile.streak} days`} icon={<TrendingUp className="h-5 w-5 text-violet-400" />} />
            <MetricCard label="Challenges" value={profile.challengesCompleted.toString()} icon={<BarChart3 className="h-5 w-5 text-emerald-400" />} />
            <MetricCard
              label="Upskilling"
              value="2x faster"
              icon={<div className="text-yellow-400 text-xl">⚡</div>}
            />
          </motion.div>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <h2 className="text-lg font-bold text-cyan-300 mb-4">Skill Progress</h2>
            <div className="space-y-4">
              {skills.map((skill) => {
                const progress = (skill.level / skill.target) * 100;
                return (
                  <div key={skill.skill} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">{skill.skill}</span>
                      <span className="text-cyan-300">
                        {skill.level}/{skill.target} ({progress.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-700/50 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 shadow-neon rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Recent Upgrades */}
        {upgrades.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <h2 className="text-lg font-bold text-violet-300 mb-4">Recent Upgrades</h2>
            <div className="space-y-3">
              {upgrades.map((upgrade) => (
                <div key={upgrade.id} className="rounded-lg border border-violet-400/20 bg-violet-500/5 p-3">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm text-slate-300">{upgrade.title}</p>
                    <span className="text-emerald-400 font-bold text-sm">{upgrade.impact}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{upgrade.date}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card"
          >
            <h2 className="text-lg font-bold text-emerald-300 mb-4">AI Recommendations</h2>
            <div className="space-y-3">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="rounded-lg border border-emerald-400/20 bg-emerald-500/5 p-4">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-semibold text-emerald-200 text-sm">{rec.title}</h3>
                    <span className="text-xs bg-emerald-500/30 px-2 py-1 rounded-full text-emerald-300">
                      {(rec.confidence * 100).toFixed(0)}% match
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mb-2">{rec.rationale}</p>
                  <span className="text-xs text-slate-400">ETA: {rec.eta}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Judge Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card border-yellow-400/30 bg-yellow-500/5"
        >
          <h3 className="text-sm font-bold text-yellow-300 mb-2">For AURISTRA'26 Judges</h3>
          <ul className="text-xs text-slate-300 space-y-1">
            <li>✓ Click "Demo Mode" button in navbar to activate 24-hour persistent demo</li>
            <li>✓ All data persists across page refreshes using localStorage</li>
            <li>✓ PDF export shows formatted progress metrics</li>
            <li>✓ 2x faster upskilling metric demonstrates impact</li>
            <li>✓ Share buttons integrated on main dashboard</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-cyan-400/20 bg-cyan-500/10 p-3 text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-xl font-bold text-cyan-300 mt-1">{value}</p>
    </div>
  );
}
