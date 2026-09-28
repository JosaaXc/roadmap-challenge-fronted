import { Component, computed, input, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideExternalLink, lucideGraduationCap } from '@ng-icons/lucide';
import { HlmCard } from '@spartan-ng/helm/card';
import { TECH_ICONS } from '../../constants/tech-badges';
import { CatalogCourse } from '../../models/landing-models';
import { courseBadges } from '../../utils/catalog-filters';

// A course of the catalog page, dressed like the cards of Mis rutas: its cover melts into a tint
// of itself and lends the card its glow. The whole card opens the course on the academy
@Component({
  selector: 'app-course-card',
  imports: [NgIcon, HlmCard],
  templateUrl: './course-card.html',
  viewProviders: [provideIcons({ ...TECH_ICONS, lucideExternalLink, lucideGraduationCap })],
  host: { class: 'block h-full' },
})
export class CourseCard {
  readonly course = input.required<CatalogCourse>();

  protected readonly badges = computed(() => courseBadges(this.course().tags));

  // One that fails takes the tint and the glow with it, and a stand-in keeps its place
  protected readonly coverFailed = signal(false);
  protected readonly cover = computed(() => (this.coverFailed() ? null : this.course().imageUrl));
}
