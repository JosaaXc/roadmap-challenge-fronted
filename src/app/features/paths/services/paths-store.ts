import { computed, inject, Service } from '@angular/core';
import { LearningPath } from '../models/paths-models';
import { PathsApi } from './paths-api';
import { BasePaginationStore } from '../../../shared/data-access/base-pagination.store';

@Service()
export class PathsStore extends BasePaginationStore {
  private readonly api = inject(PathsApi);

  readonly favoriteCount = computed(() => this._paths().filter((path) => path.isFavorite).length);

  // 1. Definimos a qué endpoint llama
  protected fetchPage(cursor?: string) {
    return this.api.getPaths({ take: 10, cursor, order: 'desc' });
  }

  // 2. Sobreescribimos para mantener la red de seguridad de fechas
  protected override processItems(paths: LearningPath[]): LearningPath[] {
    return [...paths].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  // 3. Acción exclusiva de Mis Rutas
  setFavorite(pathId: string, isFavorite: boolean): void {
    this._paths.update((paths) =>
      paths.map((path) => (path.id === pathId ? { ...path, isFavorite } : path)),
    );
  }
}
