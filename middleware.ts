import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getRole } from "@/lib/supabase/is-admin";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) { return request.cookies.get(name)?.value; },
      set(name, value, options) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({ request });
        response.cookies.set({ name, value, ...options });
      },
      remove(name, options) {
        request.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({ request });
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const role = getRole(user);
  const pathname = request.nextUrl.pathname;

  // Protect /products and /orders — must be logged in
  const isStorefrontProtected = pathname.startsWith("/products") || pathname.startsWith("/orders");
  if (isStorefrontProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Protect /admin routes — must be admin or moderator
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";

  if (isAdminRoute && !isLoginRoute && (!user || role === "user")) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (isAdminRoute && !isLoginRoute && role === "moderator" && !pathname.startsWith("/admin/orders")) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/orders";
    return NextResponse.redirect(url);
  }

  if (isLoginRoute && user && role !== "user") {
    const url = request.nextUrl.clone();
    url.pathname = role === "moderator" ? "/admin/orders" : "/admin/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/products/:path*", "/orders/:path*", "/admin/:path*"],
};
