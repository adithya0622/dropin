"use client";

import { useState, useEffect } from "react";
import { Sparkles, Zap, Trophy } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut, useSession } from "next-auth/react";
import { seedDemoData, isDemoActive, getTimeRemainingFormatted } from "@/utils/demo-seed";
import { toast } from "sonner";
import Link from "next/link";

export function Navbar() {
  const { data } = useSession();
  const [demoActive, setDemoActive] = useState(false);
  const [demoTimeLeft, setDemoTimeLeft] = useState("");

  useEffect(() => {
    const checkDemoStatus = () => {
      setDemoActive(isDemoActive());
      if (isDemoActive()) {
        setDemoTimeLeft(getTimeRemainingFormatted());
      }
    };

    checkDemoStatus();
    const interval = setInterval(checkDemoStatus, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const handleDemoMode = async () => {
    try {
      seedDemoData();
      setDemoActive(true);
      setDemoTimeLeft(getTimeRemainingFormatted());
      toast.success("🎯 Demo Mode activated! Data will persist for 24 hours.", {
        duration: 4000,
      });
      // Refresh to show demo data
      window.location.reload();
    } catch (error) {
      console.error("Failed to activate demo mode:", error);
      toast.error("Failed to activate demo mode");
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-cyan-400/20 bg-luxury-darker/85 backdrop-blur-xl luxury-card shadow-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-neon-blue icon-glow" />
          <span className="text-lg font-bold tracking-wider bg-gradient-to-r from-neon-blue via-neon-purple to-gold bg-clip-text text-transparent">AURISTRA&apos;26 Upgrade</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-end">
          {demoActive && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-400/40 bg-gradient-to-r from-emerald-500/10 to-green-500/10 px-3 py-1.5">
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-300">Demo Mode ✓</span>
              {demoTimeLeft && <span className="text-xs text-emerald-200">{demoTimeLeft}</span>}
            </div>
          )}

          {!demoActive && (
            <button
              onClick={handleDemoMode}
              className="btn-luxury group"
            >
              <Zap className="h-4 w-4 group-hover:animate-pulse" />
              Demo Mode
            </button>
          )}

          <ThemeToggle />

          {data?.user && (
            <>
              <Link
                href="/challenges"
                className="btn-gold flex items-center gap-2"
              >
                <Trophy className="h-4 w-4" />
                Challenges
              </Link>
              <Link
                href="/profile"
                className="btn-purple"
              >
                Profile
              </Link>
              <button
                onClick={() => signOut()}
                className="btn-luxury text-xs"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
