// Stage of a course inside a suggested path
export type CourseStatus = 'completed' | 'in-progress' | 'locked';

// Course as the suggested path card renders it
export interface SuggestedCourse {
  readonly title: string;
  readonly status: CourseStatus;
  // Completion percentage, only meaningful while the course is in progress
  readonly progress?: number;
  // Course that has to be finished first, only meaningful while the course is locked
  readonly unlockAfter?: string;
}
