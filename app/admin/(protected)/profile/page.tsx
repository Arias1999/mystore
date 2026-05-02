"use client";
import { ProfilePanel } from "@/components/admin/profile-panel";

export default function ProfilePage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text)]">Profile</h2>
        <p className="text-sm text-[var(--text-muted)]">Manage your admin profile and create new admin accounts.</p>
      </div>
      <ProfilePanel />
    </div>
  );
}
