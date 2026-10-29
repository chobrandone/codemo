import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getActivities, getActivity, getSections, sectionMap } from "@/lib/content";
import { asItems, cn } from "@/lib/utils";
import { ActivityCard, CtaSection, PageHero, StatFigure } from "@/components/site/sections";
import { ButtonLink, Eyebrow, Reveal, SiteImage, TextLink } from "@/components/site/primitives";
import { RichText } from "@/components/site/rich-text";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = await getActivity(slug);
  if (!a) return { title: "Not found" };
  return {
    title: a.seoTitle || a.title,
    description: a.seoDescription || a.summary,
    alternates: { canonical: `/activities/${a.slug}` },
    openGraph: { title: a.seoTitle || a.title, description: a.seoDescription || a.summary, images: a.coverImage ? [a.coverImage] : undefined },
  };
}

export default async function ActivityPage({ params }: Props) {
  const { slug } = await params;
  const [activity, all, shared] = await Promise.all([getActivity(slug), getActivities(), getSections("ACTIVITY_DETAIL")]);
  if (!activity) notFound();
  const blocks = sectionMap(shared);
  const heroStats = asItems(activity.heroStats);
  const details = asItems(activity.detailSections);
  const roadmap = asItems(activity.roadmap);
  const targets = asItems(activity.targets);
  const gallery = asItems(activity.gallery).filter((g) => g.url);
  const others = all.filter((a) => a.id !== activity.id).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={`Activity ${activity.number}`}
        title={activity.title}
        subtitle={activity.tagline}
        image={activity.coverImage}
        imageAlt={activity.coverAlt}
      >
        {blocks.hero?.primaryLabel && blocks.hero.primaryHref && (
          <ButtonLink href={blocks.hero.primaryHref} className="mt-9">
            {blocks.hero.primaryLabel}
          </ButtonLink>
        )}
      </PageHero>

      {heroStats.length > 0 && (
        <section className="border-b border-border bg-cream py-10 lg:py-12" aria-label="Key figures">
          <div className="shell grid gap-8 sm:grid-cols-3">
            {heroStats.map((s, i) => (
              <Reveal key={i} delay={i * 80}>
                <StatFigure value={s.value ?? ""} label={s.label ?? ""} size="md" />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {details.length > 0 && (
        <div className="bg-white py-20 lg:py-24">
          <div className="shell space-y-16 lg:space-y-20">
            {details.map((d, i) => (
              <div key={i} className={cn("grid gap-10 lg:grid-cols-12 lg:gap-16", d.image ? "items-center" : "")}>
                <Reveal className={d.image ? "lg:col-span-6" : "lg:col-span-8"}>
                  <p className="eyebrow text-earth">
                    {String(i + 1).padStart(2, "0")} — {d.heading}
                  </p>
                  <h2 className="section-title">{d.heading}</h2>
                  <RichText html={d.body} className="mt-6 text-[15px] leading-relaxed text-muted-foreground" />
                </Reveal>
                {d.image && (
                  <Reveal className="relative h-[300px] overflow-hidden sm:h-[380px] lg:col-span-6 lg:h-[440px]" delay={120}>
                    <SiteImage src={d.image} alt={d.alt ?? ""} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
                  </Reveal>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {roadmap.length > 0 && (
        <section className="bg-mist py-20 lg:py-24">
          <div className="shell">
            <Reveal>
              <Eyebrow>{activity.roadmapEyebrow || "Development Roadmap"}</Eyebrow>
              <h2 className="section-title">{activity.roadmapTitle}</h2>
            </Reveal>
            <ol
              className={cn(
                "mt-12 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2",
                roadmap.length >= 6 ? "lg:grid-cols-6" : roadmap.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
              )}
            >
              {roadmap.map((r, i) => (
                <Reveal as="li" key={i} delay={i * 70} className="bg-white p-7">
                  <span className="font-body text-[10px] font-bold tracking-[0.24em] text-leaf">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 text-xl leading-snug text-ink">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}

      {targets.length > 0 && (
        <section className="bg-ink py-20 lg:py-24">
          <div className="shell">
            <Reveal>
              <Eyebrow tone="gold">{blocks.targets?.eyebrow}</Eyebrow>
              <h2 className="mt-5 text-[30px] leading-[1.12] text-white sm:text-4xl lg:text-[46px]">{blocks.targets?.heading}</h2>
            </Reveal>
            <div
              className={cn(
                "mt-12 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2",
                targets.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
              )}
            >
              {targets.map((t, i) => (
                <Reveal key={i} delay={i * 80} className="bg-ink p-8 lg:p-10">
                  <StatFigure value={t.value ?? ""} label={t.label ?? ""} description={t.text} dark />
                </Reveal>
              ))}
            </div>
            {blocks.targets?.footnote && (
              <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">{blocks.targets.footnote}</p>
            )}
          </div>
        </section>
      )}

      {gallery.length > 0 && blocks.gallery && (
        <section className="bg-cream py-20 lg:py-24">
          <div className="shell">
            <Reveal className="max-w-2xl">
              <Eyebrow>{blocks.gallery.eyebrow}</Eyebrow>
              <h2 className="section-title">{blocks.gallery.heading}</h2>
              <RichText html={blocks.gallery.body} className="mt-5 text-[15px] leading-relaxed text-muted-foreground" />
            </Reveal>
            <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-3">
              {gallery.map((g, i) => (
                <Reveal as="div" key={i} delay={(i % 3) * 80}>
                  <figure className="group">
                    <div className="relative h-[200px] overflow-hidden sm:h-[280px] lg:h-[320px]">
                      <SiteImage
                        src={g.url}
                        alt={g.alt ?? ""}
                        fill
                        sizes="(min-width:1024px) 33vw, 50vw"
                        className="object-cover transition-transform duration-[1100ms] group-hover:scale-[1.05]"
                      />
                    </div>
                    {g.alt && <figcaption className="mt-3 text-[13px] text-muted-foreground">{g.alt}</figcaption>}
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {others.length > 0 && blocks.more && (
        <section className="bg-white py-20 lg:py-24">
          <div className="shell">
            <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <h2 className="text-[30px] leading-[1.1] text-ink sm:text-4xl">{blocks.more.heading}</h2>
              {blocks.more.primaryLabel && blocks.more.primaryHref && (
                <TextLink href={blocks.more.primaryHref}>{blocks.more.primaryLabel}</TextLink>
              )}
            </Reveal>
            <div className="mt-12 grid gap-6 bg-cream p-0 md:grid-cols-2 lg:grid-cols-3">
              {others.map((a, i) => (
                <Reveal key={a.id} delay={i * 90} className="bg-cream">
                  <ActivityCard activity={a} number={String(i + 1).padStart(2, "0")} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaSection section={blocks.cta} />
    </>
  );
}
