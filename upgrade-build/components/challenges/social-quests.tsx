"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Target, Link2 } from "lucide-react";
import { toast } from "sonner";

interface Quest {
  id: string;
  title: string;
  description: string;
  requiredFriends: number;
  completedFriends: number;
  xpReward: number;
  isCompleted: boolean;
}

export function SocialQuests() {
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: "1",
      title: "Team React Challenge",
      description: "Complete React hooks challenge with 3 friends",
      requiredFriends: 3,
      completedFriends: 1,
      xpReward: 500,
      isCompleted: false,
    },
    {
      id: "2",
      title: "Code Review Crew",
      description: "Review each other's pull requests (3 minimum)",
      requiredFriends: 3,
      completedFriends: 2,
      xpReward: 400,
      isCompleted: false,
    },
    {
      id: "3",
      title: "Pair Programming Marathon",
      description: "2+ hour pair coding session with a friend",
      requiredFriends: 1,
      completedFriends: 1,
      xpReward: 300,
      isCompleted: true,
    },
    {
      id: "4",
      title: "Skill Share Circle",
      description: "Teach 3 friends one new skill",
      requiredFriends: 3,
      completedFriends: 0,
      xpReward: 450,
      isCompleted: false,
    },
  ]);

  const inviteFriend = (questId: string) => {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId && q.completedFriends < q.requiredFriends
          ? { ...q, completedFriends: q.completedFriends + 1 }
          : q
      )
    );
    toast.success("Invite sent! 🎉");
  };

  const completeQuest = (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (quest && !quest.isCompleted && quest.completedFriends >= quest.requiredFriends) {
      setQuests((prev) =>
        prev.map((q) => (q.id === questId ? { ...q, isCompleted: true } : q))
      );
      toast.success(`+${quest.xpReward} XP earned! 🏆`);
    }
  };

  return (
    <motion.div
      className="luxury-card border border-neon-purple/20 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-neon-purple" />
        <h3 className="text-xl font-bold text-neon-purple">Social Quest Chains</h3>
      </div>

      {/* Quests List */}
      <div className="space-y-3">
        {quests.map((quest) => (
          <motion.div
            key={quest.id}
            whileHover={{ scale: 1.01 }}
            className={`p-4 rounded-lg border transition ${
              quest.isCompleted
                ? "bg-green-500/10 border-green-500/30"
                : "bg-slate-800/50 border-slate-700/30 hover:border-neon-purple/30"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">{quest.title}</p>
                <p className="text-xs text-slate-400">{quest.description}</p>
              </div>
              <span className="text-xs font-bold text-neon-purple bg-neon-purple/20 px-2 py-1 rounded-full ml-2">
                +{quest.xpReward} XP
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400">
                  {quest.completedFriends}/{quest.requiredFriends} Friends
                </span>
                {quest.isCompleted && (
                  <span className="text-xs text-green-400 font-semibold">✓ COMPLETED</span>
                )}
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-neon-purple to-neon-blue"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(quest.completedFriends / quest.requiredFriends) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            {!quest.isCompleted && (
              <div className="flex gap-2 text-xs">
                {quest.completedFriends < quest.requiredFriends && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => inviteFriend(quest.id)}
                    className="flex-1 px-3 py-1 rounded bg-neon-purple/20 border border-neon-purple/30 hover:border-neon-purple/50 text-neon-purple font-medium transition"
                  >
                    <Link2 className="w-3 h-3 inline mr-1" />
                    Invite Friend
                  </motion.button>
                )}
                {quest.completedFriends >= quest.requiredFriends && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => completeQuest(quest.id)}
                    className="flex-1 px-3 py-1 rounded bg-green-500/20 border border-green-500/30 hover:border-green-500/50 text-green-300 font-medium transition"
                  >
                    <Target className="w-3 h-3 inline mr-1" />
                    Complete Quest
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <p className="text-xs text-slate-400 text-center">
          Team challenges unlock exclusive multiplayer features!
        </p>
      </div>
    </motion.div>
  );
}
