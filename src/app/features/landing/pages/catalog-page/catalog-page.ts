import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleAlert, lucideSearch } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { CoverWash } from '../../../../shared/ui/cover-wash/cover-wash';
import { CourseCard } from '../../components/course-card/course-card';
import { LandingClosing } from '../../components/landing-closing/landing-closing';
import { LandingFooter } from '../../components/landing-footer/landing-footer';
import { LandingHeader } from '../../components/landing-header/landing-header';
import { TechPill } from '../../components/tech-pill/tech-pill';
import {
  CATALOG_LEVELS,
  CATALOG_LIGHT_COVERS,
  CATALOG_PINNED_FILTERS,
} from '../../constants/landing-constants';
import { CatalogBand } from '../../models/landing-models';
import { LandingStore } from '../../services/landing-store';
import { buildTechFilters, filterCourses, lightCovers } from '../../utils/catalog-filters';

// Every course of the catalog, open to anyone, in the order they are meant to be taken: from
// beginner to advanced. A technology or a search narrows it, and the light at the top follows
@Component({
  selector: 'app-catalog-page',
  imports: [
    RouterLink,
    NgIcon,
    HlmAlertImports,
    HlmButton,
    HlmEmptyImports,
    HlmInputImports,
    HlmSkeleton,
    CoverWash,
    CourseCard,
    LandingClosing,
    LandingFooter,
    LandingHeader,
    TechPill,
  ],
  templateUrl: './catalog-page.html',
  viewProviders: [provideIcons({ lucideCircleAlert, lucideSearch })],
})
export class CatalogPage {
  protected readonly store = inject(LandingStore);

  protected readonly pinnedFilters = CATALOG_PINNED_FILTERS;
  protected readonly skeletonCards = [0, 1, 2, 3, 4, 5];

  protected readonly query = signal('');
  protected readonly tag = signal<string | null>(null);
  protected readonly showAllFilters = signal(false);

  private readonly courses = computed(() => this.store.courses() ?? []);

  protected readonly filters = computed(() => buildTechFilters(this.courses()));

  // The most taught first; the rest wait behind "Ver todas", except the one chosen
  protected readonly shownFilters = computed(() => {
    const filters = this.filters();
    if (this.showAllFilters()) return filters;

    const pinned = filters.slice(0, CATALOG_PINNED_FILTERS);
    const chosen = filters.find((filter) => filter.badge.tag === this.tag());
    return chosen && !pinned.includes(chosen) ? [...pinned, chosen] : pinned;
  });

  protected readonly shown = computed(() =>
    filterCourses(this.courses(), this.tag(), this.query()),
  );

  // Levels that still hold a course, each keeping its place in the order
  protected readonly bands = computed<CatalogBand[]>(() =>
    CATALOG_LEVELS.map((level, index) => ({
      ...level,
      ordinal: index + 1,
      courses: this.shown().filter((course) => course.level === level.value),
    })).filter((band) => band.courses.length > 0),
  );

  // It follows the technology only: relighting the page on every keystroke would flicker
  protected readonly lightCovers = computed(() =>
    lightCovers(this.courses(), this.tag(), CATALOG_LIGHT_COVERS),
  );
  protected readonly lightKey = computed(() => this.tag() ?? 'all');

  // What the list holds now, announced when it changes
  protected readonly summary = computed(() => {
    const count = this.shown().length;
    const label = this.filters().find((filter) => filter.badge.tag === this.tag())?.badge.label;
    const query = this.query().trim();

    return (
      `${count} curso${count === 1 ? '' : 's'}` +
      (label ? ` de ${label}` : '') +
      (query ? ` para «${query}»` : '')
    );
  });

  constructor() {
    this.store.loadCatalog();
  }

  protected toggleTag(tag: string): void {
    this.tag.update((current) => (current === tag ? null : tag));
  }

  protected clearFilters(): void {
    this.tag.set(null);
    this.query.set('');
  }
}
