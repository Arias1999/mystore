"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Package, ReceiptText, DollarSign, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { StatCard } from "@/components/admin/stat-card";
import { SalesChart } from "@/components/admin/sales-chart";
import { CategoryChart } from "@/components/admin/category-chart";
import { LoadingState } from "@/components/admin/loading-state";
import { ErrorState } from "@/components/admin/error-state";
import { formatCurrency, formatDate } from "@/lib/utils";

type StorefrontOrder = { id: string; user_id: string; total: number; status: string; created_at: string };

export function DashboardOverview() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<StorefrontOrder[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    const [productsRes, ordersRes, customersRes] = await Promise.all([
      supabase.from("products").select("*"),
      supabase.from("storefront_orders").select("id, user_id, total, status, created_at").order("created_at", { ascending: false }),
      supabase.from("users").select("id, name, email").eq("role", "customer"),
    ]);

    if (productsRes.error || ordersRes.error) {
      setError(productsRes.error?.message || ordersRes.error?.message || "Unable to load dashboard.");
      setLoading(false);
      return;
    }

    setProducts(productsRes.data ?? []);
    setOrders(ordersRes.data ?? []);
    setCustomers(customersRes.data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { void fetchDashboard(); }, [fetchDashboard]);

  useEffect(() => {
    const channel = supabase
      .channel("admin-dashboard-overview")
      .on("postgres_changes", { event: "*", schema: "public", table: "storefront_orders" }, () => void fetchDashboard())
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => void fetchDashboard())
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [fetchDashboard, supabase]);

  const totalSales = orders.reduce((sum, o) => sum + Number(o.total), 0);

  // Revenue per day (last 7 days)
  const salesData = useMemo(() => {
    const now = new Date();
    const days = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (6 - i));
      const key = date.toISOString().slice(0, 10);
      return { key, day: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }), revenue: 0 };
    });
    const map = new Map(days.map((d) => [d.key, d]));
    orders.forEach((o) => {
      const key = new Date(o.created_at).toISOString().slice(0, 10);
      const row = map.get(key);
      if (row) row.revenue += Number(o.total);
    });
    return days.map(({ day, revenue }) => ({ day, revenue }));
  }, [orders]);

  const categoryData = useMemo(() => {
    const bucket = new Map<string, number>();
    products.forEach((p) => bucket.set(p.category, (bucket.get(p.category) ?? 0) + 1));
    return [...bucket.entries()].map(([category, value]) => ({ category, value }));
  }, [products]);

  const customerMap = useMemo(() => new Map(customers.map((c) => [c.id, c])), [customers]);

  const recentOrders = useMemo(() => orders.slice(0, 6), [orders]);

  // Today's revenue
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayRevenue = orders
    .filter((o) => new Date(o.created_at).toISOString().slice(0, 10) === todayKey)
    .reduce((sum, o) => sum + Number(o.total), 0);

  if (loading) return <LoadingState label="Loading dashboard..." rows={6} />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Revenue" value={formatCurrency(totalSales)} icon={DollarSign} />
        <StatCard label="Revenue Today" value={formatCurrency(todayRevenue)} icon={DollarSign} />
        <StatCard label="Total Orders" value={String(orders.length)} icon={ReceiptText} />
        <StatCard label="Total Products" value={String(products.length)} icon={Package} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChart data={salesData} />
        </div>
        <CategoryChart data={categoryData} />
      </div>

      {/* Revenue Per Day Table */}
      <div className="overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--surface)]">
        <div className="border-b border-[var(--line)] px-4 py-3">
          <h3 className="text-sm font-semibold text-[var(--text)]">Revenue Per Day (Last 7 Days)</h3>
        </div>
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-[var(--surface-soft)] text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Day</th>
              <th className="px-4 py-3 font-medium">Revenue</th>
              <th className="px-4 py-3 font-medium">Orders</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((d, i) => {
              const dayKey = (() => { const date = new Date(); date.setDate(date.getDate() - (6 - i)); return date.toISOString().slice(0, 10); })();
              const dayOrders = orders.filter((o) => new Date(o.created_at).toISOString().slice(0, 10) === dayKey).length;
              const isToday = dayKey === todayKey;
              return (
                <tr key={i} className={`border-b border-[var(--line)] last:border-0 ${isToday ? "bg-[var(--surface-soft)]" : ""}`}>
                  <td className="px-4 py-3 font-medium text-[var(--text)]">
                    {d.day} {isToday && <span className="ml-1 rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs text-white">Today</span>}
                  </td>
                  <td className="px-4 py-3 font-bold text-[var(--accent)]">{formatCurrency(d.revenue)}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{dayOrders}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Recent Orders */}
      <div className="overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--surface)]">
        <div className="border-b border-[var(--line)] px-4 py-3">
          <h3 className="text-sm font-semibold text-[var(--text)]">Recent Orders</h3>
        </div>
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-[var(--surface-soft)] text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Order ID</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-b border-[var(--line)] last:border-b-0">
                <td className="px-4 py-3 text-[var(--text)]">{order.id.slice(0, 8)}</td>
                <td className="px-4 py-3 text-[var(--text-muted)]">
                  {customerMap.get(order.user_id)?.name || customerMap.get(order.user_id)?.email || order.user_id.slice(0, 8)}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    order.status === "Approved" ? "bg-green-50 text-green-700" :
                    order.status === "Rejected" ? "bg-red-50 text-red-700" :
                    "bg-yellow-50 text-yellow-700"
                  }`}>{order.status}</span>
                </td>
                <td className="px-4 py-3 text-[var(--text-muted)]">{formatDate(order.created_at)}</td>
                <td className="px-4 py-3 font-bold text-[var(--accent)]">{formatCurrency(order.total)}</td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-[var(--text-muted)]">No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
