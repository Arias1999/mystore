"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Item = { name: string; price: number; img: string };

export default function ProductPage({
  title, category, items,
}: {
  title: string; category: string; items: Item[];
}) {
  const router = useRouter();
  const [cart, setCart] = useState<(Item & { qty: number })[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("cart") || "[]"); } catch { return []; }
  });
  const [qty, setQty] = useState<{ [key: number]: number }>({});

  const saveCart = (updated: (Item & { qty: number })[]) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const addToCart = (item: Item, index: number) => {
    const quantity = qty[index] || 1;
    const existing = cart.findIndex((c) => c.name === item.name);
    if (existing !== -1) {
      const updated = [...cart];
      updated[existing].qty += quantity;
      saveCart(updated);
    } else {
      saveCart([...cart, { ...item, qty: quantity }]);
    }
  };

  const removeItem = (index: number) => saveCart(cart.filter((_, i) => i !== index));
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const placeOrder = () => {
    if (cart.length === 0) { alert("Cart is empty!"); return; }
    const existing = JSON.parse(localStorage.getItem("orders") || "[]");
    const newOrder = { id: Date.now(), items: cart, total, date: new Date().toLocaleString() };
    localStorage.setItem("orders", JSON.stringify([...existing, newOrder]));
    saveCart([]);
    router.push("/orders");
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#f0fdf4" }}>

      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <span style={styles.logo}>🛒 LYRA'S STORE</span>
        <div style={{ display: "flex", gap: "4px" }}>
          <button onClick={() => router.push("/")} style={styles.navBtn}>Home</button>
          <button onClick={() => router.push("/about")} style={styles.navBtn}>About</button>
          <button onClick={() => router.push("/contact")} style={styles.navBtn}>Contact</button>
        </div>
        <button onClick={() => router.push("/login")} style={styles.loginBtn}>Login</button>
      </nav>

      <div style={{ display: "flex" }}>

        {/* PRODUCTS */}
        <div style={{ flex: 1, padding: "28px 32px" }}>
          <button onClick={() => router.push("/products")} style={styles.backBtn}>← Back to Products</button>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "12px 0 20px" }}>
            <h2 style={styles.heading}>{title}</h2>
            <span style={styles.categoryBadge}>{category}</span>
          </div>

          <div style={styles.grid}>
            {items.map((p, i) => (
              <div key={i} style={styles.card}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 28px rgba(22,163,74,0.18)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                }}
              >
                <img src={p.img} alt={p.name} style={styles.productImage} />
                <div style={styles.cardBody}>
                  <h3 style={styles.cardName}>{p.name}</h3>
                  <p style={styles.price}>₱{p.price}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "10px" }}>
                    <button onClick={() => setQty({ ...qty, [i]: Math.max(1, (qty[i] || 1) - 1) })} style={styles.qtyBtn}>−</button>
                    <span style={{ fontWeight: 700, fontSize: "15px", minWidth: "24px", textAlign: "center" }}>{qty[i] || 1}</span>
                    <button onClick={() => setQty({ ...qty, [i]: (qty[i] || 1) + 1 })} style={styles.qtyBtn}>+</button>
                  </div>
                  <button onClick={() => addToCart(p, i)} style={styles.addBtn}>🛒 Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CART SIDEBAR */}
        <div style={styles.cart}>
          <h2 style={{ marginTop: 0, color: "#14532d", fontSize: "20px", fontWeight: 900 }}>🛒 Your Cart</h2>
          {cart.length === 0 && (
            <div style={{ textAlign: "center", padding: "30px 0", color: "#86efac" }}>
              <div style={{ fontSize: "40px", marginBottom: "8px" }}>🛍️</div>
              <p style={{ margin: 0, fontSize: "14px" }}>Your cart is empty</p>
            </div>
          )}
          {cart.map((item, index) => (
            <div key={index} style={styles.cartItem}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>{item.name}</p>
                <p style={{ margin: 0, fontSize: "12px", color: "#15803d", fontWeight: 600 }}>x{item.qty} — ₱{item.price * item.qty}</p>
              </div>
              <button onClick={() => removeItem(index)} style={styles.removeBtn}>✕</button>
            </div>
          ))}
          {cart.length > 0 && (
            <>
              <div style={{ borderTop: "2px dashed #bbf7d0", margin: "12px 0", paddingTop: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: "#374151" }}>Total</span>
                  <span style={{ fontWeight: 900, fontSize: "20px", color: "#15803d" }}>₱{total}</span>
                </div>
              </div>
              <button onClick={placeOrder} style={styles.orderBtn}>✅ Place Order</button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

const styles = {
  navbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 36px", background: "#15803d",
    position: "sticky" as const, top: 0, zIndex: 10,
    boxShadow: "0 2px 12px rgba(21,128,61,0.3)",
  },
  logo: { color: "white", fontSize: "20px", fontWeight: 900 },
  navBtn: {
    background: "transparent", border: "none", color: "rgba(255,255,255,0.9)",
    cursor: "pointer", fontSize: "14px", fontWeight: 600, padding: "7px 14px", borderRadius: "8px",
  },
  loginBtn: {
    padding: "8px 22px", background: "white", color: "#15803d",
    border: "none", borderRadius: "20px", cursor: "pointer", fontWeight: 800, fontSize: "14px",
  },
  backBtn: {
    background: "transparent", border: "none", color: "#15803d",
    cursor: "pointer", fontSize: "14px", fontWeight: 700, padding: 0,
  },
  heading: { fontSize: "26px", fontWeight: 900, color: "#14532d", margin: 0 },
  categoryBadge: {
    background: "#dcfce7", color: "#15803d", fontSize: "12px",
    fontWeight: 700, padding: "4px 14px", borderRadius: "20px", border: "1px solid #bbf7d0",
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" },
  card: {
    borderRadius: "16px", overflow: "hidden", background: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)", transition: "transform 0.25s, box-shadow 0.25s",
  },
  productImage: { width: "100%", height: "150px", objectFit: "cover" as const, display: "block" },
  cardBody: { padding: "14px", textAlign: "center" as const },
  cardName: { margin: "0 0 4px", fontSize: "16px", fontWeight: 800, color: "#0f172a" },
  price: { margin: "0 0 10px", color: "#15803d", fontWeight: 800, fontSize: "17px" },
  qtyBtn: {
    width: "28px", height: "28px", borderRadius: "8px", border: "1.5px solid #bbf7d0",
    background: "#f0fdf4", color: "#15803d", cursor: "pointer", fontWeight: 900, fontSize: "16px",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  addBtn: {
    display: "block", width: "100%", padding: "9px",
    background: "#15803d", color: "white",
    border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: 700, fontSize: "13px",
  },
  cart: {
    width: "290px", padding: "24px", background: "white",
    borderLeft: "2px solid #dcfce7", minHeight: "100vh",
    boxShadow: "-4px 0 20px rgba(0,0,0,0.04)",
  },
  cartItem: {
    display: "flex", alignItems: "center", gap: "8px",
    marginBottom: "10px", padding: "10px 12px", background: "#f0fdf4",
    borderRadius: "10px", border: "1px solid #dcfce7",
  },
  removeBtn: {
    background: "#fee2e2", color: "#ef4444", border: "none",
    borderRadius: "6px", padding: "4px 8px", cursor: "pointer", fontWeight: 700, fontSize: "12px",
  },
  orderBtn: {
    width: "100%", padding: "13px", background: "#15803d",
    color: "white", border: "none", borderRadius: "12px",
    cursor: "pointer", fontWeight: 800, fontSize: "15px", marginTop: "4px",
    boxShadow: "0 4px 12px rgba(21,128,61,0.3)",
  },
};
