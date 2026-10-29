// Content captured from the reference site (https://grow-moungo-together.base44.app/).
// Used by prisma/seed.ts to populate a fresh database.
import type { NavLocation, PageKey, StatGroup } from "@prisma/client";

const img = (name: string) => `/images/${name}.webp`;
const WA_MESSAGE = "Hello CODEMO — I would like to discuss a partnership.";

export const settings = {
  locale: "en",
  siteName: "CODEMO — Coopérative de Développement du Monde Rural du Moungo",
  shortName: "CODEMO",
  tagline: "Moungo · Cameroun",
  logoUrl: null as string | null,
  faviconUrl: "/images/favicon-48.png",
  address: "Dibombari, Moungo — Littoral, Cameroun",
  phone: "Phone: available on request",
  email: "Email: available on request",
  whatsappNumber: "237600000000",
  whatsappMessage: WA_MESSAGE,
  socialLinks: [] as { label: string; href: string }[],
  seoTitle: "CODEMO — Coopérative de Développement du Monde Rural du Moungo",
  seoDescription:
    "CODEMO develops sustainable livestock, aquaculture and agricultural production while creating opportunities for rural development and investment in Cameroon.",
  ogTitle: "CODEMO — Building Sustainable Rural Production for a Stronger Future",
  ogImage: img("hero-farmers"),
  themeColor: "#1F5A36",
  mapEmbedUrl: "https://www.google.com/maps?q=Dibombari,+Moungo,+Cameroon&z=13&output=embed",
  footerTagline:
    "CODEMO develops sustainable livestock, aquaculture and agricultural production while creating opportunities for rural development and investment in Cameroon.",
  copyright: "CODEMO — Coopérative de Développement du Monde Rural du Moungo",
};

type SectionSeed = {
  page: PageKey;
  key: string;
  name: string;
  eyebrow?: string;
  heading?: string;
  headingAccent?: string;
  subheading?: string;
  body?: string;
  image?: string;
  imageAlt?: string;
  image2?: string;
  image2Alt?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  footnote?: string;
  items?: Record<string, string>[];
};

const cta = (page: PageKey): SectionSeed => ({
  page,
  key: "cta",
  name: "Partner call-to-action",
  eyebrow: "Partner with CODEMO",
  heading: "Join a growing agricultural and aquaculture initiative",
  body: "<p>Focused on expanding sustainable production capacity and rural economic development.</p>",
  image: img("crop-valley"),
  imageAlt: "Crop fields in a fertile tropical valley",
  primaryLabel: "Discuss Partnership",
  primaryHref: "/contact",
  secondaryLabel: "Contact CODEMO",
  secondaryHref: "/contact",
});

export const sections: SectionSeed[] = [
  // ── HOME ────────────────────────────────────────────────────────────────
  {
    page: "HOME",
    key: "hero",
    name: "Hero",
    eyebrow: "CODEMO · Coopérative de Développement du Monde Rural du Moungo",
    heading: "Building Sustainable Rural Production for a Stronger Future",
    headingAccent: "Stronger Future",
    body: "<p>CODEMO develops sustainable livestock, aquaculture and agricultural production while creating opportunities for rural development and investment in Cameroon.</p>",
    image: img("hero-farmers"),
    imageAlt: "Farmers working together in a plantation in the Moungo region",
    primaryLabel: "Discover CODEMO",
    primaryHref: "/about",
    secondaryLabel: "Explore Our Activities",
    secondaryHref: "/activities",
  },
  {
    page: "HOME",
    key: "cooperative",
    name: "The Cooperative",
    eyebrow: "The Cooperative",
    heading: "A Cooperative Built for Sustainable Growth",
    body: "<p>CODEMO is a cooperative governed by a board of directors, created under Cameroon's cooperative legal framework. Its approximately twenty active members specialise in livestock farming, fish farming and agriculture.</p><p>The cooperative currently operates on an approximately 2-hectare site in Dibombari, in the Moungo region, home to its production and support infrastructures.</p>",
    image: img("cooperative-members"),
    imageAlt: "CODEMO cooperative members on the production site",
    image2: img("cocoa-pod"),
    image2Alt: "A cocoa pod opened by hand in the plantation",
  },
  {
    page: "HOME",
    key: "activities",
    name: "Our Activities",
    eyebrow: "Our Activities",
    heading: "Three Core Production Activities",
    primaryLabel: "View all activities",
    primaryHref: "/activities",
  },
  {
    page: "HOME",
    key: "infrastructure",
    name: "Production Infrastructure",
    eyebrow: "Our Production Infrastructure",
    heading: "A Production Site Built to Scale",
    body: "<p>The Dibombari site combines production and support infrastructure across approximately two hectares — with further construction underway.</p>",
    image: img("site-buildings"),
    imageAlt: "Production and support buildings on the CODEMO site at Dibombari",
  },
  {
    page: "HOME",
    key: "vision",
    name: "Our Vision",
    eyebrow: "Our Vision",
    heading: "Growing Capacity. Creating Opportunity. Feeding the Future.",
    image: img("moungo-farmland"),
    imageAlt: "Fertile farmland across the Moungo region",
    footnote: "Targets drawn directly from CODEMO's stated development plans",
  },
  {
    page: "HOME",
    key: "rural",
    name: "Rural Development",
    eyebrow: "Rural Development",
    heading: "Projects supporting rural production, food supply and economic opportunity.",
    body: "<p>Beyond its production units, CODEMO's mission is rural development: creating employment, strengthening local food production and building durable agricultural infrastructure in the Moungo region.</p><p>The cooperative model places ownership and decision-making in the hands of its members — anchoring value, skills and income in the rural economy.</p>",
    image: img("rural-farms"),
    imageAlt: "Rural farms and households in the Moungo region",
    footnote: "2 ha integrated site anchoring skilled rural jobs",
    primaryLabel: "Learn about rural development",
    primaryHref: "/activities/rural-development",
  },
  {
    page: "HOME",
    key: "projects",
    name: "Expansion Projects",
    eyebrow: "Expansion Projects",
    heading: "Building the Next Phase on the Dibombari Site",
    body: "<p>Hatchery, poultry, pond and storage projects drawn directly from CODEMO's stated development plans.</p>",
  },
  cta("HOME"),

  // ── ABOUT ───────────────────────────────────────────────────────────────
  {
    page: "ABOUT",
    key: "hero",
    name: "Page hero",
    eyebrow: "Who We Are",
    heading: "About CODEMO",
    body: "<p>A cooperative committed to rural production, sustainable growth and economic opportunity.</p>",
    image: img("moungo-farmland"),
    imageAlt: "Rural landscape in the Moungo region",
  },
  {
    page: "ABOUT",
    key: "story",
    name: "Our Story",
    eyebrow: "Our Story",
    heading: "A Cooperative Rooted in the Moungo",
    body: "<p>CODEMO — Coopérative de Développement du Monde Rural du Moungo — was created under the Cameroonian cooperative legal framework and registered in 2014. Governed by a board of directors, it brings together approximately twenty active members specialising in livestock farming, fish farming and agriculture.</p><p>Today the cooperative operates from an approximately 2-hectare production site in Dibombari, with dedicated production and support infrastructure.</p>",
    image: img("cooperative-members"),
    imageAlt: "CODEMO cooperative members gathered on the production site",
    image2: img("fish-ponds"),
    image2Alt: "Earthen fish ponds at dusk on the cooperative site",
  },
  {
    page: "ABOUT",
    key: "journey",
    name: "Our Journey (timeline)",
    eyebrow: "Our Journey",
    heading: "A History of Production and Resilience",
    items: [
      { title: "1992", text: "Cameroon's cooperative legal framework is established." },
      { title: "2014", text: "CODEMO is registered under the cooperative framework." },
      { title: "2020", text: "COVID-19 significantly disrupts the cooperative's activities." },
      { title: "2020–2023", text: "Fish production at Bonabéri reaches approximately 200–300 kg per month." },
      { title: "2024–2025", text: "Fish production at Dibombari reaches approximately 100–200 kg per month." },
      { title: "2026", text: "Broiler production is launched with an initial test of 1,500 birds." },
    ],
  },
  {
    page: "ABOUT",
    key: "resilience",
    name: "Our Resilience",
    eyebrow: "Our Resilience",
    heading: "Disrupted. Restructured. Rebuilding.",
    body: "<p>The cooperative experienced significant disruption during the COVID-19 period, which interrupted its production activities.</p><p>CODEMO subsequently restructured its members and operations to relaunch livestock and aquaculture activities — rebuilding production capacity step by step on its Dibombari site.</p>",
    image: img("fish-tanks"),
    imageAlt: "Aquaculture tanks at the Dibombari production site",
    primaryLabel: "Explore our activities",
    primaryHref: "/activities",
  },
  {
    page: "ABOUT",
    key: "gallery",
    name: "In the Field (gallery)",
    eyebrow: "In the Field",
    heading: "Life and work across the cooperative",
    items: [
      { title: "Harvest", image: img("cocoa-pod"), alt: "A cocoa pod opened by hand in the plantation" },
      { title: "Training", image: img("training-session"), alt: "Young farmers in an agricultural training session" },
      { title: "Aquaculture", image: img("fish-ponds"), alt: "Earthen fish ponds on the cooperative site" },
      { title: "Production Site", image: img("site-buildings"), alt: "Production buildings across the Dibombari site" },
    ],
  },
  cta("ABOUT"),

  // ── ACTIVITIES OVERVIEW ─────────────────────────────────────────────────
  {
    page: "ACTIVITIES",
    key: "hero",
    name: "Page hero",
    eyebrow: "Our Activities",
    heading: "What We Produce",
    body: "<p>Integrated agricultural and aquaculture activities designed to build sustainable production capacity.</p>",
    image: img("site-buildings"),
    imageAlt: "Production and support buildings on the CODEMO site",
  },
  {
    page: "ACTIVITIES",
    key: "list",
    name: "Activities list",
    primaryLabel: "Learn More",
  },
  cta("ACTIVITIES"),

  // ── ACTIVITY DETAIL (shared blocks for every /activities/[slug]) ─────────
  {
    page: "ACTIVITY_DETAIL",
    key: "hero",
    name: "Hero button",
    primaryLabel: "Discuss Partnership",
    primaryHref: "/contact",
  },
  {
    page: "ACTIVITY_DETAIL",
    key: "targets",
    name: "Future targets",
    eyebrow: "Future Targets",
    heading: "Where We Are Heading",
    footnote: "These targets come directly from CODEMO's stated development plans.",
  },
  {
    page: "ACTIVITY_DETAIL",
    key: "gallery",
    name: "Project gallery",
    eyebrow: "Gallery",
    heading: "Project gallery",
    body: "<p>A visual record of the work, infrastructure and people behind this activity.</p>",
  },
  {
    page: "ACTIVITY_DETAIL",
    key: "more",
    name: "More activities",
    heading: "More CODEMO activities",
    primaryLabel: "View all activities",
    primaryHref: "/activities",
  },
  cta("ACTIVITY_DETAIL"),

  // ── CONTACT ─────────────────────────────────────────────────────────────
  {
    page: "CONTACT",
    key: "hero",
    name: "Page hero",
    eyebrow: "Contact & Investment",
    heading: "Let's Build the Future of Sustainable Production Together.",
    image: img("contact-hero"),
    imageAlt: "Cooperative members discussing on the CODEMO production site",
  },
  {
    page: "CONTACT",
    key: "inquiries",
    name: "Serious inquiries & contact cards",
    eyebrow: "Get in Touch",
    heading: "Serious Inquiries Welcome",
    body: "<p>Whether you are a development partner, commercial buyer or investor, we welcome inquiries about CODEMO's production and expansion plans.</p>",
    items: [
      { title: "Visit us", label: "visit" },
      { title: "Call us", label: "call" },
      { title: "Email us", label: "email" },
      { title: "Chat with us on WhatsApp", label: "whatsapp" },
    ],
  },
  {
    page: "CONTACT",
    key: "form",
    name: "Contact form",
    eyebrow: "Get in Touch",
    heading: "Send Us a Message",
    primaryLabel: "Send Message",
    footnote: "Thank you — your message has been sent. The CODEMO team will get back to you shortly.",
    items: [
      { title: "Development Partner" },
      { title: "Commercial Buyer" },
      { title: "Investor" },
      { title: "Other" },
    ],
  },
  {
    page: "CONTACT",
    key: "map",
    name: "Find us (map)",
    eyebrow: "Find Us",
    heading: "Our Production Site",
    body: "<p>CODEMO operates from an approximately 2-hectare integrated production site in Dibombari, in the Moungo region of the Littoral, Cameroun.</p>",
    image: img("moungo-farmland"),
    imageAlt: "Farmland around Dibombari in the Moungo region",
  },
];

type StatSeed = { group: StatGroup; value: string; suffix?: string; label: string; description?: string };
export const stats: StatSeed[] = [
  { group: "HERO_FACT", label: "Production Site", value: "2.0 ha — Dibombari" },
  { group: "HERO_FACT", label: "Active Members", value: "20+" },
  { group: "HERO_FACT", label: "Core Activities", value: "Livestock · Aquaculture · Agriculture" },
  { group: "HERO_FACT", label: "Target Fish Production", value: "2,000 kg / month" },

  { group: "COOPERATIVE", value: "2", suffix: " ha", label: "Production Site" },
  { group: "COOPERATIVE", value: "20", suffix: "+", label: "Active Members" },
  { group: "COOPERATIVE", value: "3", label: "Core Activities" },
  { group: "COOPERATIVE", value: "Dibombari", label: "Main Site" },

  { group: "VISION", value: "15", label: "Tanks", description: "Expansion from 9 to 15 above-ground fish tanks." },
  { group: "VISION", value: "2,000", suffix: " kg", label: "Per Month", description: "Target monthly fish production." },
  { group: "VISION", value: "100,000", label: "Fingerlings", description: "Target hatchery production per month." },
  { group: "VISION", value: "80", suffix: " t", label: "Per Year", description: "Target annual pond production." },
  { group: "VISION", value: "4,000–5,000", label: "Birds / Month", description: "Target monthly broiler production." },
  { group: "VISION", value: "30–60 m³", label: "Cold Storage", description: "Planned cold-storage capacity." },

  { group: "ABOUT", value: "2014", label: "Registered" },
  { group: "ABOUT", value: "20", suffix: "+", label: "Active Members" },
  { group: "ABOUT", value: "2", suffix: " ha", label: "Production Site" },
];

export const infrastructure = [
  { title: "4 Pig-Rearing Buildings", description: "Purpose-built housing for the cooperative's pig production." },
  { title: "9 Above-Ground Fish Tanks", description: "Operational aquaculture tank capacity on site." },
  { title: "Mini Hatchery — In Development", description: "A fingerling production unit being developed on site." },
  { title: "2 Fish Ponds · ~400 m² Each", description: "Earthen ponds for grow-out fish production." },
  { title: "Broiler Production Buildings", description: "Housing for the poultry operation launched in 2026." },
  { title: "Workers' Accommodation", description: "On-site housing for production staff." },
  { title: "Semi-Modern Shower Facilities", description: "Worker welfare infrastructure across the site." },
  { title: "Feed Storage", description: "Secure storage for livestock and fish feed." },
  { title: "Additional Infrastructure", description: "Further construction underway to expand capacity." },
];

export const projects = [
  {
    title: "Mini Hatchery",
    category: "Aquaculture",
    location: "Dibombari",
    description:
      "A mini hatchery under development, targeting 100,000 fingerlings per month to stock the cooperative's tanks and ponds.",
    image: img("hatchery-fingerlings"),
    imageAlt: "Fingerlings handled at the mini hatchery",
  },
  {
    title: "Broiler Buildings",
    category: "Poultry",
    location: "Dibombari",
    description:
      "Planned construction of two additional broiler buildings of 400 m² each, toward 4,000–5,000 birds per month.",
    image: img("broiler-house"),
    imageAlt: "Broiler poultry house on the production site",
  },
  {
    title: "Tank Expansion",
    category: "Aquaculture",
    location: "Dibombari",
    description:
      "Expansion from 9 to 15 above-ground fish tanks, with a target fish production of 2,000 kg per month.",
    image: img("fish-tanks"),
    imageAlt: "Above-ground fish tanks at the aquaculture unit",
  },
  {
    title: "Pond Production",
    category: "Aquaculture",
    location: "Dibombari",
    description:
      "Target pond production of 80 tonnes per year across two earthen ponds of approximately 400 m² each.",
    image: img("fish-ponds"),
    imageAlt: "Earthen fish ponds at dusk",
  },
  {
    title: "Cold Storage",
    category: "Infrastructure",
    location: "Dibombari",
    description: "Planned cold-storage capacity of 30–60 m³ for product conservation as production scales.",
    image: img("site-buildings"),
    imageAlt: "Production and support buildings on the CODEMO site",
  },
  {
    title: "Herd Rebuild",
    category: "Livestock",
    location: "Dibombari",
    description: "Rebuilding breeding stock and strengthening herd management across four pig-rearing buildings.",
    image: img("pig-buildings"),
    imageAlt: "Pig-rearing buildings on the cooperative site",
  },
];

export const ruralBullets = [
  "Rural employment and cooperative membership",
  "Local food production and supply",
  "Agricultural and production infrastructure",
  "Aquaculture and livestock development",
  "Sustainable, long-term development of the region",
];

const g = (prefix: string, captions: string[]) =>
  captions.map((alt, i) => ({ url: `/images/gallery/${prefix}-${i + 1}.webp`, alt }));
const ul = (items: string[]) => `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;

export const activities = [
  {
    slug: "pig-farming",
    number: "01",
    title: "Pig Farming",
    status: "Operational — rebuilding",
    tagline: "Building a stronger livestock production capacity.",
    summary:
      "CODEMO has developed pig farming infrastructure and production capacity while working toward rebuilding and expanding its livestock operations.",
    currentCapacity: "4 pig-rearing buildings",
    expansionPlan: "Herd rebuild & growth",
    highlightValue: "4",
    highlightLabel: "Pig-rearing buildings",
    coverImage: img("pig-buildings"),
    coverAlt: "Pig-rearing buildings on the CODEMO production site",
    showOnHome: true,
    heroStats: [
      { value: "4", label: "Pig-rearing buildings" },
      { value: "2 ha", label: "Production site" },
      { value: "20+", label: "Active members" },
    ],
    detailSections: [
      {
        heading: "Overview",
        body: "<p>Pig farming is one of CODEMO's three core production pillars. Purpose-built livestock housing stands on the cooperative's 2-hectare Dibombari site, forming the backbone of its livestock operations.</p><p>Following a period of significant disruption, the cooperative is rebuilding its herd and strengthening day-to-day production practices to restore and expand capacity.</p>",
      },
      {
        heading: "Current Infrastructure",
        body:
          "<p>Four purpose-built pig-rearing buildings stand on the site, supported by the cooperative's wider production and support infrastructure.</p>" +
          ul([
            "4 purpose-built pig-rearing buildings",
            "Feed storage on site",
            "Workers' accommodation and semi-modern shower facilities",
            "Support infrastructure across the 2-hectare site",
          ]),
        image: img("pig-buildings"),
        alt: "Pig-rearing buildings on the CODEMO production site",
      },
      {
        heading: "Challenges & History",
        body: "<p>The cooperative experienced significant disruption during the COVID-19 period, which interrupted livestock production. Members subsequently restructured the cooperative's organisation and operations to relaunch its livestock and aquaculture activities.</p>",
      },
      {
        heading: "Development Plans",
        body:
          "<p>CODEMO is working toward rebuilding and expanding its livestock operations, with its existing pig-rearing infrastructure providing a solid foundation for scaled, sustainable production.</p>" +
          ul([
            "Rebuild breeding stock",
            "Strengthen herd management and biosecurity",
            "Expand production toward full use of the 4 buildings",
          ]),
      },
    ],
    roadmap: [],
    targets: [
      { value: "4", label: "Buildings ready for scaled production" },
      { value: "20+", label: "Members behind the operation" },
      { value: "2026", label: "Relaunch of livestock activities" },
    ],
    gallery: g("pig", [
      "Inside the pig-rearing building",
      "Feeding time at the trough",
      "Sow with a new litter of piglets",
      "Daily inspection of the herd",
      "Raised pig housing on the production site",
      "Grower pigs in a clean pen",
    ]),
  },
  {
    slug: "pisciculture",
    number: "02",
    title: "Pisciculture",
    status: "Operational — expanding",
    tagline: "Expanding sustainable fish production.",
    summary:
      "CODEMO has experience producing fish through above-ground tanks and ponds and is developing expanded aquaculture capacity.",
    currentCapacity: "9 tanks · 2 ponds (~400 m²)",
    expansionPlan: "15 tanks · 2,000 kg/month",
    highlightValue: "9",
    highlightLabel: "Above-ground fish tanks",
    coverImage: img("fish-tanks"),
    coverAlt: "Above-ground fish tanks at the CODEMO aquaculture unit",
    showOnHome: true,
    heroStats: [
      { value: "9", label: "Above-ground fish tanks" },
      { value: "2 × 400 m²", label: "Earthen ponds" },
      { value: "200–300 kg", label: "Peak historical monthly production" },
    ],
    detailSections: [
      {
        heading: "Overview",
        body: "<p>CODEMO has built solid experience producing fish through above-ground tanks and ponds — first at Bonabéri, and today at its Dibombari site in the Moungo region.</p><p>The production figures below are presented as historical results and future targets, reflecting the cooperative's actual track record and stated development plans.</p>",
      },
      {
        heading: "Historical Production",
        body:
          "<p>The cooperative's fish production has evolved across two sites over the past five years.</p>" +
          ul([
            "<strong>2020–2023 · Bonabéri</strong> — production of approximately 200–300 kg per month",
            "<strong>2024–2025 · Dibombari</strong> — production of approximately 100–200 kg per month",
          ]),
        image: img("fish-tanks"),
        alt: "Above-ground fish tanks at the CODEMO aquaculture unit",
      },
      {
        heading: "Current Infrastructure",
        body: ul([
          "9 above-ground fish tanks in operation",
          "2 earthen ponds of approximately 400 m² each",
          "Feeding and water management routines handled by cooperative members",
        ]),
      },
      {
        heading: "Development Plans",
        body:
          "<p>CODEMO is developing expanded aquaculture capacity, supported by a mini hatchery that will produce fingerlings to stock the cooperative's own tanks and ponds.</p>" +
          ul([
            "Expansion from 9 to 15 above-ground tanks",
            "Target fish production of 2,000 kg per month",
            "Pond production target of 80 tonnes per year",
            "100,000 fingerlings per month from the hatchery under development",
          ]),
      },
    ],
    roadmap: [],
    targets: [
      { value: "15", label: "Above-ground fish tanks", text: "Expansion from 9 tanks today." },
      { value: "2,000 kg", label: "Fish per month", text: "Target monthly fish production." },
      { value: "100,000", label: "Fingerlings per month", text: "From the mini hatchery under development." },
      { value: "80 t", label: "Pond production per year", text: "Target annual pond output." },
    ],
    gallery: g("fish", [
      "Above-ground fish tanks from above",
      "Tilapia near the surface",
      "Feeding the fish",
      "Fresh water inlet to the tanks",
      "Fingerlings in a shallow basin",
      "Freshly harvested tilapia",
    ]),
  },
  {
    slug: "broiler-production",
    number: "03",
    title: "Broiler Production",
    status: "Operational — scaling",
    tagline: "Scaling modern broiler production.",
    summary:
      "Broiler production was launched in January 2026, with an initial test production of 1,500 birds — completed without major difficulties.",
    currentCapacity: "1,500-bird test cycle completed",
    expansionPlan: "2 new 400 m² buildings",
    highlightValue: "1,500",
    highlightLabel: "Birds in first test cycle",
    coverImage: img("broiler-house"),
    coverAlt: "Broiler poultry house at the CODEMO production site",
    showOnHome: true,
    heroStats: [
      { value: "1,500", label: "Birds in initial test production" },
      { value: "Jan 2026", label: "Production launched" },
      { value: "2 × 400 m²", label: "Additional buildings planned" },
    ],
    detailSections: [
      {
        heading: "Overview",
        body: "<p>Broiler production was launched in January 2026, with an initial test production of 1,500 birds — completed without major difficulties.</p><p>This successful first cycle validated the cooperative's poultry infrastructure and practices, opening the way for rapid scaling.</p>",
      },
      {
        heading: "The First Cycle",
        body: ul([
          "Launched in January 2026",
          "1,500 birds — initial test production",
          "Completed without major difficulties",
        ]),
        image: img("broiler-house"),
        alt: "Broiler poultry house at the CODEMO production site",
      },
      {
        heading: "Infrastructure Expansion",
        body: "<p>To reach commercial-scale output, CODEMO plans the construction of two additional broiler buildings of 400 m² each, supported by planned cold-storage capacity of 30–60 m³ for product conservation.</p>",
      },
    ],
    roadmapEyebrow: "Development Roadmap",
    roadmapTitle: "Scaling to Full Capacity",
    roadmap: [
      {
        title: "Test Production",
        text: "Initial cycle of 1,500 birds completed in early 2026 without major difficulties.",
      },
      {
        title: "Infrastructure Expansion",
        text: "Planned construction of two additional broiler buildings of 400 m² each.",
      },
      {
        title: "Full-Scale Output",
        text: "Target production of 4,000–5,000 birds per month, supported by 30–60 m³ of cold storage.",
      },
    ],
    targets: [
      { value: "4,000–5,000", label: "Birds per month", text: "Target monthly broiler production." },
      { value: "2", label: "Additional 400 m² buildings", text: "Planned construction to scale output." },
      { value: "30–60 m³", label: "Planned cold storage", text: "Conservation capacity for scaled production." },
    ],
    gallery: g("broiler", [
      "Inside the broiler house",
      "Day-old chicks under the brooder",
      "Broilers at the feed line",
      "Checking on the flock",
      "Poultry house exterior",
      "Ready-to-market broilers",
    ]),
  },
  {
    slug: "hatchery",
    number: "04",
    title: "Hatchery & Aquaculture",
    status: "In development",
    tagline: "Building the next generation of aquaculture.",
    summary:
      "Fingerling production and aquaculture expansion — a modern mini hatchery under development on the Dibombari site.",
    currentCapacity: "Mini hatchery under development",
    expansionPlan: "100,000 fingerlings / month",
    highlightValue: "100,000",
    highlightLabel: "Fingerlings per month — target",
    coverImage: img("hatchery-fingerlings"),
    coverAlt: "Fingerlings handled at the mini hatchery",
    showOnHome: false,
    heroStats: [
      { value: "100,000", label: "Fingerlings per month — target" },
      { value: "15", label: "Tanks to be stocked at full capacity" },
      { value: "80 t", label: "Annual pond production target" },
    ],
    detailSections: [
      {
        heading: "Overview",
        body: "<p>A mini hatchery is under development on the Dibombari site, designed to secure the cooperative's own supply of fingerlings and power the expansion of its aquaculture activities.</p><p>Producing fingerlings on site reduces dependence on external suppliers and anchors the full production cycle — from egg to harvest — within the cooperative.</p>",
      },
      {
        heading: "Production Target",
        body:
          "<p>The hatchery targets a production of 100,000 fingerlings per month, increasing fingerling availability for stocking the cooperative's tanks and ponds.</p>" +
          ul([
            "Target: 100,000 fingerlings per month",
            "Mini hatchery under development on site",
            "Fingerlings reserved for stocking tanks and ponds",
          ]),
        image: img("hatchery-fingerlings"),
        alt: "Fingerlings handled at the mini hatchery",
      },
    ],
    roadmapEyebrow: "Development Roadmap",
    roadmapTitle: "From Breeding to Harvest",
    roadmap: [
      { title: "Breeding", text: "Selected broodstock managed on site." },
      { title: "Hatchery", text: "Eggs incubated in controlled conditions." },
      { title: "Fingerlings", text: "Target of 100,000 fingerlings per month." },
      { title: "Stocking", text: "Ponds and tanks stocked with young fish." },
      { title: "Growth", text: "Feeding and monitoring to market size." },
      { title: "Harvest", text: "Harvest for local and regional markets." },
    ],
    targets: [
      { value: "100,000", label: "Fingerlings per month", text: "Target fingerling production." },
      { value: "15", label: "Above-ground tanks", text: "Expansion from 9 to 15 tanks." },
      { value: "2,000 kg", label: "Fish per month", text: "Target monthly fish production." },
    ],
    gallery: g("hatchery", [
      "Incubation tray",
      "Fingerling tank",
      "Hatchery basins",
      "Sorting fingerlings",
      "Water filtration unit",
      "Juvenile fish close-up",
    ]),
  },
  {
    slug: "rural-development",
    number: "05",
    title: "Rural Development",
    status: "Ongoing",
    tagline: "Projects supporting rural production, food supply and economic opportunity.",
    summary:
      "Projects supporting rural production, food supply and economic opportunity in the Moungo region of Cameroon.",
    currentCapacity: "2 ha integrated site",
    expansionPlan: "Employment · Food · Infrastructure",
    highlightValue: "2 ha",
    highlightLabel: "Integrated production site",
    coverImage: img("rural-farms"),
    coverAlt: "Rural farms and households in the Moungo region",
    showOnHome: false,
    heroStats: [
      { value: "20+", label: "Active cooperative members" },
      { value: "2 ha", label: "Integrated production site" },
      { value: "3", label: "Core production activities" },
    ],
    detailSections: [
      {
        heading: "Overview",
        body: "<p>Beyond its production units, CODEMO's mission is rural development: creating employment, strengthening local food production and building durable agricultural infrastructure in the Moungo region.</p><p>The cooperative model places ownership and decision-making in the hands of its members — anchoring value, skills and income in the rural economy.</p>",
      },
      {
        heading: "Focus Areas",
        body: ul([
          "Rural employment and cooperative membership",
          "Local food production and supply",
          "Agricultural and production infrastructure",
          "Aquaculture and livestock development",
          "Sustainable, long-term development of the region",
        ]),
        image: img("rural-farms"),
        alt: "Rural farms and households in the Moungo region",
      },
      {
        heading: "Local Impact",
        body: "<p>The cooperative's 2-hectare Dibombari site combines livestock, aquaculture and agricultural production with workers' accommodation — anchoring skilled rural jobs and local supply chains.</p><p>Each expansion — from the hatchery to new broiler buildings — extends that impact across the region.</p>",
      },
    ],
    roadmap: [],
    targets: [
      { value: "20+", label: "Cooperative members", text: "Local people, local ownership." },
      { value: "Dibombari", label: "Main production site", text: "In the Moungo region, Littoral." },
      { value: "2026+", label: "Expansion underway", text: "Hatchery, poultry and pond projects." },
    ],
    gallery: g("rural", [
      "Farmland in the Moungo region",
      "Farmers working a field",
      "Community cooperative meeting",
      "A rural road through Moungo",
      "Healthy crops in a smallholder field",
      "Village life in the Moungo",
    ]),
  },
];

type NavSeed = { location: NavLocation; label: string; href: string };
const quick = [
  ["Home", "/"],
  ["About", "/about"],
  ["Activities", "/activities"],
  ["Projects", "/#projects"],
  ["Contact", "/contact"],
];
export const navLinks: NavSeed[] = [
  ...quick.map(([label, href]) => ({ location: "HEADER" as const, label, href })),
  ...quick.map(([label, href]) => ({ location: "FOOTER_QUICK" as const, label, href })),
  ...activities.map((a) => ({
    location: "FOOTER_ACTIVITIES" as const,
    label: a.title,
    href: `/activities/${a.slug}`,
  })),
];
