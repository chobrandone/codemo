import type { Metadata } from "next";
import { getSections, getStats, sectionMap, type Section } from "@/lib/content";
import { asItems } from "@/lib/utils";
import { CtaSection, PageHero, StatFigure } from "@/components/site/sections";
import { AccentHeading, ButtonLink, Eyebrow, Reveal, SiteImage } from "@/components/site/primitives";
import { RichText } from "@/components/site/rich-text";

export async function generateMetadata(): Promise<Metadata> {
  const hero = sectionMap(await getSections("ABOUT")).hero;
  return {
    title: hero?.heading ?? "About",
    description: hero?.body?.replace(/<[^>]+>/g, "") || undefined,
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const [sections, stats] = await Promise.all([getSections("ABOUT"), getStats("ABOUT")]);

  const render = (s: Section) => {
    switch (s.key) {
      case "hero":
        return <PageHero key={s.id} section={s} />;
      case "story":
        return (
          <section key={s.id} className="bg-white py-20 lg:py-28">
            <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-6">
                <Eyebrow>{s.eyebrow}</Eyebrow>
                <h2 className="section-title">
                  <AccentHeading text={s.heading} accent={s.headingAccent} />
                </h2>
                <RichText html={s.body} className="mt-6 text-[15px] leading-relaxed text-muted-foreground" />
                {stats.length > 0 && (
                  <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
                    {stats.map((st) => (
                      <StatFigure key={st.id} value={`${st.value}${st.suffix ?? ""}`} label={st.label} size="md" />
                    ))}
                  </div>
                )}
              </Reveal>
              <Reveal className="grid grid-cols-5 gap-4 lg:col-span-6" delay={120}>
                <div className="relative col-span-3 h-[380px] overflow-hidden sm:h-[480px]">
                  <SiteImage src={s.image} alt={s.imageAlt ?? ""} fill sizes="(min-width:1024px) 28vw, 60vw" className="object-cover" />
                </div>
                <div className="relative col-span-2 mt-16 h-[300px] overflow-hidden sm:h-[400px]">
                  <SiteImage src={s.image2} alt={s.image2Alt ?? ""} fill sizes="(min-width:1024px) 20vw, 40vw" className="object-cover" />
                </div>
              </Reveal>
            </div>
          </section>
        );
      case "journey":
        return (
          <section key={s.id} className="bg-cream py-20 lg:py-28">
            <div className="shell">
              <Reveal className="max-w-2xl">
                <Eyebrow>{s.eyebrow}</Eyebrow>
                <h2 className="section-title">
                  <AccentHeading text={s.heading} accent={s.headingAccent} />
                </h2>
                <RichText html={s.body} className="mt-5 text-[15px] leading-relaxed text-muted-foreground" />
              </Reveal>
              <ol className="relative mt-14 grid gap-x-8 gap-y-10 border-t border-primary/20 pt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {asItems(s.items).map((item, i) => (
                  <Reveal as="li" key={i} delay={i * 70} className="relative">
                    <span className="absolute -top-[45px] left-0 h-2.5 w-2.5 rounded-full bg-gold ring-4 ring-cream" aria-hidden />
                    <p className="font-display text-[26px] leading-none text-primary">{item.title}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </Reveal>
                ))}
              </ol>
            </div>
          </section>
        );
      case "resilience":
        return (
          <section key={s.id} className="overflow-hidden bg-white py-20 lg:py-28">
            <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
              <Reveal className="relative h-[340px] overflow-hidden sm:h-[440px] lg:col-span-6 lg:h-[500px]">
                <SiteImage src={s.image} alt={s.imageAlt ?? ""} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
              </Reveal>
              <Reveal className="lg:col-span-6" delay={120}>
                <Eyebrow>{s.eyebrow}</Eyebrow>
                <h2 className="section-title">
                  <AccentHeading text={s.heading} accent={s.headingAccent} />
                </h2>
                <RichText html={s.body} className="mt-6 text-[15px] leading-relaxed text-muted-foreground" />
                {s.primaryLabel && s.primaryHref && (
                  <ButtonLink href={s.primaryHref} variant="primary" className="mt-10">
                    {s.primaryLabel}
                  </ButtonLink>
                )}
              </Reveal>
            </div>
          </section>
        );
      case "gallery":
        return (
          <section key={s.id} className="bg-mist py-20 lg:py-24">
            <div className="shell">
              <Reveal>
                <Eyebrow>{s.eyebrow}</Eyebrow>
                <h2 className="section-title">
                  <AccentHeading text={s.heading} accent={s.headingAccent} />
                </h2>
              </Reveal>
              <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {asItems(s.items).map((item, i) => (
                  <Reveal key={i} delay={i * 80} className="group relative h-[240px] overflow-hidden bg-ink sm:h-[320px] lg:h-[380px]">
                    <SiteImage
                      src={item.image}
                      alt={item.alt ?? item.title ?? ""}
                      fill
                      sizes="(min-width:1024px) 25vw, 50vw"
                      className="object-cover transition-transform duration-[1100ms] group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(19,42,37,0.85),rgba(0,0,0,0)_55%)]" aria-hidden />
                    {item.title && (
                      <p className="absolute bottom-5 left-5 text-[10px] font-bold uppercase tracking-[0.24em] text-white">
                        {item.title}
                      </p>
                    )}
                  </Reveal>
                ))}
              </div>
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
