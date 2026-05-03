"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { createClient } from "@/lib/supabase/client";
import { Package, MessageCircle, ChevronLeft, X, Send } from "lucide-react";

type OrderItem = { name: string; price: number; qty: number; img?: string };
type Order = { id: string; items: OrderItem[]; total: number; payment: string; status: string; created_at: string };
type Message = { id: string; sender_role: string; message: string; created_at: string };
type UserInfo = { name: string; email: string; phone: string };

const statusStyle: Record<string, { background: string; color: string; label: string }> = {
  Pending:    { background: "#fefce8", color: "#854d0e", label: "Pending" },
  Approved:   { background: "#f0fdf4", color: "#15803d", label: "Approved" },
  "On the Way": { background: "#eff6ff", color: "#1d4ed8", label: "On the Way" },
  Rejected:   { background: "#fef2f2", color: "#b91c1c", label: "Rejected" },
};

export default function OrdersPage() {
  const router = useRouter();
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const msgEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchOrders();
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserInfo({
        name: user.user_metadata?.name || "",
        email: user.email || "",
        phone: user.user_metadata?.phone || "",
      });
    }
  };

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("storefront_orders")
      .select("*")
      .order("created_at", { ascending: false });
    setOrders(data ?? []);
    setLoading(false);
  };

  const openMessages = async (orderId: string) => {
    setActiveOrder(orderId);
    const { data } = await supabase
      .from("order_messages")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });
    const existing = data ?? [];
    setMessages(existing);

    // Auto-send user info if no messages yet
    if (existing.length === 0 && userInfo) {
      const autoMsg = `Name: ${userInfo.name}\nEmail: ${userInfo.email}${userInfo.phone ? `\nPhone: ${userInfo.phone}` : ""}`;
      await supabase.from("order_messages").insert({
        order_id: orderId,
        sender_role: "user",
        message: autoMsg,
      });
      const { data: refreshed } = await supabase
        .from("order_messages")
        .select("*")
        .eq("order_id", orderId)
        .order("created_at", { ascending: true });
      setMessages(refreshed ?? []);
    }

    setNewMsg("");

    supabase.channel(`messages-${orderId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "order_messages", filter: `order_id=eq.${orderId}` },
        (payload) => setMessages((prev) => [...prev, payload.new as Message])
      ).subscribe();
  };

  const sendMessage = async () => {
    if (!newMsg.trim() || !activeOrder) return;
    setSending(true);
    await supabase.from("order_messages").insert({ order_id: activeOrder, sender_role: "user", message: newMsg.trim() });
    setNewMsg("");
    setSending(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0fdf4", fontFamily: "'Segoe UI', sans-serif", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ flex: 1, maxWidth: "720px", margin: "40px auto", padding: "0 20px", width: "100%" }}>
        <button onClick={() => router.push("/products")} style={styles.backBtn}><ChevronLeft size={16} style={{ display: "inline", verticalAlign: "middle" }} />Back to Products</button>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "16px 0 28px" }}>
          <h2 style={{ margin: 0, fontSize: "28px", fontWeight: 900, color: "#14532d", display: "flex", alignItems: "center", gap: 10 }}><Package size={26} />My Orders</h2>
          <span style={styles.countBadge}>{orders.length} order{orders.length !== 1 ? "s" : ""}</span>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: "56px", marginBottom: "12px" }}>📭</div>
            <h3 style={{ margin: "0 0 6px", color: "#14532d", fontWeight: 800 }}>No orders yet</h3>
            <p style={{ margin: "0 0 20px", color: "#4ade80", fontSize: "14px" }}>Start shopping to see your orders here!</p>
            <button onClick={() => router.push("/products")} style={styles.shopBtn}>Browse Products →</button>
          </div>
        ) : (
          orders.map((order, idx) => {
            const s = statusStyle[order.status] ?? statusStyle.Pending;
            return (
              <div key={order.id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <span style={styles.orderNum}>Order #{orders.length - idx}</span>
                    <span style={{ ...styles.badge, background: s.background, color: s.color }}>{s.label}</span>
                    <span style={{ ...styles.badge, background: "#fefce8", color: "#854d0e" }}>
                      💵 COD
                    </span>
                  </div>
                  <span style={styles.orderDate}>{new Date(order.created_at).toLocaleString()}</span>
                </div>

                <div style={{ padding: "0 20px" }}>
                  {order.items.map((item, i) => (
                    <div key={i} style={styles.itemRow}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {item.img ? (
                          <img src={item.img} alt={item.name} style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover" }} />
                        ) : (
                          <div style={styles.itemDot} />
                        )}
                        <span style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>{item.name}</span>
                        <span style={styles.qtyBadge}>x{item.qty}</span>
                      </div>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "#15803d" }}>₱{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>

                <div style={styles.orderFooter}>
                  <button onClick={() => openMessages(order.id)} style={styles.msgBtn}><MessageCircle size={14} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />Message Admin</button>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "#64748b", fontSize: "14px" }}>Total:</span>
                    <span style={{ fontWeight: 900, fontSize: "20px", color: "#15803d" }}>₱{order.total}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ background: "#14532d", color: "white", textAlign: "center", padding: "20px", marginTop: "40px" }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: "15px" }}>LYRA'S STORE</p>
        <p style={{ margin: "4px 0 0", fontSize: "13px", opacity: 0.75 }}>© 2026 All Rights Reserved · Developed by Jilly Arias</p>
      </footer>

      {/* MESSAGE MODAL */}
      {activeOrder && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "white", borderRadius: "20px", width: "100%", maxWidth: "460px", display: "flex", flexDirection: "column", maxHeight: "80vh", boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid #f0fdf4", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f0fdf4", borderRadius: "20px 20px 0 0" }}>
              <div>
                <span style={{ fontWeight: 900, color: "#14532d", fontSize: "16px", display: "flex", alignItems: "center", gap: 6 }}><MessageCircle size={16} />Message Admin</span>
                {userInfo && (
                  <div style={{ marginTop: "6px", display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontSize: "12px", color: "#374151", fontWeight: 700 }}>👤 {userInfo.name}</span>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>✉️ {userInfo.email}</span>
                    {userInfo.phone && <span style={{ fontSize: "12px", color: "#64748b" }}>📞 {userInfo.phone}</span>}
                  </div>
                )}
              </div>
              <button onClick={() => setActiveOrder(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center" }}><X size={18} /></button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {messages.length === 0 && (
                <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "13px", margin: "20px 0" }}>No messages yet. Send a message to the admin.</p>
              )}
              {messages.map((msg) => (
                <div key={msg.id} style={{ display: "flex", justifyContent: msg.sender_role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "75%", padding: "10px 14px", borderRadius: msg.sender_role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: msg.sender_role === "user" ? "#15803d" : "#f0fdf4",
                    color: msg.sender_role === "user" ? "white" : "#0f172a",
                    fontSize: "14px", fontWeight: 500,
                  }}>
                    <p style={{ margin: "0 0 4px" }}>{msg.message}</p>
                    <p style={{ margin: 0, fontSize: "11px", opacity: 0.7 }}>{new Date(msg.created_at).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
              <div ref={msgEndRef} />
            </div>
            <div style={{ padding: "14px 16px", borderTop: "1px solid #f0fdf4", display: "flex", gap: "10px" }}>
              <textarea
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && e.ctrlKey) sendMessage(); }}
                placeholder="Type a message..."
                rows={3}
                style={{ flex: 1, padding: "10px 14px", borderRadius: "12px", border: "1.5px solid #bbf7d0", fontSize: "14px", outline: "none", resize: "none" }}
              />
              <button onClick={sendMessage} disabled={sending || !newMsg.trim()} style={{ padding: "10px 18px", background: "#15803d", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: 700, fontSize: "14px", opacity: sending ? 0.7 : 1, display: "flex", alignItems: "center", gap: 6 }}>
                <Send size={14} />Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  backBtn: { background: "transparent", border: "none", color: "#15803d", cursor: "pointer", fontSize: "14px", fontWeight: 700, padding: 0 },
  countBadge: { background: "#dcfce7", color: "#15803d", fontSize: "13px", fontWeight: 700, padding: "4px 14px", borderRadius: "20px", border: "1px solid #bbf7d0" },
  emptyState: { background: "white", borderRadius: "20px", padding: "50px 20px", textAlign: "center" as const, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "2px dashed #bbf7d0" },
  shopBtn: { padding: "12px 28px", background: "#15803d", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: 800, fontSize: "15px" },
  orderCard: { background: "white", borderRadius: "18px", marginBottom: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.07)", overflow: "hidden", border: "1px solid #dcfce7" },
  orderHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "#f0fdf4", borderBottom: "1px solid #dcfce7", flexWrap: "wrap" as const, gap: "8px" },
  orderNum: { fontWeight: 900, color: "#14532d", fontSize: "16px" },
  badge: { fontSize: "12px", fontWeight: 700, padding: "3px 10px", borderRadius: "12px" },
  orderDate: { fontSize: "12px", color: "#94a3b8", fontWeight: 600 },
  itemRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0fdf4" },
  itemDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80", flexShrink: 0 },
  qtyBadge: { background: "#f0fdf4", color: "#15803d", fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "8px" },
  orderFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", background: "#f8fafc", borderTop: "1px solid #dcfce7" },
  msgBtn: { padding: "8px 16px", background: "#f0fdf4", color: "#15803d", border: "1.5px solid #bbf7d0", borderRadius: "10px", cursor: "pointer", fontWeight: 700, fontSize: "13px" },
};
