"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { getRole } from "@/lib/supabase/is-admin";

export default function AdminLoginPage() {
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      const role = getRole(data.user);

      if (role === "user") {
        await supabase.auth.signOut();
        toast.error("Access denied. This account does not have admin access.");
        setLoading(false);
        return;
      }

      toast.success("Welcome back.");
      const destination = role === "moderator" ? "/admin/orders" : nextPath;
      router.replace(destination);
    } catch (error) {
      if (error instanceof TypeError) {
        toast.error("Cannot reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL and your internet connection.");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unable to sign in. Check Supabase configuration.");
      }
    }

    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-xl">
        <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">My Store</p>
        <h1 className="mb-1 text-2xl font-semibold text-[var(--text)]">Admin Login</h1>
        <p className="mb-5 text-sm text-[var(--text-muted)]">Sign in to manage products, orders, customers, and analytics.</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Admin email"
            className="h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--accent)]"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--accent)]"
          />
          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-lg bg-[var(--accent)] text-sm font-medium text-white disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
