import { afterNextRender, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButton } from '@spartan-ng/helm/button';
import { buildCoverFan } from '../../../../shared/ui/cover-fan/build-cover-fan';
import { ParticleField } from '../../../../shared/ui/particle-field/particle-field';
import {
  SAMPLE_PATH,
  SAMPLE_PATH_TOPIC,
} from '../../../../shared/ui/suggested-path-card/sample-path';
import { SuggestedPathCard } from '../../../../shared/ui/suggested-path-card/suggested-path-card';
import { LandingStore } from '../../services/landing-store';

// Pace of the sample path: the first course once the card has lit up, then one every few
// seconds, and a longer rest once the path is done before it starts over
const FIRST_STEP_MS = 3000;
const STEP_MS = 2600;
const DONE_REST_MS = 3200;

@Component({
  imports: [RouterLink, HlmButton, ParticleField, SuggestedPathCard],
  selector: 'app-landing-hero',
  templateUrl: './landing-hero.html',
  host: { class: 'contents' },
})
export class LandingHero {
  private readonly store = inject(LandingStore);

  protected readonly samplePath = SAMPLE_PATH;
  protected readonly samplePathTopic = SAMPLE_PATH_TOPIC;

  // The sample path plays itself from the course it marks as next, and returns there each round
  private readonly startingPoint = SAMPLE_PATH.findIndex((course) => course.status === 'next');
  protected readonly completed = signal(this.startingPoint);

  // Real covers of its courses, from the catalog; empty until it answers
  protected readonly covers = computed(() => {
    const bySlug = this.store.coverBySlug();
    return this.samplePath.flatMap((course) => (course.slug && bySlug.get(course.slug)) || []);
  });

  protected readonly fan = computed(() => {
    const bySlug = this.store.coverBySlug();
    const courses = this.samplePath.map((course) => ({
      id: course.title,
      imageUrl: course.slug ? bySlug.get(course.slug) : null,
    }));
    return buildCoverFan(courses, this.samplePath[this.completed()]?.title ?? null);
  });

  constructor() {
    this.store.loadCatalog();

    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      // Still for anyone who asked for less motion: the card shows the path as it comes
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const total = this.samplePath.length;
      let timer: ReturnType<typeof setTimeout>;
      const next = () => {
        const done = this.completed() >= total ? this.startingPoint : this.completed() + 1;
        this.completed.set(done);
        timer = setTimeout(next, done === total ? DONE_REST_MS : STEP_MS);
      };

      timer = setTimeout(next, FIRST_STEP_MS);
      destroyRef.onDestroy(() => clearTimeout(timer));
    });
  }
}
