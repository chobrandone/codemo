import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCustomPage, getCustomPageSections } from "@/lib/content";
import { GenericSection, HERO_TYPES } from "@/components/site/generic-sections";

// Pages created in the CMS (Admin → Page sections → New page).
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCustomPage(slug);
  if (!page) return { title: "Not found" };
  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || undefined,
    alternates: { canonical: `/${page.slug}` },
  };
}

export default async function CustomPage({ params }: Props) {
  const { slug } = await params;
  const page = await getCustomPage(slug);
  if (!page) notFound();
  const sections = await getCustomPageSections(page.id);
  const startsWithHero = sections[0] && HERO_TYPES.includes(sections[0].type || sections[0].key);

  return (
    <>
      {/* The header is transparent and white; give it a dark backdrop when the page has no hero. */}
      {!startsWithHero && (
        <div className="bg-ink pb-12 pt-36 lg:pt-44">
          <div className="shell">
            <h1 className="text-[38px] leading-[1.05] text-white sm:text-[52px]">{page.title}</h1>
          </div>
        </div>
      )}
      {sections.map((s) => (
        <GenericSection key={s.id} section={s} />
      ))}
    </>
  );
}
