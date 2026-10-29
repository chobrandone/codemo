import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LogoMark } from "@/components/site/logo";

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-screen items-center overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full border border-gold/15" aria-hidden />
      <div className="pointer-events-none absolute -bottom-48 left-1/4 h-[600px] w-[600px] rounded-full border border-leaf/10" aria-hidden />
      <div className="shell py-24">
        <Link href="/" className="inline-flex items-center gap-3">
          <LogoMark />
          <span className="font-body text-base font-extrabold tracking-[0.26em]">CODEMO</span>
        </Link>
        <p className="eyebrow mt-16 text-gold">Error 404</p>
        <h1 className="mt-6 max-w-3xl text-[44px] leading-[1.05] sm:text-[64px]">
          This field is <span className="italic text-gold">still unplanted.</span>
        </h1>
        <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-white/70">
          The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s get you back to solid ground.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex h-[54px] items-center justify-center gap-2.5 bg-gold px-9 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink hover:bg-[#c8972c]"
          >
            Back to home <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
          <Link
            href="/activities"
            className="inline-flex h-[54px] items-center justify-center border border-white/40 px-9 text-[11px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-white hover:text-primary"
          >
            Explore our activities
          </Link>
        </div>
      </div>
    </main>
  );
}
