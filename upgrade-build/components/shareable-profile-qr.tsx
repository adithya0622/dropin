"use client";

import { motion } from "framer-motion";
import { Share2, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ShareableProfileQR({ userId = "user-12345" }: { userId?: string }) {
  const [copied, setCopied] = useState(false);
  const profileUrl = `https://upgrade-build.vercel.app/profile/${userId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(profileUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast.success("Profile link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="luxury-card-3d border-neon-blue/30 p-6 flex flex-col items-center"
    >
      <h3 className="text-lg font-bold text-neon-blue mb-4 flex items-center gap-2">
        <Share2 className="w-5 h-5" />
        Share Your Profile
      </h3>

      <motion.div
        animate={{ rotate: [0, 2, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="p-4 bg-white rounded-xl mb-4 border-2 border-neon-blue/30"
      >
        <img src={qrUrl} alt="Profile QR Code" className="w-48 h-48" />
      </motion.div>

      <p className="text-xs text-slate-400 mb-4 text-center max-w-xs">
        Let judges scan your profile QR code to see your real-time stats
      </p>

      <div className="flex gap-2 w-full">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="flex-1 py-2 px-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg font-semibold text-white hover:shadow-lg transition flex items-center justify-center gap-2"
        >
          <Copy className="w-4 h-4" />
          {copied ? "Copied!" : "Copy Link"}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 py-2 px-3 bg-gradient-to-r from-gold to-neon-purple rounded-lg font-semibold text-white hover:shadow-lg transition"
        >
          📱 Share
        </motion.button>
      </div>
    </motion.div>
  );
}
