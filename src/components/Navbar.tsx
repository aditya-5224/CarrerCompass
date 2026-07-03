"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { label: "Home",     href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Contact Us", href: "/#contact" },
  { label: "Stats",    href: "/profile#stats" },
];

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router   = useRouter();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Hide navbar on auth page
  const isAuthPage = pathname?.startsWith("/auth");
  if (isAuthPage) return null;

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    router.push("/auth");
  };

  const displayName = user?.displayName || user?.email?.split("@")[0] || "U";
  const initial     = displayName[0].toUpperCase();

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}>
      {/* ── Logo (flush left, no indent) ── */}
      <Link href="/" className={styles.logo}>
        <div className={styles.logoIcon}>
          <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
            <circle cx="18" cy="18" r="16" stroke="url(#ng)" strokeWidth="2"/>
            <path d="M18 6 L22 18 L18 30 L14 18 Z" fill="url(#ng2)" opacity=".9"/>
            <circle cx="18" cy="18" r="3" fill="#fff"/>
            <defs>
              <linearGradient id="ng" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop stopColor="#818cf8"/><stop offset="1" stopColor="#a5b4fc"/>
              </linearGradient>
              <linearGradient id="ng2" x1="0" y1="0" x2="0" y2="36" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a5b4fc"/><stop offset="1" stopColor="#818cf8"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span className={styles.logoText}>CareerCompass</span>
      </Link>

      {/* ── Nav links + profile ── */}
      <div className={styles.right}>
        <ul className={styles.navLinks}>
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`${styles.navLink} ${pathname === l.href ? styles.navLinkActive : ""}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* ── Auth / Profile ── */}
        {loading ? (
          <div className={styles.avatarSkeleton} />
        ) : user ? (
          <div className={styles.profileWrapper} ref={dropdownRef}>
            <button
              className={styles.avatarBtn}
              onClick={() => setDropdownOpen((o) => !o)}
              aria-label="Profile menu"
              aria-expanded={dropdownOpen}
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt={displayName} className={styles.avatarImg} />
              ) : (
                <span className={styles.avatarInitial}>{initial}</span>
              )}
              <span className={styles.avatarChevron}>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </span>
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className={styles.dropdown}>
                {/* User info */}
                <div className={styles.dropdownUser}>
                  {user.photoURL
                    ? <img src={user.photoURL} alt="" className={styles.dropdownAvatar} />
                    : <div className={styles.dropdownAvatarFallback}>{initial}</div>
                  }
                  <div>
                    <p className={styles.dropdownName}>{displayName}</p>
                    <p className={styles.dropdownEmail}>{user.email}</p>
                  </div>
                </div>

                <div className={styles.dropdownDivider} />

                <Link href="/profile" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  My Profile
                </Link>
                <Link href="/profile#activity" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                  Activity
                </Link>

                <div className={styles.dropdownDivider} />

                <button className={`${styles.dropdownItem} ${styles.dropdownSignOut}`} onClick={handleLogout}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/auth" className={styles.signInBtn}>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
