"use client";

import { useEffect, useState } from "react";
import { Menu, Search } from "lucide-react";
import { ThemeToggle } from "@/components/admin/theme-toggle";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type TopbarProps = {
  onMenuClick: () => void;
  onSearchChange: (value: string) => void;
};

export function Topbar({ onMenuClick, onSearchChange }: TopbarProps) {
  const [adminName, setAdminName] = useState("Admin");
  const [initials, setInitials] = useState("AD");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from("users")
        .select("name, email, avatar_url")
        .eq("id", user.id)
        .single();
      const display = data?.name || data?.email || "Admin";
      setAdminName(display);
      setInitials(display.slice(0, 2).toUpperCase());
      if (data?.avatar_url) setAvatarUrl(data.avatar_url);
    });
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[color:color-mix(in_srgb,var(--surface)_88%,transparent)] backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 md:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--text)] md:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </button>
        <label className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            className="h-10 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] pl-9 pr-3 text-sm outline-none focus:border-[var(--accent)]"
            placeholder="Search products, orders, or customers..."
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
        <ThemeToggle />
        <Link
          href="/admin/profile"
          className="hidden items-center gap-3 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 sm:flex hover:bg-[var(--surface-soft)] transition"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-semibold text-white overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)]">Admin</p>
            <p className="text-sm font-semibold text-[var(--text)]">{adminName}</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
