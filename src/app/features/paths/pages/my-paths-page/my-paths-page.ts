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
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';
import { PathFilter } from '../../models/paths-models';
import { DeviMascot } from '../../../../shared/ui/devi-mascot/devi-mascot';
import { PathsStore } from '../../services/paths-store';
import { toPathCard } from '../../utils/path-card';
import { PathCardComponent } from '../../../../shared/ui/path-card/path-card';
import { useListOrder } from '../../../../shared/utils/use-list-order';
import { CommunityPathsPageComponent } from '../../../community-paths/pages/community-paths/community-paths';

@Component({
  selector: 'app-my-paths-page',
  imports: [
    RouterLink,
    NgIcon,
    HlmAlertImports,
    HlmButton,
    HlmEmptyImports,
    HlmSkeleton,
    HlmToggleGroupImports,
    PathCardComponent,
    CommunityPathsPageComponent,
    DeviMascot,
  ],
  templateUrl: './my-paths-page.html',
  viewProviders: [
    provideIcons({ lucideCheck, lucideChevronDown, lucideChevronUp, lucideCircleAlert }),
  ],
})
export class MyPathsPage implements OnInit {
  readonly store = inject(PathsStore);

  readonly filter = signal<PathFilter>('all');
  readonly skeletonCards = [0, 1, 2, 3, 4, 5];

  // PASO 1: Filtramos los datos crudos del store
  private readonly filteredPaths = computed(() => {
    const allPaths = this.store.paths();
    return this.filter() === 'all' ? allPaths : allPaths.filter((path) => path.isFavorite);
  });

  // PASO 2: Le pasamos la lista filtrada a nuestro hook para que la ordene
  readonly listOrder = useListOrder(this.filteredPaths);

  // Exponemos las variables del hook al HTML
  readonly order = this.listOrder.order;
  readonly toggleOrder = this.listOrder.toggleOrder;

  // PASO 3: Mapeamos el resultado final a PathCard para renderizar
  readonly cards = computed(() => this.listOrder.orderedList().map(toPathCard));

  ngOnInit() {
    // Cambio de store.load() a store.loadInitial()
    this.store.loadInitial();
  }

  onFilterChange(value: unknown): void {
    if (value === 'all' || value === 'favorites') this.filter.set(value);
  }
}
