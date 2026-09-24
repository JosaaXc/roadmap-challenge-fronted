import { computed, inject, Service, signal } from '@angular/core';
import { LearningPath } from '../models/paths-models';
import { PathsApi } from './paths-api';

// One request covers the list: the favourites filter runs in memory, so the
// toggle is instant and the totals never depend on a second response
const PAGE_SIZE = 50;

@Service()
export class PathsStore {
  private readonly api = inject(PathsApi);

  private readonly _paths = signal<LearningPath[]>([]);
  private readonly _isLoading = signal<boolean>(true);
  private readonly _isLoadingMore = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _nextCursor = signal<string | undefined>(undefined);
  private readonly _hasNextPage = signal<boolean>(false);

  readonly paths = this._paths.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isLoadingMore = this._isLoadingMore.asReadonly();
  readonly error = this._error.asReadonly();
  readonly hasNextPage = this._hasNextPage.asReadonly();

  readonly favoriteCount = computed(() => this._paths().filter((path) => path.isFavorite).length);

  load(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.api.getPaths({ take: PAGE_SIZE, order: 'desc' }).subscribe({
      next: (response) => {
        this._paths.set(this.sortByNewest(response.data.items));
        this._nextCursor.set(response.meta.nextCursor);
        this._hasNextPage.set(response.meta.hasNextPage);
        this._isLoading.set(false);
      },
      error: () => {
        this._error.set('No pudimos cargar tus rutas.');
        this._isLoading.set(false);
      },
    });
  }

  loadMore(): void {
    if (!this._hasNextPage() || this._isLoadingMore()) return;

    this._isLoadingMore.set(true);

    this.api.getPaths({ take: PAGE_SIZE, cursor: this._nextCursor(), order: 'desc' }).subscribe({
      next: (response) => {
        this._paths.update((current) => this.sortByNewest([...current, ...response.data.items]));
        this._nextCursor.set(response.meta.nextCursor);
        this._hasNextPage.set(response.meta.hasNextPage);
        this._isLoadingMore.set(false);
      },
      error: () => this._isLoadingMore.set(false),
    });
  }

  // The card calls the API itself, so the list only mirrors the result instead
  // of reloading every path
  setFavorite(pathId: string, isFavorite: boolean): void {
    this._paths.update((paths) =>
      paths.map((path) => (path.id === pathId ? { ...path, isFavorite } : path)),
    );
  }

  // A safety net over the server order: the cursor pages come back in date
  // order, and appending a page must not break it
  private sortByNewest(paths: LearningPath[]): LearningPath[] {
    return [...paths].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }
}
