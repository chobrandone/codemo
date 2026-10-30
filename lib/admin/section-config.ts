import type { PageKey } from "@prisma/client";
import type { RepeaterFieldDef } from "@/components/admin/repeater";

export const PAGES: { key: PageKey; slug: string; label: string; path: string; description: string }[] = [
  { key: "HOME", slug: "home", label: "Home", path: "/", description: "Hero, cooperative, activities, infrastructure, vision, rural development, projects and CTA." },
  { key: "ABOUT", slug: "about", label: "About", path: "/about", description: "Story, journey timeline, resilience and field gallery." },
  { key: "ACTIVITIES", slug: "activities", label: "Activities overview", path: "/activities", description: "Hero and CTA around the activities list." },
  {
    key: "ACTIVITY_DETAIL",
    slug: "activity-detail",
    label: "Activity pages (shared)",
    path: "/activities/pig-farming",
    description: "Headings shared by every activity detail page: targets, gallery, more activities and CTA.",
  },
  { key: "CONTACT", slug: "contact", label: "Contact", path: "/contact", description: "Hero, contact cards, form labels and map." },
];

export const pageBySlug = (slug: string) => PAGES.find((p) => p.slug === slug);

export type SectionFieldKey =
  | "eyebrow"
  | "heading"
  | "headingAccent"
  | "subheading"
  | "body"
  | "image"
  | "image2"
  | "primary"
  | "secondary"
  | "footnote";

type Config = {
  fields: SectionFieldKey[];
  labels?: Partial<Record<SectionFieldKey, string>>;
  hints?: Partial<Record<SectionFieldKey, string>>;
  items?: { label: string; hint?: string; addLabel: string; fields: RepeaterFieldDef[] };
  /** Where the section's list content is managed instead (shown as a link). */
  managedAt?: { label: string; href: string }[];
};

const base: SectionFieldKey[] = ["eyebrow", "heading", "headingAccent", "body"];

const CONFIG: Record<string, Config> = {
  "HOME:hero": {
    fields: [...base, "image", "primary", "secondary"],
    hints: { headingAccent: "Part of the heading shown in italic gold, e.g. “Stronger Future”." },
    managedAt: [{ label: "Fact strip → Stats & figures", href: "/admin/stats" }],
  },
  "HOME:cooperative": {
    fields: [...base, "image", "image2"],
    labels: { image2: "Small overlapping image" },
    managedAt: [{ label: "Count-up stats → Stats & figures", href: "/admin/stats" }],
  },
  "HOME:activities": {
    fields: [...base, "primary"],
    managedAt: [{ label: "Activity cards → Activities (those marked “Show on home”)", href: "/admin/activities" }],
  },
  "HOME:infrastructure": {
    fields: [...base, "image"],
    managedAt: [{ label: "Numbered items → Infrastructure", href: "/admin/infrastructure" }],
  },
  "HOME:vision": {
    fields: [...base, "image", "footnote"],
    labels: { image: "Background image (shown faded)" },
    managedAt: [{ label: "Targets → Stats & figures", href: "/admin/stats" }],
  },
  "HOME:rural": {
    fields: [...base, "image", "footnote", "primary"],
    labels: { footnote: "Image badge text" },
    managedAt: [{ label: "Bullet points → Rural development points", href: "/admin/bullets" }],
  },
  "HOME:projects": {
    fields: base,
    managedAt: [{ label: "Project cards → Expansion projects", href: "/admin/projects" }],
  },
  "ABOUT:story": {
    fields: [...base, "image", "image2"],
    managedAt: [{ label: "Stats → Stats & figures (About)", href: "/admin/stats" }],
  },
  "ABOUT:journey": {
    fields: base,
    items: {
      label: "Timeline entries",
      addLabel: "Add milestone",
      fields: [
        { key: "title", label: "Year / period", placeholder: "2014" },
        { key: "text", label: "Description", type: "textarea" },
      ],
    },
  },
  "ABOUT:resilience": { fields: [...base, "image", "primary"] },
  "ABOUT:gallery": {
    fields: ["eyebrow", "heading", "headingAccent"],
    items: {
      label: "Gallery tiles",
      addLabel: "Add tile",
      fields: [
        { key: "title", label: "Label", placeholder: "Harvest" },
        { key: "image", label: "Image", type: "image", altKey: "alt" },
      ],
    },
  },
  "ACTIVITIES:list": {
    fields: ["primary"],
    labels: { primary: "“Learn more” link label" },
    managedAt: [{ label: "Activities → Activities", href: "/admin/activities" }],
  },
  "ACTIVITY_DETAIL:hero": { fields: ["primary"], labels: { primary: "Hero button" } },
  "ACTIVITY_DETAIL:targets": {
    fields: ["eyebrow", "heading", "footnote"],
    managedAt: [{ label: "Target figures are edited on each activity", href: "/admin/activities" }],
  },
  "ACTIVITY_DETAIL:gallery": {
    fields: ["eyebrow", "heading", "body"],
    managedAt: [{ label: "Gallery images are edited on each activity", href: "/admin/activities" }],
  },
  "ACTIVITY_DETAIL:more": { fields: ["heading", "primary"] },
  "CONTACT:hero": { fields: [...base, "image"] },
  "CONTACT:inquiries": {
    fields: base,
    items: {
      label: "Contact cards",
      hint: "Card values come from Site settings (address, phone, email, WhatsApp).",
      addLabel: "Add card",
      fields: [
        { key: "title", label: "Card title", placeholder: "Visit us" },
        {
          key: "label",
          label: "Type",
          type: "select",
          options: [
            { value: "visit", label: "Address" },
            { value: "call", label: "Phone" },
            { value: "email", label: "Email" },
            { value: "whatsapp", label: "WhatsApp" },
          ],
        },
      ],
    },
    managedAt: [{ label: "Address / phone / email → Site settings", href: "/admin/settings" }],
  },
  "CONTACT:form": {
    fields: ["eyebrow", "heading", "body", "primary", "footnote"],
    labels: { primary: "Submit button", footnote: "Success message" },
    items: {
      label: "“I am contacting you as” options",
      addLabel: "Add option",
      fields: [{ key: "title", label: "Option", placeholder: "Investor" }],
    },
  },
  "CONTACT:map": {
    fields: [...base, "image"],
    managedAt: [{ label: "Map location → Site settings (map embed)", href: "/admin/settings" }],
  },
};

const CTA: Config = { fields: [...base, "image", "primary", "secondary"], labels: { image: "Background image (faded)" } };

/** Blocks that can be added to any page, including CMS-created pages. */
export const SECTION_LIBRARY: { type: string; label: string; description: string }[] = [
  { type: "page-hero", label: "Page hero", description: "Dark banner with title, intro text and background image." },
  { type: "text", label: "Text", description: "Heading and rich text in a centred column, optional buttons." },
  { type: "text-image", label: "Text + image", description: "Two columns: text and buttons beside a large image." },
  { type: "cards", label: "Cards", description: "Numbered cards with title, text and optional image." },
  { type: "gallery", label: "Image gallery", description: "Grid of photos with captions." },
  { type: "stats", label: "Figures", description: "Dark band of count-up numbers with labels." },
  { type: "cta", label: "Call to action", description: "Full-width banner with heading and two buttons." },
];

const GENERIC: Record<string, Config> = {
  "page-hero": { fields: [...base, "image"], labels: { image: "Background image" } },
  hero: { fields: [...base, "image"], labels: { image: "Background image" } },
  cta: CTA,
  text: { fields: [...base, "primary", "secondary"] },
  "text-image": {
    fields: [...base, "subheading", "image", "primary", "secondary"],
    labels: { subheading: "Image position" },
    hints: { subheading: "Type “left” to put the image on the left (default: right)." },
  },
  cards: {
    fields: [...base, "primary", "secondary"],
    items: {
      label: "Cards",
      addLabel: "Add card",
      fields: [
        { key: "title", label: "Title" },
        { key: "text", label: "Text", type: "textarea" },
        { key: "image", label: "Image (optional)", type: "image", altKey: "alt" },
      ],
    },
  },
  gallery: {
    fields: base,
    items: {
      label: "Images",
      addLabel: "Add image",
      fields: [
        { key: "image", label: "Image", type: "image", altKey: "alt" },
        { key: "title", label: "Caption (optional)" },
      ],
    },
  },
  stats: {
    fields: [...base, "footnote"],
    items: {
      label: "Figures",
      hint: "Numbers count up on scroll (e.g. 2,000 kg, 20+). Text values are shown as typed.",
      addLabel: "Add figure",
      fields: [
        { key: "value", label: "Value", placeholder: "2,000 kg" },
        { key: "title", label: "Label" },
        { key: "text", label: "Description (optional)", type: "textarea" },
      ],
    },
  },
};

/** Field layout for a section, by the page it belongs to and its renderer type. */
export function sectionConfig(page: PageKey, type: string): Config {
  return CONFIG[`${page}:${type}`] ?? GENERIC[type] ?? { fields: [...base, "image", "primary", "secondary", "footnote"] };
}

/** Human label for a section type (built-in types fall back to the type id). */
export function sectionTypeLabel(type: string) {
  return SECTION_LIBRARY.find((t) => t.type === type)?.label ?? type.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
}
