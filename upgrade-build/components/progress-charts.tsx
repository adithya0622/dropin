"use client";

import { SkillProgress } from "@/types";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Chart as ChartJS, ArcElement, Tooltip as CTooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, CTooltip, Legend);

export function ProgressCharts({ progress }: { progress: SkillProgress[] }) {
  const trend = progress.flatMap((item) =>
    item.trend.map((level, idx) => ({ skill: item.skill, week: idx + 1, level })),
  );
  const average = Math.round(progress.reduce((acc, skill) => acc + skill.level, 0) / progress.length);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-2xl border border-cyan-400/20 bg-slate-900/40 p-4 lg:col-span-2">
        <p className="mb-3 text-sm text-slate-300">Skill Levels</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={progress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="skill" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="level" fill="#22d3ee" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-2xl border border-violet-400/20 bg-slate-900/40 p-4">
        <p className="mb-3 text-sm text-slate-300">Overall Mastery</p>
        <Doughnut
          data={{
            labels: ["Current", "To Goal"],
            datasets: [{ data: [average, 100 - average], backgroundColor: ["#7c3aed", "#1e293b"] }],
          }}
        />
      </div>
      <div className="rounded-2xl border border-lime-400/20 bg-slate-900/40 p-4 lg:col-span-3">
        <p className="mb-3 text-sm text-slate-300">Weekly Trend</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="week" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="level" stroke="#84cc16" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
