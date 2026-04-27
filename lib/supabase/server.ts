import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const FALLBACK_URL = "https://placeholder.supabase.co";
const FALLBACK_KEY = "placeholder";

export async function createClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: Record<string, unknown>) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: Record<string, unknown>) {
        cookieStore.set({ name, value: "", ...options });
      },
    },
  });
}
