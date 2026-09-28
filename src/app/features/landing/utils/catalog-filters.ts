import { FIELD_BADGES, TECHNOLOGY_BADGES } from '../constants/tech-badges';
import { CatalogCourse, TechBadge, TechFilter } from '../models/landing-models';

// Languages and frameworks first, then fields and tools, in the curated order of the marquee
const ALL_BADGES = [...TECHNOLOGY_BADGES, ...FIELD_BADGES];
const BADGE_BY_TAG = new Map(ALL_BADGES.map((badge) => [badge.tag, badge]));

// Lowercase and without accents, so "programacion" still finds "programación"
export function normalizeText(text: string): string {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}

// Every technology and field some course carries, the most taught first. Ties keep the curated
// order, and tags without a badge, like the levels, stay out
export function buildTechFilters(courses: readonly CatalogCourse[]): TechFilter[] {
  const counts = new Map<string, number>();
  for (const tag of courses.flatMap((course) => course.tags)) {
    counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }

  return ALL_BADGES.flatMap((badge) => {
    const count = counts.get(badge.tag) ?? 0;
    return count > 0 ? [{ badge, count }] : [];
  }).sort((a, b) => b.count - a.count);
}

// The courses with the chosen tag that match every word of the search, in their title, their
// description or the name of one of their technologies
export function filterCourses(
  courses: readonly CatalogCourse[],
  tag: string | null,
  query: string,
): CatalogCourse[] {
  const words = normalizeText(query).split(/\s+/).filter(Boolean);

  return courses.filter((course) => {
    if (tag && !course.tags.includes(tag)) return false;
    if (words.length === 0) return true;

    const names = course.tags.map((courseTag) => BADGE_BY_TAG.get(courseTag)?.label ?? courseTag);
    const text = normalizeText([course.title, course.description, ...names].join(' '));
    return words.every((word) => text.includes(word));
  });
}

// What a card lists: languages and frameworks before fields, at most three
export function courseBadges(tags: readonly string[], max = 3): TechBadge[] {
  return ALL_BADGES.filter((badge) => tags.includes(badge.tag)).slice(0, max);
}

// Covers for the light at the top of the page: those of the chosen tag's courses, or with none
// chosen one per technology, so the light carries the colours of the whole catalog
export function lightCovers(
  courses: readonly CatalogCourse[],
  tag: string | null,
  max: number,
): string[] {
  const picked = tag
    ? courses.filter((course) => course.tags.includes(tag))
    : TECHNOLOGY_BADGES.flatMap(
        (badge) => courses.find((course) => course.tags.includes(badge.tag)) ?? [],
      );

  return [...new Set(picked.flatMap((course) => course.imageUrl ?? []))].slice(0, max);
}
