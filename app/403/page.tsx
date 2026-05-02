"use client";
import { useRouter } from "next/navigation";

export default function ForbiddenPage() {
  const router = useRouter();
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", background: "#f0fdf4", textAlign: "center", padding: "24px",
    }}>
      <div style={{
        background: "white", borderRadius: "20px", padding: "48px 40px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)", border: "1px solid #dcfce7", maxWidth: "420px", width: "100%",
      }}>
        <div style={{
          width: "72px", height: "72px", borderRadius: "50%", background: "#fef2f2",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "36px", margin: "0 auto 20px",
        }}>🚫</div>
        <h1 style={{ margin: "0 0 8px", fontSize: "28px", fontWeight: 900, color: "#14532d" }}>403</h1>
        <h2 style={{ margin: "0 0 12px", fontSize: "18px", fontWeight: 700, color: "#b91c1c" }}>Access Denied</h2>
        <p style={{ margin: "0 0 28px", fontSize: "14px", color: "#64748b", lineHeight: 1.6 }}>
          You don&apos;t have permission to access this page.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            onClick={() => router.push("/")}
            style={{
              padding: "10px 24px", borderRadius: "10px", border: "none",
              background: "#15803d", color: "white", fontWeight: 700,
              fontSize: "14px", cursor: "pointer",
            }}
          >
            Go Home
          </button>
          <button
            onClick={() => router.push("/login")}
            style={{
              padding: "10px 24px", borderRadius: "10px",
              border: "2px solid #bbf7d0", background: "white",
              color: "#15803d", fontWeight: 700, fontSize: "14px", cursor: "pointer",
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
