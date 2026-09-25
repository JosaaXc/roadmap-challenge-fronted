import {
  afterNextRender,
  booleanAttribute,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
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

// A path as a timeline: the rail is cyan up to where the learner stands and grey after it
@Component({
  imports: [HlmCardImports, PathTimelineStep],
  selector: 'app-suggested-path-card',
  templateUrl: './suggested-path-card.html',
  host: { class: 'contents' },
})
export class SuggestedPathCard {
  readonly courses = input.required<readonly SuggestedCourse[]>();
  readonly topic = input.required<string>();

  // Shortens the header labels where the card sits in a narrow column
  readonly compact = input(false, { transform: booleanAttribute });

  protected readonly statusLabel = COURSE_STATUS_LABEL;
  protected readonly timelineState = TIMELINE_STATE;

  protected readonly headerLabel = computed(
    () => `${this.compact() ? 'Ruta' : 'Ruta sugerida'} · ${this.topic()}`,
  );

  protected readonly progressLabel = computed(() => {
    const completed = this.courses().filter((course) => course.status === 'completed').length;
    const total = this.courses().length;
    return this.compact() ? `${completed} de ${total}` : `${completed} de ${total} completados`;
  });

  // Holds the path unlit until the card has painted, so flipping it draws the
  // rail course by course, as one sequence
  protected readonly pathRevealed = signal(false);

  constructor() {
    afterNextRender(() => {
      // The unlit state has to reach the screen before the values change, or the
      // browser has nothing to transition from; the beat also makes it noticeable
      setTimeout(() => this.pathRevealed.set(true), 250);
    });
  }
}
