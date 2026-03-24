"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, BookOpen, Zap } from "lucide-react";
import { toast } from "sonner";

interface SkillCard {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  icon: string;
  xp: number;
}

export function SwipeChallenges() {
  const [cards, setCards] = useState<SkillCard[]>([
    {
      id: "1",
      title: "React Hooks Mastery",
      description: "Build a custom hook for form validation",
      difficulty: "medium",
      topic: "React",
      icon: "⚛️",
      xp: 250,
    },
    {
      id: "2",
      title: "Async/Await Deep Dive",
      description: "Implement parallel API calls with error handling",
      difficulty: "hard",
      topic: "JavaScript",
      icon: "⚡",
      xp: 350,
    },
    {
      id: "3",
      title: "CSS Grid Layout",
      description: "Create a responsive dashboard layout",
      difficulty: "easy",
      topic: "CSS",
      icon: "🎨",
      xp: 150,
    },
    {
      id: "4",
      title: "TypeScript Generics",
      description: "Build a type-safe utility library",
      difficulty: "hard",
      topic: "TypeScript",
      icon: "📘",
      xp: 400,
    },
  ]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [totalXP, setTotalXP] = useState(0);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "from-green-500 to-emerald-600";
      case "medium":
        return "from-yellow-500 to-orange-600";
      case "hard":
        return "from-red-500 to-pink-600";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  const handleSwipe = (direction: "right" | "left") => {
    const card = cards[currentIdx];
    if (direction === "right") {
      toast.success(`+${card.xp} XP! Great choice! 🎉`);
      setTotalXP((p) => p + card.xp);
    } else {
      toast.info("Skipped for now");
    }

    if (currentIdx < cards.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      toast.success("No more challenges! Come back tomorrow!");
      setCurrentIdx(0);
      setCards(cards.sort(() => Math.random() - 0.5));
    }
  };

  const currentCard = cards[currentIdx];

  return (
    <motion.div
      className="luxury-card border border-gold/20 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-gold" />
        <h3 className="text-xl font-bold text-gold">Swipe-to-Learn</h3>
      </div>

      {/* XP Counter */}
      <div className="mb-4 p-3 rounded-lg bg-gold/10 border border-gold/20 text-center">
        <p className="text-xs text-slate-400">Today's XP</p>
        <p className="text-2xl font-bold text-gold">{totalXP}</p>
      </div>

      {/* Card Stack */}
      <div className="relative h-64 mb-6 perspective">
        <AnimatePresence mode="wait">
          {currentCard && (
            <motion.div
              key={currentCard.id}
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 90 }}
              transition={{ duration: 0.4 }}
              className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getDifficultyColor(currentCard.difficulty)} p-6 flex flex-col justify-between cursor-grab active:cursor-grabbing shadow-2xl`}
              style={{
                perspective: "1000px",
              }}
            >
              <div>
                <div className="text-4xl mb-2">{currentCard.icon}</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-black/40">
                    {currentCard.topic}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-black/40 capitalize">
                    {currentCard.difficulty}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-2xl font-bold mb-2 text-white">
                  {currentCard.title}
                </h4>
                <p className="text-sm text-white/90">{currentCard.description}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  +{currentCard.xp} XP
                </span>
                <span className="text-xs text-white/70">
                  {currentIdx + 1}/{cards.length}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSwipe("left")}
          className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white font-semibold flex items-center justify-center gap-2 transition"
        >
          <ThumbsDown className="w-5 h-5" />
          Skip
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSwipe("right")}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-neon-blue/50 transition"
        >
          <ThumbsUp className="w-5 h-5" />
          Practice
        </motion.button>
      </div>
    </motion.div>
  );
}
