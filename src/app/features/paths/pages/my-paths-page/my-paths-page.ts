import { Component, inject, OnInit, signal } from '@angular/core';
import { PathsApi } from '../../services/paths-api';
import { LearningPath } from '../../models/paths-models';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavoriteToggleComponent } from '../../components/favorite-toggle/favorite-toggle.component';

export class PaginatedPathsList {
  readonly items = signal<LearningPath[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly isLoadingMore = signal<boolean>(false);
  readonly nextCursor = signal<string | undefined>(undefined);
  readonly hasNextPage = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly currentOrder = signal<'asc' | 'desc'>('desc');

  constructor(
    private api: PathsApi,
    private filters: {
      isFavorite?: boolean;
      isPublic?: boolean;
    } = {}
  ) {}

  toggleOrder(){
    const newOrder = this.currentOrder() === 'desc' ? 'asc' : 'desc';
    this.currentOrder.set(newOrder);
    this.loadInitial()
  }

  loadInitial() {
    this.isLoading.set(true);
    this.error.set(null);

    this.api.getPaths({ take: 10, order: this.currentOrder(), ...this.filters }).subscribe({
      next: (response) => {
        this.items.set(response.data.items);
        this.nextCursor.set(response.meta.nextCursor);
        this.hasNextPage.set(response.meta.hasNextPage);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('No pudimos cargar tus rutas.');
        this.isLoading.set(false);
      },
    });
  }

  loadMore() {
    if (!this.hasNextPage() || this.isLoadingMore()) return;

    this.isLoadingMore.set(true);

    this.api.getPaths({ take: 10, cursor: this.nextCursor(), order: this.currentOrder(), ...this.filters}).subscribe({
      next: (response) => {
        this.items.update((current) => [...current, ...response.data.items]);
        this.nextCursor.set(response.meta.nextCursor);
        this.hasNextPage.set(response.meta.hasNextPage);
        this.isLoadingMore.set(false);
      },
      error: () => {
        this.isLoadingMore.set(false);
      },
    });
  }
}

@Component({
  imports: [CommonModule, RouterModule, FavoriteToggleComponent],
  standalone: true,
  selector: 'app-my-paths-page',
  templateUrl: './my-paths-page.html',
})
export class MyPathsPage implements OnInit{
  private readonly api = inject(PathsApi);

  readonly favorites = new PaginatedPathsList(this.api, {isFavorite: true});
  readonly regular = new PaginatedPathsList(this.api, {isFavorite: false, isPublic: false});
  readonly published = new PaginatedPathsList(this.api, {isPublic: true});

  ngOnInit() {
    this.favorites.loadInitial();
    this.regular.loadInitial();
    this.published.loadInitial();
  }

  get isCompletelyEmpty() {
    return !this.favorites.isLoading() &&
            !this.regular.isLoading() &&
            !this.published.isLoading() &&
            this.favorites.items().length === 0 &&
            this.regular.items().length === 0 &&
            this.published.items().length === 0;

  }
}
