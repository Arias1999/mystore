import { SettingsPanel } from "@/components/admin/settings-panel";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text)]">Settings</h2>
        <p className="text-sm text-[var(--text-muted)]">Configure store preferences and notification options.</p>
      </div>
      <SettingsPanel />
    </div>
  );
}
