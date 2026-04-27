"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Logged out.");
    router.replace("/admin/login");
  };

  return (
    <button
      onClick={handleLogout}
      className={`inline-flex items-center gap-2 rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--surface-soft)] ${
        compact ? "w-full justify-center" : ""
      }`}
      type="button"
    >
      <LogOut size={16} />
      {!compact ? "Logout" : ""}
    </button>
  );
}
