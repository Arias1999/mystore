"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { ErrorState } from "@/components/admin/error-state";
import { LoadingState } from "@/components/admin/loading-state";
import { Pagination } from "@/components/admin/pagination";
import { formatDate } from "@/lib/utils";

type StorefrontOrder = {
  id: string;
  user_id: string;
  items: { name: string; price: number; qty: number }[];
  total: number;
  payment: string;
  status: string;
  created_at: string;
  user_email?: string;
  rider_name?: string;
};

type Message = { id: string; sender_role: string; message: string; created_at: string };

const PAGE_SIZE = 10;

export function OrdersManager() {
  const supabase = createClient();
  const [orders, setOrders] = useState<StorefrontOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [activeOrder, setActiveOrder] = useState<StorefrontOrder | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const msgEndRef = useRef<HTMLDivElement>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error: err } = await supabase
      .from("storefront_orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (err) { setError(err.message); setLoading(false); return; }

    // Fetch user emails and rider names separately
    const userIds = [...new Set((data ?? []).map((o: any) => o.user_id).filter(Boolean))];
    const riderIds = [...new Set((data ?? []).map((o: any) => o.rider_id).filter(Boolean))];
    let emailMap: Record<string, string> = {};
    let riderMap: Record<string, string> = {};

    if (userIds.length > 0) {
      const { data: users } = await supabase.from("users").select("id, email").in("id", userIds);
      emailMap = Object.fromEntries((users ?? []).map((u: any) => [u.id, u.email]));
    }
    if (riderIds.length > 0) {
      const { data: riders } = await supabase.from("users").select("id, name, email").in("id", riderIds);
      riderMap = Object.fromEntries((riders ?? []).map((r: any) => [r.id, r.name ?? r.email]));
    }

    setOrders((data ?? []).map((o: any) => ({
      ...o,
      user_email: emailMap[o.user_id] ?? "",
      rider_name: o.rider_id ? (riderMap[o.rider_id] ?? "Unknown") : undefined,
    })));
    setLoading(false);
  }, [supabase]);

  useEffect(() => { void fetchOrders(); }, [fetchOrders]);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openMessages = async (order: StorefrontOrder) => {
    setActiveOrder(order);
    const { data } = await supabase
      .from("order_messages")
      .select("*")
      .eq("order_id", order.id)
      .order("created_at", { ascending: true });
    setMessages(data ?? []);

    supabase.channel(`admin-messages-${order.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "order_messages", filter: `order_id=eq.${order.id}` },
        (payload) => setMessages((prev) => [...prev, payload.new as Message])
      ).subscribe();
  };

  const sendReply = async () => {
    if (!newMsg.trim() || !activeOrder) return;
    setSending(true);
    const { error: err } = await supabase.from("order_messages").insert({ order_id: activeOrder.id, sender_role: "admin", message: newMsg.trim() });
    if (err) toast.error(err.message);
    setNewMsg("");
    setSending(false);
  };

  const updateStatus = async (orderId: string, status: string) => {
    const { error: err } = await supabase.from("storefront_orders").update({ status }).eq("id", orderId);
    if (err) { toast.error(err.message); return; }
    toast.success(`Order ${status.toLowerCase()}.`);
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
  };

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const paginated = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statusColor: Record<string, string> = {
    Pending: "text-yellow-700 bg-yellow-50",
    Approved: "text-green-700 bg-green-50",
    Rejected: "text-red-700 bg-red-50",
  };

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
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Rider</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((order) => (
              <tr key={order.id} className="border-b border-[var(--line)] last:border-b-0">
                <td className="px-4 py-3 text-[var(--text)]">{order.id.slice(0, 8)}</td>
                <td className="px-4 py-3 text-[var(--text)]">{order.user_email || order.user_id.slice(0, 8)}</td>
                <td className="px-4 py-3 text-[var(--text)]">💵 COD</td>
                <td className="px-4 py-3 text-[var(--text)]">₱{order.total}</td>
                <td className="px-4 py-3 text-[var(--text-muted)]">{formatDate(order.created_at)}</td>
                <td className="px-4 py-3">
                  {order.rider_name ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">
                      🏍️ {order.rider_name}
                    </span>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)]">— Unassigned</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusColor[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {order.status === "Pending" && (
                      <>
                        <button onClick={() => updateStatus(order.id, "Approved")} className="rounded-md bg-green-600 px-3 py-1 text-xs font-bold text-white hover:bg-green-700">
                          Approve
                        </button>
                        <button onClick={() => updateStatus(order.id, "Rejected")} className="rounded-md bg-red-500 px-3 py-1 text-xs font-bold text-white hover:bg-red-600">
                          Reject
                        </button>
                      </>
                    )}
                    <button onClick={() => openMessages(order)} className="rounded-md border border-[var(--line)] px-3 py-1 text-xs font-bold text-[var(--text)] hover:bg-[var(--surface-soft)]">
                      💬 Chat
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-[var(--text-muted)]">No orders yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {/* MESSAGE MODAL */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl" style={{ maxHeight: "80vh" }}>
            <div className="flex items-center justify-between rounded-t-2xl border-b bg-[var(--surface-soft)] px-5 py-4">
              <div>
                <p className="font-bold text-[var(--text)]">💬 Order #{activeOrder.id.slice(0, 8)}</p>
                <p className="text-xs text-[var(--text-muted)]">{activeOrder.user_email}</p>
              </div>
              <button onClick={() => setActiveOrder(null)} className="text-[var(--text-muted)] hover:text-[var(--text)]">✕</button>
            </div>
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
              {messages.length === 0 && (
                <p className="text-center text-sm text-[var(--text-muted)]">No messages yet.</p>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_role === "admin" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${msg.sender_role === "admin" ? "bg-[var(--accent)] text-white" : "bg-[var(--surface-soft)] text-[var(--text)]"}`}>
                    <p className="mb-1">{msg.message}</p>
                    <p className="text-xs opacity-60">{new Date(msg.created_at).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
              <div ref={msgEndRef} />
            </div>
            <div className="flex gap-2 border-t p-3">
              <input
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") sendReply(); }}
                placeholder="Reply to customer..."
                className="flex-1 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
              />
              <button onClick={sendReply} disabled={sending || !newMsg.trim()} className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
