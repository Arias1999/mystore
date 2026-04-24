"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const products = [
  { name: "Milk", img: "/products/milk.jpg", category: "Dairy" },
  { name: "Can Goods", img: "/products/canned.jpg", category: "Canned Food" },
  { name: "Bath Soap", img: "/products/bath-soap.jpg", category: "Personal Care" },
  { name: "Laundry Soap", img: "/products/laundry-soap.jpg", category: "Personal Care" },
  { name: "Eggs", img: "/products/eggs.jpg", category: "Fresh Produce" },
  { name: "Toothpaste", img: "/products/toothpaste.jpg", category: "Personal Care" },
  { name: "Shampoo", img: "/products/shampoo.jpg", category: "Personal Care" },
  { name: "Biscuits", img: "/products/biscuits.jpg", category: "Snacks" },
  { name: "Salt", img: "/products/salt.jpg", category: "Others" },
  { name: "Vinegar", img: "/products/vinegar.webp", category: "Others" },
  { name: "Magic Sarap", img: "/products/magic-sarap.webp", category: "Others" },
  { name: "Vetsin", img: "/products/vetsin.jpg", category: "Others" },
];

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "All" || p.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#f0fdf4", display: "flex", flexDirection: "column" }}>

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

      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.heroBadge}>🌿 Fresh & Affordable</div>
        <h1 style={styles.heroTitle}>Your Neighborhood Store,<br />Now Online!</h1>
        <p style={styles.heroSub}>Quality products delivered to your doorstep.</p>
        <input
          type="text"
          placeholder="🔍  Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />
      </div>

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

      {/* PRODUCTS */}
      <div style={styles.grid}>
        {filtered.map((p, i) => (
          <div
            key={i}
            style={styles.card}
            onClick={() => router.push("/login")}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 32px rgba(22,163,74,0.18)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 14px rgba(0,0,0,0.08)";
            }}
          >
            <div style={{ position: "relative" }}>
              <img src={p.img} alt={p.name} style={styles.productImage} />
              <span style={styles.categoryBadge}>{p.category}</span>
            </div>
            <p style={styles.cardName}>{p.name}</p>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: "15px" }}>🛒 LYRA'S STORE</p>
        <p style={{ margin: "4px 0 0", fontSize: "13px", opacity: 0.75 }}>© 2026 All Rights Reserved · Developed by Jilly Arias</p>
      </footer>
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
  logo: { color: "white", fontSize: "20px", fontWeight: 900, letterSpacing: "0.5px" },
  navBtn: {
    background: "transparent", border: "none", color: "rgba(255,255,255,0.9)",
    cursor: "pointer", fontSize: "14px", fontWeight: 600, padding: "7px 14px", borderRadius: "8px",
  },
  loginBtn: {
    padding: "8px 22px", background: "white", color: "#15803d",
    border: "none", borderRadius: "20px", cursor: "pointer", fontWeight: 800, fontSize: "14px",
  },
  hero: {
    background: "linear-gradient(135deg, #15803d 0%, #16a34a 50%, #22c55e 100%)",
    padding: "60px 20px 50px", textAlign: "center" as const, color: "white",
  },
  heroBadge: {
    display: "inline-block", background: "rgba(255,255,255,0.2)", color: "white",
    fontSize: "13px", fontWeight: 700, padding: "6px 16px", borderRadius: "20px",
    marginBottom: "16px", backdropFilter: "blur(4px)",
  },
  heroTitle: {
    fontSize: "40px", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.2,
    textShadow: "0 2px 8px rgba(0,0,0,0.15)",
  },
  heroSub: { fontSize: "17px", margin: "0 0 28px", opacity: 0.9 },
  search: {
    padding: "14px 24px", borderRadius: "30px", border: "none",
    width: "360px", fontSize: "15px", outline: "none",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)", color: "#0f172a",
  },
  filters: {
    display: "flex", flexWrap: "wrap" as const, gap: "10px",
    justifyContent: "center", padding: "24px 32px 8px",
  },
  filterBtn: {
    padding: "8px 20px", borderRadius: "20px", border: "2px solid #bbf7d0",
    background: "white", color: "#15803d", cursor: "pointer",
    fontSize: "13px", fontWeight: 700, transition: "all 0.2s",
  },
  filterBtnActive: {
    background: "#15803d", border: "2px solid #15803d", color: "white",
  },
  grid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px", padding: "20px 36px 40px", flex: 1,
  },
  card: {
    background: "white", borderRadius: "16px", cursor: "pointer",
    transition: "transform 0.25s, box-shadow 0.25s",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)", overflow: "hidden",
  },
  productImage: { width: "100%", height: "160px", objectFit: "cover" as const, display: "block" },
  categoryBadge: {
    position: "absolute" as const, top: "8px", left: "8px",
    background: "#15803d", color: "white", fontSize: "11px",
    fontWeight: 700, padding: "3px 10px", borderRadius: "12px",
  },
  cardName: {
    margin: "10px 0", fontWeight: 700, fontSize: "15px",
    textAlign: "center" as const, color: "#0f172a",
  },
  footer: {
    background: "#14532d", color: "white",
    textAlign: "center" as const, padding: "20px",
  },
};
