"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Product = { name: string; price: number; img: string; category: string; qty?: number };

const productsData: Product[] = [
  { name: "Milk", price: 50, img: "/products/milk.jpg", category: "Dairy" },
  { name: "Can Goods", price: 30, img: "/products/canned.jpg", category: "Canned Food" },
  { name: "Bath Soap", price: 25, img: "/products/bath-soap.jpg", category: "Personal Care" },
  { name: "Laundry Soap", price: 20, img: "/products/laundry-soap.jpg", category: "Personal Care" },
  { name: "Eggs", price: 10, img: "/products/eggs.jpg", category: "Fresh Produce" },
  { name: "Toothpaste", price: 35, img: "/products/toothpaste.jpg", category: "Personal Care" },
  { name: "Shampoo", price: 45, img: "/products/shampoo.jpg", category: "Personal Care" },
  { name: "Biscuits", price: 15, img: "/products/biscuits.jpg", category: "Snacks" },
  { name: "Salt", price: 10, img: "/products/salt.jpg", category: "Others" },
  { name: "Vinegar", price: 15, img: "/products/vinegar.webp", category: "Others" },
  { name: "Magic Sarap", price: 5, img: "/products/magic-sarap.webp", category: "Others" },
  { name: "Vetsin", price: 5, img: "/products/vetsin.jpg", category: "Others" },
];

const productRoutes: { [key: string]: string } = {
  "Milk": "/products/milk", "Can Goods": "/products/can-goods",
  "Bath Soap": "/products/bath-soap", "Laundry Soap": "/products/laundry-soap",
  "Eggs": "/products/eggs", "Toothpaste": "/products/toothpaste",
  "Shampoo": "/products/shampoo", "Biscuits": "/products/biscuits",
  "Salt": "/products/salt", "Vinegar": "/products/venigar",
  "Magic Sarap": "/products/magic-sarap", "Vetsin": "/products/vetsin",
};

const categories = ["All", ...Array.from(new Set(productsData.map((p) => p.category)))];

export default function Products() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const router = useRouter();

  const filtered = productsData.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "All" || p.category === activeCategory;
    return matchSearch && matchCategory;
  });

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
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button onClick={() => router.push("/orders")} style={styles.ordersBtn}>📦 My Orders</button>
          <button onClick={() => router.push("/login")} style={styles.loginBtn}>Login</button>
        </div>
      </nav>

      <div style={{ padding: "28px 36px" }}>
        {/* HEADER */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ margin: "0 0 4px", fontSize: "26px", fontWeight: 900, color: "#14532d" }}>🛍️ All Products</h2>
          <p style={{ margin: 0, color: "#4ade80", fontSize: "14px", fontWeight: 600 }}>Browse and shop our fresh selections</p>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="🔍  Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        {/* CATEGORY FILTERS */}
        <div style={styles.filters}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{ ...styles.filterBtn, ...(activeCategory === cat ? styles.filterBtnActive : {}) }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div style={styles.grid}>
          {filtered.map((p, i) => (
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
                <span style={styles.categoryBadge}>{p.category}</span>
              </div>
              <div style={styles.cardBody}>
                <h3 style={styles.cardName}>{p.name}</h3>
                <p style={styles.price}>₱{p.price}</p>
                <button onClick={() => router.push(productRoutes[p.name])} style={styles.viewBtn}>
                  View Product →
                </button>
              </div>
            </div>
          ))}
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
  ordersBtn: {
    padding: "8px 16px", background: "rgba(255,255,255,0.15)", color: "white",
    border: "1px solid rgba(255,255,255,0.4)", borderRadius: "20px", cursor: "pointer", fontWeight: 700, fontSize: "13px",
  },
  loginBtn: {
    padding: "8px 22px", background: "white", color: "#15803d",
    border: "none", borderRadius: "20px", cursor: "pointer", fontWeight: 800, fontSize: "14px",
  },
  search: {
    width: "100%", padding: "13px 22px", borderRadius: "30px",
    border: "2px solid #bbf7d0", fontSize: "15px", outline: "none",
    marginBottom: "16px", boxSizing: "border-box" as const,
    background: "white", color: "#0f172a",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  filters: { display: "flex", flexWrap: "wrap" as const, gap: "10px", marginBottom: "24px" },
  filterBtn: {
    padding: "8px 20px", borderRadius: "20px", border: "2px solid #bbf7d0",
    background: "white", color: "#15803d", cursor: "pointer", fontSize: "13px", fontWeight: 700,
  },
  filterBtnActive: { background: "#15803d", border: "2px solid #15803d", color: "white" },
  grid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" },
  card: {
    borderRadius: "16px", overflow: "hidden", background: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)", transition: "transform 0.25s, box-shadow 0.25s",
  },
  productImage: { width: "100%", height: "150px", objectFit: "cover" as const, display: "block" },
  categoryBadge: {
    position: "absolute" as const, top: "8px", left: "8px",
    background: "#15803d", color: "white", fontSize: "11px",
    fontWeight: 700, padding: "3px 10px", borderRadius: "12px",
  },
  cardBody: { padding: "14px", textAlign: "center" as const },
  cardName: { margin: "0 0 4px", fontSize: "16px", fontWeight: 800, color: "#0f172a" },
  price: { margin: "0 0 12px", color: "#15803d", fontWeight: 800, fontSize: "17px" },
  viewBtn: {
    display: "block", width: "100%", padding: "9px",
    background: "#15803d", color: "white",
    border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: 700, fontSize: "13px",
  },
};
