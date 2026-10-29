import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import type { Settings } from "@/lib/content";
import { Logo } from "./logo";

type LinkItem = { id: string; label: string; href: string };

export function Footer({
  settings,
  whatsapp,
  quickLinks,
  activityLinks,
}: {
  settings: Settings;
  whatsapp: string | null;
  quickLinks: LinkItem[];
  activityLinks: LinkItem[];
}) {
  const socials = (Array.isArray(settings.socialLinks) ? settings.socialLinks : []) as { label: string; href: string }[];
  return (
    <footer className="relative overflow-hidden bg-ink text-white/70">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full border border-gold/15"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-1/3 h-[520px] w-[520px] rounded-full border border-leaf/10"
        aria-hidden="true"
      />
      <div className="shell relative py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link href="/">
              <Logo name={settings.shortName} tagline={settings.tagline} logoUrl={settings.logoUrl} />
            </Link>
            {settings.footerTagline && (
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/65">{settings.footerTagline}</p>
            )}
            <div className="mt-7 flex flex-wrap gap-3">
              {whatsapp && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center gap-2 border border-white/25 px-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-gold hover:text-gold"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  WhatsApp
                </a>
              )}
              {socials.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center border border-white/25 px-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-gold hover:text-gold"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Quick Links" links={quickLinks} className="lg:col-span-2" />
          <FooterColumn title="Activities" links={activityLinks} className="lg:col-span-3" />

          <div className="lg:col-span-3">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.26em] text-gold">Contact</h2>
            <ul className="mt-5 space-y-3 text-sm">
              <li>{settings.address}</li>
              {settings.phone && <li>{settings.phone}</li>}
              {settings.email && <li>{settings.email}</li>}
            </ul>
            <Link
              href="/contact"
              className="group mt-6 inline-flex items-center gap-2 border-b border-white/30 pb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:border-gold hover:text-gold"
            >
              Send a message
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-7 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {settings.copyright || settings.siteName}
          </p>
          {settings.tagline && <p className="uppercase tracking-[0.24em]">{settings.tagline}</p>}
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links, className }: { title: string; links: LinkItem[]; className?: string }) {
  return (
    <div className={className}>
      <h2 className="text-[10px] font-bold uppercase tracking-[0.26em] text-gold">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.id}>
            <Link className="transition-colors hover:text-white" href={l.href}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
