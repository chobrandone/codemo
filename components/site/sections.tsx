import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Activity } from "@prisma/client";
import type { Section } from "@/lib/content";
import { CountUp } from "./count-up";
import { AccentHeading, ButtonLink, Eyebrow, Reveal, SiteImage, StatusPill } from "./primitives";
import { RichText } from "./rich-text";

/** Dark hero used at the top of inner pages. */
export function PageHero({
  section,
  fallbackTitle,
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt,
  children,
}: {
  section?: Section;
  fallbackTitle?: string;
  eyebrow?: string | null;
  title?: string | null;
  subtitle?: React.ReactNode;
  image?: string | null;
  imageAlt?: string | null;
  children?: React.ReactNode;
}) {
  const img = image ?? section?.image;
  return (
    <section className="relative isolate flex min-h-[62vh] items-end overflow-hidden bg-ink pb-12 pt-36 sm:min-h-[66vh] lg:pb-16 lg:pt-44">
      {img && (
        <SiteImage
          src={img}
          alt={imageAlt ?? section?.imageAlt ?? ""}
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
      )}
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(19,42,37,0.9),rgba(19,42,37,0.45),rgba(0,0,0,0))]"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(19,42,37),rgba(19,42,37,0.45),rgba(0,0,0,0))]"
        aria-hidden
      />
      <div className="shell">
        <div className="max-w-3xl motion-safe:animate-rise">
          <Eyebrow tone="gold">{eyebrow ?? section?.eyebrow}</Eyebrow>
          <h1 className="mt-6 text-[38px] leading-[1.05] text-white sm:text-[52px] lg:text-[66px]">
            <AccentHeading text={title ?? section?.heading ?? fallbackTitle} accent={section?.headingAccent} />
          </h1>
          {subtitle ? (
            <div className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/75 sm:text-[17px]">{subtitle}</div>
          ) : (
            <RichText
              html={section?.body}
              className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/75 sm:text-[17px]"
            />
          )}
          {children}
        </div>
      </div>
    </section>
  );
}

export function CtaSection({ section }: { section?: Section }) {
  if (!section) return null;
  return (
    <section className="relative isolate overflow-hidden bg-deep">
      <SiteImage
        src={section.image}
        alt={section.imageAlt ?? ""}
        fill
        sizes="100vw"
        className="-z-20 object-cover opacity-25"
      />
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(19,42,37),rgba(19,42,37,0.9),rgba(24,63,39,0.7))]"
        aria-hidden
      />
      <div className="shell py-20 text-center lg:py-28">
        <Reveal>
          <Eyebrow tone="gold" className="justify-center">
            {section.eyebrow}
          </Eyebrow>
          <h2 className="mx-auto mt-5 max-w-3xl text-3xl leading-tight text-white sm:text-4xl lg:text-[46px]">
            <AccentHeading text={section.heading} accent={section.headingAccent} />
          </h2>
          <RichText
            html={section.body}
            className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base"
          />
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {section.primaryLabel && section.primaryHref && (
              <ButtonLink href={section.primaryHref}>{section.primaryLabel}</ButtonLink>
            )}
            {section.secondaryLabel && section.secondaryHref && (
              <ButtonLink href={section.secondaryHref} variant="outline-light">
                {section.secondaryLabel}
              </ButtonLink>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

type CardActivity = Pick<
  Activity,
  "id" | "slug" | "number" | "title" | "status" | "summary" | "currentCapacity" | "expansionPlan" | "coverImage" | "coverAlt"
>;

export function ActivityCard({ activity, number }: { activity: CardActivity; number?: string }) {
  return (
    <Link
      href={`/activities/${activity.slug}`}
      className="group flex h-full flex-col bg-white transition-shadow duration-500 hover:shadow-[0_30px_60px_-40px_rgba(20,43,38,0.55)]"
    >
      <div className="relative h-60 overflow-hidden sm:h-64">
        <SiteImage
          src={activity.coverImage}
          alt={activity.coverAlt ?? activity.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.06]"
        />
        <StatusPill className="absolute left-0 top-0">{activity.status}</StatusPill>
      </div>
      <div className="flex flex-1 flex-col p-7 lg:p-8">
        <span className="font-body text-[10px] font-bold uppercase tracking-[0.28em] text-leaf">
          {number ?? activity.number}
        </span>
        <h3 className="mt-3 text-2xl leading-snug text-ink">{activity.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{activity.summary}</p>
        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-5 text-xs">
          {activity.currentCapacity && (
            <div>
              <dt className="text-muted-foreground">Current capacity</dt>
              <dd className="mt-1 font-semibold text-ink">{activity.currentCapacity}</dd>
            </div>
          )}
          {activity.expansionPlan && (
            <div>
              <dt className="text-muted-foreground">Expansion plan</dt>
              <dd className="mt-1 font-semibold text-ink">{activity.expansionPlan}</dd>
            </div>
          )}
        </dl>
        <span className="mt-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          Learn More
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

/** Horizontal row of count-up figures (cream strip, light or dark). */
export function StatFigure({
  value,
  label,
  description,
  dark,
  size = "lg",
}: {
  value: string;
  label: string;
  description?: string | null;
  dark?: boolean;
  size?: "lg" | "md";
}) {
  return (
    <div>
      <p
        className={
          (size === "lg" ? "text-[40px] lg:text-[52px] " : "text-[34px] lg:text-[42px] ") +
          "font-display leading-none " +
          (dark ? "text-gold" : "text-primary")
        }
      >
        <CountUp value={value} />
      </p>
      <p
        className={
          "mt-3 text-[10px] font-bold uppercase tracking-[0.24em] " + (dark ? "text-white/85" : "text-earth")
        }
      >
        {label}
      </p>
      {description && (
        <p className={"mt-2.5 text-[13px] leading-relaxed " + (dark ? "text-white/55" : "text-muted-foreground")}>
          {description}
        </p>
      )}
    </div>
  );
}
