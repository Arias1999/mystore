"use client";

import { createBrowserClient } from "@supabase/ssr";

const FALLBACK_URL = "https://placeholder.supabase.co";
const FALLBACK_KEY = "placeholder";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;

  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      onAuthStateChange: (event) => {
        if (event === "TOKEN_REFRESHED") return;
        if (event === "SIGNED_OUT") {
          if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/register") && window.location.pathname !== "/") {
            window.location.href = "/login";
          }
        }
      },
    },
  });
}
