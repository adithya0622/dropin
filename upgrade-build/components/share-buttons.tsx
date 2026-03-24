"use client";

import { Linkedin, Share2, Twitter } from "lucide-react";
import { toast } from "sonner";

export function ShareButtons() {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = "Leveling up my skills with AURISTRA'26 Upgrade Dashboard! 🚀 AI-powered recommendations, real-time progress tracking, and 2x faster upskilling.";

  const handleShare = (platform: "twitter" | "linkedin" | "copy") => {
    try {
      const encodedText = encodeURIComponent(shareText);
      const encodedUrl = encodeURIComponent(currentUrl);

      switch (platform) {
        case "twitter":
          window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, "_blank", "width=600,height=400");
          break;
        case "linkedin":
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, "_blank", "width=600,height=400");
          break;
        case "copy":
          navigator.clipboard.writeText(`${shareText}\n\n${currentUrl}`);
          toast.success("Link copied to clipboard!");
          break;
      }
    } catch (error) {
      console.error("Share failed:", error);
      toast.error("Failed to share");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleShare("twitter")}
        className="inline-flex items-center gap-2 rounded-lg border border-blue-400/40 bg-blue-500/10 px-3 py-2 text-sm text-blue-300 shadow-neon transition hover:bg-blue-500/20"
        title="Share on X/Twitter"
      >
        <Twitter className="h-4 w-4" />
        <span className="hidden sm:inline">X</span>
      </button>
      <button
        onClick={() => handleShare("linkedin")}
        className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-300 shadow-neon transition hover:bg-cyan-500/20"
        title="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
        <span className="hidden sm:inline">LinkedIn</span>
      </button>
      <button
        onClick={() => handleShare("copy")}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800/50 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-700/50"
        title="Copy link"
      >
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline">Share</span>
      </button>
    </div>
  );
}
