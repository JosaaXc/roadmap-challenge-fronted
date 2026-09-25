import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideChevronDown,
  lucideChevronUp,
  lucideCircleAlert,
} from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCard } from '@spartan-ng/helm/card';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';
import { FavoriteToggleComponent } from '../../components/favorite-toggle/favorite-toggle.component';
import { PathProgress } from '../../components/path-progress/path-progress';
import { PathCard, PathFilter, PathOrder } from '../../models/paths-models';
import { PathTitlePipe } from '../../pipes/path-title.pipe';
import { ShortDatePipe } from '../../pipes/short-date.pipe';
import { PathsStore } from '../../services/paths-store';
import { toPathCard } from '../../utils/path-card';

@Component({
  selector: 'app-my-paths-page',
  imports: [
    RouterLink,
    NgIcon,
    HlmAlertImports,
    HlmButton,
    HlmCard,
    HlmEmptyImports,
    HlmSkeleton,
    HlmToggleGroupImports,
    FavoriteToggleComponent,
    PathProgress,
    PathTitlePipe,
    ShortDatePipe,
  ],
  templateUrl: './my-paths-page.html',
  viewProviders: [
    provideIcons({ lucideCheck, lucideChevronDown, lucideChevronUp, lucideCircleAlert }),
  ],
})
export class MyPathsPage implements OnInit {
  readonly store = inject(PathsStore);

  readonly filter = signal<PathFilter>('all');
  readonly order = signal<PathOrder>('desc');

  // Enough placeholders to fill the first row on every breakpoint
  readonly skeletonCards = [0, 1, 2, 3, 4, 5];

  readonly cards = computed<PathCard[]>(() => {
    const visible = this.store.paths().filter((path) => this.filter() === 'all' || path.isFavorite);

    // The store already sorts newest first, so the other order is its reverse
    const ordered = this.order() === 'desc' ? visible : visible.reverse();
    return ordered.map(toPathCard);
  });

  ngOnInit() {
    this.store.load();
  }

  // The toggle group hands back the value of the pressed item
  onFilterChange(value: unknown): void {
    if (value === 'all' || value === 'favorites') this.filter.set(value);
  }

  toggleOrder(): void {
    this.order.update((current) => (current === 'desc' ? 'asc' : 'desc'));
  }
}
