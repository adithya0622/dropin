"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Play, Trash2, Smile, Frown } from "lucide-react";
import { toast } from "sonner";

interface VoiceEntry {
  id: string;
  date: string;
  duration: number;
  transcript: string;
  sentiment: "positive" | "neutral" | "negative";
  audioUrl?: string;
}

export function VoiceLog() {
  const [entries, setEntries] = useState<VoiceEntry[]>([
    {
      id: "1",
      date: "2026-03-24",
      duration: 12,
      transcript: "Really productive day! Completed the React module and solved 5 LeetCode problems.",
      sentiment: "positive",
    },
    {
      id: "2",
      date: "2026-03-23",
      duration: 8,
      transcript: "Feeling stuck on async/await. Need to review and practice more examples.",
      sentiment: "neutral",
    },
  ]);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(blob);
        mockTranscribeAndAdd(audioUrl, recordingTime);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      toast.success("Recording started!");
    } catch (error) {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      setIsRecording(false);
    }
  };

  const mockTranscribeAndAdd = (audioUrl: string, duration: number) => {
    // Mock AI transcription
    const mockTranscripts = [
      "Had a great session today! Learned about React hooks and built a custom hook.",
      "Struggled a bit with TypeScript generics but got through it.",
      "Productive day - completed 3 challenges and helped teammates.",
    ];

    const transcript =
      mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
    const sentiments: ("positive" | "neutral" | "negative")[] = [
      "positive",
      "positive",
      "neutral",
    ];
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];

    const newEntry: VoiceEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      duration: Math.max(duration, 5),
      transcript,
      sentiment,
      audioUrl,
    };

    setEntries([newEntry, ...entries]);
    toast.success("Voice log saved! ✨");
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "😊";
      case "neutral":
        return "😐";
      case "negative":
        return "😞";
      default:
        return "😐";
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-400";
      case "neutral":
        return "text-yellow-400";
      case "negative":
        return "text-red-400";
      default:
        return "text-slate-400";
    }
  };

  return (
    <motion.div
      className="luxury-card border border-neon-blue/20 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Mic className="w-5 h-5 text-neon-blue" />
        <h3 className="text-xl font-bold text-neon-blue">Voice Progress Log</h3>
      </div>

      {/* Recording Controls */}
      <div className="mb-6 p-4 bg-neon-blue/10 rounded-lg border border-neon-blue/20">
        {isRecording ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-neon-blue mb-2">
                Recording...
              </p>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block"
              >
                <div className="w-3 h-3 rounded-full bg-red-500" />
              </motion.div>
              <span className="ml-2 text-sm text-slate-300">
                {Math.floor(recordingTime / 60).toString().padStart(2, "0")}:
                {(recordingTime % 60).toString().padStart(2, "0")}
              </span>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={stopRecording}
              className="p-3 rounded-full bg-red-500/20 border border-red-500/50 hover:bg-red-500/30"
            >
              <Square className="w-6 h-6 text-red-400" />
            </motion.button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startRecording}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-neon-blue/50"
          >
            <Mic className="w-5 h-5" />
            Record Daily Update (15 sec)
          </motion.button>
        )}
      </div>

      {/* Entry Limit Hint */}
      {recordingTime > 15 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-yellow-400 mb-3"
        >
          ⏱️ Your update is getting long - consider wrapping up soon!
        </motion.div>
      )}

      {/* Entries List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs text-slate-400">{entry.date}</p>
                  <p className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <span className={`text-lg ${getSentimentColor(entry.sentiment)}`}>
                      {getSentimentEmoji(entry.sentiment)}
                    </span>
                    {entry.duration}s
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    setEntries(entries.filter((e) => e.id !== entry.id))
                  }
                  className="p-1 hover:bg-red-500/20 rounded transition"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </motion.button>
              </div>
              <p className="text-xs text-slate-300 line-clamp-2">
                {entry.transcript}
              </p>
              {entry.audioUrl && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="mt-2 text-xs px-2 py-1 rounded bg-neon-blue/20 border border-neon-blue/30 hover:border-neon-blue/50 text-neon-blue flex items-center gap-1"
                >
                  <Play className="w-3 h-3" />
                  Play
                </motion.button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
