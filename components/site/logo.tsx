import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("h-10 w-10 shrink-0 sm:h-11 sm:w-11", className)} aria-hidden="true">
      <circle cx="24" cy="24" r="22.5" fill="none" stroke="currentColor" strokeWidth="1.1" className="text-gold" />
      <path d="M24 37V22" stroke="currentColor" strokeWidth="1.4" className="text-leaf" strokeLinecap="round" />
      <path
        d="M24 27c0-6.5 4.2-11.6 10.5-13.5C33.6 20.6 30 26 24 27Z"
        fill="currentColor"
        className="text-leaf"
        opacity="0.95"
      />
      <path d="M24 32c0-5-3.4-9-8.6-10.6C16.2 28 19 32 24 32Z" fill="currentColor" className="text-gold" opacity="0.9" />
    </svg>
  );
}

export function Logo({
  name,
  tagline,
  logoUrl,
  dark,
}: {
  name: string;
  tagline?: string | null;
  logoUrl?: string | null;
  dark?: boolean;
}) {
  return (
    <span className="notranslate flex items-center gap-3" translate="no">
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover sm:h-11 sm:w-11" />
      ) : (
        <LogoMark />
      )}
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-body text-[15px] font-extrabold tracking-[0.26em] sm:text-base",
            dark ? "text-ink" : "text-white",
          )}
        >
          {name}
        </span>
        {tagline && (
          <span
            className={cn(
              "mt-1.5 text-[8.5px] font-medium uppercase tracking-[0.28em]",
              dark ? "text-muted-foreground" : "text-white/65",
            )}
          >
            {tagline}
          </span>
        )}
      </span>
    </span>
  );
}
