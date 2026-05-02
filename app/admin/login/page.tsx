"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        if (error.message.toLowerCase().includes("email not confirmed")) {
          toast.error("Email not confirmed. Please verify your email first.");
        } else {
          toast.error("Invalid email or password.");
        }
        setLoading(false);
        return;
      }

      const { data: dbUser, error: dbError } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (dbError || !dbUser) {
        await supabase.auth.signOut();
        toast.error("Account not found in database.");
        setLoading(false);
        return;
      }

      if (dbUser.role === "admin" || dbUser.role === "moderator") {
        toast.success("Welcome back.");
        router.replace(dbUser.role === "moderator" ? "/admin/orders" : nextPath);
      } else if (dbUser.role === "rider") {
        toast.success("Welcome back.");
        router.replace("/admin/orders");
      } else {
        await supabase.auth.signOut();
        toast.error("Access denied. This account does not have admin access.");
      }
    } catch (error) {
      if (error instanceof TypeError) {
        toast.error("Cannot reach Supabase. Check your connection.");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unable to sign in. Check Supabase configuration.");
      }
    }

    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#f0fdf4", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "linear-gradient(135deg, #15803d 0%, #16a34a 50%, #22c55e 100%)", padding: "50px 20px", textAlign: "center", color: "white" }}>
        <div style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", fontSize: "13px", fontWeight: 700, padding: "6px 16px", borderRadius: "20px", marginBottom: "16px" }}>🔐 Admin Access</div>
        <h1 style={{ fontSize: "36px", fontWeight: 900, margin: "0 0 12px", textShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>Admin Login</h1>
        <p style={{ fontSize: "16px", margin: 0, opacity: 0.9 }}>Sign in to manage LYRA&apos;S STORE</p>
      </div>

      <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "40px 24px" }}>
        <div style={styles.card}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={styles.iconCircle}>🛡️</div>
            <h2 style={styles.title}>LYRA&apos;S STORE</h2>
            <p style={styles.sub}>Admin Dashboard Access</p>
          </div>

          <form onSubmit={onSubmit}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              required
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#15803d")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
            />

            <label style={styles.label}>Password</label>
            <input
              type="password"
              required
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#15803d")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
            />

            <button type="submit" disabled={loading} style={{ ...styles.button, opacity: loading ? 0.75 : 1 }}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <span style={styles.spinner} /> Signing in...
                </span>
              ) : (
                "Sign in →"
              )}
            </button>
          </form>
        </div>
      </div>

      <footer style={styles.footer}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: "15px" }}>🛒 LYRA&apos;S STORE</p>
        <p style={{ margin: "4px 0 0", fontSize: "13px", opacity: 0.75 }}>© 2026 All Rights Reserved · Developed by Jilly Arias</p>
      </footer>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginContent />
    </Suspense>
  );
}

const styles = {
  card: {
    background: "white", borderRadius: "20px", padding: "40px 36px",
    width: "100%", maxWidth: "400px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
    border: "1px solid #dcfce7",
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
    transition: "border-color 0.15s",
  },
  button: {
    marginTop: "20px", width: "100%", padding: "13px",
    background: "#15803d", color: "white", border: "none",
    borderRadius: "12px", fontSize: "16px", fontWeight: 800, cursor: "pointer",
    boxShadow: "0 4px 12px rgba(21,128,61,0.3)", transition: "opacity 0.15s",
  },
  spinner: {
    display: "inline-block", width: "16px", height: "16px",
    border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white",
    borderRadius: "50%", animation: "spin 0.7s linear infinite",
  },
  footer: { background: "#14532d", color: "white", textAlign: "center" as const, padding: "20px" },
};
