"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/login");
      } else {
        setUser(data.user);
      }
    });
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/");
  };

  if (!user) return null;

  const meta = user.user_metadata ?? {};

  return (
    <div style={{ minHeight: "100vh", background: "#f0fdf4", fontFamily: "'Segoe UI', sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth: "720px", margin: "40px auto", padding: "0 20px" }}>
        <div style={{ background: "white", border: "1px solid #dcfce7", borderRadius: "16px", padding: "24px", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
          <h1 style={{ margin: "0 0 16px", color: "#14532d" }}>My Profile</h1>
          <p style={{ margin: "0 0 10px", color: "#374151" }}><strong>Name:</strong> {meta.name || "-"}</p>
          <p style={{ margin: "0 0 10px", color: "#374151" }}><strong>Email:</strong> {user.email || "-"}</p>
          <p style={{ margin: "0 0 10px", color: "#374151" }}><strong>Phone:</strong> {meta.phone || "-"}</p>
          <p style={{ margin: "0", color: "#374151" }}><strong>Address:</strong> {meta.address || "-"}</p>
          <button
            type="button"
            onClick={handleLogout}
            style={{ marginTop: "18px", width: "100%", padding: "12px", borderRadius: "10px", border: "none", background: "#ef4444", color: "white", fontWeight: 800, cursor: "pointer" }}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
