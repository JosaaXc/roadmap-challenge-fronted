import { signal } from '@angular/core';
import { Observable } from 'rxjs';// Ajusta tu ruta
import { LearningPath, PaginatedPathsResponse } from '../../features/paths/models/paths-models';

export abstract class BasePaginationStore {
  protected readonly _paths = signal<LearningPath[]>([]);
  protected readonly _isLoading = signal<boolean>(true);
  protected readonly _isLoadingMore = signal<boolean>(false);
  protected readonly _error = signal<string | null>(null);
  protected readonly _nextCursor = signal<string | undefined>(undefined);
  protected readonly _hasNextPage = signal<boolean>(false);

  readonly paths = this._paths.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isLoadingMore = this._isLoadingMore.asReadonly();
  readonly error = this._error.asReadonly();
  readonly hasNextPage = this._hasNextPage.asReadonly();

  protected abstract fetchPage(cursor?: string): Observable<PaginatedPathsResponse>;

  protected processItems(items: LearningPath[]): LearningPath[] {
    return items;
  }

  loadInitial(silent: boolean = false): void {
    if(!silent){
    this._isLoading.set(true);
    }
    this._error.set(null);

    this.fetchPage(undefined).subscribe({
      next: (response) => {
        this._paths.set(this.processItems(response.data.items));
        this._nextCursor.set(response.meta.nextCursor);
        this._hasNextPage.set(response.meta.hasNextPage);
        this._isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando datos', err);
        this._error.set('No pudimos cargar tus rutas.')
        this._isLoading.set(false);
      },
    });
  }

  loadMore(): void {
    if (!this._hasNextPage() || this._isLoadingMore()) return;

    this._isLoadingMore.set(true);
    this.fetchPage(this._nextCursor()).subscribe({
      next: (response) => {
        this._paths.update((curr) => this.processItems([...curr, ...response.data.items]));
        this._nextCursor.set(response.meta.nextCursor);
        this._hasNextPage.set(response.meta.hasNextPage);
        this._isLoadingMore.set(false);
      },
      error: () => this._isLoadingMore.set(false),
    });
  }
}
