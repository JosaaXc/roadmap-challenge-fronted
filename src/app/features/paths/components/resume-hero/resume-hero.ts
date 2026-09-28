import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButton } from '@spartan-ng/helm/button';
import { buildCoverFan } from '../../../../shared/ui/cover-fan/build-cover-fan';
import { CoverFan } from '../../../../shared/ui/cover-fan/cover-fan';
import { ParticleField } from '../../../../shared/ui/particle-field/particle-field';
import { LearningPath } from '../../models/paths-models';
import { PathTitlePipe } from '../../pipes/path-title.pipe';
import { pathCourses } from '../../utils/path-courses';
import { PathProgress } from '../path-progress/path-progress';

// The top of Mis rutas: the course to take next on the path to pick up again, and the fan of
// that path's covers turned to it
@Component({
  selector: 'app-resume-hero',
  imports: [RouterLink, HlmButton, CoverFan, ParticleField, PathProgress, PathTitlePipe],
  templateUrl: './resume-hero.html',
  host: { class: 'block' },
})
export class ResumeHero {
  readonly path = input.required<LearningPath>();

  protected readonly courses = computed(() => pathCourses(this.path()));

  // Where the path stands: the first course not done yet, counted from one
  protected readonly step = computed(
    () => this.courses().findIndex((course) => !course.isCompleted) + 1,
  );
  protected readonly next = computed(() => this.courses()[this.step() - 1]);
  protected readonly fan = computed(() => buildCoverFan(this.courses(), this.next()?.id ?? null));

  // Nothing done yet, so the action is to start rather than to carry on
  protected readonly started = computed(() => this.path().progress > 0);
}
