"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

type OrderItem = { name: string; price: number; qty: number };
type Order = { id: number; items: OrderItem[]; total: number; date: string };

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try { setOrders(JSON.parse(localStorage.getItem("orders") || "[]")); } catch { setOrders([]); }
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f0fdf4", fontFamily: "'Segoe UI', sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: "720px", margin: "40px auto", padding: "0 20px" }}>

        <button onClick={() => router.push("/products")} style={styles.backBtn}>← Back to Products</button>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "16px 0 28px" }}>
          <h2 style={{ margin: 0, fontSize: "28px", fontWeight: 900, color: "#14532d" }}>📦 My Orders</h2>
          <span style={styles.countBadge}>{orders.length} order{orders.length !== 1 ? "s" : ""}</span>
        </div>

        {orders.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: "56px", marginBottom: "12px" }}>📭</div>
            <h3 style={{ margin: "0 0 6px", color: "#14532d", fontWeight: 800 }}>No orders yet</h3>
            <p style={{ margin: "0 0 20px", color: "#4ade80", fontSize: "14px" }}>Start shopping to see your orders here!</p>
            <button onClick={() => router.push("/products")} style={styles.shopBtn}>Browse Products →</button>
          </div>
        ) : (
          [...orders].reverse().map((order, idx) => (
            <div key={order.id} style={styles.orderCard}>
              {/* ORDER HEADER */}
              <div style={styles.orderHeader}>
                <div>
                  <span style={styles.orderNum}>Order #{idx + 1}</span>
                  <span style={styles.orderStatus}>✅ Completed</span>
                </div>
                <span style={styles.orderDate}>{order.date}</span>
              </div>

              {/* ORDER ITEMS */}
              <div style={{ padding: "0 20px" }}>
                {order.items.map((item, i) => (
                  <div key={i} style={styles.itemRow}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={styles.itemDot} />
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>{item.name}</span>
                      <span style={styles.qtyBadge}>x{item.qty}</span>
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#15803d" }}>₱{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              {/* ORDER FOOTER */}
              <div style={styles.orderFooter}>
                <span style={{ color: "#64748b", fontSize: "14px" }}>{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#64748b", fontSize: "14px" }}>Total:</span>
                  <span style={{ fontWeight: 900, fontSize: "20px", color: "#15803d" }}>₱{order.total}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  backBtn: {
    background: "transparent", border: "none", color: "#15803d",
    cursor: "pointer", fontSize: "14px", fontWeight: 700, padding: 0,
  },
  countBadge: {
    background: "#dcfce7", color: "#15803d", fontSize: "13px",
    fontWeight: 700, padding: "4px 14px", borderRadius: "20px", border: "1px solid #bbf7d0",
  },
  emptyState: {
    background: "white", borderRadius: "20px", padding: "50px 20px",
    textAlign: "center" as const, boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    border: "2px dashed #bbf7d0",
  },
  shopBtn: {
    padding: "12px 28px", background: "#15803d", color: "white",
    border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: 800, fontSize: "15px",
  },
  orderCard: {
    background: "white", borderRadius: "18px", marginBottom: "20px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.07)", overflow: "hidden",
    border: "1px solid #dcfce7",
  },
  orderHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px 20px", background: "#f0fdf4", borderBottom: "1px solid #dcfce7",
  },
  orderNum: { fontWeight: 900, color: "#14532d", fontSize: "16px", marginRight: "10px" },
  orderStatus: {
    background: "#dcfce7", color: "#15803d", fontSize: "12px",
    fontWeight: 700, padding: "3px 10px", borderRadius: "12px",
  },
  orderDate: { fontSize: "12px", color: "#94a3b8", fontWeight: 600 },
  itemRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 0", borderBottom: "1px solid #f0fdf4",
  },
  itemDot: {
    width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80", flexShrink: 0,
  },
  qtyBadge: {
    background: "#f0fdf4", color: "#15803d", fontSize: "11px",
    fontWeight: 700, padding: "2px 8px", borderRadius: "8px",
  },
  orderFooter: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 20px", background: "#f8fafc", borderTop: "1px solid #dcfce7",
  },
};
