"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ErrorState } from "@/components/admin/error-state";
import { LoadingState } from "@/components/admin/loading-state";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Database } from "@/types/database";

type Customer = Database["public"]["Tables"]["customers"]["Row"];
type Order = Database["public"]["Tables"]["orders"]["Row"];

export function CustomerDetails({ customerId }: { customerId: string }) {
  const supabase = createClient();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setError("");

    const [customerRes, ordersRes] = await Promise.all([
      supabase.from("users").select("id, name, email, created_at").eq("id", customerId).single(),
      supabase.from("orders").select("*").eq("user_id", customerId).order("created_at", { ascending: false }),
    ]);

    if (customerRes.error || ordersRes.error) {
      setError(customerRes.error?.message || ordersRes.error?.message || "Unable to load customer details.");
      setLoading(false);
      return;
    }

    setCustomer(customerRes.data);
    setOrders(ordersRes.data ?? []);
    setLoading(false);
  }, [customerId, supabase]);

  useEffect(() => {
    void fetchDetails();
  }, [fetchDetails]);

  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total_price), 0);

  if (loading) return <LoadingState label="Loading customer details..." rows={6} />;
  if (error) return <ErrorState message={error} />;
  if (!customer) return <ErrorState message="Customer not found." />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text)]">Customer Details</h2>
          <p className="text-sm text-[var(--text-muted)]">Order history and profile summary.</p>
        </div>
        <Link
          href="/admin/customers"
          className="rounded-md border border-[var(--line)] px-3 py-2 text-sm text-[var(--text)] transition hover:bg-[var(--surface-soft)]"
        >
          Back
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
          <p className="text-xs text-[var(--text-muted)]">Name</p>
          <p className="mt-1 text-sm font-medium text-[var(--text)]">{customer.name || "No name"}</p>
        </div>
        <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
          <p className="text-xs text-[var(--text-muted)]">Email</p>
          <p className="mt-1 text-sm font-medium text-[var(--text)]">{customer.email}</p>
        </div>
        <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
          <p className="text-xs text-[var(--text-muted)]">Phone</p>
          <p className="mt-1 text-sm font-medium text-[var(--text)]">{customer.phone || "-"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
          <p className="text-xs text-[var(--text-muted)]">Total Orders</p>
          <p className="mt-1 text-xl font-semibold text-[var(--text)]">{orders.length}</p>
        </div>
        <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
          <p className="text-xs text-[var(--text-muted)]">Total Spent</p>
          <p className="mt-1 text-xl font-semibold text-[var(--text)]">{formatCurrency(totalSpent)}</p>
        </div>
        <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
          <p className="text-xs text-[var(--text-muted)]">Joined</p>
          <p className="mt-1 text-xl font-semibold text-[var(--text)]">{formatDate(customer.created_at)}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--surface)]">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-[var(--surface-soft)] text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Order ID</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-[var(--line)] last:border-b-0">
                <td className="px-4 py-3 text-[var(--text)]">{order.id.slice(0, 8)}</td>
                <td className="px-4 py-3 text-[var(--text-muted)]">{formatDate(order.created_at)}</td>
                <td className="px-4 py-3 text-[var(--text)]">{order.status}</td>
                <td className="px-4 py-3 text-[var(--text)]">{formatCurrency(order.total_price)}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-[var(--text-muted)]">
                  This customer has no orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
