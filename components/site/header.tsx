"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

type NavItem = { id: string; label: string; href: string };

export function Header({
  name,
  tagline,
  logoUrl,
  address,
  phone,
  email,
  whatsapp,
  nav,
}: {
  name: string;
  tagline?: string | null;
  logoUrl?: string | null;
  address: string;
  phone?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  nav: NavItem[];
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => {
    if (href.includes("#")) return false;
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <a
        href="#main"
        className="sr-only z-[60] bg-gold px-4 py-2 text-sm font-semibold text-ink focus:not-sr-only focus:absolute focus:left-4 focus:top-2"
      >
        Skip to content
      </a>
      <div className="bg-ink text-white/65">
        <div className="shell flex h-9 items-center justify-between gap-4 text-[9.5px] font-medium uppercase tracking-[0.15em]">
          <p className="flex min-w-0 items-center gap-2">
            <MapPin className="h-3 w-3 shrink-0 text-gold" aria-hidden />
            <span className="truncate">{address}</span>
          </p>
          <div className="hidden items-center gap-7 md:flex">
            {phone && (
              <span className="flex items-center gap-2">
                <Phone className="h-3 w-3 text-gold" aria-hidden />
                {phone}
              </span>
            )}
            {email && (
              <span className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-gold" aria-hidden />
                {email}
              </span>
            )}
            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-white transition-colors hover:text-gold"
              >
                WhatsApp <ArrowUpRight className="h-3 w-3" aria-hidden />
              </a>
            )}
          </div>
          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="text-white transition-colors hover:text-gold md:hidden"
            >
              WhatsApp
            </a>
          )}
        </div>
      </div>

      <div
        className={cn(
          "transition-all duration-500",
          scrolled || open ? "bg-ink/95 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.6)] backdrop-blur-md" : "bg-transparent",
        )}
      >
        <div className="shell flex h-[68px] items-center justify-between gap-6 lg:h-[76px]">
          <Link href="/">
            <Logo name={name} tagline={tagline} logoUrl={logoUrl} />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative py-2 text-[10.5px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 hover:text-white",
                    active ? "text-white" : "text-white/80",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-300",
                      active ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:block">
            <Link
              href="/contact"
              className="group inline-flex h-11 items-center justify-center gap-2.5 bg-gold px-6 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink transition-all duration-300 hover:bg-[#c8972c]"
            >
              Partner With Us
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center text-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <div
          id="mobile-menu"
          hidden={!open}
          className="h-[calc(100dvh-104px)] overflow-y-auto border-t border-white/10 bg-ink lg:hidden"
        >
          <nav className="shell flex flex-col py-6" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "border-b border-white/10 py-4 font-display text-2xl transition-colors hover:text-gold",
                  isActive(item.href) ? "text-gold" : "text-white",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-8 inline-flex h-[54px] items-center justify-center gap-2.5 bg-gold text-[11px] font-semibold uppercase tracking-[0.16em] text-ink"
            >
              Partner With Us <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
