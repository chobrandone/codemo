import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getActivities, getSections, sectionMap, type Section } from "@/lib/content";
import { CtaSection, PageHero } from "@/components/site/sections";
import { Reveal, SiteImage } from "@/components/site/primitives";
import { CountUp } from "@/components/site/count-up";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const hero = sectionMap(await getSections("ACTIVITIES")).hero;
  return {
    title: "Activities",
    description: hero?.body?.replace(/<[^>]+>/g, "") || undefined,
    alternates: { canonical: "/activities" },
  };
}

export default async function ActivitiesPage() {
  const [sections, activities] = await Promise.all([getSections("ACTIVITIES"), getActivities()]);

  const render = (s: Section) => {
    switch (s.key) {
      case "hero":
        return <PageHero key={s.id} section={s} />;
      case "list":
        return (
          <section key={s.id} className="bg-white py-20 lg:py-28">
            <div className="shell space-y-20 lg:space-y-28">
              {activities.map((a, i) => {
                const flip = i % 2 === 1;
                return (
                  <article key={a.id} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                    <Reveal className={cn("relative lg:col-span-7", flip && "lg:order-2")}>
                      <Link href={`/activities/${a.slug}`} className="group block overflow-hidden" tabIndex={-1} aria-hidden>
                        <div className="relative h-[300px] sm:h-[420px] lg:h-[480px]">
                          <SiteImage
                            src={a.coverImage}
                            alt={a.coverAlt ?? a.title}
                            fill
                            sizes="(min-width:1024px) 55vw, 100vw"
                            className="object-cover transition-transform duration-[1100ms] group-hover:scale-[1.04]"
                          />
                        </div>
                      </Link>
                      {a.highlightValue && (
                        <div
                          className={cn(
                            "absolute -bottom-8 bg-ink px-7 py-6 text-white shadow-xl sm:px-9",
                            flip ? "right-6 lg:-left-8 lg:right-auto" : "right-6 lg:-right-8",
                          )}
                        >
                          <p className="font-display text-4xl leading-none text-gold lg:text-5xl">
                            <CountUp value={a.highlightValue} />
                          </p>
                          <p className="mt-2 max-w-[200px] text-[9.5px] font-bold uppercase tracking-[0.22em] text-white/75">
                            {a.highlightLabel}
                          </p>
                        </div>
                      )}
                    </Reveal>
                    <Reveal className={cn("lg:col-span-5", flip && "lg:order-1")} delay={120}>
                      <div className="flex items-center gap-4">
                        <span className="font-display text-5xl leading-none text-primary/15">{a.number}</span>
                        <span className="bg-mist px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
                          {a.status}
                        </span>
                      </div>
                      <h2 className="mt-5 text-[30px] leading-[1.1] text-ink sm:text-4xl">{a.title}</h2>
                      <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">{a.summary}</p>
                      <dl className="mt-8 grid grid-cols-2 gap-6 border-y border-border py-6">
                        <div>
                          <dt className="text-[9.5px] font-bold uppercase tracking-[0.22em] text-earth">Current capacity</dt>
                          <dd className="mt-2 text-sm font-semibold text-ink">{a.currentCapacity}</dd>
                        </div>
                        <div>
                          <dt className="text-[9.5px] font-bold uppercase tracking-[0.22em] text-earth">Expansion plan</dt>
                          <dd className="mt-2 text-sm font-semibold text-ink">{a.expansionPlan}</dd>
                        </div>
                      </dl>
                      <Link
                        href={`/activities/${a.slug}`}
                        className="group mt-8 inline-flex items-center gap-2 border-b border-primary/25 pb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:border-gold"
                      >
                        {s.primaryLabel || "Learn More"}
                        <span className="sr-only"> about {a.title}</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
                      </Link>
                    </Reveal>
                  </article>
                );
              })}
            </div>
          </section>
        );
      case "cta":
        return <CtaSection key={s.id} section={s} />;
      default:
        return null;
    }
  };

  return <>{sections.map(render)}</>;
}
