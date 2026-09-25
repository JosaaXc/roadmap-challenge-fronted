// Stage of a course inside a suggested path. There is no progress within a course:
// the product tracks whole courses, so the one to take now is simply the next
export type CourseStatus = 'completed' | 'next' | 'locked';

// Course as the suggested path card renders it
export interface SuggestedCourse {
  readonly title: string;
  readonly status: CourseStatus;
  // Course that has to be finished first, only meaningful while the course is locked
  readonly unlockAfter?: string;
}
