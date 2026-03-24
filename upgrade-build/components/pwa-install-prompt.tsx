"use client";

import { useEffect, useRef, useState } from "react";
import { Download, X } from "lucide-react";
import Confetti from "react-confetti";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      setShowPrompt(false);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <>
      {showConfetti && (
        <div ref={confettiRef} className="fixed inset-0 pointer-events-none">
          <Confetti numberOfPieces={200} recycle={false} />
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-40 animate-slide-up">
        <div className="rounded-xl border border-emerald-400/40 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 p-4 shadow-lg backdrop-blur-sm max-w-sm space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <h3 className="font-semibold text-emerald-300">Install App</h3>
              <p className="text-xs text-slate-300">
                Add AURISTRA Upgrade to your home screen for offline access and faster loading.
              </p>
            </div>
            <button
              onClick={() => setShowPrompt(false)}
              className="text-slate-400 hover:text-slate-300 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-neon-emerald transition hover:opacity-90"
            >
              <Download className="h-4 w-4" />
              Install
            </button>
            <button
              onClick={() => setShowPrompt(false)}
              className="flex-1 rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/50"
            >
              Not Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
