export type AppRole = "admin" | "moderator" | "user";

type AuthUserLike = {
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
};

function normalizeRole(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const role = value.trim().toLowerCase();
  return role.length > 0 ? role : null;
}

export function getRole(user: AuthUserLike | null | undefined): AppRole {
  const role =
    normalizeRole(user?.user_metadata?.["role"]) ??
    normalizeRole(user?.app_metadata?.["role"]);
  if (role === "admin") return "admin";
  if (role === "moderator") return "moderator";
  return "user";
}

export function isAdminUser(user: AuthUserLike | null | undefined): boolean {
  const role = getRole(user);
  return role === "admin" || role === "moderator";
}
