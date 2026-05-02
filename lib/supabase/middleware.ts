import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getRole } from "@/lib/supabase/is-admin";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: Record<string, unknown>) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({ request });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: Record<string, unknown>) {
        request.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({ request });
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role = getRole(user);
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";

  // If JWT has no role, fall back to DB users table
  if (user && role === "customer") {
    const { data: dbUser } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    if (dbUser?.role === "admin" || dbUser?.role === "moderator") {
      role = dbUser.role as "admin" | "moderator";
    }
  }

  // Block unauthenticated or plain customers from all /admin/* routes
  if (isAdminRoute && !isLoginRoute && (!user || role === "customer")) {
    const url = request.nextUrl.clone();
    url.pathname = "/403";
    return NextResponse.redirect(url);
  }

  // Moderators can only access /admin/orders
  if (
    isAdminRoute &&
    !isLoginRoute &&
    role === "moderator" &&
    !request.nextUrl.pathname.startsWith("/admin/orders")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/orders";
    return NextResponse.redirect(url);
  }

  // Redirect already-logged-in users away from login page
  if (isLoginRoute && user && role !== "customer") {
    const url = request.nextUrl.clone();
    url.pathname = role === "moderator" ? "/admin/orders" : "/admin/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}
