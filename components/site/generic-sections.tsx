import type { Section } from "@/lib/content";
import { asItems, cn } from "@/lib/utils";
import { CtaSection, PageHero, StatFigure } from "./sections";
import { AccentHeading, ButtonLink, Eyebrow, Reveal, SiteImage } from "./primitives";
import { RichText } from "./rich-text";

/**
 * Reusable blocks that can be added to any page (including CMS-created pages).
 * Returns null for types this module doesn't handle.
 */
export function GenericSection({ section: s }: { section: Section }) {
  switch (s.type || s.key) {
    case "page-hero":
    case "hero":
      return <PageHero section={s} />;
    case "cta":
      return <CtaSection section={s} />;
    case "text":
      return <TextBlock s={s} />;
    case "text-image":
      return <TextImageBlock s={s} />;
    case "cards":
      return <CardsBlock s={s} />;
    case "gallery":
      return <GalleryBlock s={s} />;
    case "stats":
      return <StatsBlock s={s} />;
    default:
      return null;
  }
}

function Heading({ s, center, light }: { s: Section; center?: boolean; light?: boolean }) {
  return (
    <>
      <Eyebrow tone={light ? "gold" : "earth"} className={center ? "justify-center" : undefined}>
        {s.eyebrow}
      </Eyebrow>
      {s.heading && (
        <h2 className={cn("section-title", center && "mx-auto max-w-3xl", light && "text-white")}>
          <AccentHeading text={s.heading} accent={s.headingAccent} />
        </h2>
      )}
    </>
  );
}

function Buttons({ s, center }: { s: Section; center?: boolean }) {
  if (!(s.primaryLabel && s.primaryHref) && !(s.secondaryLabel && s.secondaryHref)) return null;
  return (
    <div className={cn("mt-9 flex flex-col gap-4 sm:flex-row", center && "justify-center")}>
      {s.primaryLabel && s.primaryHref && (
        <ButtonLink href={s.primaryHref} variant="primary">
          {s.primaryLabel}
        </ButtonLink>
      )}
      {s.secondaryLabel && s.secondaryHref && (
        <ButtonLink href={s.secondaryHref} variant="outline-dark">
          {s.secondaryLabel}
        </ButtonLink>
      )}
    </div>
  );
}

function TextBlock({ s }: { s: Section }) {
  return (
    <section className="bg-white py-20 lg:py-24">
      <Reveal className="shell max-w-3xl text-center">
        <Heading s={s} center />
        <RichText html={s.body} className="mt-6 text-left text-[15px] leading-relaxed text-muted-foreground sm:text-center" />
        <Buttons s={s} center />
      </Reveal>
    </section>
  );
}

function TextImageBlock({ s }: { s: Section }) {
  const imageLeft = s.subheading?.trim().toLowerCase() === "left";
  return (
    <section className="overflow-hidden bg-white py-20 lg:py-28">
      <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className={cn("lg:col-span-6", imageLeft && "lg:order-2")}>
          <Heading s={s} />
          <RichText html={s.body} className="mt-6 text-[15px] leading-relaxed text-muted-foreground" />
          <Buttons s={s} />
        </Reveal>
        {s.image && (
          <Reveal className={cn("relative h-[320px] overflow-hidden sm:h-[420px] lg:col-span-6 lg:h-[480px]", imageLeft && "lg:order-1")} delay={120}>
            <SiteImage src={s.image} alt={s.imageAlt ?? ""} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
          </Reveal>
        )}
      </div>
    </section>
  );
}

function CardsBlock({ s }: { s: Section }) {
  const items = asItems(s.items);
  return (
    <section className="bg-cream py-20 lg:py-28">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <Heading s={s} />
          <RichText html={s.body} className="mt-5 text-[15px] leading-relaxed text-muted-foreground" />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <Reveal as="article" key={i} delay={(i % 3) * 90} className="flex flex-col bg-white">
              {it.image && (
                <div className="relative h-56 overflow-hidden">
                  <SiteImage src={it.image} alt={it.alt ?? it.title ?? ""} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" />
                </div>
              )}
              <div className="flex-1 p-7">
                <span className="font-body text-[10px] font-bold uppercase tracking-[0.28em] text-leaf">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {it.title && <h3 className="mt-3 text-2xl leading-snug text-ink">{it.title}</h3>}
                {it.text && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{it.text}</p>}
              </div>
            </Reveal>
          ))}
        </div>
        <Buttons s={s} />
      </div>
    </section>
  );
}

function GalleryBlock({ s }: { s: Section }) {
  const items = asItems(s.items).filter((it) => it.image);
  return (
    <section className="bg-mist py-20 lg:py-24">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <Heading s={s} />
          <RichText html={s.body} className="mt-5 text-[15px] leading-relaxed text-muted-foreground" />
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={i} delay={(i % 3) * 80}>
              <figure className="group">
                <div className="relative h-[200px] overflow-hidden sm:h-[280px] lg:h-[320px]">
                  <SiteImage
                    src={it.image}
                    alt={it.alt ?? it.title ?? ""}
                    fill
                    sizes="(min-width:1024px) 33vw, 50vw"
                    className="object-cover transition-transform duration-[1100ms] group-hover:scale-[1.05]"
                  />
                </div>
                {(it.title || it.alt) && (
                  <figcaption className="mt-3 text-[13px] text-muted-foreground">{it.title || it.alt}</figcaption>
                )}
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsBlock({ s }: { s: Section }) {
  const items = asItems(s.items).filter((it) => it.value);
  return (
    <section className="bg-ink py-20 lg:py-24">
      <div className="shell">
        <Reveal className="max-w-3xl">
          <Heading s={s} light />
          <RichText html={s.body} className="rich-light mt-5 text-[15px] leading-relaxed text-white/70" />
        </Reveal>
        <div
          className={cn(
            "mt-12 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2",
            items.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
          )}
        >
          {items.map((it, i) => (
            <Reveal key={i} delay={(i % 4) * 80} className="bg-ink p-8 lg:p-10">
              <StatFigure value={it.value ?? ""} label={it.title ?? ""} description={it.text} dark />
            </Reveal>
          ))}
        </div>
        {s.footnote && (
          <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">{s.footnote}</p>
        )}
      </div>
    </section>
  );
}

/** Types that render as a full-bleed dark hero (used to decide whether a page needs a header backdrop). */
export const HERO_TYPES = ["hero", "page-hero"];
