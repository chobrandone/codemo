import {
  ActivitiesSection,
  CooperativeSection,
  HomeHero,
  InfrastructureSection,
  ProjectsSection,
  RuralSection,
  VisionSection,
} from "@/components/site/home";
import { CtaSection } from "@/components/site/sections";
import { GenericSection } from "@/components/site/generic-sections";
import {
  getActivities,
  getBullets,
  getInfrastructure,
  getProjects,
  getSections,
  getStats,
  type Section,
} from "@/lib/content";

export default async function HomePage() {
  const [sections, facts, coop, vision, activities, infrastructure, projects, bullets] = await Promise.all([
    getSections("HOME"),
    getStats("HERO_FACT"),
    getStats("COOPERATIVE"),
    getStats("VISION"),
    getActivities(),
    getInfrastructure(),
    getProjects(),
    getBullets("rural-development"),
  ]);

  const render = (s: Section) => {
    switch (s.type || s.key) {
      case "hero":
        return <HomeHero key={s.id} section={s} facts={facts} />;
      case "cooperative":
        return <CooperativeSection key={s.id} section={s} stats={coop} />;
      case "activities":
        return <ActivitiesSection key={s.id} section={s} activities={activities.filter((a) => a.showOnHome)} />;
      case "infrastructure":
        return <InfrastructureSection key={s.id} section={s} items={infrastructure} />;
      case "vision":
        return <VisionSection key={s.id} section={s} stats={vision} />;
      case "rural":
        return <RuralSection key={s.id} section={s} bullets={bullets} />;
      case "projects":
        return <ProjectsSection key={s.id} section={s} projects={projects} />;
      case "cta":
        return <CtaSection key={s.id} section={s} />;
      default:
        return <GenericSection key={s.id} section={s} />;
    }
  };

  return <>{sections.map(render)}</>;
}
