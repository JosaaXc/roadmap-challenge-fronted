import { Component, inject, OnInit, signal } from '@angular/core';
import { PathsApi } from '../../services/paths-api';
import { LearningPath } from '../../models/paths-models';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  imports: [CommonModule, RouterModule],
  standalone: true,
  selector: 'app-my-paths-page',
  templateUrl: './my-paths-page.html',
})
export class MyPathsPage implements OnInit{
  private readonly api = inject(PathsApi);

  readonly paths = signal<LearningPath[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly isLoadingMore = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly nextCursor = signal<string | undefined>(undefined);
  readonly hasNextPage = signal<boolean>(false);

  ngOnInit() {
    this.loadInitialPaths();
  }

  loadInitialPaths() {
    this.isLoading.set(true);
    this.error.set(null);

    this.api.getPaths({take: 10, order: 'desc'}).subscribe({
      next: (response) => {
        this.paths.set(response.data.items);
        this.nextCursor.set(response.meta.nextCursor);
        this.hasNextPage.set(response.meta.hasNextPage);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('No pudimos cargar tus rutas.');
        this.isLoading.set(false)
      }
    });
  }

  loadMore() {
    if (!this.hasNextPage() || this.isLoadingMore()) return;

    this.isLoadingMore.set(true);

    this.api.getPaths({take: 10, cursor: this.nextCursor(), order: 'desc'}).subscribe({
      next: (response) => {
        this.paths.update(current => [...current, ...response.data.items]);
        this.nextCursor.set(response.meta.nextCursor);
        this.hasNextPage.set(response.meta.hasNextPage);
        this.isLoadingMore.set(false);
      }, error: () => {
        this.isLoadingMore.set(false);
      }
    });
  }
}
