"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Zap,
  Trophy,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: Home, label: "Home", badge: null },
    { href: "/challenges", icon: Zap, label: "Challenges", badge: "3" },
    { href: "/leaderboard", icon: Trophy, label: "Top 10", badge: null },
    { href: "/profile", icon: User, label: "Profile", badge: null },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-luxury-darker to-luxury-dark border-t border-neon-blue/20 px-2 py-2 md:hidden"
    >
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition ${
                    isActive
                      ? "text-neon-blue bg-neon-blue/10"
                      : "text-slate-400 hover:text-neon-blue hover:bg-neon-blue/5"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs font-medium">{item.label}</span>

                  {item.badge && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 px-1.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-neon-purple to-neon-blue text-white"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
