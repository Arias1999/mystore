"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#0f766e", "#0891b2", "#dc2626", "#d97706", "#1d4ed8", "#4f46e5"];

type CategoryItem = {
  category: string;
  value: number;
};

export function CategoryChart({ data }: { data: CategoryItem[] }) {
  return (
    <div className="h-[300px] rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
      <p className="mb-4 text-sm font-medium text-[var(--text)]">Product Category Distribution</p>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="category" innerRadius={55} outerRadius={92} paddingAngle={2}>
            {data.map((entry, index) => (
              <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: 8, borderColor: "var(--line)", backgroundColor: "var(--surface)" }}
            labelStyle={{ color: "var(--text)" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
