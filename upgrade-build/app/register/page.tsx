"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      await api.auth.register({ email, password });
      toast.success("Registration successful");
      router.push("/login");
    } catch {
      toast.error("Could not register with backend. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-md card">
      <h1 className="text-2xl font-bold text-violet-200">Register</h1>
      <p className="mb-4 mt-1 text-sm text-slate-400">Build your future-ready profile in seconds.</p>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          className="w-full rounded-xl border border-cyan-400/40 bg-slate-900/70 px-3 py-2 shadow-neon outline-none"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full rounded-xl border border-violet-400/40 bg-slate-900/70 px-3 py-2 shadow-neon outline-none"
          required
        />
        <button disabled={loading} className="w-full rounded-xl bg-violet-500/20 py-2 text-violet-100 transition hover:bg-violet-500/30">
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </section>
  );
}
