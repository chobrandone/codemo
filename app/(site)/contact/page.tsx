import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getSections, getSettings, sectionMap, type Section } from "@/lib/content";
import { asItems, whatsappLink } from "@/lib/utils";
import { PageHero } from "@/components/site/sections";
import { AccentHeading, Eyebrow, Reveal, SiteImage } from "@/components/site/primitives";
import { RichText } from "@/components/site/rich-text";
import { ContactForm } from "@/components/site/contact-form";

export async function generateMetadata(): Promise<Metadata> {
  const hero = sectionMap(await getSections("CONTACT")).hero;
  return {
    title: "Contact",
    description: hero?.heading ?? undefined,
    alternates: { canonical: "/contact" },
  };
}

const ICONS = { visit: MapPin, call: Phone, email: Mail, whatsapp: MessageCircle } as const;

export default async function ContactPage() {
  const [sections, settings] = await Promise.all([getSections("CONTACT"), getSettings()]);
  const map = sectionMap(sections);
  const wa = whatsappLink(settings.whatsappNumber, settings.whatsappMessage);
  const formSection = map.form;

  const cardValue = (kind: string) => {
    switch (kind) {
      case "visit":
        return { text: settings.address };
      case "call": {
        const tel = settings.phone?.replace(/[^\d+]/g, "");
        return { text: settings.phone, href: tel && tel.length > 5 ? `tel:${tel}` : undefined };
      }
      case "email": {
        const isEmail = settings.email && /\S+@\S+\.\S+/.test(settings.email);
        return { text: settings.email, href: isEmail ? `mailto:${settings.email}` : undefined };
      }
      case "whatsapp":
        return { text: null, href: wa ?? undefined };
      default:
        return { text: null };
    }
  };

  const render = (s: Section) => {
    switch (s.key) {
      case "hero":
        return <PageHero key={s.id} section={s} />;
      case "inquiries":
        return (
          <section key={s.id} className="bg-white py-16 lg:py-24">
            <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-5">
                <Eyebrow>{s.eyebrow}</Eyebrow>
                <h2 className="section-title">
                  <AccentHeading text={s.heading} accent={s.headingAccent} />
                </h2>
                <RichText html={s.body} className="mt-6 text-[15px] leading-relaxed text-muted-foreground" />
                <ul className="mt-10 space-y-4">
                  {asItems(s.items).map((item, i) => {
                    const kind = (item.label ?? "") as keyof typeof ICONS;
                    const Icon = ICONS[kind] ?? MapPin;
                    const { text, href } = cardValue(kind);
                    if (kind === "whatsapp" && !href) return null;
                    const inner = (
                      <>
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-primary text-white">
                          <Icon className="h-[18px] w-[18px]" aria-hidden />
                        </span>
                        <span>
                          <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-earth">{item.title}</span>
                          {text && <span className="mt-1 block text-[15px] text-ink">{text}</span>}
                        </span>
                      </>
                    );
                    return (
                      <li key={i}>
                        {href ? (
                          <a
                            href={href}
                            {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                            className="flex items-center gap-4 border border-border bg-cream/60 p-5 transition-colors hover:border-gold"
                          >
                            {inner}
                          </a>
                        ) : (
                          <div className="flex items-center gap-4 border border-border bg-cream/60 p-5">{inner}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
              {formSection && (
                <Reveal className="lg:col-span-7" delay={120}>
                  <div className="relative border border-border bg-white p-7 shadow-[0_30px_60px_-45px_rgba(19,42,37,0.5)] sm:p-10">
                    <Eyebrow>{formSection.eyebrow}</Eyebrow>
                    <h2 className="mt-4 text-[28px] leading-tight text-ink sm:text-[34px]">{formSection.heading}</h2>
                    <RichText html={formSection.body} className="mt-3 text-sm text-muted-foreground" />
                    <div className="mt-8">
                      <ContactForm
                        options={asItems(formSection.items).map((o) => o.title ?? "").filter(Boolean)}
                        submitLabel={formSection.primaryLabel || "Send Message"}
                        successMessage={formSection.footnote || "Thank you — your message has been sent."}
                      />
                    </div>
                  </div>
                </Reveal>
              )}
            </div>
          </section>
        );
      case "map":
        return (
          <section key={s.id} className="bg-mist py-16 lg:py-24">
            <div className="shell grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-5">
                <Eyebrow>{s.eyebrow}</Eyebrow>
                <h2 className="section-title">
                  <AccentHeading text={s.heading} accent={s.headingAccent} />
                </h2>
                <RichText html={s.body} className="mt-6 text-[15px] leading-relaxed text-muted-foreground" />
                <p className="mt-8 flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                  <MapPin className="h-4 w-4 text-gold" aria-hidden />
                  {settings.address}
                </p>
                {s.image && (
                  <div className="relative mt-8 hidden h-48 overflow-hidden lg:block">
                    <SiteImage src={s.image} alt={s.imageAlt ?? ""} fill sizes="30vw" className="object-cover" />
                  </div>
                )}
              </Reveal>
              <Reveal className="lg:col-span-7" delay={120}>
                {settings.mapEmbedUrl ? (
                  <div className="relative h-[380px] overflow-hidden border border-border bg-white shadow-sm sm:h-[460px]">
                    <iframe
                      title={`Map — ${settings.address}`}
                      src={settings.mapEmbedUrl}
                      className="absolute inset-0 h-full w-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                ) : (
                  <div className="relative h-[380px] overflow-hidden sm:h-[460px]">
                    <SiteImage src={s.image} alt={s.imageAlt ?? ""} fill sizes="55vw" className="object-cover" />
                  </div>
                )}
              </Reveal>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return <>{sections.map(render)}</>;
}
