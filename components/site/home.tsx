import { Check } from "lucide-react";
import type { Activity, BulletPoint, InfrastructureItem, Project, Stat } from "@prisma/client";
import type { Section } from "@/lib/content";
import { ActivityCard, StatFigure } from "./sections";
import { AccentHeading, ButtonLink, Eyebrow, Reveal, SiteImage, TextLink } from "./primitives";
import { RichText } from "./rich-text";

const statValue = (s: Pick<Stat, "value" | "suffix">) => `${s.value}${s.suffix ?? ""}`;

export function HomeHero({ section, facts }: { section: Section; facts: Stat[] }) {
  return (
    <section className="relative isolate flex min-h-[94vh] flex-col justify-end overflow-hidden bg-ink">
      <SiteImage
        src={section.image}
        alt={section.imageAlt ?? ""}
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(19,42,37,0.85),rgba(19,42,37,0.4),rgb(19,42,37))]"
        aria-hidden
      />
      <div className="shell pb-10 pt-40 lg:pb-14">
        <div className="motion-safe:animate-rise">
          <Eyebrow tone="gold" className="max-w-xl">
            {section.eyebrow}
          </Eyebrow>
          <h1 className="mt-6 max-w-4xl text-[36px] leading-[1.03] tracking-[-0.015em] text-white sm:text-[54px] lg:text-[76px]">
            <AccentHeading text={section.heading} accent={section.headingAccent} />
          </h1>
          <RichText
            html={section.body}
            className="mt-7 max-w-xl text-[15px] leading-relaxed text-white/75 sm:text-[17px]"
          />
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            {section.primaryLabel && section.primaryHref && (
              <ButtonLink href={section.primaryHref}>{section.primaryLabel}</ButtonLink>
            )}
            {section.secondaryLabel && section.secondaryHref && (
              <ButtonLink href={section.secondaryHref} variant="outline-light">
                {section.secondaryLabel}
              </ButtonLink>
            )}
          </div>
        </div>
        {facts.length > 0 && (
          <div className="motion-safe:animate-rise-late">
            <ul className="mt-16 grid gap-x-8 gap-y-4 border-t border-white/15 pt-7 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
              {facts.map((f) => (
                <li
                  key={f.id}
                  className="flex gap-3 text-[10px] font-semibold uppercase leading-relaxed tracking-[0.18em] text-white/70"
                >
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-gold" aria-hidden />
                  <span>
                    {f.label}: <span className="text-white">{statValue(f)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export function CooperativeSection({ section, stats }: { section: Section; stats: Stat[] }) {
  return (
    <section className="overflow-hidden bg-white py-20 lg:py-28">
      <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-6">
          <div className="relative pb-10 pr-4 sm:pr-10">
            <div className="relative h-[360px] overflow-hidden sm:h-[480px] lg:h-[540px]">
              <SiteImage
                src={section.image}
                alt={section.imageAlt ?? ""}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            {section.image2 && (
              <div className="absolute bottom-0 right-0 w-[42%] border-[6px] border-white shadow-xl">
                <div className="relative h-32 lg:h-44">
                  <SiteImage
                    src={section.image2}
                    alt={section.image2Alt ?? ""}
                    fill
                    sizes="(min-width: 1024px) 20vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            <div className="absolute -left-4 -top-4 -z-10 h-40 w-40 dot-grid" aria-hidden />
          </div>
        </Reveal>
        <Reveal className="lg:col-span-6" delay={120}>
          <Eyebrow>{section.eyebrow}</Eyebrow>
          <h2 className="section-title">
            <AccentHeading text={section.heading} accent={section.headingAccent} />
          </h2>
          <RichText html={section.body} className="mt-6 text-[15px] leading-relaxed text-muted-foreground" />
          {stats.length > 0 && (
            <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-border pt-8 sm:grid-cols-4">
              {stats.map((s) => (
                <StatFigure key={s.id} value={statValue(s)} label={s.label} size="md" />
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export function ActivitiesSection({ section, activities }: { section: Section; activities: Activity[] }) {
  return (
    <section className="bg-cream py-20 lg:py-28">
      <div className="shell">
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Eyebrow>{section.eyebrow}</Eyebrow>
            <h2 className="section-title">
              <AccentHeading text={section.heading} accent={section.headingAccent} />
            </h2>
            <RichText html={section.body} className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground" />
          </div>
          {section.primaryLabel && section.primaryHref && (
            <TextLink href={section.primaryHref}>{section.primaryLabel}</TextLink>
          )}
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {activities.map((a, i) => (
            <Reveal key={a.id} delay={i * 100}>
              <ActivityCard activity={a} number={String(i + 1).padStart(2, "0")} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InfrastructureSection({ section, items }: { section: Section; items: InfrastructureItem[] }) {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Eyebrow>{section.eyebrow}</Eyebrow>
            <h2 className="section-title">
              <AccentHeading text={section.heading} accent={section.headingAccent} />
            </h2>
            <RichText html={section.body} className="mt-6 max-w-md text-[15px] leading-relaxed text-muted-foreground" />
            {section.image && (
              <div className="relative mt-10 h-[280px] overflow-hidden sm:h-[340px] lg:h-[300px]">
                <SiteImage
                  src={section.image}
                  alt={section.imageAlt ?? ""}
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </Reveal>
        <ol className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
          {items.map((item, i) => (
            <Reveal
              as="li"
              key={item.id}
              delay={(i % 2) * 80}
              className="flex gap-5 border-b border-border py-7 first:pt-0 sm:[&:nth-child(2)]:pt-0"
            >
              <span className="pt-1 font-body text-[10px] font-bold tracking-[0.2em] text-leaf">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-[19px] leading-snug text-ink sm:text-xl">{item.title}</h3>
                {item.description && (
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                )}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function VisionSection({ section, stats }: { section: Section; stats: Stat[] }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <SiteImage
        src={section.image}
        alt={section.imageAlt ?? ""}
        fill
        sizes="100vw"
        className="-z-20 object-cover opacity-20"
      />
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom_right,rgb(19,42,37),rgba(19,42,37,0.95),rgba(24,63,39,0.9))]"
        aria-hidden
      />
      <div className="shell py-20 lg:py-28">
        <Reveal className="max-w-3xl">
          <Eyebrow tone="gold">{section.eyebrow}</Eyebrow>
          <h2 className="mt-5 text-[30px] leading-[1.12] text-white sm:text-4xl lg:text-[48px]">
            <AccentHeading text={section.heading} accent={section.headingAccent} />
          </h2>
          <RichText html={section.body} className="rich-light mt-5 text-[15px] leading-relaxed text-white/70" />
        </Reveal>
        <div className="mt-14 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 90} className="bg-ink/80 p-8 lg:p-10">
              <StatFigure value={statValue(s)} label={s.label} description={s.description} dark />
            </Reveal>
          ))}
        </div>
        {section.footnote && (
          <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">
            {section.footnote}
          </p>
        )}
      </div>
    </section>
  );
}

export function RuralSection({ section, bullets }: { section: Section; bullets: BulletPoint[] }) {
  return (
    <section className="overflow-hidden bg-white py-20 lg:py-28">
      <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-6">
          <Eyebrow>{section.eyebrow}</Eyebrow>
          <h2 className="section-title">
            <AccentHeading text={section.heading} accent={section.headingAccent} />
          </h2>
          <RichText html={section.body} className="mt-6 text-[15px] leading-relaxed text-muted-foreground" />
          {bullets.length > 0 && (
            <ul className="mt-8 space-y-3.5">
              {bullets.map((b) => (
                <li key={b.id} className="flex items-start gap-3.5 text-[15px] text-ink">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf/15 text-leaf">
                    <Check className="h-3 w-3" aria-hidden />
                  </span>
                  {b.text}
                </li>
              ))}
            </ul>
          )}
          {section.primaryLabel && section.primaryHref && (
            <ButtonLink href={section.primaryHref} variant="primary" className="mt-10">
              {section.primaryLabel}
            </ButtonLink>
          )}
        </Reveal>
        <Reveal className="lg:col-span-6" delay={120}>
          <div className="relative">
            <div className="relative h-[340px] overflow-hidden sm:h-[440px] lg:h-[520px]">
              <SiteImage
                src={section.image}
                alt={section.imageAlt ?? ""}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            {section.footnote && (
              <div className="absolute -bottom-6 left-6 max-w-[260px] border-l-2 border-gold bg-white p-5 shadow-[0_24px_50px_-30px_rgba(19,42,37,0.6)] sm:left-10">
                <p className="font-display text-[15px] leading-snug text-ink">{section.footnote}</p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ProjectsSection({ section, projects }: { section: Section; projects: Project[] }) {
  return (
    <section id="projects" className="scroll-mt-24 bg-mist py-20 lg:py-28">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <Eyebrow>{section.eyebrow}</Eyebrow>
          <h2 className="section-title">
            <AccentHeading text={section.heading} accent={section.headingAccent} />
          </h2>
          <RichText html={section.body} className="mt-5 text-[15px] leading-relaxed text-muted-foreground" />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal as="article" key={p.id} delay={(i % 3) * 90} className="group relative overflow-hidden bg-ink">
              <div className="relative h-[300px] md:h-[340px]">
                <SiteImage
                  src={p.image}
                  alt={p.imageAlt ?? p.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                />
              </div>
              <div
                className="absolute inset-0 bg-[linear-gradient(to_top,rgb(19,42,37),rgba(19,42,37,0.45),rgba(0,0,0,0))]"
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <p className="flex items-center gap-2.5 text-[9.5px] font-bold uppercase tracking-[0.22em]">
                  <span className="text-gold">{p.category}</span>
                  <span className="h-1 w-1 rounded-full bg-white/40" aria-hidden />
                  <span className="text-white/65">{p.location}</span>
                </p>
                <h3 className="mt-2.5 text-[22px] leading-snug text-white lg:text-2xl">{p.title}</h3>
                <p className="mt-2 max-w-md text-[13px] leading-relaxed text-white/70">{p.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
