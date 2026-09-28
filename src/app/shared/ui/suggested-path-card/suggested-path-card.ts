import {
  afterNextRender,
  booleanAttribute,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmProgressImports } from '@spartan-ng/helm/progress';
import { CoverFan } from '../cover-fan/cover-fan';
import { FanCover } from '../cover-fan/cover-fan-models';
import { CoverWash } from '../cover-wash/cover-wash';
import { TimelineStepState } from '../path-timeline/path-timeline-models';
import { PathTimelineStep } from '../path-timeline/path-timeline-step';
import { CourseStatus, SuggestedCourse } from './suggested-path-models';

const COURSE_STATUS_LABEL: Record<CourseStatus, string> = {
  completed: 'Completado',
  next: 'Siguiente',
  locked: 'Bloqueado',
};

// The preview speaks of courses, the timeline of steps: the next course is the current step
const TIMELINE_STATE: Record<CourseStatus, TimelineStepState> = {
  completed: 'completed',
  next: 'current',
  locked: 'pending',
};

// Gap between the rails of two consecutive courses when the path first lights up
const REVEAL_STAGGER_MS = 260;

// A path as a timeline: the rail is cyan up to where the learner stands and grey after it
@Component({
  imports: [HlmCardImports, HlmProgressImports, CoverFan, CoverWash, PathTimelineStep],
  selector: 'app-suggested-path-card',
  templateUrl: './suggested-path-card.html',
  host: { class: 'contents' },
})
export class SuggestedPathCard {
  readonly courses = input.required<readonly SuggestedCourse[]>();
  readonly topic = input.required<string>();

  // Shortens the header labels where the card sits in a narrow column
  readonly compact = input(false, { transform: booleanAttribute });

  // How many courses are done, for a card that plays its path forward. Null, the default,
  // keeps the status each course comes with
  readonly completed = input<number | null>(null);

  // The path's covers and the fan around the course to take now. Without covers the card
  // keeps its plain header, as in the compact aside
  readonly covers = input<readonly string[]>([]);
  readonly fan = input<readonly FanCover[]>([]);

  protected readonly statusLabel = COURSE_STATUS_LABEL;
  protected readonly timelineState = TIMELINE_STATE;

  protected readonly statuses = computed(() => {
    const completed = this.completed();
    return this.courses().map((course, index) =>
      completed === null ? course.status : statusAt(index, completed),
    );
  });

  // The line under a course: how it unlocked, while it is the one to take now, and on the last
  // course once the path is done. One course carries it at a time, and as one folds the next
  // opens at the same pace, so a card that plays its path never changes height
  protected readonly hints = computed(() => {
    const statuses = this.statuses();
    const done = statuses.every((status) => status === 'completed');
    const last = statuses.length - 1;

    return this.courses().map((course, index) =>
      done && index === last
        ? { text: 'Completaste esta ruta', open: true }
        : {
            text: course.unlockAfter ? `Se desbloqueó al terminar ${course.unlockAfter}` : null,
            open: statuses[index] === 'next',
          },
    );
  });

  protected readonly headerLabel = computed(
    () => `${this.compact() ? 'Ruta' : 'Ruta sugerida'} · ${this.topic()}`,
  );

  private readonly completedCount = computed(
    () => this.statuses().filter((status) => status === 'completed').length,
  );

  protected readonly progressLabel = computed(() => {
    const total = this.courses().length;
    return this.compact()
      ? `${this.completedCount()} de ${total}`
      : `${this.completedCount()} de ${total} completados`;
  });

  protected readonly progressValue = computed(() =>
    Math.round((this.completedCount() / Math.max(this.courses().length, 1)) * 100),
  );

  // Holds the path unlit until the card has painted, so flipping it draws the
  // rail course by course, as one sequence
  protected readonly pathRevealed = signal(false);

  // The stagger belongs to that first sequence only: a path that plays on moves each rail at once
  protected readonly staggered = signal(true);

  constructor() {
    afterNextRender(() => {
      // The unlit state has to reach the screen before the values change, or the
      // browser has nothing to transition from; the beat also makes it noticeable
      setTimeout(() => this.pathRevealed.set(true), 250);
      setTimeout(
        () => this.staggered.set(false),
        250 + this.courses().length * REVEAL_STAGGER_MS + 500,
      );
    });
  }

  // One class binding per card, so helm's own classes and these never fight over the element
  protected readonly cardClasses = computed(() =>
    [
      this.compact() ? '[--card-spacing:--spacing(3.5)]' : '[--card-spacing:--spacing(5)]',
      // The banner runs to the card's top edge
      this.covers().length > 0 ? 'pt-0' : '',
    ].join(' '),
  );

  protected stepClasses(status: CourseStatus): string {
    return [
      this.compact() ? '[--card-spacing:--spacing(3)]' : '[--card-spacing:--spacing(3.5)]',
      // The course to take now is outlined like the current card of a real path
      status === 'next' ? 'border-highlight' : 'border-border',
    ].join(' ');
  }

  protected revealDelay(index: number): number {
    return this.staggered() ? index * REVEAL_STAGGER_MS : 0;
  }
}

// Where a course stands once the first `completed` courses of its path are done
function statusAt(index: number, completed: number): CourseStatus {
  if (index < completed) return 'completed';
  return index === completed ? 'next' : 'locked';
}
