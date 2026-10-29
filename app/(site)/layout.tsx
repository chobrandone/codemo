import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { RevealObserver } from "@/components/site/reveal-observer";
import { getNav, getSettings } from "@/lib/content";
import { whatsappLink } from "@/lib/utils";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, header, quick, activities] = await Promise.all([
    getSettings(),
    getNav("HEADER"),
    getNav("FOOTER_QUICK"),
    getNav("FOOTER_ACTIVITIES"),
  ]);
  const whatsapp = whatsappLink(settings.whatsappNumber, settings.whatsappMessage);

  return (
    <>
      <Header
        name={settings.shortName}
        tagline={settings.tagline}
        logoUrl={settings.logoUrl}
        address={settings.address}
        phone={settings.phone}
        email={settings.email}
        whatsapp={whatsapp}
        nav={header}
      />
      <main id="main">{children}</main>
      <Footer settings={settings} whatsapp={whatsapp} quickLinks={quick} activityLinks={activities} />
      <RevealObserver />
    </>
  );
}
