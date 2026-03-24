"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStudent } from "@/hooks/use-student";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error } = useStudent();
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("demo123");
  const [submitError, setSubmitError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!rollNo.trim()) {
      setSubmitError("Please enter your Roll Number");
      return;
    }

    const result = await login(parseInt(rollNo), password);

    if (result && result.success) {
      // Redirect to dashboard
      router.push("/profile");
    } else {
      setSubmitError(error || "Login failed. Check your Roll Number and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Upgrade</h1>
        <p className="text-center text-gray-600 mb-8">Student Learning Recommendation System</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="rollNo" className="block text-sm font-medium text-gray-700 mb-1">
              Roll Number
            </label>
            <input
              id="rollNo"
              type="number"
              placeholder="Enter your Roll Number"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">Only top 5 performers can log in</p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">Hint: demo123</p>
          </div>

          {(submitError || error) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {submitError || error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            Test Roll Numbers: <span className="font-mono font-semibold">22001-22005</span>
          </p>
          <p className="text-center text-xs text-gray-500 mt-2">
            Use these to test the top 5 student restriction
          </p>
        </div>
      </div>
    </div>
  );
}
