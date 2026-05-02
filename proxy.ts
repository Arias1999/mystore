import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getRole } from "@/lib/supabase/is-admin";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value; },
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
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  let role = getRole(user);
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";

  // Fallback to DB if JWT has no role
  if (user && role === "customer") {
    const { data: dbUser } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    if (dbUser?.role === "admin" || dbUser?.role === "moderator" || dbUser?.role === "rider") {
      role = dbUser.role as "admin" | "moderator" | "rider";
    }
  }

  // Block non-admin from /admin/* except login
  if (!isLoginRoute && (!user || role === "customer")) {
    return NextResponse.redirect(new URL("/403", request.url));
  }

  // Riders only allowed on /admin/orders
  if (!isLoginRoute && role === "rider" && !request.nextUrl.pathname.startsWith("/admin/orders")) {
    return NextResponse.redirect(new URL("/admin/orders", request.url));
  }

  // Moderators only allowed on /admin/orders
  if (!isLoginRoute && role === "moderator" && !request.nextUrl.pathname.startsWith("/admin/orders")) {
    return NextResponse.redirect(new URL("/admin/orders", request.url));
  }

  // Already logged-in admin visiting login page → redirect to dashboard
  if (isLoginRoute && user && role !== "customer") {
    const dest = role === "moderator" ? "/admin/orders" : "/admin/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
