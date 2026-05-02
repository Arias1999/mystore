"use client";
import { MessagesManager } from "@/components/admin/messages-manager";

export default function MessagesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text)]">Messages</h2>
        <p className="text-sm text-[var(--text-muted)]">View and reply to customer messages.</p>
      </div>
      <MessagesManager />
    </div>
  );
}
