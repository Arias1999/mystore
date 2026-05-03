"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ErrorState } from "@/components/admin/error-state";
import { LoadingState } from "@/components/admin/loading-state";
import { Pagination } from "@/components/admin/pagination";
import { formatDate } from "@/lib/utils";
import type { Database } from "@/types/database";

type Customer = { id: string; name: string | null; email: string; created_at: string; total_orders?: number };

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

    const { data, error: fetchError } = await supabase
      .from("users")
      .select("id, name, email, created_at")
      .eq("role", "customer")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    // Get order counts per user
    const { data: orders } = await supabase
      .from("storefront_orders")
      .select("user_id");

    const orderCounts: Record<string, number> = {};
    (orders ?? []).forEach((o: any) => {
      orderCounts[o.user_id] = (orderCounts[o.user_id] || 0) + 1;
    });

    setCustomers((data ?? []).map((c: any) => ({ ...c, total_orders: orderCounts[c.id] || 0 })));
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
      return (customer.name ?? "").toLowerCase().includes(lower) || customer.email.toLowerCase().includes(lower);
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
                <td className="px-4 py-3 text-[var(--text)]">{customer.name ?? "No name"}</td>
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
