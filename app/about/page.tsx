"use client";

import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";

export default function About() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#f0fdf4", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* HERO */}
      <div style={{ background: "linear-gradient(135deg, #15803d 0%, #16a34a 50%, #22c55e 100%)", padding: "50px 20px", textAlign: "center", color: "white" }}>
        <div style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", fontSize: "13px", fontWeight: 700, padding: "6px 16px", borderRadius: "20px", marginBottom: "16px" }}>🌿 About Us</div>
        <h1 style={{ fontSize: "36px", fontWeight: 900, margin: "0 0 12px", textShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>LYRA'S STORE</h1>
        <p style={{ fontSize: "16px", margin: 0, opacity: 0.9 }}>Your trusted neighborhood store, now online.</p>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, maxWidth: "800px", margin: "40px auto", padding: "0 24px", width: "100%" }}>

        {/* ABOUT CARD */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🏪 Who We Are</h2>
          <p style={styles.text}>
            LYRA'S STORE is your one-stop shop for daily essentials like food, hygiene products, and household needs.
            We aim to provide affordable and high-quality products for everyone in the community.
          </p>
          <p style={styles.text}>
            We have been serving the community since 2020, committed to making everyday shopping easy and enjoyable for every family.
          </p>
        </div>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", margin: "20px 0" }}>
          {[
            { icon: "🏆", value: "5+", label: "Years of Service" },
            { icon: "🛍️", value: "100+", label: "Products Available" },
            { icon: "😊", value: "500+", label: "Happy Customers" },
          ].map((s, i) => (
            <div key={i} style={styles.statCard}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>{s.icon}</div>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "#15803d" }}>{s.value}</div>
              <div style={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* MISSION */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🎯 Our Mission</h2>
          <p style={styles.text}>
            To provide every household with affordable, quality products delivered with care and convenience.
            We believe that everyone deserves access to fresh and reliable everyday essentials.
          </p>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", margin: "32px 0" }}>
          <button onClick={() => router.push("/products")} style={styles.shopBtn}>Browse Products →</button>
        </div>

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
  card: {
    background: "white", borderRadius: "16px", padding: "28px 32px",
    marginBottom: "20px", boxShadow: "0 4px 14px rgba(0,0,0,0.07)",
    border: "1px solid #dcfce7",
  },
  cardTitle: { margin: "0 0 14px", fontSize: "20px", fontWeight: 900, color: "#14532d" },
  text: { margin: "0 0 10px", fontSize: "15px", color: "#374151", lineHeight: 1.7 },
  statCard: {
    background: "white", borderRadius: "16px", padding: "24px 16px",
    textAlign: "center" as const, boxShadow: "0 4px 14px rgba(0,0,0,0.07)",
    border: "1px solid #dcfce7",
  },
  shopBtn: {
    padding: "13px 32px", background: "#15803d", color: "white",
    border: "none", borderRadius: "12px", cursor: "pointer",
    fontWeight: 800, fontSize: "15px", boxShadow: "0 4px 12px rgba(21,128,61,0.3)",
  },
  footer: {
    background: "#14532d", color: "white",
    textAlign: "center" as const, padding: "20px",
  },
};
