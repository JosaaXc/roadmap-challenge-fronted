import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Service, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { toast } from '@spartan-ng/brain/sonner';
import { finalize, firstValueFrom } from 'rxjs';
import { TimelineStepState } from '../../../shared/ui/path-timeline/path-timeline-models';
import {
  LearningPath,
  NewResource,
  PathDetailStatus,
  PathNode,
  PathTimeline,
} from '../models/paths-models';
import { withStepFlipped } from '../utils/path-progress';
import { buildTimeline } from '../utils/path-timeline';
import { PathsApi } from './paths-api';

const EMPTY_TIMELINE: PathTimeline = { courses: [], orphans: [] };

// State and actions of one path detail. The page provides it, so every visit starts clean
@Service({ autoProvided: false })
export class PathDetailStore {
  private readonly api = inject(PathsApi);
  private readonly router = inject(Router);

  private pathId = '';

  private readonly _path = signal<LearningPath | null>(null);
  private readonly _status = signal<PathDetailStatus>('loading');
  // Steps with a completion call in flight: the endpoint flips the flag instead of
  // setting it, so a second click before the answer would undo the first
  private readonly _toggling = signal<ReadonlySet<string>>(new Set());
  private readonly _deleting = signal<ReadonlySet<string>>(new Set());
  private readonly _isAddingResource = signal(false);
  private readonly _isDeletingPath = signal(false);

  readonly path = this._path.asReadonly();
  readonly status = this._status.asReadonly();
  readonly isAddingResource = this._isAddingResource.asReadonly();
  readonly isDeletingPath = this._isDeletingPath.asReadonly();

  readonly timeline = computed(() => {
    const path = this._path();
    return path ? buildTimeline(path) : EMPTY_TIMELINE;
  });

  // The first unfinished course. Resources are optional branches, so they never become the
  // next step; and not nextStep either: the toggle does not return it, so it goes stale
  readonly currentNodeId = computed(
    () => this.timeline().courses.find((entry) => !entry.node.isCompleted)?.node.id ?? null,
  );

  // Only catalogue courses count, as on the card: resources are the user's own additions
  readonly courseCount = computed(() => this.timeline().courses.length);

  readonly isCompleted = computed(() => (this._path()?.progress ?? 0) >= 100);

  load(pathId: string): void {
    this.pathId = pathId;
    this._status.set('loading');

    this.api.getPathById(pathId).subscribe({
      next: (response) => {
        this._path.set(response.data);
        this._status.set('ready');
      },
      // Any 404 here means the same to the visitor: there is no path behind this link
      error: (err: HttpErrorResponse) =>
        this._status.set(err.status === 404 ? 'not-found' : 'error'),
    });
  }

  retry(): void {
    this.load(this.pathId);
  }

  stepState(node: PathNode): TimelineStepState {
    if (node.isCompleted) return 'completed';
    return node.id === this.currentNodeId() ? 'current' : 'pending';
  }

  isToggling(nodeId: string): boolean {
    return this._toggling().has(nodeId);
  }

  isDeleting(nodeId: string): boolean {
    return this._deleting().has(nodeId);
  }

  setFavorite(isFavorite: boolean): void {
    this._path.update((path) => path && { ...path, isFavorite });
  }

  // Optimistic: the step and the bar move now and the server confirms after
  toggleStep(nodeId: string): void {
    const path = this._path();
    if (!path || this.isToggling(nodeId)) return;

    this._path.set(withStepFlipped(path, nodeId));
    setFlag(this._toggling, nodeId, true);

    this.api
      .toggleNodeCompletion(path.id, nodeId)
      .pipe(finalize(() => setFlag(this._toggling, nodeId, false)))
      .subscribe({
        next: (response) => {
          // The server has the last word on both the flag and the progress
          this._path.update(
            (current) =>
              current && {
                ...current,
                progress: response.data.progress,
                nodes: current.nodes.map((node) =>
                  node.id === nodeId
                    ? { ...node, isCompleted: response.data.node.isCompleted }
                    : node,
                ),
              },
          );
        },
        error: () => {
          // Flipping back only this step keeps any other toggle that is still in flight
          this._path.update((current) => current && withStepFlipped(current, nodeId));
          toast.error('No pudimos guardar tu progreso. Intenta de nuevo.');
        },
      });
  }

  // Resolves true once the resource is saved, so the dialog knows it can close
  async addResource(parentId: string, resource: NewResource): Promise<boolean> {
    const path = this._path();
    if (!path || this._isAddingResource()) return false;

    this._isAddingResource.set(true);
    try {
      // The edge from the parent is what places the resource on screen
      await firstValueFrom(
        this.api.addExternalNode(path.id, { ...resource, previousNodeId: parentId }),
      );
      // The server places the new node, so the path comes back from it instead of being patched here
      this.refresh();
      return true;
    } catch {
      toast.error('No pudimos agregar el recurso. Intenta de nuevo.');
      return false;
    } finally {
      this._isAddingResource.set(false);
    }
  }

  deleteResource(nodeId: string): void {
    const path = this._path();
    if (!path || this.isDeleting(nodeId)) return;

    setFlag(this._deleting, nodeId, true);

    this.api
      .deleteExternalNode(path.id, nodeId)
      .pipe(finalize(() => setFlag(this._deleting, nodeId, false)))
      .subscribe({
        next: (response) => {
          this._path.update(
            (current) =>
              current && {
                ...current,
                progress: response.data.progress,
                nodes: current.nodes.filter((node) => node.id !== nodeId),
              },
          );
        },
        error: () => toast.error('No pudimos eliminar el recurso. Intenta de nuevo.'),
      });
  }

  deletePath(): void {
    const path = this._path();
    if (!path || this._isDeletingPath()) return;

    this._isDeletingPath.set(true);

    this.api
      .deletePath(path.id)
      .pipe(finalize(() => this._isDeletingPath.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/mis-rutas']),
        error: () => toast.error('No pudimos eliminar la ruta. Intenta de nuevo.'),
      });
  }

  // A quiet refresh: the page stays on screen while the new order comes in
  private refresh(): void {
    this.api.getPathById(this.pathId).subscribe({
      next: (response) => this._path.set(response.data),
      error: () => toast.error('No pudimos actualizar la ruta. Recarga la página.'),
    });
  }
}

// Replaces the set instead of mutating it, so the signal notices the change
function setFlag(flags: WritableSignal<ReadonlySet<string>>, nodeId: string, on: boolean): void {
  flags.update((set) => {
    const next = new Set(set);
    if (on) {
      next.add(nodeId);
    } else {
      next.delete(nodeId);
    }
    return next;
  });
}
