"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Aperture, Lightbulb } from "lucide-react";
import { toast } from "sonner";

interface ScanResult {
  object: string;
  suggestedSkills: string[];
  relevance: number;
}

export function ARScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const mockObjects = [
    {
      object: "Laptop",
      suggestedSkills: ["Web Development", "System Design", "DevOps"],
      relevance: 95,
    },
    {
      object: "Phone",
      suggestedSkills: ["Mobile Development", "React Native", "Full Stack"],
      relevance: 88,
    },
    {
      object: "Coffee Cup",
      suggestedSkills: ["UI/UX Design", "Frontend", "CSS Animation"],
      relevance: 72,
    },
    {
      object: "Desk",
      suggestedSkills: ["Productivity", "Time Management", "Career Planning"],
      relevance: 65,
    },
  ];

  const handleStartScan = async () => {
    try {
      setIsScanning(true);
      toast.loading("Scanning environment...");

      // Mock AR scan - simulate camera access
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Simulate scan completion after 3 seconds
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Stop stream
        stream.getTracks().forEach((track) => track.stop());

        // Random result
        const result = mockObjects[Math.floor(Math.random() * mockObjects.length)];
        setScanResult(result);
        setIsScanning(false);
        toast.success(`Detected: ${result.object}! +150 XP`);
      }
    } catch (error: any) {
      setIsScanning(false);
      toast.error("Camera access denied - using mock scan");

      // Show mock result anyway for demo
      const result = mockObjects[Math.floor(Math.random() * mockObjects.length)];
      setScanResult(result);
      toast.success(`Detected: ${result.object}! +150 XP`);
    }
  };

  return (
    <motion.div
      className="luxury-card border border-neon-blue/20 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Camera className="w-5 h-5 text-neon-blue" />
        <h3 className="text-xl font-bold text-neon-blue">AR Skill Scanner</h3>
      </div>

      {/* Scanner Display */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-neon-blue/30 mb-4 bg-slate-900">
        {isScanning && (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
            />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 border-2 border-neon-blue/50 flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Aperture className="w-16 h-16 text-neon-blue" />
              </motion.div>
            </motion.div>
          </>
        )}

        {!isScanning && !scanResult && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-neon-blue/10 to-neon-purple/10">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Camera className="w-12 h-12 text-neon-blue/50" />
            </motion.div>
            <p className="text-sm text-slate-400 mt-2">Point at an object</p>
          </div>
        )}

        {scanResult && !isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 p-4">
            <div className="text-4xl mb-3">{getObjectEmoji(scanResult.object)}</div>
            <p className="text-2xl font-bold text-center">{scanResult.object}</p>
            <p className="text-sm text-slate-300 mt-2">Relevance: {scanResult.relevance}%</p>
          </div>
        )}
      </div>

      {/* Scan Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleStartScan}
        disabled={isScanning}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-neon-blue/50 transition disabled:opacity-50"
      >
        <Camera className="w-5 h-5" />
        {isScanning ? "Scanning..." : "Scan Environment"}
      </motion.button>

      {/* Results */}
      {scanResult && !isScanning && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 pt-4 border-t border-slate-700"
        >
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-gold" />
            <p className="text-sm font-semibold text-gold">Suggested Skills</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {scanResult.suggestedSkills.map((skill) => (
              <span
                key={skill}
                className="text-xs px-3 py-1 rounded-full bg-neon-blue/20 border border-neon-blue/30 text-neon-blue"
              >
                {skill}
              </span>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              toast.success("+150 XP earned!");
              setScanResult(null);
            }}
            className="w-full mt-3 py-2 rounded-lg bg-neon-blue/10 border border-neon-blue/30 hover:border-neon-blue/50 text-neon-blue font-medium text-sm transition"
          >
            Learn These Skills
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}

function getObjectEmoji(object: string): string {
  const emojiMap: Record<string, string> = {
    Laptop: "💻",
    Phone: "📱",
    "Coffee Cup": "☕",
    Desk: "🖥️",
  };
  return emojiMap[object] || "📦";
}
