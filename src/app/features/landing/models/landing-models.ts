// Step of the "how it works" strip
export interface LandingStep {
  // Zero-padded ordinal, rendered as a mono label
  readonly ordinal: string;
  readonly title: string;
  readonly description: string;
}

// Headline figure of the catalog section, counted from the catalog itself
export interface CatalogStat {
  readonly value: number;
  readonly label: string;
}

// A course as the landing reads it from the public catalog
export interface CatalogCourse {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly level: string;
  readonly tags: readonly string[];
  // Its page on the academy
  readonly url: string;
  readonly imageUrl: string | null;
}

// A level of the catalog page, which lays the courses out from the first level to the last
export interface CatalogLevel {
  // As the API names it, like BEGINNER
  readonly value: string;
  readonly label: string;
  readonly description: string;
}

// A level as the page shows it: its place in the order and the courses the filters leave in it
export interface CatalogBand extends CatalogLevel {
  readonly ordinal: number;
  readonly courses: readonly CatalogCourse[];
}

// A technology or field the catalog page filters by, and how many courses carry it
export interface TechFilter {
  readonly badge: TechBadge;
  readonly count: number;
}

// GET /catalog/courses: one page of courses and the cursor to the next one
export interface CatalogCoursesResponse {
  readonly success: boolean;
  readonly data: { readonly items: readonly CatalogCourse[] };
  readonly meta: { readonly hasNextPage: boolean; readonly nextCursor?: string };
}

// A catalog tag as a pill of the marquee
export interface TechBadge {
  readonly tag: string;
  readonly label: string;
  // A name registered in TECH_ICONS
  readonly icon: string;
  // What the pill lights up with: any CSS colour, a brand's own or a theme variable
  readonly color: string;
}

// The marquee's rows: technologies slide one way, fields and tools the other
export interface TechRows {
  readonly technologies: readonly TechBadge[];
  readonly fields: readonly TechBadge[];
}
