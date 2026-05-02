"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified") === "1";

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (authError || !data.user) {
      setError(
        authError?.message.toLowerCase().includes("email not confirmed")
          ? "Email not confirmed. Please check your inbox."
          : "Invalid email or password."
      );
      setLoading(false);
      return;
    }

    const role = data.user.user_metadata?.role || "customer";

    if (role === "admin" || role === "moderator") {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/");
    }
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#f0fdf4", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ background: "linear-gradient(135deg, #15803d 0%, #16a34a 50%, #22c55e 100%)", padding: "50px 20px", textAlign: "center", color: "white" }}>
        <div style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", fontSize: "13px", fontWeight: 700, padding: "6px 16px", borderRadius: "20px", marginBottom: "16px" }}>🔐 Welcome Back</div>
        <h1 style={{ fontSize: "36px", fontWeight: 900, margin: "0 0 12px", textShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>Sign In</h1>
        <p style={{ fontSize: "16px", margin: 0, opacity: 0.9 }}>Login to continue shopping at LYRA&apos;S STORE</p>
      </div>

      <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "40px 24px" }}>
        <div style={styles.card}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={styles.iconCircle}>🛒</div>
            <h2 style={styles.title}>LYRA&apos;S STORE</h2>
            <p style={styles.sub}>Sign in to continue shopping</p>
          </div>

          {verified && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "10px 14px", marginBottom: "14px", color: "#166534", fontSize: "14px", fontWeight: 600 }}>
              ✅ Email verified! You can now log in.
            </div>
          )}

          {error && (
            <div style={styles.errorBox}>
              <span style={{ fontSize: "16px" }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <label style={styles.label}>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#15803d")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
          />

          <label style={styles.label}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...styles.input, paddingRight: "44px" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#15803d")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)} style={styles.eyeBtn}>
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button onClick={handleLogin} disabled={loading} style={{ ...styles.button, opacity: loading ? 0.75 : 1 }}>
            {loading ? "Signing in..." : "Login →"}
          </button>

          <p style={styles.link} onClick={() => router.push("/register")}>
            No account yet? <span style={styles.linkSpan}>Register here</span>
          </p>
          <p style={styles.back} onClick={() => router.push("/")}>← Back to Home</p>
        </div>
      </div>

      <footer style={styles.footer}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: "15px" }}>🛒 LYRA&apos;S STORE</p>
        <p style={{ margin: "4px 0 0", fontSize: "13px", opacity: 0.75 }}>© 2026 All Rights Reserved · Developed by Jilly Arias</p>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

const styles = {
  card: { background: "white", borderRadius: "20px", padding: "40px 36px", width: "100%", maxWidth: "400px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", border: "1px solid #dcfce7" },
  iconCircle: { width: "64px", height: "64px", borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", margin: "0 auto 12px" },
  title: { margin: "0 0 4px", fontSize: "22px", fontWeight: 900, color: "#14532d", letterSpacing: "0.5px" },
  sub: { margin: 0, fontSize: "14px", color: "#64748b" },
  errorBox: { display: "flex", alignItems: "center", gap: "8px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "10px 14px", marginBottom: "14px", color: "#b91c1c", fontSize: "14px", fontWeight: 600 },
  label: { display: "block", fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "6px", marginTop: "14px" },
  input: { display: "block", width: "100%", padding: "12px 16px", borderRadius: "10px", border: "2px solid #e2e8f0", fontSize: "15px", outline: "none", boxSizing: "border-box" as const, background: "#f8fafc", color: "#0f172a" },
  eyeBtn: { position: "absolute" as const, right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px", padding: "2px" },
  button: { marginTop: "20px", width: "100%", padding: "13px", background: "#15803d", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 12px rgba(21,128,61,0.3)" },
  link: { marginTop: "16px", fontSize: "14px", color: "#64748b", cursor: "pointer", textAlign: "center" as const },
  linkSpan: { color: "#15803d", fontWeight: 800 },
  back: { marginTop: "8px", fontSize: "14px", color: "#15803d", fontWeight: 600, cursor: "pointer", textAlign: "center" as const },
  footer: { background: "#14532d", color: "white", textAlign: "center" as const, padding: "20px" },
};
