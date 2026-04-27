"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { Download } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { ErrorState } from "@/components/admin/error-state";
import { LoadingState } from "@/components/admin/loading-state";
import { SalesChart } from "@/components/admin/sales-chart";
import { formatCurrency } from "@/lib/utils";
import type { Database } from "@/types/database";

type Order = Database["public"]["Tables"]["orders"]["Row"];
type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];
type Period = "daily" | "monthly";

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function ReportsManager() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState<Period>("daily");

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError("");

    const [ordersRes, itemsRes, productsRes] = await Promise.all([
      supabase.from("orders").select("*").order("order_date", { ascending: false }),
      supabase.from("order_items").select("*"),
      supabase.from("products").select("*"),
    ]);

    if (ordersRes.error || itemsRes.error || productsRes.error) {
      setError(ordersRes.error?.message || itemsRes.error?.message || productsRes.error?.message || "Unable to load analytics.");
      setLoading(false);
      return;
    }

    setOrders(ordersRes.data ?? []);
    setOrderItems(itemsRes.data ?? []);
    setProducts(productsRes.data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    const channel = supabase
      .channel("admin-analytics")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => void fetchAnalytics())
      .on("postgres_changes", { event: "*", schema: "public", table: "order_items" }, () => void fetchAnalytics())
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => void fetchAnalytics())
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [fetchAnalytics, supabase]);

  const reportRows = useMemo(() => {
    const bucket = new Map<string, number>();

    orders.forEach((order) => {
      const date = new Date(order.order_date);
      const key = period === "daily" ? date.toISOString().slice(0, 10) : getMonthKey(date);
      bucket.set(key, (bucket.get(key) ?? 0) + Number(order.total_price));
    });

    return [...bucket.entries()]
      .map(([label, revenue]) => ({ label, revenue }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [orders, period]);

  const productMap = useMemo(() => {
    return new Map(products.map((product) => [product.id, product.name]));
  }, [products]);

  const bestSelling = useMemo(() => {
    const byProduct = new Map<string, { quantity: number; revenue: number }>();
    orderItems.forEach((item) => {
      const row = byProduct.get(item.product_id) ?? { quantity: 0, revenue: 0 };
      row.quantity += item.quantity;
      row.revenue += Number(item.subtotal);
      byProduct.set(item.product_id, row);
    });

    return [...byProduct.entries()]
      .map(([productId, stats]) => ({
        productId,
        name: productMap.get(productId) || productId.slice(0, 8),
        quantity: stats.quantity,
        revenue: stats.revenue,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 6);
  }, [orderItems, productMap]);

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_price), 0);
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;
  const deliveredRevenue = orders
    .filter((order) => order.status === "Delivered")
    .reduce((sum, order) => sum + Number(order.total_price), 0);

  function exportAsCsv() {
    const worksheet = XLSX.utils.json_to_sheet(reportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Analytics");
    XLSX.writeFile(workbook, `my-store-${period}-analytics.csv`, { bookType: "csv" });
    toast.success("CSV exported.");
  }

  function exportAsXlsx() {
    const worksheet = XLSX.utils.json_to_sheet(reportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Analytics");
    XLSX.writeFile(workbook, `my-store-${period}-analytics.xlsx`);
    toast.success("Excel exported.");
  }

  if (loading) return <LoadingState label="Loading analytics..." rows={7} />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
          <p className="text-sm text-[var(--text-muted)]">Revenue Overview</p>
          <p className="text-2xl font-semibold text-[var(--text)]">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
          <p className="text-sm text-[var(--text-muted)]">Average Order Value</p>
          <p className="text-2xl font-semibold text-[var(--text)]">{formatCurrency(avgOrderValue)}</p>
        </div>
        <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
          <p className="text-sm text-[var(--text-muted)]">Delivered Revenue</p>
          <p className="text-2xl font-semibold text-[var(--text)]">{formatCurrency(deliveredRevenue)}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
        <div className="inline-flex rounded-lg border border-[var(--line)] bg-[var(--surface-soft)] p-1 text-sm">
          {(["daily", "monthly"] as Period[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPeriod(option)}
              className={`rounded-md px-3 py-1.5 capitalize transition ${
                period === option ? "bg-[var(--accent)] text-white" : "text-[var(--text)]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={exportAsCsv}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--line)] px-3 py-2 text-sm"
          >
            <Download size={14} />
            Export CSV
          </button>
          <button
            type="button"
            onClick={exportAsXlsx}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-3 py-2 text-sm text-white"
          >
            <Download size={14} />
            Export Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="space-y-4">
          <SalesChart data={reportRows.map((row) => ({ day: row.label, revenue: row.revenue }))} />
          <div className="overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--surface)]">
            <div className="border-b border-[var(--line)] px-4 py-3">
              <h3 className="text-sm font-semibold text-[var(--text)]">Sales Trend Table</h3>
            </div>
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[var(--line)] bg-[var(--surface-soft)] text-[var(--text-muted)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Period</th>
                  <th className="px-4 py-3 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {reportRows.map((row) => (
                  <tr key={row.label} className="border-b border-[var(--line)] last:border-b-0">
                    <td className="px-4 py-3 text-[var(--text)]">{row.label}</td>
                    <td className="px-4 py-3 text-[var(--text)]">{formatCurrency(row.revenue)}</td>
                  </tr>
                ))}
                {reportRows.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-4 py-6 text-center text-[var(--text-muted)]">
                      No sales records yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--surface)]">
          <div className="border-b border-[var(--line)] px-4 py-3">
            <h3 className="text-sm font-semibold text-[var(--text)]">Best Selling Products</h3>
          </div>
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[var(--line)] bg-[var(--surface-soft)] text-[var(--text-muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Units Sold</th>
                <th className="px-4 py-3 font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {bestSelling.map((item) => (
                <tr key={item.productId} className="border-b border-[var(--line)] last:border-b-0">
                  <td className="px-4 py-3 text-[var(--text)]">{item.name}</td>
                  <td className="px-4 py-3 text-[var(--text)]">{item.quantity}</td>
                  <td className="px-4 py-3 text-[var(--text)]">{formatCurrency(item.revenue)}</td>
                </tr>
              ))}
              {bestSelling.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-[var(--text-muted)]">
                    No best-seller data yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
