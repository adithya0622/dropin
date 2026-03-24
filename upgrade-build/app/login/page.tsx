"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-slate-400">Redirecting...</p>
    </div>
  );
}
