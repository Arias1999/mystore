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
import type { Database } from "@/types/database";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Order = Database["public"]["Tables"]["orders"]["Row"];
type Customer = Database["public"]["Tables"]["customers"]["Row"];

export function DashboardOverview() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    const [productsRes, ordersRes, customersRes] = await Promise.all([
      supabase.from("products").select("*"),
      supabase.from("orders").select("*"),
      supabase.from("customers").select("*"),
    ]);

    if (productsRes.error || ordersRes.error || customersRes.error) {
      setError(productsRes.error?.message || ordersRes.error?.message || customersRes.error?.message || "Unable to load dashboard.");
      setLoading(false);
      return;
    }

    setProducts(productsRes.data ?? []);
    setOrders(ordersRes.data ?? []);
    setCustomers(customersRes.data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    const channel = supabase
      .channel("admin-dashboard-overview")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => void fetchDashboard())
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => void fetchDashboard())
      .on("postgres_changes", { event: "*", schema: "public", table: "customers" }, () => void fetchDashboard())
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [fetchDashboard, supabase]);

  const totalSales = orders.reduce((sum, order) => sum + Number(order.total_price), 0);

  const salesData = useMemo(() => {
    const now = new Date();
    const days = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (6 - index));
      const key = date.toISOString().slice(0, 10);
      return { key, day: date.toLocaleDateString("en-US", { weekday: "short" }), revenue: 0 };
    });

    const map = new Map(days.map((day) => [day.key, day]));
    orders.forEach((order) => {
      const key = new Date(order.order_date).toISOString().slice(0, 10);
      const row = map.get(key);
      if (row) row.revenue += Number(order.total_price);
    });

    return days.map(({ day, revenue }) => ({ day, revenue }));
  }, [orders]);

  const categoryData = useMemo(() => {
    const bucket = new Map<string, number>();
    products.forEach((product) => {
      bucket.set(product.category, (bucket.get(product.category) ?? 0) + 1);
    });
    return [...bucket.entries()].map(([category, value]) => ({ category, value }));
  }, [products]);

  const customerMap = useMemo(() => {
    return new Map(customers.map((customer) => [customer.id, customer]));
  }, [customers]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime())
      .slice(0, 6);
  }, [orders]);

  if (loading) return <LoadingState label="Loading dashboard..." rows={6} />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Sales" value={formatCurrency(totalSales)} icon={DollarSign} />
        <StatCard label="Total Orders" value={String(orders.length)} icon={ReceiptText} />
        <StatCard label="Total Products" value={String(products.length)} icon={Package} />
        <StatCard label="Total Customers" value={String(customers.length)} icon={Users} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChart data={salesData} />
        </div>
        <CategoryChart data={categoryData} />
      </div>

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
                  {customerMap.get(order.customer_id)?.name || customerMap.get(order.customer_id)?.email || order.customer_id.slice(0, 8)}
                </td>
                <td className="px-4 py-3 text-[var(--text)]">{order.status}</td>
                <td className="px-4 py-3 text-[var(--text-muted)]">{formatDate(order.order_date)}</td>
                <td className="px-4 py-3 text-[var(--text)]">{formatCurrency(order.total_price)}</td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-[var(--text-muted)]">
                  No recent orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
