"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

type Rider = { id: string; name: string | null; email: string; created_at: string };
type Order = { id: string; user_email: string; total: number; status: string; rider_id: string | null; rider_name: string | null };

export function RidersManager() {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"riders" | "assign">("riders");

  // Create rider form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);

  const defaultRiders = [
    { name: "Rilay", email: "rilay@lyrastore.com" },
    { name: "Rider", email: "rider@lyrastore.com" },
  ];

  const supabase = createClient();

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    const [{ data: riderData }, { data: orderData }] = await Promise.all([
      supabase.from("users").select("id, name, email, created_at").eq("role", "rider").order("created_at", { ascending: false }),
      supabase.from("storefront_orders").select("id, total, status, rider_id, user_id").order("created_at", { ascending: false }),
    ]);

    setRiders(riderData ?? []);

    const riderMap = Object.fromEntries((riderData ?? []).map((r) => [r.id, r.name ?? r.email]));

    // Fetch user emails separately
    const userIds = [...new Set((orderData ?? []).map((o: any) => o.user_id).filter(Boolean))];
    let emailMap: Record<string, string> = {};
    if (userIds.length > 0) {
      const { data: users } = await supabase.from("users").select("id, email").in("id", userIds);
      emailMap = Object.fromEntries((users ?? []).map((u: any) => [u.id, u.email]));
    }

    setOrders((orderData ?? []).map((o: any) => ({
      id: o.id,
      user_email: emailMap[o.user_id] ?? "—",
      total: o.total,
      status: o.status,
      rider_id: o.rider_id,
      rider_name: o.rider_id ? (riderMap[o.rider_id] ?? "Unknown") : null,
    })));
    setLoading(false);
  }

  async function handleCreateRider() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill out all fields.");
      return;
    }
    setCreating(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
      options: { data: { name: name.trim(), role: "rider" } },
    });
    if (error) { toast.error(error.message); setCreating(false); return; }
    if (data.user) {
      await supabase.from("users").upsert({ id: data.user.id, email: email.trim(), name: name.trim(), role: "rider" });
    }
    toast.success(`Rider account created for ${email.trim()}.`);
    setName(""); setEmail(""); setPassword("");
    setCreating(false);
    fetchAll();
  }

  async function handleDeleteRider(id: string) {
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) { toast.error("Failed to remove rider."); return; }
    toast.success("Rider removed.");
    setRiders((prev) => prev.filter((r) => r.id !== id));
  }

  async function handleAssignRider(orderId: string, riderId: string) {
    const { error } = await supabase.from("storefront_orders").update({ rider_id: riderId || null }).eq("id", orderId);
    if (error) { toast.error("Failed to assign rider."); return; }
    toast.success("Rider assigned.");
    const riderName = riders.find((r) => r.id === riderId)?.name ?? riders.find((r) => r.id === riderId)?.email ?? null;
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, rider_id: riderId || null, rider_name: riderId ? riderName : null } : o));
  }

  if (loading) return <p className="text-sm text-[var(--text-muted)]">Loading...</p>;

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2">
        {(["riders", "assign"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${tab === t ? "bg-[var(--accent)] text-white" : "border border-[var(--line)] text-[var(--text)] hover:bg-[var(--surface-soft)]"}`}>
            {t === "riders" ? "🏍️ Riders" : "📦 Assign Orders"}
          </button>
        ))}
      </div>

      {tab === "riders" && (
        <div className="space-y-4">
          {/* Create Rider */}
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 space-y-3">
            <h3 className="text-sm font-semibold text-[var(--text)]">Add New Rider</h3>

            {/* Quick Add default riders */}
            <div className="flex flex-wrap gap-2">
              <p className="w-full text-xs text-[var(--text-muted)]">Quick add:</p>
              {defaultRiders
                .filter((d) => !riders.some((r) => r.email === d.email))
                .map((d) => (
                  <button
                    key={d.email}
                    type="button"
                    onClick={() => { setName(d.name); setEmail(d.email); }}
                    className="rounded-full border border-[var(--accent)] px-3 py-1 text-xs font-semibold text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition"
                  >
                    + {d.name}
                  </button>
                ))}
              {defaultRiders.every((d) => riders.some((r) => r.email === d.email)) && (
                <p className="text-xs text-[var(--text-muted)]">All default riders already added.</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name"
                className="h-10 rounded-lg border border-[var(--line)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
                className="h-10 rounded-lg border border-[var(--line)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6)"
                className="h-10 rounded-lg border border-[var(--line)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
            </div>
            <button onClick={handleCreateRider} disabled={creating}
              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
              {creating ? "Creating..." : "Create Rider"}
            </button>
          </div>

          {/* Riders List */}
          <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-[var(--surface)]">
            <table className="min-w-full text-sm">
              <thead className="border-b border-[var(--line)] bg-[var(--surface-soft)] text-[var(--text-muted)]">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Joined</th>
                  <th className="px-4 py-3 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {riders.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-6 text-center text-[var(--text-muted)]">No riders yet.</td></tr>
                )}
                {riders.map((r) => (
                  <tr key={r.id} className="border-b border-[var(--line)] last:border-0">
                    <td className="px-4 py-3 font-medium text-[var(--text)]">{r.name ?? "—"}</td>
                    <td className="px-4 py-3 text-[var(--text-muted)]">{r.email}</td>
                    <td className="px-4 py-3 text-[var(--text-muted)]">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDeleteRider(r.id)}
                        className="rounded-md bg-red-50 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-100">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "assign" && (
        <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-[var(--surface)]">
          <table className="min-w-full text-sm">
            <thead className="border-b border-[var(--line)] bg-[var(--surface-soft)] text-[var(--text-muted)]">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Order ID</th>
                <th className="px-4 py-3 text-left font-medium">Customer</th>
                <th className="px-4 py-3 text-left font-medium">Total</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Assign Rider</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-[var(--text-muted)]">No orders yet.</td></tr>
              )}
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-[var(--line)] last:border-0">
                  <td className="px-4 py-3 text-[var(--text)]">{o.id.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{o.user_email}</td>
                  <td className="px-4 py-3 text-[var(--text)]">₱{o.total}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${o.status === "Approved" ? "bg-green-50 text-green-700" : o.status === "Rejected" ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {riders.length === 0 ? (
                      <span className="text-xs text-[var(--text-muted)]">No riders available</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {riders.map((r) => (
                          <button
                            key={r.id}
                            onClick={() => handleAssignRider(o.id, o.rider_id === r.id ? "" : r.id)}
                            className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                              o.rider_id === r.id
                                ? "bg-[var(--accent)] text-white"
                                : "border border-[var(--line)] text-[var(--text)] hover:bg-[var(--accent)] hover:text-white"
                            }`}
                          >
                            🏍️ {r.name ?? r.email}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
