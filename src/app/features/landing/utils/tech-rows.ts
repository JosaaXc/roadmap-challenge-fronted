import { FIELD_BADGES, TECHNOLOGY_BADGES } from '../constants/tech-badges';
import { TechRows } from '../models/landing-models';

// The catalog's tags as the marquee's rows, in the curated order of the badges. Tags without a
// badge, like the levels, stay out, and so do badges whose tag the catalog no longer uses
export function buildTechRows(tags: readonly string[]): TechRows {
  const inCatalog = new Set(tags);
  return {
    technologies: TECHNOLOGY_BADGES.filter((badge) => inCatalog.has(badge.tag)),
    fields: FIELD_BADGES.filter((badge) => inCatalog.has(badge.tag)),
  };
}
