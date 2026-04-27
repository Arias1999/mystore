"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  try {
    const url = new URL(supabaseUrl);
    if (url.protocol !== "https:") {
      throw new Error();
    }
  } catch {
    throw new Error("Invalid NEXT_PUBLIC_SUPABASE_URL. It should look like https://<project-ref>.supabase.co");
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
