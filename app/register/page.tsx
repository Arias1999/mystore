"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [step, setStep] = useState<"register" | "otp">("register");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const router = useRouter();

  const handleRegister = async () => {
    setMessage(null);

    if (!fullName.trim() || !email.trim() || !phone.trim() || !address.trim() || !password || !confirmPassword) {
      setMessage({ type: "error", text: "Please fill in all fields." });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: fullName.trim(),
            phone: phone.trim(),
            address: address.trim(),
          },
        },
      });

      if (signUpError) {
        setMessage({ type: "error", text: signUpError.message });
        return;
      }

      setStep("otp");
      setMessage({ type: "success", text: "OTP sent! Please check your email." });
    } catch {
      setMessage({ type: "error", text: "Cannot connect. Check your internet connection." });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setMessage(null);

    if (otp.trim().length !== 6) {
      setMessage({ type: "error", text: "Please enter the 6-digit OTP code." });
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp.trim(),
        type: "signup",
      });

      if (verifyError) {
        setMessage({ type: "error", text: "Invalid or expired OTP. Please try again." });
        return;
      }

      router.push("/login?verified=1");
    } catch {
      setMessage({ type: "error", text: "Verification failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setMessage(null);
    setLoading(true);

    try {
      const supabase = createClient();

      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
      });

      if (resendError) {
        setMessage({ type: "error", text: resendError.message });
        return;
      }

      setMessage({ type: "success", text: "OTP resent! Check your email." });
    } catch {
      setMessage({ type: "error", text: "Failed to resend OTP." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#f0fdf4", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ background: "linear-gradient(135deg, #15803d 0%, #16a34a 50%, #22c55e 100%)", padding: "50px 20px", textAlign: "center", color: "white" }}>
        <div style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", fontSize: "13px", fontWeight: 700, padding: "6px 16px", borderRadius: "20px", marginBottom: "16px" }}>
          {step === "register" ? "Create Account" : "Verify Email"}
        </div>

        <h1 style={{ fontSize: "36px", fontWeight: 900, margin: "0 0 12px", textShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
          {step === "register" ? "Create your account" : "Check your email"}
        </h1>

        <p style={{ fontSize: "16px", margin: 0, opacity: 0.9 }}>
          {step === "register" ? "Register to browse products and track orders." : `We sent a 6-digit OTP to ${email}`}
        </p>
      </div>

      <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "40px 24px" }}>
        <div style={styles.card}>
          {step === "register" ? (
            <>
              <h2 style={styles.title}>Create your account</h2>

              {message && (
                <div style={message.type === "success" ? styles.successBox : styles.errorBox}>
                  {message.type === "success" ? "✅" : "⚠️"} {message.text}
                </div>
              )}

              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={styles.input}
              />

              <label style={styles.label}>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />

              <label style={styles.label}>Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={styles.input}
              />

              <label style={styles.label}>Address</label>
              <input
                type="text"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={styles.input}
              />

              <label style={styles.label}>Password (min. 6)</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />

              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
              />

              <button onClick={handleRegister} disabled={loading} style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}>
                {loading ? "Registering..." : "Register"}
              </button>

              <p style={styles.link} onClick={() => router.push("/login")}>
                Already have an account? <span style={styles.linkSpan}>Login</span>
              </p>
            </>
          ) : (
            <>
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <div style={{ fontSize: "52px", marginBottom: "12px" }}>📧</div>
                <h2 style={styles.title}>Enter OTP Code</h2>
                <p style={{ margin: "0", fontSize: "14px", color: "#64748b" }}>
                  Enter the 6-digit code sent to<br />
                  <strong style={{ color: "#15803d" }}>{email}</strong>
                </p>
              </div>

              {message && (
                <div style={message.type === "success" ? styles.successBox : styles.errorBox}>
                  {message.type === "success" ? "✅" : "⚠️"} {message.text}
                </div>
              )}

              <label style={styles.label}>OTP Code</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                style={{ ...styles.input, textAlign: "center", fontSize: "24px", letterSpacing: "8px", fontWeight: 800 }}
                maxLength={6}
              />

              <button onClick={handleVerifyOtp} disabled={loading || otp.length < 6} style={{ ...styles.button, opacity: loading || otp.length < 6 ? 0.7 : 1, marginTop: "20px" }}>
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>

              <button onClick={handleResendOtp} disabled={loading} style={styles.resendBtn}>
                Resend OTP
              </button>

              <p style={styles.link} onClick={() => { setStep("register"); setOtp(""); setMessage(null); }}>
                ← Back to Register
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "30px",
    width: "100%",
    maxWidth: "460px",
    boxShadow: "0 8px 26px rgba(0,0,0,0.08)",
    border: "1px solid #dcfce7",
  },
  title: {
    margin: "0 0 18px",
    fontSize: "24px",
    fontWeight: 900,
    color: "#14532d",
    textAlign: "center" as const,
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 700,
    color: "#374151",
    marginBottom: "6px",
    marginTop: "12px",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "2px solid #e2e8f0",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box" as const,
    background: "#f8fafc",
    color: "#0f172a",
  },
  button: {
    marginTop: "18px",
    width: "100%",
    padding: "13px",
    background: "#15803d",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(21,128,61,0.3)",
  },
  resendBtn: {
    marginTop: "10px",
    width: "100%",
    padding: "11px",
    background: "white",
    color: "#15803d",
    border: "2px solid #bbf7d0",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    padding: "10px 14px",
    marginBottom: "14px",
    color: "#b91c1c",
    fontSize: "14px",
    fontWeight: 600,
  },
  successBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#dcfce7",
    border: "1px solid #bbf7d0",
    borderRadius: "10px",
    padding: "10px 14px",
    marginBottom: "14px",
    color: "#166534",
    fontSize: "14px",
    fontWeight: 600,
  },
  link: {
    marginTop: "14px",
    fontSize: "14px",
    color: "#64748b",
    cursor: "pointer",
    textAlign: "center" as const,
  },
  linkSpan: {
    color: "#15803d",
    fontWeight: 800,
  },
};