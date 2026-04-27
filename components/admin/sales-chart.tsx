"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type SalesPoint = {
  day: string;
  revenue: number;
};

export function SalesChart({ data }: { data: SalesPoint[] }) {
  return (
    <div className="h-[300px] rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
      <p className="mb-4 text-sm font-medium text-[var(--text)]">Sales Overview</p>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
          <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
          <YAxis stroke="var(--text-muted)" fontSize={12} />
          <Tooltip
            contentStyle={{ borderRadius: 8, borderColor: "var(--line)", backgroundColor: "var(--surface)" }}
            labelStyle={{ color: "var(--text)" }}
          />
          <Line type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={3} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
