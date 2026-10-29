"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Building2,
  ExternalLink,
  FileText,
  FolderKanban,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Navigation,
  Settings,
  Sprout,
  UserCircle,
  Users,
  X,
} from "lucide-react";
import { logout } from "@/app/admin/actions/auth";
import { LogoMark } from "@/components/site/logo";
import { cn } from "@/lib/utils";

const groups = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/messages", label: "Messages", icon: Inbox, badge: "unread" as const },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/pages", label: "Page sections", icon: FileText },
      { href: "/admin/activities", label: "Activities", icon: Sprout },
      { href: "/admin/projects", label: "Expansion projects", icon: FolderKanban },
      { href: "/admin/infrastructure", label: "Infrastructure", icon: Building2 },
      { href: "/admin/stats", label: "Stats & figures", icon: BarChart3 },
      { href: "/admin/bullets", label: "Rural development points", icon: ListChecks },
      { href: "/admin/navigation", label: "Navigation & footer", icon: Navigation },
      { href: "/admin/media", label: "Media library", icon: ImageIcon },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/settings", label: "Site settings", icon: Settings },
      { href: "/admin/users", label: "Users", icon: Users, adminOnly: true },
      { href: "/admin/account", label: "My account", icon: UserCircle },
    ],
  },
];

export function AdminSidebar({
  user,
  unread,
}: {
  user: { name: string | null; email: string; role: string };
  unread: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const nav = (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5" aria-label="Admin">
      {groups.map((g) => (
        <div key={g.label}>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{g.label}</p>
          <ul className="mt-2 space-y-0.5">
            {g.items
              .filter((i) => !("adminOnly" in i && i.adminOnly) || user.role === "ADMIN")
              .map((item) => {
                const active = "exact" in item && item.exact ? pathname === item.href : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        active ? "bg-primary/10 font-medium text-primary" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {"badge" in item && unread > 0 && (
                        <span className="rounded-full bg-gold px-1.5 py-0.5 text-[10px] font-bold leading-none text-ink">{unread}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const footer = (
    <div className="border-t border-zinc-200 p-3">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100"
      >
        <ExternalLink className="h-4 w-4" /> View website
      </Link>
      <div className="mt-2 flex items-center gap-3 rounded-md px-3 py-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
          {(user.name || user.email).slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{user.name || user.email}</p>
          <p className="text-[11px] uppercase tracking-wide text-zinc-400">{user.role.toLowerCase()}</p>
        </div>
        <form action={logout}>
          <button type="submit" className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900" aria-label="Sign out" title="Sign out">
            <LogOut className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );

  const brand = (
    <Link href="/admin" className="flex items-center gap-2.5">
      <span className="rounded-full bg-ink p-0.5">
        <LogoMark className="h-8 w-8 sm:h-8 sm:w-8" />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-extrabold tracking-[0.18em] text-ink">CODEMO</span>
        <span className="block text-[10px] font-medium uppercase tracking-wider text-zinc-400">Content manager</span>
      </span>
    </Link>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-zinc-200 bg-white lg:flex">
        <div className="flex h-16 items-center border-b border-zinc-200 px-5">{brand}</div>
        {nav}
        {footer}
      </aside>

      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 lg:hidden">
        {brand}
        <button type="button" onClick={() => setOpen(true)} className="rounded-md p-2 hover:bg-zinc-100" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-4">
              {brand}
              <button type="button" onClick={() => setOpen(false)} className="rounded-md p-2 hover:bg-zinc-100" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            {nav}
            {footer}
          </aside>
        </div>
      )}
    </>
  );
}
