"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const router = useRouter();

  const handleRegister = () => {
    if (!username || !password || !confirm) { alert("Please fill in all fields."); return; }
    if (password !== confirm) { alert("Passwords do not match."); return; }
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const exists = users.find((u: { username: string }) => u.username === username);
    if (exists) { alert("Username already taken."); return; }
    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registered successfully! Please login.");
    router.push("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />
      <div style={styles.box}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={styles.iconCircle}>🛒</div>
          <h2 style={styles.title}>LYRA'S STORE</h2>
          <p style={styles.sub}>Create your account</p>
        </div>

        <label style={styles.label}>Username</label>
        <input type="text" placeholder="Choose a username" onChange={(e) => setUsername(e.target.value)} style={styles.input} />

        <label style={styles.label}>Password</label>
        <input type="password" placeholder="Create a password" onChange={(e) => setPassword(e.target.value)} style={styles.input} />

        <label style={styles.label}>Confirm Password</label>
        <input type="password" placeholder="Repeat your password" onChange={(e) => setConfirm(e.target.value)} style={styles.input} />

        <button onClick={handleRegister} style={styles.button}>Create Account →</button>

        <p style={styles.link} onClick={() => router.push("/login")}>
          Already have an account? <span style={styles.linkSpan}>Login here</span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh", display: "flex", justifyContent: "center", alignItems: "center",
    position: "relative" as const, backgroundImage: "url('/background.jpg')",
    backgroundSize: "cover", backgroundPosition: "center", fontFamily: "'Segoe UI', sans-serif",
  },
  overlay: { position: "absolute" as const, inset: 0, backgroundColor: "rgba(0,0,0,0.5)" },
  box: {
    position: "relative" as const, zIndex: 1, background: "white",
    padding: "40px 36px", borderRadius: "24px", width: "340px",
    boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
  },
  iconCircle: {
    width: "64px", height: "64px", borderRadius: "50%", background: "#dcfce7",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "28px", margin: "0 auto 12px",
  },
  title: { margin: "0 0 4px", fontSize: "22px", fontWeight: 900, color: "#14532d", letterSpacing: "0.5px" },
  sub: { margin: 0, fontSize: "14px", color: "#64748b" },
  label: { display: "block", fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "6px", marginTop: "14px" },
  input: {
    display: "block", width: "100%", padding: "12px 16px",
    borderRadius: "10px", border: "2px solid #e2e8f0", fontSize: "15px",
    outline: "none", boxSizing: "border-box" as const, background: "#f8fafc", color: "#0f172a",
  },
  button: {
    marginTop: "20px", width: "100%", padding: "13px",
    background: "#15803d", color: "white", border: "none",
    borderRadius: "12px", fontSize: "16px", fontWeight: 800, cursor: "pointer",
    boxShadow: "0 4px 12px rgba(21,128,61,0.3)",
  },
  link: { marginTop: "16px", fontSize: "14px", color: "#64748b", cursor: "pointer", textAlign: "center" as const },
  linkSpan: { color: "#15803d", fontWeight: 800 },
};
