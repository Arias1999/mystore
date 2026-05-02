"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Navbar from "../components/Navbar";

type MyMessage = {
  id: string;
  message: string;
  reply: string | null;
  created_at: string;
};

export default function ContactPage() {
  const supabase = createClient();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [myMessages, setMyMessages] = useState<MyMessage[]>([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const email = data.user.email || "";
        setForm((prev) => ({
          ...prev,
          name: data.user.user_metadata?.name || "",
          email,
        }));
        setUserEmail(email);
        fetchMyMessages(email);
      }
    });
  }, []);

  async function fetchMyMessages(email: string) {
    const { data } = await supabase
      .from("contact_messages")
      .select("id, message, reply, created_at")
      .eq("email", email)
      .order("created_at", { ascending: false });
    setMyMessages(data ?? []);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setFeedback({ type: "error", text: "Please fill out all fields." });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });

      if (error) {
        setFeedback({ type: "error", text: error.message || "Unable to send your message right now." });
        return;
      }

      setForm((prev) => ({ ...prev, message: "" }));
      setFeedback({ type: "success", text: "Message sent! We will reply soon." });
      if (userEmail) fetchMyMessages(userEmail);
    } catch {
      setFeedback({
        type: "error",
        text: "Cannot connect to Supabase. Check your environment variables.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "'Segoe UI', sans-serif",
        background: "#f0fdf4",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      <div
        style={{
          background: "linear-gradient(135deg, #15803d 0%, #16a34a 50%, #22c55e 100%)",
          padding: "50px 20px",
          textAlign: "center",
          color: "white",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.2)",
            fontSize: "13px",
            fontWeight: 700,
            padding: "6px 16px",
            borderRadius: "20px",
            marginBottom: "16px",
          }}
        >
          Contact Us
        </div>
        <h1
          style={{
            fontSize: "36px",
            fontWeight: 900,
            margin: "0 0 12px",
            textShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          Get In Touch
        </h1>
        <p style={{ fontSize: "16px", margin: 0, opacity: 0.9 }}>We'd love to hear from you!</p>
      </div>

      <div style={{ flex: 1, maxWidth: "800px", margin: "40px auto", padding: "0 24px", width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { icon: "Email", label: "Email", value: "lyrastore@gmail.com" },
            { icon: "Phone", label: "Phone", value: "0912-345-6789" },
            { icon: "Address", label: "Address", value: "Alcoy, Cebu, Philippines" },
          ].map((info, i) => (
            <div key={i} style={styles.infoCard}>
              <div style={{ fontSize: "20px", marginBottom: "8px", fontWeight: 800 }}>{info.icon}</div>
              <div style={{ fontWeight: 800, fontSize: "13px", color: "#15803d", marginBottom: "4px" }}>{info.label}</div>
              <div style={{ fontSize: "13px", color: "#374151", fontWeight: 600 }}>{info.value}</div>
            </div>
          ))}
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Send us a Message</h2>

          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              style={styles.input}
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />

            <label style={styles.label}>Your Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              style={styles.input}
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            />

            <label style={styles.label}>Message</label>
            <textarea
              placeholder="Write your message here..."
              style={styles.textarea}
              value={form.message}
              onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
            />

            {feedback && (
              <p
                style={{
                  margin: "12px 0 0",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: feedback.type === "success" ? "#166534" : "#b91c1c",
                }}
              >
                {feedback.text}
              </p>
            )}

            <button style={styles.sendBtn} type="submit" disabled={submitting}>
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* MY MESSAGES & ADMIN REPLIES */}
        {myMessages.length > 0 && (
          <div style={{ ...styles.card, marginTop: "8px" }}>
            <h2 style={styles.cardTitle}>📬 My Messages</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {myMessages.map((msg) => (
                <div key={msg.id} style={{ borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                  <div style={{ padding: "14px 16px", background: "#f8fafc" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#15803d" }}>You</span>
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                        {new Date(msg.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: "14px", color: "#374151" }}>{msg.message}</p>
                  </div>
                  {msg.reply ? (
                    <div style={{ padding: "14px 16px", background: "#dcfce7", borderTop: "1px solid #bbf7d0" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#14532d", display: "block", marginBottom: "6px" }}>🛡️ Admin Reply</span>
                      <p style={{ margin: 0, fontSize: "14px", color: "#166534" }}>{msg.reply}</p>
                    </div>
                  ) : (
                    <div style={{ padding: "10px 16px", background: "#fefce8", borderTop: "1px solid #fef08a" }}>
                      <span style={{ fontSize: "12px", color: "#854d0e", fontWeight: 600 }}>⏳ Waiting for admin reply...</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <footer style={styles.footer}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: "15px" }}>LYRA'S STORE</p>
        <p style={{ margin: "4px 0 0", fontSize: "13px", opacity: 0.75 }}>2026 All Rights Reserved. Developed by Jilly Arias.</p>
      </footer>
    </div>
  );
}

const styles = {
  infoCard: {
    background: "white",
    borderRadius: "16px",
    padding: "24px 16px",
    textAlign: "center" as const,
    boxShadow: "0 4px 14px rgba(0,0,0,0.07)",
    border: "1px solid #dcfce7",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "28px 32px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.07)",
    border: "1px solid #dcfce7",
    marginBottom: "20px",
  },
  cardTitle: { margin: "0 0 20px", fontSize: "20px", fontWeight: 900, color: "#14532d" },
  label: { display: "block", fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "6px", marginTop: "14px" },
  input: {
    display: "block",
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "2px solid #e2e8f0",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box" as const,
    background: "#f8fafc",
    color: "#0f172a",
  },
  textarea: {
    display: "block",
    width: "100%",
    height: "120px",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "2px solid #e2e8f0",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box" as const,
    background: "#f8fafc",
    color: "#0f172a",
    resize: "vertical" as const,
    marginTop: "6px",
  },
  sendBtn: {
    marginTop: "20px",
    width: "100%",
    padding: "13px",
    background: "#15803d",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(21,128,61,0.3)",
  },
  footer: {
    background: "#14532d",
    color: "white",
    textAlign: "center" as const,
    padding: "20px",
  },
};
