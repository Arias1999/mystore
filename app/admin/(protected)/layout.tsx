import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { createClient } from "@/lib/supabase/server";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient().catch(() => {
    redirect("/admin/login?error=missing_supabase_env");
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || (profile?.role !== "admin" && profile?.role !== "moderator" && profile?.role !== "rider")) {
    redirect("/403");
  }

  return <AdminShell>{children}</AdminShell>;
}
