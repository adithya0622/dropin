"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, Zap } from "lucide-react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-auristra-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Neon glow effect */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-0 h-72 w-72 bg-violet-500/20 rounded-full blur-3xl" />
        </div>

        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full blur-lg opacity-20" />
            <div className="relative bg-slate-900 rounded-full p-4 border border-cyan-400/30">
              <AlertTriangle className="h-12 w-12 text-red-400" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">
            Oops! Something went wrong
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            We encountered an unexpected error. Our championship status is temporarily offline.
          </p>
        </div>

        {/* Error Details */}
        {process.env.NODE_ENV === "development" && error.message && (
          <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-left">
            <p className="font-mono text-xs text-red-300 break-words max-h-24 overflow-auto">{error.message}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={reset}
            className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-violet-500/20 px-6 py-3 font-semibold text-cyan-200 shadow-neon transition hover:from-cyan-500/30 hover:to-violet-500/30 border border-cyan-400/40"
          >
            <Zap className="h-5 w-5 group-hover:animate-pulse" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-800/50 px-6 py-3 font-semibold text-slate-300 transition hover:bg-slate-700/50"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>
        </div>

        {/* Motivational Message */}
        <div className="pt-2 text-xs text-slate-500">
          Champions bounce back. We'll get this fixed. 🚀
        </div>
      </div>
    </div>
  );
}
