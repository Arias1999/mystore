"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

type AdminProfile = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  avatar_url: string | null;
  created_at: string;
};

export function ProfilePanel() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  // Create admin form
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data) {
        setProfile(data);
        setName(data.name ?? "");
        setAvatarUrl(data.avatar_url ?? null);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const path = `avatars/${profile.id}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast.error("Failed to upload image.");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(path);

    const url = urlData.publicUrl;

    await supabase.from("users").update({ avatar_url: url }).eq("id", profile.id);
    setAvatarUrl(url);
    setProfile((prev) => prev ? { ...prev, avatar_url: url } : prev);
    toast.success("Profile picture updated.");
    setUploading(false);
  }

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from("users")
      .update({ name: name.trim() })
      .eq("id", profile.id);
    if (error) toast.error("Failed to update profile.");
    else {
      toast.success("Profile updated.");
      setProfile((prev) => prev ? { ...prev, name: name.trim() } : prev);
    }
    setSaving(false);
  }

  async function handleCreateAdmin() {
    if (!newEmail.trim() || !newPassword.trim() || !newName.trim()) {
      toast.error("Please fill out all fields.");
      return;
    }
    setCreating(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: newEmail.trim(),
        password: newPassword.trim(),
        options: { data: { name: newName.trim(), role: "admin" } },
      });

      if (error) {
        toast.error(error.message);
        setCreating(false);
        return;
      }

      if (data.user) {
        await supabase.from("users").upsert({
          id: data.user.id,
          email: newEmail.trim(),
          name: newName.trim(),
          role: "admin",
        });
      }

      toast.success(`Admin account created for ${newEmail.trim()}.`);
      setNewEmail("");
      setNewPassword("");
      setNewName("");
    } catch {
      toast.error("Failed to create admin account.");
    }
    setCreating(false);
  }

  if (loading) return <p className="text-sm text-[var(--text-muted)]">Loading profile...</p>;
  if (!profile) return <p className="text-sm text-[var(--text-muted)]">Profile not found.</p>;

  const initials = (profile.name ?? profile.email).slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6 max-w-2xl">

      {/* My Profile */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 space-y-4">
        <h3 className="text-base font-semibold text-[var(--text)]">My Profile</h3>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="avatar"
                className="h-16 w-16 rounded-full object-cover border-2 border-[var(--accent)]"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)] text-2xl font-bold text-white">
                {initials}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-white text-xs border-2 border-[var(--surface)] hover:opacity-80 transition"
              title="Change photo"
            >
              ✏️
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <p className="font-semibold text-[var(--text)]">{profile.name || "—"}</p>
            <p className="text-sm text-[var(--text-muted)]">{profile.email}</p>
            <span className="mt-1 inline-block rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs font-semibold text-white">
              {profile.role}
            </span>
          </div>
        </div>
        {uploading && <p className="text-xs text-[var(--text-muted)]">Uploading photo...</p>}

        <div className="grid gap-1">
          <label className="text-xs font-semibold text-[var(--text-muted)]">Display Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="h-10 rounded-lg border border-[var(--line)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div className="grid gap-1">
          <label className="text-xs font-semibold text-[var(--text-muted)]">Email</label>
          <input
            value={profile.email}
            disabled
            className="h-10 rounded-lg border border-[var(--line)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--text-muted)] opacity-60"
          />
        </div>

        <div className="grid gap-1">
          <label className="text-xs font-semibold text-[var(--text-muted)]">Member Since</label>
          <p className="text-sm text-[var(--text)]">
            {new Date(profile.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Create New Admin */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 space-y-4">
        <h3 className="text-base font-semibold text-[var(--text)]">Create New Admin Account</h3>
        <p className="text-sm text-[var(--text-muted)]">New admin will be able to log in at <span className="font-medium">/admin/login</span>.</p>

        <div className="grid gap-1">
          <label className="text-xs font-semibold text-[var(--text-muted)]">Full Name</label>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter full name"
            className="h-10 rounded-lg border border-[var(--line)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div className="grid gap-1">
          <label className="text-xs font-semibold text-[var(--text-muted)]">Email</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter email address"
            className="h-10 rounded-lg border border-[var(--line)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div className="grid gap-1">
          <label className="text-xs font-semibold text-[var(--text-muted)]">Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter password (min 6 characters)"
            className="h-10 rounded-lg border border-[var(--line)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
          />
        </div>

        <button
          onClick={handleCreateAdmin}
          disabled={creating}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {creating ? "Creating..." : "Create Admin"}
        </button>
      </div>

    </div>
  );
}


