"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  User,
  Bank,
  ListChecks,
  Star,
  Question,
  Gear,
  List,
  X,
  SignOut,
  Megaphone,
} from "@phosphor-icons/react/dist/ssr";
import { signOut } from "@/app/actions/auth";
import "./globals.css";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: House },
  { href: "/admin/leads", label: "Leads", icon: User },
  { href: "/admin/bank-products", label: "Bank & Produk", icon: Bank },
  { href: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/admin/sections", label: "Sections", icon: ListChecks },
  { href: "/admin/testimonials", label: "Testimoni", icon: Star },
  { href: "/admin/faq", label: "FAQ", icon: Question },
  { href: "/admin/settings", label: "Pengaturan", icon: Gear },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  async function handleLogout() {
    await signOut();
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="app">
      <input
        type="checkbox"
        id="sidebar-toggle"
        className="sr-only"
        checked={sidebarOpen}
        onChange={() => setSidebarOpen(!sidebarOpen)}
      />

      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="sidebar-header">
          <Link href="/admin" className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="sidebar-logo-text">
              Admin Panel
              <br />
              Kredit Pensiun
            </div>
          </Link>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link${isActive ? " active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon weight="bold" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            onClick={handleLogout}
            className="sidebar-link w-full"
            style={{ cursor: "pointer", background: "none", border: "none" }}
          >
            <SignOut weight="bold" />
            Keluar
          </button>
        </div>
      </aside>

      <div
        className={`sidebar-overlay${sidebarOpen ? " open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className="main">
        <header className="topbar">
          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X weight="bold" />
            ) : (
              <List weight="bold" />
            )}
          </button>

          <div className="topbar-title">
            {NAV_ITEMS.find((item) =>
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href)
            )?.label || "Admin"}
          </div>

          <div className="topbar-right">
            <span className="topbar-admin">Admin</span>
            <div className="topbar-avatar">A</div>
          </div>
        </header>

        <div className="content">{children}</div>
      </div>
    </div>
  );
}
