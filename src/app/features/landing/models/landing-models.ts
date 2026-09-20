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
