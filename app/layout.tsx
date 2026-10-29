import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { getSettings } from "@/lib/content";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

// Content is read from the database at request time (served from the content
// cache), so builds never need a database connection.
export const dynamic = "force-dynamic";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  style: ["normal", "italic"],
});
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export async function generateViewport(): Promise<Viewport> {
  const s = await getSettings();
  return { themeColor: s.themeColor || "#1F5A36", width: "device-width", initialScale: 1 };
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const ogImage = s.ogImage ? [{ url: s.ogImage }] : undefined;
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: s.seoTitle, template: `%s · ${s.shortName}` },
    description: s.seoDescription,
    applicationName: s.shortName,
    icons: {
      icon: s.faviconUrl || "/images/favicon-48.png",
      apple: "/images/apple-touch-icon.png",
    },
    openGraph: {
      type: "website",
      locale: "en",
      siteName: s.shortName,
      title: s.ogTitle || s.seoTitle,
      description: s.seoDescription,
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title: s.ogTitle || s.seoTitle,
      description: s.seoDescription,
      images: s.ogImage ? [s.ogImage] : undefined,
    },
    appleWebApp: { capable: true, title: s.shortName, statusBarStyle: "black" },
    other: { "mobile-web-app-capable": "yes" },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        {/* Flags JS availability so scroll-reveal styles only apply when they can be undone. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
