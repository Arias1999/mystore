"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

type Item = { name: string; price: number; img: string };
type CartItem = Item & { qty: number };

export default function ProductPage({ title, category, items }: { title: string; category: string; items: Item[] }) {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [qty, setQty] = useState<{ [key: number]: number }>({});
  const [added, setAdded] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    try { setCart(JSON.parse(localStorage.getItem("cart") || "[]")); } catch { }
  }, []);

  const saveCart = (updated: CartItem[]) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const addToCart = (item: Item, index: number) => {
    const quantity = qty[index] || 1;
    const existing = cart.findIndex((c) => c.name === item.name);
    const updated = [...cart];
    if (existing !== -1) {
      updated[existing].qty += quantity;
    } else {
      updated.push({ ...item, qty: quantity });
    }
    saveCart(updated);
    setAdded({ ...added, [index]: true });
    setTimeout(() => setAdded((a) => ({ ...a, [index]: false })), 1500);
    setCartOpen(true);
  };

  const removeItem = (index: number) => saveCart(cart.filter((_, i) => i !== index));
  const updateQty = (index: number, delta: number) => {
    const updated = [...cart];
    updated[index].qty = Math.max(1, updated[index].qty + delta);
    saveCart(updated);
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const placeOrder = () => {
    if (cart.length === 0) { alert("Please add items to cart first."); return; }
    const existing = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify([...existing, { id: Date.now(), items: cart, total, date: new Date().toLocaleString() }]));
    saveCart([]);
    setCartOpen(false);
    router.push("/orders");
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#f0fdf4" }}>

      <Navbar />

      <div style={{ padding: "28px 32px 100px" }}>
        <button onClick={() => router.push("/products")} style={styles.backBtn}>← Back to Products</button>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "12px 0 24px" }}>
          <h2 style={styles.heading}>{title}</h2>
          <span style={styles.categoryBadge}>{category}</span>
        </div>

        {/* PRODUCTS GRID */}
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
              <div style={{ position: "relative" }}>
                <img src={p.img} alt={p.name} style={styles.productImage} />
                <span style={styles.categoryBadge2}>{category}</span>
              </div>
              <div style={styles.cardBody}>
                <h3 style={styles.cardName}>{p.name}</h3>
                <p style={styles.price}>₱{p.price}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "12px" }}>
                  <button onClick={() => setQty({ ...qty, [i]: Math.max(1, (qty[i] || 1) - 1) })} style={styles.qtyBtn}>−</button>
                  <span style={{ fontWeight: 700, fontSize: "15px", minWidth: "28px", textAlign: "center" }}>{qty[i] || 1}</span>
                  <button onClick={() => setQty({ ...qty, [i]: (qty[i] || 1) + 1 })} style={styles.qtyBtn}>+</button>
                </div>
                <button onClick={() => addToCart(p, i)} style={{ ...styles.addBtn, background: added[i] ? "#16a34a" : "#15803d" }}>
                  {added[i] ? "✅ Added!" : "🛒 Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FLOATING CART BUTTON */}
      <button onClick={() => setCartOpen(true)} style={styles.floatingCart}>
        🛒
        {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
      </button>

      {/* CART DRAWER OVERLAY */}
      {cartOpen && (
        <div style={styles.overlay} onClick={() => setCartOpen(false)} />
      )}

      {/* CART DRAWER */}
      <div style={{ ...styles.drawer, right: cartOpen ? 0 : "-420px" }}>
        <div style={styles.drawerHeader}>
          <span style={{ fontWeight: 900, fontSize: "18px" }}>🛒 My Cart ({cartCount})</span>
          <button onClick={() => setCartOpen(false)} style={styles.closeBtn}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
              <div style={{ fontSize: "52px", marginBottom: "12px" }}>🛍️</div>
              <p style={{ margin: 0, fontWeight: 700 }}>Your cart is empty</p>
              <p style={{ margin: "8px 0 0", fontSize: "13px" }}>Add products to get started</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={index} style={styles.cartItem}>
                <img src={item.img} alt={item.name} style={styles.cartImg} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "14px", color: "#0f172a" }}>{item.name}</p>
                  <p style={{ margin: "0 0 8px", color: "#15803d", fontWeight: 800, fontSize: "15px" }}>₱{item.price}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button onClick={() => updateQty(index, -1)} style={styles.qtyBtn}>−</button>
                    <span style={{ fontWeight: 700, minWidth: "24px", textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => updateQty(index, 1)} style={styles.qtyBtn}>+</button>
                    <span style={{ marginLeft: "auto", fontWeight: 800, color: "#15803d" }}>₱{item.price * item.qty}</span>
                  </div>
                </div>
                <button onClick={() => removeItem(index)} style={styles.removeBtn}>🗑️</button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div style={styles.drawerFooter}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px" }}>
              <span style={{ fontWeight: 700, color: "#374151", fontSize: "15px" }}>Total</span>
              <span style={{ fontWeight: 900, fontSize: "22px", color: "#15803d" }}>₱{total}</span>
            </div>
            <button onClick={() => { setCartOpen(false); router.push("/products"); }} style={styles.continueBtn}>
              ← Continue Shopping
            </button>
            <button onClick={placeOrder} style={styles.orderBtn}>
              ✅ Place Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 36px", background: "#15803d",
    position: "sticky" as const, top: 0, zIndex: 100,
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
  categoryBadge2: {
    position: "absolute" as const, top: "8px", left: "8px",
    background: "#15803d", color: "white", fontSize: "11px",
    fontWeight: 700, padding: "3px 10px", borderRadius: "12px",
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" },
  card: {
    borderRadius: "16px", overflow: "hidden", background: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)", transition: "transform 0.25s, box-shadow 0.25s",
  },
  productImage: { width: "100%", height: "160px", objectFit: "cover" as const, display: "block" },
  cardBody: { padding: "14px", textAlign: "center" as const },
  cardName: { margin: "0 0 4px", fontSize: "15px", fontWeight: 800, color: "#0f172a" },
  price: { margin: "0 0 10px", color: "#15803d", fontWeight: 800, fontSize: "18px" },
  qtyBtn: {
    width: "30px", height: "30px", borderRadius: "8px", border: "1.5px solid #bbf7d0",
    background: "#f0fdf4", color: "#15803d", cursor: "pointer", fontWeight: 900, fontSize: "16px",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  addBtn: {
    display: "block", width: "100%", padding: "10px",
    color: "white", border: "none", borderRadius: "10px",
    cursor: "pointer", fontWeight: 700, fontSize: "13px", transition: "background 0.3s",
  },
  floatingCart: {
    position: "fixed" as const, bottom: "30px", right: "30px",
    width: "60px", height: "60px", borderRadius: "50%",
    background: "#15803d", color: "white", border: "none",
    fontSize: "24px", cursor: "pointer", zIndex: 200,
    boxShadow: "0 6px 20px rgba(21,128,61,0.4)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  cartBadge: {
    position: "absolute" as const, top: "-4px", right: "-4px",
    background: "#ef4444", color: "white", borderRadius: "50%",
    width: "22px", height: "22px", fontSize: "12px", fontWeight: 900,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  overlay: {
    position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.4)",
    zIndex: 300, backdropFilter: "blur(2px)",
  },
  drawer: {
    position: "fixed" as const, top: 0, bottom: 0, width: "400px",
    background: "white", zIndex: 400, display: "flex", flexDirection: "column" as const,
    boxShadow: "-8px 0 32px rgba(0,0,0,0.15)", transition: "right 0.35s cubic-bezier(0.4,0,0.2,1)",
  },
  drawerHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "20px 20px 16px", borderBottom: "2px solid #f0fdf4",
    background: "#f0fdf4",
  },
  closeBtn: {
    background: "white", border: "1px solid #dcfce7", borderRadius: "8px",
    padding: "6px 10px", cursor: "pointer", fontWeight: 700, color: "#374151",
  },
  cartItem: {
    display: "flex", gap: "12px", alignItems: "flex-start",
    padding: "14px", marginBottom: "10px", background: "#f9fafb",
    borderRadius: "12px", border: "1px solid #f0fdf4",
  },
  cartImg: { width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover" as const },
  removeBtn: {
    background: "none", border: "none", cursor: "pointer", fontSize: "18px", padding: "4px",
  },
  drawerFooter: {
    padding: "16px 20px", borderTop: "2px solid #f0fdf4", background: "white",
  },
  continueBtn: {
    width: "100%", padding: "11px", marginBottom: "10px",
    background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0",
    borderRadius: "12px", cursor: "pointer", fontWeight: 700, fontSize: "14px",
  },
  orderBtn: {
    width: "100%", padding: "13px", background: "#15803d",
    color: "white", border: "none", borderRadius: "12px",
    cursor: "pointer", fontWeight: 800, fontSize: "15px",
    boxShadow: "0 4px 12px rgba(21,128,61,0.3)",
  },
};
