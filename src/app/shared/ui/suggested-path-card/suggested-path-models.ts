// Stage of a course inside a suggested path. There is no progress within a course:
// the product tracks whole courses, so the one to take now is simply the next
export type CourseStatus = 'completed' | 'next' | 'locked';

// Course as the suggested path card renders it
export interface SuggestedCourse {
  readonly title: string;
  readonly status: CourseStatus;
  // Course that has to be finished first, recalled while this one is the one to take now
  readonly unlockAfter?: string;
  // The catalog course it stands for, so a card can be dressed with its cover
  readonly slug?: string;
}
