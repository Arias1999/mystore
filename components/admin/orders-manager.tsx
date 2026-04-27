"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { ErrorState } from "@/components/admin/error-state";
import { LoadingState } from "@/components/admin/loading-state";
import { Pagination } from "@/components/admin/pagination";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Database } from "@/types/database";

type Customer = { id: string; name: string | null; email: string };

const statuses: Array<Order["status"]> = ["Pending", "Delivered", "Cancelled"];
const PAGE_SIZE = 10;

export function OrdersManager() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    const [ordersRes, customersRes] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("users").select("id, name, email"),
    ]);

    if (ordersRes.error || customersRes.error) {
      setError(ordersRes.error?.message || customersRes.error?.message || "Unable to load orders.");
      setLoading(false);
      return;
    }

    setOrders(ordersRes.data ?? []);
    setCustomers(customersRes.data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const channel = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => void fetchOrders())
      .on("postgres_changes", { event: "*", schema: "public", table: "users" }, () => void fetchOrders())
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [fetchOrders, supabase]);

  const customerMap = useMemo(() => {
    return new Map(customers.map((customer) => [customer.id, customer]));
  }, [customers]);

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const paginated = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage((prev) => Math.min(prev, Math.max(1, Math.ceil(orders.length / PAGE_SIZE))));
  }, [orders.length]);

  async function updateStatus(orderId: string, status: Order["status"]) {
    const { error: updateError } = await supabase.from("orders").update({ status }).eq("id", orderId);

    if (updateError) {
      toast.error(updateError.message);
      return;
    }

    toast.success("Order status updated.");
  }

  if (loading) return <LoadingState label="Loading orders..." rows={7} />;
  if (error) return <ErrorState message={error} />;

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--surface)]">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-[var(--surface-soft)] text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Order ID</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Order Date</th>
              <th className="px-4 py-3 font-medium">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((order) => (
              <tr key={order.id} className="border-b border-[var(--line)] last:border-b-0">
                <td className="px-4 py-3 text-[var(--text)]">{order.id.slice(0, 8)}</td>
                <td className="px-4 py-3 text-[var(--text)]">
                  {customerMap.get(order.user_id)?.name || customerMap.get(order.user_id)?.email || order.user_id.slice(0, 8)}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    onChange={(event) => updateStatus(order.id, event.target.value as Order["status"])}
                    className="h-9 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-[var(--text-muted)]">{formatDate(order.created_at)}</td>
                <td className="px-4 py-3 text-[var(--text)]">{formatCurrency(order.total_price)}</td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-[var(--text-muted)]">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </>
  );
}
