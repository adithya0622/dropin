"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Volume2, Sparkles } from "lucide-react";

interface Message {
  id: string;
  text: string;
  avatar: "mentor" | "user";
  timestamp: number;
}

export function AIAvatar() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey! I'm your AI Mentor. Based on your skills, I see you're 92% match for Full Stack roles. Want personalized advice?",
      avatar: "mentor",
      timestamp: Date.now(),
    },
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const sendAdviceRequest = (topic: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: topic,
      avatar: "user",
      timestamp: Date.now(),
    };
    setMessages([...messages, newUserMessage]);

    // Simulate mentor response
    setTimeout(() => {
      const adviceMap: Record<string, string> = {
        career: "Focus on System Design interviews. I recommend LeetCode Medium problems + mock interviews weekly.",
        skills: "Your next level: Learn Kubernetes & Docker. These are in 78% of job postings you match.",
        projects: "Build a full-stack SaaS with Next.js, PostgreSQL, and deploy to Vercel. This impresses every recruiter.",
        interview: "Practice behavioral questions using the STAR method. Record yourself and watch back critically.",
      };

      const response = adviceMap[topic] || "Great question! Keep improving and you'll crush your goals.";

      const mentorMessage: Message = {
        id: Date.now().toString(),
        text: response,
        avatar: "mentor",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, mentorMessage]);
    }, 800);
  };

  const topicButtons = [
    { label: "💼 Career", value: "career" },
    { label: "🎯 Skills", value: "skills" },
    { label: "🚀 Projects", value: "projects" },
    { label: "🎤 Interview", value: "interview" },
  ];

  return (
    <motion.div
      className="luxury-card border border-neon-purple/20 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-neon-purple" />
        <h3 className="text-xl font-bold text-neon-purple">AI Mentor</h3>
      </div>

      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <motion.div
          animate={isSpeaking ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center text-2xl"
        >
          🤖
        </motion.div>
      </div>

      {/* Messages */}
      <div className="space-y-3 mb-4 max-h-56 overflow-y-auto">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.avatar === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-lg text-sm ${
                msg.avatar === "user"
                  ? "bg-neon-purple/20 border border-neon-purple/30 text-white"
                  : "bg-neon-blue/20 border border-neon-blue/30 text-slate-100"
              }`}
            >
              {msg.text}
              {msg.avatar === "mentor" && (
                <button
                  onClick={() => handleSpeak(msg.text)}
                  className="mt-2 text-xs flex items-center gap-1 hover:text-neon-blue transition"
                >
                  <Volume2 className="w-3 h-3" />
                  Listen
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Topic Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {topicButtons.map((btn) => (
          <motion.button
            key={btn.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => sendAdviceRequest(btn.value)}
            className="px-3 py-2 rounded-lg bg-neon-purple/10 border border-neon-purple/20 text-xs font-medium hover:border-neon-purple/50 transition"
          >
            {btn.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
