"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Package,
  ReceiptText,
  Settings,
  UserCircle,
  Users,
} from "lucide-react";
import { LogoutButton } from "@/components/admin/logout-button";

type Item = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
};

const navItems: Item[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ReceiptText },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/profile", label: "Profile", icon: UserCircle },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full flex-col border-r border-[var(--line)] bg-[var(--surface)]">
      <div className="border-b border-[var(--line)] px-5 py-5">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]">My Store</p>
        <h1 className="text-xl font-semibold text-[var(--text)]">Admin Console</h1>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--text)] hover:bg-[var(--surface-soft)]"
              }`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4">
        <LogoutButton compact />
      </div>
    </aside>
  );
}
