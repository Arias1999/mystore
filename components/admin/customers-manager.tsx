"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ErrorState } from "@/components/admin/error-state";
import { LoadingState } from "@/components/admin/loading-state";
import { Pagination } from "@/components/admin/pagination";
import { formatDate } from "@/lib/utils";
import type { Database } from "@/types/database";

type Customer = { id: string; full_name: string | null; email: string; created_at: string; total_orders?: number };

const PAGE_SIZE = 10;

export function CustomersManager() {
  const supabase = createClient();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError("");

    // Get unique users from storefront_orders
    const { data: orders, error: fetchError } = await (supabase as any)
      .from("storefront_orders")
      .select("user_id, created_at, customer_name, customer_email");

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    // Group by user_id
    const userMap: Record<string, { user_id: string; total_orders: number; created_at: string; name: string; email: string }> = {};
    (orders ?? []).forEach((o: any) => {
      if (!userMap[o.user_id]) {
        userMap[o.user_id] = { user_id: o.user_id, total_orders: 0, created_at: o.created_at, name: o.customer_name || "", email: o.customer_email || "" };
      }
      userMap[o.user_id].total_orders += 1;
    });

    const uniqueUsers = Object.values(userMap).map((u) => ({
      id: u.user_id,
      full_name: u.name || null,
      email: u.email || u.user_id.slice(0, 8),
      created_at: u.created_at,
      total_orders: u.total_orders,
    }));

    setCustomers(uniqueUsers);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    const channel = supabase
      .channel("admin-customers")
      .on("postgres_changes", { event: "*", schema: "public", table: "customers" }, () => void fetchCustomers())
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => void fetchCustomers())
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [fetchCustomers, supabase]);

  const filtered = useMemo(() => {
    const lower = search.trim().toLowerCase();
    if (!lower) return customers;
    return customers.filter((customer) => {
      return (customer.full_name ?? "").toLowerCase().includes(lower) || customer.email.toLowerCase().includes(lower);
    });
  }, [customers, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <LoadingState label="Loading customers..." rows={7} />;
  if (error) return <ErrorState message={error} />;

  return (
    <>
      <div className="mb-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search customer by name or email"
          className="h-10 w-full max-w-sm rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--accent)]"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--surface)]">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-[var(--surface-soft)] text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Total Orders</th>
              <th className="px-4 py-3 font-medium">Registered</th>
              <th className="px-4 py-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((customer) => (
              <tr key={customer.id} className="border-b border-[var(--line)] last:border-b-0">
                <td className="px-4 py-3 text-[var(--text)]">{customer.full_name ?? "No name"}</td>
                <td className="px-4 py-3 text-[var(--text-muted)]">{customer.email}</td>
                <td className="px-4 py-3 text-[var(--text-muted)]">-</td>
                <td className="px-4 py-3 text-[var(--text)]">{customer.total_orders ?? 0}</td>
                <td className="px-4 py-3 text-[var(--text-muted)]">{formatDate(customer.created_at)}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    className="rounded-md border border-[var(--line)] px-3 py-1.5 text-xs text-[var(--text)] transition hover:bg-[var(--surface-soft)]"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-[var(--text-muted)]">
                  No customers found.
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
