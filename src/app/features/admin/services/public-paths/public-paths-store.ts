import { inject, Injectable, signal } from '@angular/core';
import { PublicPathsApi } from './public-paths-api';
import { AdminPath } from '../../models/public-paths-model';

@Injectable({ providedIn: 'root' })
export class PublicPathsStore {
  private readonly api = inject(PublicPathsApi);

  private readonly _paths = signal<AdminPath[]>([]);
  private readonly _isLoading = signal<boolean>(true);
  private readonly _isLoadingMore = signal<boolean>(false);

  private readonly _nextCursor = signal<string | null>(null);
  private readonly _hasNextPage = signal<boolean>(false);
  private readonly _currentOrder = signal<'asc' | 'desc'>('desc');

  readonly paths = this._paths.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isLoadingMore = this._isLoadingMore.asReadonly();
  readonly hasNextPage = this._hasNextPage.asReadonly();
  readonly currentOrder = this._currentOrder.asReadonly();

  loadInitial(): void {
    this._isLoading.set(true);
    this.api.getPaths(10, null, this._currentOrder()).subscribe({
      next: (response) => {
        this._paths.set(response.data.items);
        this._nextCursor.set(response.meta.nextCursor || null);
        this._hasNextPage.set(response.meta.hasNextPage || false);
        this._isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando rutas', err);
        this._isLoading.set(false);
      },
    });
  }

  loadMore(): void {
    if (!this._hasNextPage() || this._isLoadingMore()) return;

    this._isLoadingMore.set(true);
    this.api.getPaths(10, this._nextCursor(), this._currentOrder()).subscribe({
      next: (response) => {
        this._paths.update((current) => [...current, ...response.data.items]);
        this._nextCursor.set(response.meta.nextCursor || null);
        this._hasNextPage.set(response.meta.hasNextPage || false);
        this._isLoadingMore.set(false);
      },
      error: (err) => {
        console.error('Error cargando más rutas', err);
        this._isLoadingMore.set(false);
      },
    });
  }

  toggleOrder(): void {
    const newOrder = this._currentOrder() === 'desc' ? 'asc' : 'desc';
    this._currentOrder.set(newOrder);
    this.loadInitial(); // Recargamos desde el principio con el nuevo orden
  }

  deletePath(id: string): void {
    this.api.deletePath(id).subscribe({
      next: (response: any) => {
        if (!response || response.success) {
          // Eliminación optimista de la UI
          this._paths.update((current) => current.filter((p) => p.id !== id));
        }
      },
      error: (err) => console.error('Error al eliminar ruta', err),
    });
  }
}
