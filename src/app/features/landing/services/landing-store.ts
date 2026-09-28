import { computed, inject, Service, signal } from '@angular/core';
import { CatalogCourse, CatalogStat } from '../models/landing-models';
import { buildTechRows } from '../utils/tech-rows';
import { LandingApi } from './landing-api';

@Service()
export class LandingStore {
  private readonly api = inject(LandingApi);

  private readonly _courses = signal<readonly CatalogCourse[] | null>(null);
  private readonly _catalogFailed = signal(false);
  private catalogRequested = false;

  // Every active course, null until the catalog answers
  readonly courses = this._courses.asReadonly();
  readonly catalogFailed = this._catalogFailed.asReadonly();

  // The marquee's rows, from the tags of the courses themselves: /catalog/tags also carries the
  // questionnaire's, which no course has. Empty until the catalog answers
  readonly techRows = computed(() =>
    buildTechRows((this._courses() ?? []).flatMap((course) => course.tags)),
  );

  // The catalog section's figures, counted from the same courses; null until they arrive
  readonly catalogStats = computed<readonly CatalogStat[] | null>(() => {
    const courses = this._courses();
    if (!courses) return null;

    return [
      { value: courses.length, label: 'Cursos a elegir' },
      { value: this.techRows().technologies.length, label: 'Tecnologías' },
      { value: new Set(courses.map((course) => course.level)).size, label: 'Niveles' },
    ];
  });

  // Every cover of the catalog by course slug, for the sample path of the hero
  readonly coverBySlug = computed(
    () => new Map((this._courses() ?? []).map((course) => [course.slug, course.imageUrl])),
  );

  // Once per visit to the app, as the catalog rarely changes. The landing reads well without it,
  // so a failure only leaves out what it feeds; the catalog page says so and offers a retry
  loadCatalog(): void {
    if (this.catalogRequested) return;
    this.catalogRequested = true;
    this._catalogFailed.set(false);

    this.api.getCatalogCourses().subscribe({
      next: (courses) => this._courses.set(courses),
      error: () => {
        this.catalogRequested = false;
        this._catalogFailed.set(true);
      },
    });
  }
}
