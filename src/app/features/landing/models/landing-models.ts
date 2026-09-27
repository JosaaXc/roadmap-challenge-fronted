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
  readonly level: string;
  readonly tags: readonly string[];
  readonly imageUrl: string | null;
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
