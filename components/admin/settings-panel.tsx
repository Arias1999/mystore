"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export function SettingsPanel() {
  const [storeName, setStoreName] = useState("Lyra Store");
  const [currency, setCurrency] = useState("USD");
  const [emailAlerts, setEmailAlerts] = useState(true);

  function saveSettings() {
    toast.success("Settings saved.");
  }

  return (
    <div className="max-w-2xl space-y-4 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
      <h2 className="text-lg font-semibold text-[var(--text)]">Store Settings</h2>
      <label className="grid gap-2 text-sm text-[var(--text-muted)]">
        Store Name
        <input
          value={storeName}
          onChange={(event) => setStoreName(event.target.value)}
          className="h-10 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm text-[var(--text)]"
        />
      </label>
      <label className="grid gap-2 text-sm text-[var(--text-muted)]">
        Currency
        <select
          value={currency}
          onChange={(event) => setCurrency(event.target.value)}
          className="h-10 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm text-[var(--text)]"
        >
          <option value="USD">USD</option>
          <option value="PHP">PHP</option>
          <option value="EUR">EUR</option>
        </select>
      </label>
      <label className="flex items-center gap-3 text-sm text-[var(--text)]">
        <input
          type="checkbox"
          checked={emailAlerts}
          onChange={(event) => setEmailAlerts(event.target.checked)}
          className="h-4 w-4 rounded border-[var(--line)]"
        />
        Enable new order email alerts
      </label>
      <button
        type="button"
        onClick={saveSettings}
        className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
      >
        Save Changes
      </button>
    </div>
  );
}
