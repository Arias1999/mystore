"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "./components/Navbar";

const products = [
  { name: "Can Goods", img: "/products/canned.jpg", category: "Canned Food", description: "Includes sardines, meat loaf, beef loaf, carne norte, corned beef, tuna, and more. Perfect for quick and easy everyday meals. Long shelf life and packed with flavor." },
  { name: "Bath Soap", img: "/products/bath-soap.jpg", category: "Personal Care", description: "Gentle and effective soap for daily skin care. Leaves your skin feeling fresh and clean all day. Available in various scents and formulas." },
  { name: "Laundry Soap", img: "/products/laundry-soap.jpg", category: "Personal Care", description: "Keeps your clothes fresh and clean. Available in different variants for all fabric types. Affordable and effective for everyday laundry needs." },
  { name: "Eggs", img: "/products/eggs.jpg", category: "Fresh Produce", description: "Farm-fresh eggs packed with protein and nutrients. Perfect for breakfast, baking, and everyday cooking. Sourced from healthy and well-fed chickens." },
  { name: "Toothpaste", img: "/products/toothpaste.jpg", category: "Personal Care", description: "Protects your teeth from cavities and keeps breath fresh. Formulated for strong enamel and healthy gums. Trusted by families for daily oral care." },
  { name: "Shampoo", img: "/products/shampoo.jpg", category: "Personal Care", description: "Nourishes and strengthens your hair from root to tip. Leaves hair smooth, shiny, and manageable every day. Available in variants for all hair types." },
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

      <Navbar />

      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.heroBadge}>🌿 Fresh & Affordable</div>
        <h1 style={styles.heroTitle}>Your Neighborhood Store,<br />Now Online!</h1>
        <p style={styles.heroSub}>Quality products delivered to your doorstep.</p>
      </div>

      {/* FEATURED PRODUCTS */}
      <div style={{ background: "#fafaf9", padding: "40px 36px" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <span style={{ display: "inline-block", background: "#fff7ed", color: "#ea580c", fontSize: "12px", fontWeight: 800, padding: "5px 14px", borderRadius: "20px", border: "1px solid #fed7aa", letterSpacing: "0.5px" }}>⭐ FEATURED PRODUCTS</span>
          <h2 style={{ margin: "12px 0 4px", fontSize: "28px", fontWeight: 900, color: "#1c1917" }}>Today's Top Picks</h2>
          <p style={{ margin: 0, fontSize: "14px", color: "#78716c" }}>Handpicked favorites just for you</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", maxWidth: "1100px", margin: "0 auto" }}>

          {/* SNACKS */}
          <div style={styles.featuredCard}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 40px rgba(0,0,0,0.12)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
          >
            <img src="/products/biscuits.jpg" alt="Biscuits" style={styles.featuredImg} />
            <div style={styles.featuredContent}>
              <span style={{ ...styles.badge, background: "#fff7ed", color: "#ea580c", border: "1px solid #fed7aa" }}>🍪 SNACKS</span>
              <h3 style={styles.featuredTitle}>Biscuits & Snacks</h3>
              <p style={styles.featuredDesc}>Crispy and delicious biscuits perfect for snacking anytime. Skyflakes, Oreo, Chips Ahoy, and more!</p>
              <button onClick={() => router.push("/login")} style={styles.orderBtn}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#c2410c"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#ea580c"; }}
              >Shop Now →</button>
            </div>
          </div>

          {/* CAN GOODS */}
          <div style={styles.featuredCard}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 40px rgba(0,0,0,0.12)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
          >
            <img src="/products/canned.jpg" alt="Can Goods" style={styles.featuredImg} />
            <div style={styles.featuredContent}>
              <span style={{ ...styles.badge, background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" }}>🥫 CANNED FOOD</span>
              <h3 style={styles.featuredTitle}>Can Goods</h3>
              <p style={styles.featuredDesc}>Sardines, meat loaf, beef loaf, carne norte, corned beef, tuna, and more. Quick and easy everyday meals!</p>
              <button onClick={() => router.push("/login")} style={{ ...styles.orderBtn, background: "#15803d", boxShadow: "0 4px 14px rgba(21,128,61,0.35)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#14532d"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#15803d"; }}
              >Shop Now →</button>
            </div>
          </div>

          {/* MILK */}
          <div style={styles.featuredCard}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 40px rgba(0,0,0,0.12)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
          >
            <img src="/products/milk.webp" alt="Milk" style={styles.featuredImg} />
            <div style={styles.featuredContent}>
              <span style={{ ...styles.badge, background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" }}>🥛 DAIRY</span>
              <h3 style={styles.featuredTitle}>Milk & Drinks</h3>
              <p style={styles.featuredDesc}>Milo, Bear Brand, Alaska, Energen, Nescafe, Tablea and more. Fresh and nutritious drinks for the whole family!</p>
              <button onClick={() => router.push("/login")} style={{ ...styles.orderBtn, background: "#2563eb", boxShadow: "0 4px 14px rgba(37,99,235,0.35)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#1d4ed8"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#2563eb"; }}
              >Shop Now →</button>
            </div>
          </div>

        </div>
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
            {(p as any).description && (
              <p style={{ margin: "0 10px 10px", fontSize: "12px", color: "#4b5563", textAlign: "center", lineHeight: 1.5 }}>{(p as any).description}</p>
            )}
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
  productImage: { width: "100%", aspectRatio: "1/1", objectFit: "cover" as const, display: "block" },
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
  featuredCard: {
    display: "flex", flexDirection: "row" as const, alignItems: "center",
    background: "white", borderRadius: "20px", overflow: "hidden",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    transition: "transform 0.25s, box-shadow 0.25s",
  },
  featuredImg: { width: "180px", height: "180px", objectFit: "cover" as const, display: "block", flexShrink: 0 },
  featuredContent: { padding: "20px" },
  badge: {
    display: "inline-block", fontSize: "11px", fontWeight: 800,
    padding: "4px 12px", borderRadius: "20px", marginBottom: "10px", letterSpacing: "0.5px",
  },
  featuredTitle: { margin: "0 0 8px", fontSize: "20px", fontWeight: 900, color: "#1c1917" },
  featuredDesc: { margin: "0 0 16px", fontSize: "13px", color: "#57534e", lineHeight: 1.6 },
  orderBtn: {
    padding: "10px 22px", background: "#ea580c", color: "white",
    border: "none", borderRadius: "12px", cursor: "pointer",
    fontWeight: 800, fontSize: "14px",
    boxShadow: "0 4px 14px rgba(234,88,12,0.35)",
    transition: "background 0.2s",
  },
};
