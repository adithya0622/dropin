"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useAIRecommendations } from "@/hooks/use-api";
import { LoadingSpinner } from "@/components/loading-spinner";
import { toast } from "sonner";
import { useEffect } from "react";

export function AIRecommendationsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data, error, isLoading } = useAIRecommendations(open);

  useEffect(() => {
    if (error) toast.error("AI recommendation service is unavailable. Showing fallback data.");
  }, [error]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
        >
          <motion.div
            initial={{ y: 20, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, scale: 0.97 }}
            className="w-full max-w-3xl rounded-2xl border border-cyan-400/30 bg-auristra-panel p-6 shadow-neon"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xl font-semibold text-cyan-200">
                <Sparkles className="h-5 w-5" />
                AI Upgrade Paths
              </h3>
              <button onClick={onClose} className="rounded-lg bg-slate-800 px-3 py-1 text-sm text-slate-200">
                Close
              </button>
            </div>
            {isLoading && <LoadingSpinner />}
            <div className="grid gap-3 md:grid-cols-2">
              {data?.map((item) => (
                <motion.div
                  key={item.title}
                  whileHover={{ y: -4 }}
                  className="rounded-xl border border-violet-300/30 bg-slate-900/70 p-4"
                >
                  <p className="font-semibold text-violet-200">{item.title}</p>
                  <p className="mt-2 text-sm text-slate-300">{item.rationale}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-cyan-300">
                    <span>ETA: {item.eta}</span>
                    <span>{Math.round(item.confidence * 100)}% match</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
