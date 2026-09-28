// Tags are stored lowercase and hyphenated, like react-native
export function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, '-');
}

export function normalizeTags(tags: string[]): string[] {
  return [...new Set(tags.map(normalizeTag))];
}
