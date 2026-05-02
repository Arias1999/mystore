"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<{ name: string; price: number; img: string; qty: number }[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });
    loadCart();
    window.addEventListener("storage", loadCart);
    return () => { window.removeEventListener("storage", loadCart); };
  }, []);

  const loadCart = () => {
    try {
      const c = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(c);
      setCartCount(c.reduce((sum: number, i: { qty: number }) => sum + i.qty, 0));
    } catch { }
  };

  const saveCart = (updated: typeof cart) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    setCartCount(updated.reduce((sum, i) => sum + i.qty, 0));
  };

  const updateQty = (index: number, delta: number) => {
    const updated = [...cart];
    updated[index].qty = Math.max(1, updated[index].qty + delta);
    saveCart(updated);
  };

  const removeItem = (index: number) => {
    const updated = cart.filter((_, i) => i !== index);
    saveCart(updated);
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const placeOrder = () => {
    if (cart.length === 0) { alert("Please add items to cart first."); return; }
    const existing = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify([...existing, { id: Date.now(), items: cart, total, date: new Date().toLocaleString() }]));
    saveCart([]);
    setCartOpen(false);
    router.push("/orders");
  };

  return (
    <>
      <nav style={styles.navbar}>
        <span style={styles.logo}>🛒 LYRA'S STORE</span>
        <div style={{ display: "flex", gap: "4px" }}>
          <button onClick={() => router.push("/")} style={styles.navBtn}>Home</button>
          <button onClick={() => router.push("/about")} style={styles.navBtn}>About</button>
          <button onClick={() => router.push("/contact")} style={styles.navBtn}>Contact</button>
          {user && <button onClick={() => router.push("/orders")} style={styles.navBtn}>My Orders</button>}
        </div>
        <form onSubmit={(e) => { 
          e.preventDefault(); 
          if (!search.trim()) return;
          if (user) {
            router.push(`/products?search=${encodeURIComponent(search)}`);
          } else {
            router.push("/login");
          }
        }} style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </form>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={() => setCartOpen(true)} style={styles.cartBtn}>
            🛒 Cart
            {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
          </button>
          {user ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={(e) => { e.stopPropagation(); setProfileOpen((open) => !open); }}
                style={styles.profileBtn}
                aria-label="Profile"
                title="Profile"
              >
                {"\u{1F464}"}
              </button>
              {profileOpen && (
                <>
                  <div style={styles.profileMenu}>
                    <div style={styles.profileMenuHeader}>My Account</div>
                    <div style={styles.profileInfo}>
                      <div style={styles.profileInfoLabel}>Name</div>
                      <div>{user.user_metadata?.name || "Guest"}</div>
                    </div>
                    <div style={styles.profileInfo}>
                      <div style={styles.profileInfoLabel}>Email</div>
                      <div>{user.email}</div>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        const supabase = createClient();
                        await supabase.auth.signOut();
                        setUser(null);
                        setProfileOpen(false);
                        router.replace("/");
                      }}
                      style={styles.profileLogoutBtn}
                    >
                      Log out
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        router.push("/profile");
                      }}
                      style={styles.profileViewBtn}
                    >
                      View Profile
                    </button>
                  </div>
                  <div style={styles.profileOverlay} onClick={() => setProfileOpen(false)} />
                </>
              )}
            </div>
          ) : (
            <>
              <button onClick={() => router.push("/login")} style={styles.loginBtn}>Login</button>
              <button onClick={() => router.push("/register")} style={styles.registerBtn}>Register</button>
            </>
          )}
        </div>
      </nav>

      {/* OVERLAY */}
      {cartOpen && <div style={styles.overlay} onClick={() => setCartOpen(false)} />}

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
                <button onClick={() => removeItem(index)} style={styles.removeBtn}>🗑️ Remove</button>
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
            <button onClick={placeOrder} style={styles.orderBtn}>✅ Place Order</button>
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  navbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 36px", background: "#15803d",
    position: "sticky" as const, top: 0, zIndex: 100,
    boxShadow: "0 2px 12px rgba(21,128,61,0.3)",
  },
  logo: { color: "white", fontSize: "20px", fontWeight: 900, letterSpacing: "0.5px" },
  searchInput: {
    padding: "8px 18px", borderRadius: "20px", border: "none",
    fontSize: "14px", outline: "none", width: "220px",
    background: "rgba(255,255,255,0.2)", color: "white",
    "::placeholder": { color: "rgba(255,255,255,0.7)" },
  },
  navBtn: {
    background: "transparent", border: "none", color: "rgba(255,255,255,0.9)",
    cursor: "pointer", fontSize: "14px", fontWeight: 600, padding: "7px 14px", borderRadius: "8px",
  },
  cartBtn: {
    position: "relative" as const, padding: "8px 18px",
    background: "rgba(255,255,255,0.15)", color: "white",
    border: "1px solid rgba(255,255,255,0.4)", borderRadius: "20px",
    cursor: "pointer", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", gap: "6px",
  },
  cartBadge: {
    background: "#ef4444", color: "white", borderRadius: "50%",
    width: "20px", height: "20px", fontSize: "11px", fontWeight: 900,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  loginBtn: {
    padding: "8px 22px", background: "white", color: "#15803d",
    border: "none", borderRadius: "20px", cursor: "pointer", fontWeight: 800, fontSize: "14px",
  },
  registerBtn: {
    padding: "8px 18px", background: "#dcfce7", color: "#166534",
    border: "none", borderRadius: "20px", cursor: "pointer", fontWeight: 800, fontSize: "14px",
  },
  profileBtn: {
    width: "38px", height: "38px", background: "#dcfce7", color: "#15803d",
    border: "none", borderRadius: "9999px", cursor: "pointer", fontWeight: 800, fontSize: "18px",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  profileMenu: {
    position: "absolute" as const,
    top: "46px",
    right: 0,
    width: "280px",
    background: "white",
    border: "1px solid #d1fae5",
    borderRadius: "16px",
    boxShadow: "0 20px 50px rgba(15,23,42,0.18)",
    zIndex: 250,
    padding: "14px",
  },
  profileMenuHeader: {
    color: "#065f46",
    fontWeight: 800,
    marginBottom: "10px",
    fontSize: "14px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },
  profileInfo: {
    padding: "10px 12px",
    borderRadius: "12px",
    background: "#ecfdf5",
    marginBottom: "10px",
    display: "grid",
    gap: "4px",
    fontSize: "13px",
    color: "#065f46",
  },
  profileInfoLabel: {
    fontWeight: 700,
    fontSize: "12px",
    color: "#134e4a",
  },
  profileLogoutBtn: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "none",
    background: "#dc2626",
    color: "white",
    fontWeight: 800,
    cursor: "pointer",
    marginBottom: "8px",
  },
  profileViewBtn: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #d1fae5",
    background: "white",
    color: "#065f46",
    fontWeight: 700,
    cursor: "pointer",
  },
  profileOverlay: {
    position: "fixed" as const,
    inset: 0,
    zIndex: 240,
    background: "transparent",
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
    padding: "20px 20px 16px", borderBottom: "2px solid #f0fdf4", background: "#f0fdf4",
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
    background: "#fee2e2", border: "none", cursor: "pointer",
    color: "#dc2626", fontWeight: 700, fontSize: "12px",
    padding: "6px 10px", borderRadius: "8px", whiteSpace: "nowrap" as const,
  },
  qtyBtn: {
    width: "30px", height: "30px", borderRadius: "8px", border: "1.5px solid #bbf7d0",
    background: "#f0fdf4", color: "#15803d", cursor: "pointer", fontWeight: 900, fontSize: "16px",
    display: "flex", alignItems: "center", justifyContent: "center",
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
