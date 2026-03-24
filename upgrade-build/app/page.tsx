"use client";

import { useMemo, useState } from "react";
import { Bot, Sparkles, Download, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useProfile, useRecentUpgrades, useSkillProgress } from "@/hooks/use-api";
import { LoadingSpinner } from "@/components/loading-spinner";
import { ProgressCharts } from "@/components/progress-charts";
import { AIRecommendationsModal } from "@/components/ai-recommendations-modal";
import { PDFExport } from "@/components/pdf-export";
import { ShareButtons } from "@/components/share-buttons";
import { AuthModal } from "@/components/auth-modal";
import confetti from "canvas-confetti";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: progress, isLoading: progressLoading } = useSkillProgress();
  const { data: upgrades, isLoading: upgradesLoading } = useRecentUpgrades();
  const [openRecommendations, setOpenRecommendations] = useState(false);

  const totalImpact = useMemo(
    () => upgrades?.reduce((acc, item) => acc + Number(item.impact.replace("%", "").replace("+", "")), 0) ?? 0,
    [upgrades],
  );

  const handleAIRecommendations = () => {
    setOpenRecommendations(true);
    confetti({ particleCount: 30, spread: 45 });
  };

  if (status === "loading" || profileLoading || progressLoading || upgradesLoading) return <LoadingSpinner />;

  // Show login modal for unauthenticated users
  if (!session) {
    return <AuthModal open={true} onClose={() => {}} />;
  }

  return (
    <div className="space-y-5">
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="luxury-card-3d relative overflow-hidden border-neon-blue/20 shadow-lg">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-neon-blue/10 blur-3xl" />
        <p className="text-sm uppercase tracking-widest text-neon-blue font-semibold">Welcome Back</p>
        <h1 className="mt-1 text-3xl md:text-4xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-gold bg-clip-text text-transparent">{profile?.name}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Track your momentum, unlock AI-guided learning paths, and demo real-time impact metrics for AURISTRA&apos;26 judges.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleAIRecommendations}
            className="btn-luxury group flex items-center gap-2 hover:shadow-lg"
          >
            <Bot className="h-4 w-4 group-hover:drop-shadow-[0_0_8px_rgba(0,245,255,0.6)]" />
            Open AI Recommendations
          </button>
          <span className="inline-flex items-center gap-2 rounded-xl border-2 border-neon-purple/40 px-4 py-2 text-sm text-neon-purple font-semibold bg-neon-purple/5 transition hover:border-neon-purple/60 hover:bg-neon-purple/10 cursor-pointer">
            <Trophy className="h-4 w-4 icon-glow" />
            2x Faster Upskilling
          </span>
          <span className="inline-flex items-center gap-2 rounded-xl border-2 border-gold/40 px-4 py-2 text-sm text-gold font-semibold bg-gold/5 transition hover:border-gold/60 hover:bg-gold/10 cursor-pointer">
            <Sparkles className="h-4 w-4 icon-glow" />
            Impact: +{totalImpact}%
          </span>
        </div>
      </motion.section>

      {progress && <ProgressCharts progress={progress} />}

      <section className="luxury-card border-neon-blue/20 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-neon-blue">Recent Upgrades</h2>
          <div className="flex gap-2">
            <PDFExport />
            <ShareButtons />
          </div>
        </div>
        <div className="space-y-3">
          {upgrades?.map((upgrade) => (
            <motion.div
              key={upgrade.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="flex items-center justify-between rounded-xl bg-gradient-to-r from-luxury-dark to-luxury-darker p-4 hover:from-neon-blue/5 hover:to-neon-purple/5 transition cursor-pointer border border-neon-blue/10 hover:border-neon-blue/30"
            >
              <div>
                <p className="font-semibold text-neon-blue">{upgrade.title}</p>
                <p className="text-xs text-slate-400">{upgrade.date}</p>
              </div>
              <span className="rounded-lg bg-gradient-to-r from-gold/20 to-gold/10 px-3 py-1 text-sm font-bold text-gold border border-gold/30">{upgrade.impact}</span>
            </motion.div>
          ))}
          {(!upgrades || upgrades.length === 0) && (
            <p className="text-center text-slate-400 py-6">No upgrades yet. Start learning to see your progress! 🚀</p>
          )}
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="luxury-card-3d border-gold/20 bg-gradient-to-br from-gold/5 via-luxury-dark to-neon-purple/5 shadow-lg"
      >
        <h3 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 icon-glow filter drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]" />
          Champion Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div whileHover={{ scale: 1.05 }} className="rounded-xl bg-gradient-to-br from-neon-blue/10 to-neon-blue/5 p-4 text-center border border-neon-blue/20 hover:border-neon-blue/40 transition cursor-pointer">
            <p className="text-neon-blue font-bold text-2xl">{profile?.level}</p>
            <p className="text-xs text-slate-400 mt-1">Level</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-4 text-center border border-emerald-500/20 hover:border-emerald-500/40 transition cursor-pointer">
            <p className="text-emerald-400 font-bold text-2xl">{profile?.streak}</p>
            <p className="text-xs text-slate-400 mt-1">Day Streak</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="rounded-xl bg-gradient-to-br from-neon-purple/10 to-neon-purple/5 p-4 text-center border border-neon-purple/20 hover:border-neon-purple/40 transition cursor-pointer">
            <p className="text-neon-purple font-bold text-2xl">{profile?.challengesCompleted}</p>
            <p className="text-xs text-slate-400 mt-1">Challenges</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="rounded-xl bg-gradient-to-br from-gold/10 to-gold/5 p-4 text-center border border-gold/20 hover:border-gold/40 transition cursor-pointer">
            <p className="text-gold font-bold text-2xl">2x</p>
            <p className="text-xs text-slate-400 mt-1">Speed</p>
          </motion.div>
        </div>
      </motion.section>

      <AIRecommendationsModal open={openRecommendations} onClose={() => setOpenRecommendations(false)} />
    </div>
  );
}
