import { computed, inject, Injectable, signal } from '@angular/core';
import { CatalogApi } from './catalog-api';
import { Course } from '../../models/catalog-model';

const PAGE_SIZE = 10;

@Injectable({ providedIn: 'root' })
export class CatalogStore {
  private readonly api = inject(CatalogApi);

  // Estado interno
  private readonly _courses = signal<Course[]>([]);
  private readonly _isLoading = signal<boolean>(true);
  private readonly _isLoadingMore = signal<boolean>(false);
  private readonly _nextCursor = signal<string | undefined>(undefined);
  private readonly _hasNextPage = signal<boolean>(false);

  // Estado de los filtros (Backend-driven)
  private readonly _currentOrder = signal<'desc' | 'asc'>('desc');
  private readonly _currentSearch = signal<string | undefined>(undefined);

  // Selectores públicos de solo lectura
  readonly courses = this._courses.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isLoadingMore = this._isLoadingMore.asReadonly();
  readonly hasNextPage = this._hasNextPage.asReadonly();
  readonly currentOrder = this._currentOrder.asReadonly();

  // Carga inicial o al cambiar filtros
  load(): void {
    this._isLoading.set(true);

    this.api
      .getCatalog({
        take: PAGE_SIZE,
        order: this._currentOrder(),
        search: this._currentSearch(),
      })
      .subscribe({
        next: (response) => {
          this._courses.set(response.data.items);
          this._nextCursor.set(response.meta.nextCursor);
          this._hasNextPage.set(response.meta.hasNextPage);
          this._isLoading.set(false);
        },
        error: (err) => {
          console.error('Error cargando cursos', err);
          this._isLoading.set(false);
        },
      });
  }

  // Carga secuencial
  loadMore(): void {
    if (!this._hasNextPage() || this._isLoadingMore()) return;

    this._isLoadingMore.set(true);

    this.api
      .getCatalog({
        take: PAGE_SIZE,
        order: this._currentOrder(),
        cursor: this._nextCursor(),
        search: this._currentSearch(),
      })
      .subscribe({
        next: (response) => {
          this._courses.update((current) => [...current, ...response.data.items]);
          this._nextCursor.set(response.meta.nextCursor);
          this._hasNextPage.set(response.meta.hasNextPage);
          this._isLoadingMore.set(false);
        },
        error: () => this._isLoadingMore.set(false),
      });
  }

  // Acciones para actualizar filtros
  setSearch(term: string | undefined): void {
    this._currentSearch.set(term);
    this.load(); // Recarga limpia
  }

  toggleOrder(): void {
    this._currentOrder.update((o) => (o === 'desc' ? 'asc' : 'desc'));
    this.load(); // Recarga limpia
  }

  deleteCourse(id: string): void {
    this.api.deleteCourse(id).subscribe({
      next: (response) => {
        if (!response || response.success) {
          this._courses.update((currentCourses) =>
            currentCourses.filter((course) => course.id !== id)
          );
        }
      },
      error: (err) => {
        console.error('Error al eliminar el curso', err);
      }
    });
  }
}
