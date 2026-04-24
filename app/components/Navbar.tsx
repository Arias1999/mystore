"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Navbar({ search, onSearch, cartCount = 0 }: {
  search?: string;
  onSearch?: (v: string) => void;
  cartCount?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div style={styles.header}>
      {/* LOGO */}
      <div style={styles.logo} onClick={() => router.push("/")}>
        <span style={styles.logoIcon}>🛒</span>
        <span style={styles.logoText}>LYRA'S STORE</span>
      </div>

      {/* NAV LINKS */}
      <div style={styles.nav}>
        {[{ label: "Home", path: "/" }, { label: "About", path: "/about" }, { label: "Contact", path: "/contact" }].map(({ label, path }) => (
          <button
            key={path}
            onClick={() => router.push(path)}
            style={{
              ...styles.navBtn,
              ...(pathname === path ? styles.navBtnActive : {}),
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      {onSearch !== undefined && (
        <div style={styles.searchWrapper}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            style={styles.search}
          />
        </div>
      )}

      {/* RIGHT ACTIONS */}
      <div style={styles.actions}>
        <button onClick={() => router.push("/login")} style={styles.loginBtn}>
          Login
        </button>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
    color: "white",
    padding: "0 30px",
    height: "65px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },
  logoIcon: { fontSize: "24px" },
  logoText: { fontSize: "20px", fontWeight: "800", letterSpacing: "1px" },
  nav: { display: "flex", gap: "4px" },
  navBtn: {
    background: "transparent",
    border: "none",
    color: "rgba(255,255,255,0.8)",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    padding: "6px 14px",
    borderRadius: "6px",
    transition: "0.2s",
  },
  navBtnActive: {
    color: "white",
    background: "rgba(255,255,255,0.15)",
    fontWeight: "700",
  },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.15)",
    borderRadius: "25px",
    padding: "6px 14px",
    gap: "8px",
    width: "240px",
  },
  searchIcon: { fontSize: "14px" },
  search: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "white",
    fontSize: "14px",
    width: "100%",
  },
  actions: { display: "flex", alignItems: "center", gap: "12px" },
  loginBtn: {
    padding: "8px 20px",
    background: "white",
    color: "#2563eb",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
    transition: "0.2s",
  },
};
