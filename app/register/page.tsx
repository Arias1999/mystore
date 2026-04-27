"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState<{ open: boolean; type: "success" | "error"; message: string }>({
    open: false, type: "error", message: "",
  });
  const router = useRouter();

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !phone.trim() || !address.trim() || !password || !confirmPassword) {
      setPopup({ open: true, type: "error", message: "Please fill in all fields." });
      return;
    }
    if (password.length < 6) {
      setPopup({ open: true, type: "error", message: "Password must be at least 6 characters." });
      return;
    }
    if (password !== confirmPassword) {
      setPopup({ open: true, type: "error", message: "Passwords do not match." });
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { name: fullName.trim(), phone: phone.trim(), address: address.trim(), role: "customer" },
        },
      });

      if (error) {
        setPopup({ open: true, type: "error", message: error.message });
        return;
      }

      setPopup({ open: true, type: "success", message: "Registered successfully! Please login." });
    } catch (error) {
      setPopup({
        open: true,
        type: "error",
        message: "Cannot connect to Supabase. Check your network and environment variables.",
      });
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    const shouldRedirect = popup.type === "success";
    setPopup((prev) => ({ ...prev, open: false }));
    if (shouldRedirect) router.push("/login");
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#f0fdf4", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ background: "linear-gradient(135deg, #15803d 0%, #16a34a 50%, #22c55e 100%)", padding: "50px 20px", textAlign: "center", color: "white" }}>
        <div style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", fontSize: "13px", fontWeight: 700, padding: "6px 16px", borderRadius: "20px", marginBottom: "16px" }}>Create Account</div>
        <h1 style={{ fontSize: "36px", fontWeight: 900, margin: "0 0 12px", textShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>Create your account</h1>
        <p style={{ fontSize: "16px", margin: 0, opacity: 0.9 }}>Register to browse products, check-out, and track orders.</p>
      </div>

      <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "40px 24px" }}>
        <div style={styles.card}>
          <h2 style={styles.title}>Create your account</h2>

          <label style={styles.label}>Full Name</label>
          <input type="text" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} style={styles.input} />

          <label style={styles.label}>Email</label>
          <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />

          <label style={styles.label}>Phone Number</label>
          <input type="tel" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} style={styles.input} />

          <label style={styles.label}>Address</label>
          <input type="text" placeholder="Enter your address" value={address} onChange={(e) => setAddress(e.target.value)} style={styles.input} />

          <label style={styles.label}>Password (min. 6)</label>
          <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />

          <label style={styles.label}>Confirm password</label>
          <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={styles.input} />

          <button onClick={handleRegister} disabled={loading} style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Registering..." : "Register"}
          </button>

          <p style={styles.link} onClick={() => router.push("/login")}>
            Already have an account? <span style={styles.linkSpan}>Login</span>
          </p>
        </div>
      </div>

      {popup.open && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupCard}>
            <p style={{ ...styles.popupTitle, color: popup.type === "success" ? "#166534" : "#b91c1c" }}>
              {popup.type === "success" ? "Success" : "Error"}
            </p>
            <p style={styles.popupMessage}>{popup.message}</p>
            <button onClick={closePopup} style={styles.popupButton}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: { background: "white", borderRadius: "16px", padding: "30px", width: "100%", maxWidth: "460px", boxShadow: "0 8px 26px rgba(0,0,0,0.08)", border: "1px solid #dcfce7" },
  title: { margin: "0 0 18px", fontSize: "24px", fontWeight: 900, color: "#14532d", textAlign: "center" as const },
  label: { display: "block", fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "6px", marginTop: "12px" },
  input: { display: "block", width: "100%", padding: "12px 14px", borderRadius: "10px", border: "2px solid #e2e8f0", fontSize: "15px", outline: "none", boxSizing: "border-box" as const, background: "#f8fafc", color: "#0f172a" },
  button: { marginTop: "18px", width: "100%", padding: "13px", background: "#15803d", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 12px rgba(21,128,61,0.3)" },
  link: { marginTop: "14px", fontSize: "14px", color: "#64748b", cursor: "pointer", textAlign: "center" as const },
  linkSpan: { color: "#15803d", fontWeight: 800 },
  popupOverlay: { position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 50 },
  popupCard: { background: "white", borderRadius: "14px", width: "100%", maxWidth: "360px", padding: "22px", textAlign: "center" as const, boxShadow: "0 10px 28px rgba(0,0,0,0.2)" },
  popupTitle: { margin: "0 0 8px", fontSize: "20px", fontWeight: 900 },
  popupMessage: { margin: "0", fontSize: "14px", color: "#374151" },
  popupButton: { marginTop: "16px", width: "100%", padding: "10px 12px", borderRadius: "10px", border: "none", background: "#15803d", color: "white", fontSize: "14px", fontWeight: 800, cursor: "pointer" },
};
