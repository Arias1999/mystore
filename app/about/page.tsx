"use client";

import Navbar from "../components/Navbar";

export default function About() {
  return (
    <div style={styles.container}>
      <div style={styles.overlay} />
      <Navbar />

      <div style={styles.content}>
        <div style={styles.card}>
          <h2 style={styles.heading}>About Us</h2>
          <p style={styles.text}>
            LYRA'S STORE is your one-stop shop for daily essentials like food,
            hygiene products, and household needs. We aim to provide affordable
            and high-quality products for everyone.
          </p>
          <p style={styles.text}>
            We have been serving the community since 2020, committed to making
            everyday shopping easy and enjoyable for every family.
          </p>
        </div>
      </div>

      <div style={styles.footer}>
        <p>© 2026 LYRA'S STORE | All Rights Reserved</p>
        <p>Developed by Jilly Arias</p>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    backgroundImage: "url('/background.svg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  overlay: {
    position: "absolute",
    top: 0, left: 0,
    width: "100%", height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 0,
  },
  content: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 1,
    padding: "40px 20px",
  },
  card: {
    background: "rgba(255,255,255,0.92)",
    borderRadius: "14px",
    padding: "40px 50px",
    maxWidth: "600px",
    width: "100%",
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
  },
  heading: { fontSize: "26px", fontWeight: "bold", color: "#1e3a5f", marginBottom: "16px" },
  text: { fontSize: "16px", color: "#444", lineHeight: "1.7", marginBottom: "12px" },
  footer: {
    background: "rgba(30, 58, 95, 0.9)",
    color: "white",
    textAlign: "center",
    padding: "12px",
    position: "relative",
    zIndex: 1,
  },
};
