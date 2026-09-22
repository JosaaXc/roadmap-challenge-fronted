import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PathsApi } from '../../services/paths-api';
import { LearningPath } from '../../models/paths-models';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCard } from '@spartan-ng/helm/card';
import { CommonModule } from '@angular/common';
import { FavoriteToggleComponent } from '../../components/favorite-toggle/favorite-toggle.component';

@Component({
  imports: [CommonModule,HlmButton, HlmCard, FavoriteToggleComponent],
  standalone: true,
  selector: 'app-path-detail-page',
  templateUrl: './path-detail-page.html',
})
export class PathDetailPage implements OnInit{
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(PathsApi);

  readonly path = signal<LearningPath | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly togglingNodes = signal<Set<string>>(new Set());

  ngOnInit() {
    const pathId = this.route.snapshot.paramMap.get('id');
    if (pathId) {
      this.loadPath(pathId);
    } else {
      this.router.navigate(['/mis-rutas']);
    }
  }

  private loadPath(id: string) {
    this.isLoading.set(true);
    this.api.getPathById(id).subscribe({
      next: (response) => {
        const sortedPath = {
          ...response.data,
          nodes: response.data.nodes.sort((a,b) => a.position - b.position)
        };
        this.path.set(sortedPath);
        this.isLoading.set(false);
      }, error: () => {
        this.error.set('No pudimos cargar los detalles de esta ruta.');
        this.isLoading.set(false);
      }
    });
  }

  toggleNode(nodeId: string){
    const currentPath = this.path();
    if(!currentPath) return;

    this.togglingNodes.update(set => {
      const newSet = new Set(set);
      newSet.add(nodeId);
      return newSet;
    });

    this.api.toggleNodeCompletion(currentPath.id, nodeId).subscribe({
      next: (response) => {
        this.path.update(p => {
          if(!p) return p;

          return {
            ...p,
            progress: response.data.progress,
            nodes: p.nodes.map(n => n.id === nodeId ? response.data.node : n)
          };
        });
        this.removeTogglingNode(nodeId);
      }, error: () => {
        this.removeTogglingNode(nodeId);
      }
    });
  }

  private removeTogglingNode(nodeId: string){
    this.togglingNodes.update(set => {
      const newSet = new Set(set);
      newSet.delete(nodeId);
      return newSet;
    })
  }
}
