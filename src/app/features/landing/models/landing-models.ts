// Stage of a course inside a suggested path
export type CourseStatus = 'completed' | 'in-progress' | 'locked';

// Course as rendered by the suggested path preview
export interface SuggestedCourse {
  readonly title: string;
  readonly status: CourseStatus;
  // Completion percentage. Only meaningful while the course is in progress
  readonly progress?: number;
  readonly unlockAfter?: string;
}

// Step of the "how it works" strip
export interface LandingStep {
  // Zero-padded ordinal, rendered as a mono label
  readonly ordinal: string;
  readonly title: string;
  readonly description: string;
}

// Headline figure of the catalog section
export interface CatalogStat {
  // Already formatted for display, e.g. "+80"
  readonly value: string;
  readonly label: string;
}
