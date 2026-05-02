"use client";

export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const handleVerify = async () => {
    setMessage(null);
    if (otp.trim().length !== 6) {
      setMessage({ type: "error", text: "Please enter the 6-digit OTP code." });
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp.trim(),
        type: "signup",
      });

      if (error) {
        setMessage({ type: "error", text: "Invalid or expired OTP. Please try again." });
        return;
      }

      await supabase.auth.signOut();
      setMessage({ type: "success", text: "Email verified! Redirecting to login..." });
      setTimeout(() => router.push("/login?verified=1"), 1500);
    } catch {
      setMessage({ type: "error", text: "Verification failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setMessage(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({ type: "signup", email });
      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({ type: "success", text: "OTP resent! Check your email." });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to resend OTP." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#f0fdf4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>

      <div style={{ width: "100%", maxWidth: "420px", background: "white", borderRadius: "20px", padding: "40px 36px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", border: "1px solid #dcfce7" }}>

        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "56px", marginBottom: "12px" }}>📧</div>
          <h1 style={{ margin: "0 0 8px", fontSize: "24px", fontWeight: 900, color: "#14532d" }}>Verify your email</h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
            We sent a 6-digit code to<br />
            <strong style={{ color: "#15803d" }}>{email || "your email"}</strong>
          </p>
        </div>

        {message && (
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: message.type === "success" ? "#dcfce7" : "#fef2f2",
            border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`,
            borderRadius: "10px", padding: "10px 14px", marginBottom: "16px",
            color: message.type === "success" ? "#166534" : "#b91c1c",
            fontSize: "14px", fontWeight: 600,
          }}>
            {message.type === "success" ? "✅" : "⚠️"} {message.text}
          </div>
        )}

        <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>
          Enter OTP Code
        </label>
        <input
          type="text"
          placeholder="000000"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          maxLength={6}
          style={{
            display: "block", width: "100%", padding: "16px",
            borderRadius: "12px", border: "2px solid #e2e8f0",
            fontSize: "32px", fontWeight: 900, letterSpacing: "12px",
            textAlign: "center", outline: "none",
            boxSizing: "border-box" as const,
            background: "#f8fafc", color: "#0f172a",
          }}
        />

        <button
          onClick={handleVerify}
          disabled={loading || otp.length < 6}
          style={{
            marginTop: "20px", width: "100%", padding: "14px",
            background: "#15803d", color: "white", border: "none",
            borderRadius: "12px", fontSize: "16px", fontWeight: 800,
            cursor: otp.length < 6 ? "not-allowed" : "pointer",
            opacity: loading || otp.length < 6 ? 0.7 : 1,
            boxShadow: "0 4px 12px rgba(21,128,61,0.3)",
          }}
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>

        <button
          onClick={handleResend}
          disabled={loading}
          style={{
            marginTop: "10px", width: "100%", padding: "12px",
            background: "white", color: "#15803d",
            border: "2px solid #bbf7d0", borderRadius: "12px",
            fontSize: "14px", fontWeight: 700, cursor: "pointer",
          }}
        >
          Resend OTP
        </button>

        <p
          onClick={() => router.push("/register")}
          style={{ marginTop: "16px", fontSize: "14px", color: "#64748b", cursor: "pointer", textAlign: "center" }}
        >
          ← Back to Register
        </p>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  );
}
