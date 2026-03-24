"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail, Chrome, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"choice" | "login" | "signup">("choice");
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Use redirect: true to let NextAuth handle the entire flow
      await signIn("google", {
        redirect: true,
        callbackUrl: "/profile",
      });
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error("Authentication failed. Try email login.");
      setError("Google login failed");
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!email || !password) {
        setError("Email and password required");
        toast.error("Please fill in all fields");
        setIsLoading(false);
        return;
      }

      // Use redirect: true to let NextAuth properly set the JWT cookie
      const result = await signIn("email-login", {
        email,
        password,
        redirect: true,
        callbackUrl: "/profile",
      });

      // This code won't execute if redirect: true works
      if (!result?.ok) {
        setError("Invalid email or password");
        toast.error("Invalid email or password!");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed");
      toast.error("Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!email || !password || !name) {
        setError("All fields required");
        toast.error("Please fill in all fields");
        setIsLoading(false);
        return;
      }

      if (password.length < 8) {
        setError("Password must be at least 8 characters");
        toast.error("Password must be at least 8 characters long");
        setIsLoading(false);
        return;
      }

      // Signup uses redirect: true for proper session creation
      const result = await signIn("email-signup", {
        email,
        password,
        name,
        redirect: true,
        callbackUrl: "/profile",
      });

      // This code won't execute if redirect: true works
      if (!result?.ok) {
        setError("Signup failed");
        toast.error("Signup failed. Email may already be in use.");
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      const errorMsg = error?.message || "Signup failed";
      setError(errorMsg);
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-auristra-bg p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="luxury-card-3d w-full max-w-md border-neon-blue/30 shadow-2xl p-8 relative overflow-hidden"
      >
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-neon-blue/20 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-neon-purple/20 blur-3xl" />
        <div className="relative z-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-gold bg-clip-text text-transparent mb-2">
              AURISTRA&apos;26
            </h1>
            <p className="text-slate-400 text-sm">
              AI-powered skill acceleration for hackathon winners
            </p>
          </div>

          {mode === "choice" && (
            <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full btn-luxury flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isLoading ? <Loader className="h-5 w-5 animate-spin" /> : <Chrome className="h-5 w-5" />}
                Continue with Google
              </button>

              <button
                onClick={() => setMode("login")}
                disabled={isLoading}
                className="w-full btn-gold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Mail className="h-5 w-5" />
                Login with Email
              </button>

              <button
                onClick={() => setMode("signup")}
                disabled={isLoading}
                className="w-full btn-purple flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Mail className="h-5 w-5" />
                Sign Up with Email
              </button>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neon-blue/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-luxury-darker text-slate-400">Demo credentials</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 text-center mt-4">
                Try: <span className="text-neon-blue font-mono">demo@gmail.com</span>
                <br />
                Pass: <span className="text-neon-blue font-mono">demo123</span>
              </p>
            </motion.div>
          )}

          {mode === "login" && (
            <motion.form
              onSubmit={handleEmailLogin}
              className="space-y-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                  {error}
                </div>
              )}

              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-luxury-dark/50 border border-neon-blue/20 text-white placeholder-slate-500 focus:border-neon-blue/50 focus:outline-none transition disabled:opacity-50"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-luxury-dark/50 border border-neon-blue/20 text-white placeholder-slate-500 focus:border-neon-blue/50 focus:outline-none transition disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full btn-luxury font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("choice");
                  setError("");
                  setEmail("");
                  setPassword("");
                }}
                disabled={isLoading}
                className="w-full text-sm text-slate-400 hover:text-neon-blue transition disabled:opacity-50"
              >
                ← Back
              </button>
            </motion.form>
          )}

          {mode === "signup" && (
            <motion.form
              onSubmit={handleEmailSignup}
              className="space-y-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                  {error}
                </div>
              )}

              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-luxury-dark/50 border border-neon-blue/20 text-white placeholder-slate-500 focus:border-neon-blue/50 focus:outline-none transition disabled:opacity-50"
              />

              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-luxury-dark/50 border border-neon-blue/20 text-white placeholder-slate-500 focus:border-neon-blue/50 focus:outline-none transition disabled:opacity-50"
              />

              <input
                type="password"
                placeholder="Password (min 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                minLength={8}
                className="w-full px-4 py-3 rounded-xl bg-luxury-dark/50 border border-neon-blue/20 text-white placeholder-slate-500 focus:border-neon-blue/50 focus:outline-none transition disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={isLoading || !name || !email || !password}
                className="w-full btn-gold font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("choice");
                  setError("");
                  setName("");
                  setEmail("");
                  setPassword("");
                }}
                disabled={isLoading}
                className="w-full text-sm text-slate-400 hover:text-gold transition disabled:opacity-50"
              >
                ← Back
              </button>
            </motion.form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
