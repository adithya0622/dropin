"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Flame, RotateCw } from "lucide-react";
import { toast } from "sonner";

interface DuelRound {
  question: string;
  aiAnswer: string;
  userAnswer: string | null;
  userCorrect: boolean | null;
}

export function DuelTimer() {
  const [duelActive, setDuelActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [userScore, setUserScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [rounds, setRounds] = useState<DuelRound[]>([]);

  const questions = [
    {
      q: "What does 'const' mean in JavaScript?",
      answer: "Block-scoped variable that cannot be reassigned",
    },
    {
      q: "How many hooks are in React 18?",
      answer: "18+ hooks available",
    },
    {
      q: "What is HTML semantic meaning?",
      answer: "Using tags that describe content meaning",
    },
  ];

  useEffect(() => {
    if (!duelActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [duelActive, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      setDuelActive(false);
      if (userScore > aiScore) {
        toast.success(`You won! ${userScore}-${aiScore}! 🏆`);
      } else if (aiScore > userScore) {
        toast.info(`AI won this time. ${aiScore}-${userScore}`);
      } else {
        toast.info(`Tie! ${userScore}-${aiScore}`);
      }
    }
  }, [timeLeft, userScore, aiScore]);

  const startDuel = () => {
    setDuelActive(true);
    setTimeLeft(60);
    setUserScore(0);
    setAiScore(0);
    setCurrentRound(0);
    setRounds([]);
  };

  const submitAnswer = (correct: boolean) => {
    if (!duelActive) return;

    const newRound: DuelRound = {
      question: questions[currentRound % questions.length].q,
      aiAnswer: questions[currentRound % questions.length].answer,
      userAnswer: correct ? "correct" : "incorrect",
      userCorrect: correct,
    };

    setRounds([...rounds, newRound]);

    if (correct) {
      setUserScore((s) => s + 10);
      toast.success("+10 Points!");
    }

    // AI randomly scores
    if (Math.random() > 0.6) {
      setAiScore((s) => s + 10);
    }

    setCurrentRound((r) => r + 1);

    if (currentRound >= 2) {
      setTimeLeft(0);
      setDuelActive(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      className="luxury-card border border-neon-purple/20 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Flame className="w-5 h-5 text-neon-purple" />
        <h3 className="text-xl font-bold text-neon-purple">Live Coding Duels</h3>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-neon-blue/10 p-3 rounded-lg text-center border border-neon-blue/20">
          <p className="text-xs text-slate-400">You</p>
          <p className="text-2xl font-bold text-neon-blue">{userScore}</p>
        </div>
        <div className="bg-neon-purple/10 p-3 rounded-lg text-center border border-neon-purple/20">
          <p className="text-xs text-slate-400">AI</p>
          <p className="text-2xl font-bold text-neon-purple">{aiScore}</p>
        </div>
      </div>

      {/* Timer */}
      {duelActive && (
        <motion.div
          className="mb-4 p-4 rounded-lg bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 text-center"
          animate={timeLeft < 10 ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <p className="text-sm text-slate-300 mb-1">Time Remaining</p>
          <p className="text-3xl font-bold text-red-400">{formatTime(timeLeft)}</p>
        </motion.div>
      )}

      {/* Question Display */}
      {duelActive && currentRound < questions.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
        >
          <p className="text-xs text-slate-400 mb-2">Question {currentRound + 1}</p>
          <p className="font-semibold text-sm mb-3">
            {questions[currentRound % questions.length].q}
          </p>

          <div className="space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => submitAnswer(true)}
              className="w-full px-3 py-2 rounded-lg bg-green-500/20 border border-green-500/50 hover:border-green-500 text-green-300 text-sm font-medium transition"
            >
              ✓ Correct
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => submitAnswer(false)}
              className="w-full px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 hover:border-slate-600 text-slate-300 text-sm font-medium transition"
            >
              ✗ Incorrect
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Start Button */}
      {!duelActive && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={startDuel}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-neon-purple/50 transition"
        >
          <Flame className="w-5 h-5" />
          Start Duel (60s)
        </motion.button>
      )}

      {/* Results */}
      {!duelActive && rounds.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 pt-4 border-t border-slate-700"
        >
          <p className="text-xs text-slate-400 mb-2">Round History</p>
          <div className="space-y-1 text-xs">
            {rounds.map((round, idx) => (
              <div
                key={idx}
                className={`px-2 py-1 rounded ${
                  round.userCorrect
                    ? "bg-green-500/10 text-green-300"
                    : "bg-red-500/10 text-red-300"
                }`}
              >
                Round {idx + 1}: {round.userCorrect ? "✓ Win" : "✗ Loss"}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
