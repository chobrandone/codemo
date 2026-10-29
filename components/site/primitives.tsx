import Link from "next/link";
import Image, { type ImageProps } from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  tone = "earth",
  className,
}: {
  children: React.ReactNode;
  tone?: "earth" | "gold" | "leaf";
  className?: string;
}) {
  if (!children) return null;
  const color = tone === "gold" ? "text-gold" : tone === "leaf" ? "text-leaf" : "text-earth";
  return <p className={cn("eyebrow", color, className)}>{children}</p>;
}

/** Renders a heading and wraps `accent` (if present in the text) in italic gold. */
export function AccentHeading({ text, accent }: { text?: string | null; accent?: string | null }) {
  if (!text) return null;
  if (!accent || !text.includes(accent)) return <>{text}</>;
  const [before, ...rest] = text.split(accent);
  return (
    <>
      {before}
      <span className="italic text-gold">{accent}</span>
      {rest.join(accent)}
    </>
  );
}

type ButtonVariant = "gold" | "outline-light" | "primary" | "outline-dark";
const buttonVariants: Record<ButtonVariant, string> = {
  gold: "bg-gold text-ink hover:bg-[#c8972c] shadow-[0_14px_34px_-18px_rgba(214,166,58,0.9)]",
  "outline-light": "border border-white/40 text-white hover:bg-white hover:text-primary hover:border-white",
  primary: "bg-primary text-white hover:bg-deep shadow-[0_14px_34px_-20px_rgba(31,91,54,0.9)]",
  "outline-dark": "border border-primary/30 text-primary hover:bg-primary hover:text-white",
};

export function ButtonLink({
  href,
  children,
  variant = "gold",
  size = "lg",
  className,
  arrow = true,
}: {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: "lg" | "md";
  className?: string;
  arrow?: boolean;
}) {
  const external = /^https?:\/\//.test(href);
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={cn(
        "group inline-flex items-center justify-center gap-2.5 font-semibold uppercase tracking-[0.16em] transition-all duration-300",
        size === "lg" ? "h-[54px] px-9 text-[11px]" : "h-11 px-6 text-[10.5px]",
        buttonVariants[variant],
        className,
      )}
    >
      {children}
      {arrow && (
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
      )}
    </Link>
  );
}

export function TextLink({ href, children, light }: { href: string; children: React.ReactNode; light?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 border-b pb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors",
        light
          ? "border-white/30 text-white hover:border-gold hover:text-gold"
          : "border-primary/25 text-primary hover:border-gold",
      )}
    >
      {children}
      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
    </Link>
  );
}

/** next/image wrapper: optimises local and configured-bucket images, falls back to plain loading otherwise. */
export function SiteImage({ src, alt, className, ...rest }: Omit<ImageProps, "src" | "alt"> & { src?: string | null; alt?: string | null }) {
  if (!src) return null;
  const bucket = process.env.S3_PUBLIC_URL;
  const optimizable = src.startsWith("/") || (!!bucket && src.startsWith(bucket));
  return <Image src={src} alt={alt ?? ""} className={className} unoptimized={!optimizable} {...rest} />;
}

export function StatusPill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "bg-ink/90 px-3.5 py-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className,
  fade,
}: {
  children: React.ReactNode;
  as?: "div" | "li" | "article" | "section";
  delay?: number;
  className?: string;
  fade?: boolean;
}) {
  return (
    <Tag
      data-reveal={fade ? "fade" : ""}
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
