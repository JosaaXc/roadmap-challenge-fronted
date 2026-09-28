import { inject, Injectable, signal } from '@angular/core';
import { CommunityPathsApi } from './community-paths.api'; // Ajusta la ruta a donde guardaste el base store
import { BasePaginationStore } from '../../../shared/data-access/base-pagination.store';

@Injectable({ providedIn: 'root' })
export class CommunityPathsStore extends BasePaginationStore {
  private readonly api = inject(CommunityPathsApi);

  private readonly _search = signal<string | undefined>(undefined);
  private readonly _sortBy = signal<'popular' | 'recent'>('popular');

  readonly search = this._search.asReadonly();
  readonly sortBy = this._sortBy.asReadonly();

  setSearch(term: string | undefined): void {
    const validTerm = term && term.length >= 2 ? term : undefined;
    if (this._search() === validTerm) return;

    this._search.set(validTerm);
    this.loadInitial(true);
  }

  setSortBy(sortBy: 'popular' | 'recent'): void {
    if (this._sortBy() === sortBy) return;
    this._sortBy.set(sortBy);
    this.loadInitial(true);
  }

  toggleSortBy(): void {
    const nextSort = this._sortBy() === 'popular' ? 'recent' : 'popular';
    this._sortBy.set(nextSort);
    this.loadInitial(true);
  }

  // El BaseStore nos pide implementar este único método para saber a qué endpoint llamar
  protected fetchPage(cursor?: string) {
    return this.api.getCommunityPaths({
      take: 10,
      cursor: cursor ?? null,
      order: 'desc',
      sortBy: this._sortBy(),
      search: this._search(),
    });
  }
}
