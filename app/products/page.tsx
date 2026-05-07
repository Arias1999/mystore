"use client";

export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";

type Product = { name: string; price: number; img: string; category: string };
type CartItem = Product & { qty: number };

const productsData: Product[] = [
  { name: "Milk", price: 50, img: "/products/milk.jpg", category: "Dairy" },
  { name: "Can Goods", price: 30, img: "/products/canned.jpg", category: "Canned Food" },
  { name: "Sardines Mega green", price: 20, img: "/products/sardines-mega-green.jpg", category: "Canned Food" },
  { name: "Meat Loaf", price: 38, img: "/products/meat-loaf.webp", category: "Canned Food" },
  { name: "Beef Loaf", price: 42, img: "/products/beef-loaf.webp", category: "Canned Food" },
  { name: "Carne Norte", price: 55, img: "/products/carne-norte.jpg", category: "Canned Food" },
  { name: "Corned Beef", price: 45, img: "/products/corned-beef.webp", category: "Canned Food" },
  { name: "Tuna", price: 35, img: "/products/tuna-spicy.jpg", category: "Canned Food" },
  { name: "Sardines Mega red", price: 55, img: "/products/sardines-mega-red.webp", category: "Canned Food" },
  { name: "Bath Soap", price: 25, img: "/products/bath-soap.jpg", category: "Personal Care" },
  { name: "Laundry Soap", price: 20, img: "/products/laundry-soap.jpg", category: "Personal Care" },
  { name: "Toothpaste", price: 35, img: "/products/toothpaste.jpg", category: "Personal Care" },
  { name: "Shampoo", price: 45, img: "/products/shampoo.jpg", category: "Personal Care" },
  { name: "Eggs", price: 10, img: "/products/eggs.jpg", category: "Fresh Produce" },
  { name: "Biscuits", price: 15, img: "/products/biscuits.jpg", category: "Snacks" },
  { name: "Salt", price: 10, img: "/products/Salt.jpg", category: "Others" },
  { name: "Vinegar", price: 15, img: "/products/Vinegar.webp", category: "Others" },
  { name: "Magic Sarap", price: 5, img: "/products/magic-sarap.webp", category: "Others" },
  { name: "Vetsin", price: 5, img: "/products/vetsin.jpg", category: "Others" },
];

const productRoutes: { [key: string]: string } = {
  Milk: "/products/milk",
  "Can Goods": "/products/can-goods",
  "Sardines Mega green": "/products/can-goods",
  "Meat Loaf": "/products/can-goods",
  "Beef Loaf": "/products/can-goods",
  "Carne Norte": "/products/can-goods",
  "Corned Beef": "/products/can-goods",
  "Tuna": "/products/can-goods",
  "Sardines Mega red": "/products/can-goods",
  "Bath Soap": "/products/bath-soap",
  "Laundry Soap": "/products/laundry-soap",
  Eggs: "/products/eggs",
  Toothpaste: "/products/toothpaste",
  Shampoo: "/products/shampoo",
  Biscuits: "/products/biscuits",
  Salt: "/products/salt",
  Vinegar: "/products/venigar",
  "Magic Sarap": "/products/magic-sarap",
  Vetsin: "/products/vetsin",
};

const categories = ["All", ...Array.from(new Set(productsData.map((p) => p.category)))];

function getCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem("cart") || "[]"); } catch { return []; }
}

function saveCart(cart: CartItem[]) {
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("storage"));
}

function ProductsContent() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [qty, setQty] = useState<{ [key: number]: number }>({});
  const [added, setAdded] = useState<{ [key: number]: boolean }>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const filtered = productsData.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "All" || p.category === activeCategory;
    return matchSearch && matchCategory;
  });

  

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#f0fdf4", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ flex: 1, padding: "28px 36px" }}>
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ margin: "0 0 4px", fontSize: "26px", fontWeight: 900, color: "#14532d" }}>All Products</h2>
          <p style={{ margin: 0, color: "#4ade80", fontSize: "14px", fontWeight: 600 }}>Browse and shop our fresh selections</p>
        </div>

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

        <div style={styles.grid}>
          {filtered.map((p, i) => (
            <div
              key={i}
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 28px rgba(22,163,74,0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
              }}
            >
              <div style={{ position: "relative" }}>
                <img src={p.img} alt={p.name} style={styles.productImage} />
                <span style={styles.categoryBadge}>{p.category}</span>
              </div>
              <div style={styles.cardBody}>
                <h3 style={styles.cardName}>{p.name}</h3>
                <p style={styles.price}>PHP {p.price}</p>
                <button onClick={() => router.push(productRoutes[p.name])} style={styles.viewBtn}>
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ background: "#14532d", color: "white", textAlign: "center", padding: "20px", marginTop: "40px" }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: "15px" }}>LYRA'S STORE</p>
        <p style={{ margin: "4px 0 0", fontSize: "13px", opacity: 0.75 }}>© 2026 All Rights Reserved · Developed by Jilly Arias</p>
      </footer>
    </div>
  );
}

export default function Products() {
  return (
    <Suspense fallback={null}>
      <ProductsContent />
    </Suspense>
  );
}

const styles = {
  filters: { display: "flex", flexWrap: "wrap" as const, gap: "10px", marginBottom: "24px" },
  filterBtn: {
    padding: "8px 20px",
    borderRadius: "20px",
    border: "2px solid #bbf7d0",
    background: "white",
    color: "#15803d",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 700,
  },
  filterBtnActive: { background: "#15803d", border: "2px solid #15803d", color: "white" },
  grid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" },
  card: {
    borderRadius: "16px",
    overflow: "hidden",
    background: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    transition: "transform 0.25s, box-shadow 0.25s",
  },
  productImage: { width: "100%", height: "150px", objectFit: "cover" as const, display: "block" },
  categoryBadge: {
    position: "absolute" as const,
    top: "8px",
    left: "8px",
    background: "#15803d",
    color: "white",
    fontSize: "11px",
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: "12px",
  },
  cardBody: { padding: "14px", textAlign: "center" as const },
  cardName: { margin: "0 0 4px", fontSize: "16px", fontWeight: 800, color: "#0f172a" },
  price: { margin: "0 0 12px", color: "#15803d", fontWeight: 800, fontSize: "17px" },
  qtyBtn: {
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    border: "1.5px solid #bbf7d0",
    background: "#f0fdf4",
    color: "#15803d",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  addBtn: {
    display: "block",
    width: "100%",
    padding: "9px",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "13px",
    marginBottom: "6px",
    transition: "background 0.3s",
  },
  viewBtn: {
    display: "block",
    width: "100%",
    padding: "9px",
    background: "white",
    color: "#15803d",
    border: "1.5px solid #bbf7d0",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "13px",
  },
};
