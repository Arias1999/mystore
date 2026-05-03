"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.replace("/login"); return; }
      setUser(data.user);
      const meta = data.user.user_metadata ?? {};
      setName(meta.name || "");
      setPhone(meta.phone || "");
      setAddress(meta.address || "");
      setAvatarUrl(meta.avatar_url || "");
    });
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setMsg("");
    const { error } = await supabase.auth.updateUser({
      data: { name, phone, address, avatar_url: avatarUrl },
    });
    setSaving(false);
    if (error) { setMsg("Failed: " + error.message); return; }
    setMsg("Profile updated successfully!");
    setEditing(false);
    const { data } = await supabase.auth.getUser();
    if (data.user) setUser(data.user);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    setMsg("");
    const ext = file.name.split(".").pop();
    const path = `avatars/${user.id}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, file, { upsert: true });
    if (uploadError) { setMsg("Upload failed: " + uploadError.message); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
    setAvatarUrl(urlData.publicUrl);
    setUploading(false);
    setMsg("Photo uploaded! Click Save to apply.");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#f0fdf4", fontFamily: "'Segoe UI', sans-serif", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ flex: 1, maxWidth: "520px", margin: "40px auto", padding: "0 20px", width: "100%" }}>
        <div style={{ background: "white", border: "1px solid #dcfce7", borderRadius: "20px", padding: "32px", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>

          {/* AVATAR */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src={avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(name || "User") + "&background=15803d&color=fff&size=128"}
                alt="Profile"
                style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: "3px solid #bbf7d0" }}
              />
              <button
                onClick={() => fileRef.current?.click()}
                style={{ position: "absolute", bottom: 0, right: 0, background: "#15803d", border: "none", borderRadius: "50%", width: "30px", height: "30px", cursor: "pointer", color: "white", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {uploading ? "..." : "📷"}
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleUpload} />
            </div>
            <h2 style={{ margin: "12px 0 4px", fontSize: "20px", fontWeight: 900, color: "#14532d" }}>{name || "No name"}</h2>
            <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>{user.email}</p>
          </div>

          {/* INFO / EDIT */}
          {editing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={styles.label}>Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} style={styles.input} placeholder="Enter your name" />
              </div>
              <div>
                <label style={styles.label}>Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} style={styles.input} placeholder="Enter your phone" />
              </div>
              <div>
                <label style={styles.label}>Address</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} style={styles.input} placeholder="Enter your address" />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                <button onClick={handleSave} disabled={saving} style={{ ...styles.btn, background: "#15803d", flex: 1 }}>
                  {saving ? "Saving..." : "💾 Save"}
                </button>
                <button onClick={() => { setEditing(false); setMsg(""); }} style={{ ...styles.btn, background: "#64748b", flex: 1 }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { label: "Name", value: name || "-" },
                { label: "Email", value: user.email || "-" },
                { label: "Phone", value: phone || "-" },
                { label: "Address", value: address || "-" },
              ].map((item) => (
                <div key={item.label} style={{ background: "#f0fdf4", borderRadius: "10px", padding: "12px 16px", border: "1px solid #dcfce7" }}>
                  <p style={{ margin: "0 0 2px", fontSize: "11px", fontWeight: 700, color: "#15803d", textTransform: "uppercase" }}>{item.label}</p>
                  <p style={{ margin: 0, fontSize: "14px", color: "#0f172a", fontWeight: 600 }}>{item.value}</p>
                </div>
              ))}
              <button onClick={() => setEditing(true)} style={{ ...styles.btn, background: "#15803d", marginTop: "4px" }}>
                ✏️ Edit Profile
              </button>
            </div>
          )}

          {msg && <p style={{ marginTop: "12px", fontSize: "13px", fontWeight: 700, color: msg.includes("Failed") ? "#b91c1c" : "#15803d", textAlign: "center" }}>{msg}</p>}

          <button onClick={handleLogout} style={{ ...styles.btn, background: "#ef4444", marginTop: "14px" }}>
            Log out
          </button>
        </div>
      </div>

      <footer style={{ background: "#14532d", color: "white", textAlign: "center", padding: "20px", marginTop: "40px" }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: "15px" }}>🛒 LYRA'S STORE</p>
        <p style={{ margin: "4px 0 0", fontSize: "13px", opacity: 0.75 }}>© 2026 All Rights Reserved · Developed by Jilly Arias</p>
      </footer>
    </div>
  );
}

const styles = {
  label: { display: "block", fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "4px" },
  input: { display: "block", width: "100%", padding: "10px 14px", borderRadius: "10px", border: "2px solid #e2e8f0", fontSize: "14px", outline: "none", boxSizing: "border-box" as const, background: "#f8fafc", color: "#0f172a" },
  btn: { width: "100%", padding: "12px", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: 800, fontSize: "14px" },
};
