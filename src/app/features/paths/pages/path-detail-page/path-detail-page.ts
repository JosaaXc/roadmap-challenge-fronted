import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideCircleAlert,
  lucideEllipsis,
  lucideExternalLink,
  lucidePlus,
  lucideTrash2,
} from '@ng-icons/lucide';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCard } from '@spartan-ng/helm/card';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { finalize } from 'rxjs';
import { DeviMascot } from '../../../../shared/ui/devi-mascot/devi-mascot';
import { TimelineStepState } from '../../../../shared/ui/path-timeline/path-timeline-models';
import { PathTimelineStep } from '../../../../shared/ui/path-timeline/path-timeline-step';
import { FavoriteToggleComponent } from '../../components/favorite-toggle/favorite-toggle.component';
import { PathProgress } from '../../components/path-progress/path-progress';
import { LearningPath, PathNode } from '../../models/paths-models';
import { PathTitlePipe } from '../../pipes/path-title.pipe';
import { ShortDatePipe } from '../../pipes/short-date.pipe';
import { PathsApi } from '../../services/paths-api';

// Flips one step and recalculates progress as the server does: every node counts, one decimal
function flipNode(path: LearningPath, nodeId: string): LearningPath {
  const nodes = path.nodes.map((node) =>
    node.id === nodeId ? { ...node, isCompleted: !node.isCompleted } : node,
  );
  const completed = nodes.filter((node) => node.isCompleted).length;
  const progress = nodes.length > 0 ? Math.round((completed / nodes.length) * 1000) / 10 : 0;
  return { ...path, nodes, progress };
}

@Component({
  selector: 'app-path-detail-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIcon,
    HlmAlertImports,
    HlmAlertDialogImports,
    HlmButton,
    HlmCard,
    HlmCheckbox,
    HlmDialogImports,
    HlmDropdownMenuImports,
    HlmEmptyImports,
    HlmFieldImports,
    HlmInput,
    HlmSkeleton,
    HlmSpinner,
    DeviMascot,
    PathTimelineStep,
    FavoriteToggleComponent,
    PathProgress,
    PathTitlePipe,
    ShortDatePipe,
  ],
  templateUrl: './path-detail-page.html',
  viewProviders: [
    provideIcons({
      lucideChevronLeft,
      lucideCircleAlert,
      lucideEllipsis,
      lucideExternalLink,
      lucidePlus,
      lucideTrash2,
    }),
  ],
})
export class PathDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(PathsApi);
  private readonly fb = inject(FormBuilder);

  private pathId = '';

  readonly path = signal<LearningPath | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly notFound = signal<boolean>(false);

  // Steps with a completion call in flight: the endpoint flips the flag instead of
  // setting it, so a second click before the answer would undo the first
  readonly togglingNodes = signal<ReadonlySet<string>>(new Set());
  readonly deletingNodes = signal<ReadonlySet<string>>(new Set());
  readonly isSubmittingNode = signal<boolean>(false);
  readonly isDeletingPath = signal<boolean>(false);

  // The resource waiting on its confirmation dialog
  readonly pendingResource = signal<PathNode | null>(null);

  // Mirrors CreateCustomNodeDto. The URL also needs its scheme, which the API does not
  // demand: without it the link would resolve against this site
  readonly resourceForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    url: ['', [Validators.required, Validators.pattern(/^https?:\/\/\S+$/i)]],
  });

  // Enough placeholders to hint at a path without guessing its length
  readonly skeletonSteps = [0, 1, 2, 3];

  // Steps in the order the server defines
  readonly nodes = computed(() =>
    [...(this.path()?.nodes ?? [])].sort((a, b) => a.position - b.position),
  );

  // The first unfinished step. Not nextStep: the toggle does not return it, so it goes stale
  readonly currentNodeId = computed(
    () => this.nodes().find((node) => !node.isCompleted)?.id ?? null,
  );

  // Only catalogue courses count, as on the card: resources are the user's own additions
  readonly courseCount = computed(
    () => this.nodes().filter((node) => node.type === 'DEVTALLES_COURSE').length,
  );

  readonly isCompleted = computed(() => (this.path()?.progress ?? 0) >= 100);

  ngOnInit() {
    const pathId = this.route.snapshot.paramMap.get('id');
    if (pathId) {
      this.pathId = pathId;
      this.loadPath();
    } else {
      this.router.navigate(['/mis-rutas']);
    }
  }

  loadPath(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.notFound.set(false);

    this.api.getPathById(this.pathId).subscribe({
      next: (response) => {
        this.path.set(response.data);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        // Any 404 here means the same to the visitor: there is no path behind this link
        if (err.status === 404) {
          this.notFound.set(true);
        } else {
          this.error.set('Revisa tu conexión e intenta de nuevo.');
        }
        this.isLoading.set(false);
      },
    });
  }

  stepState(node: PathNode): TimelineStepState {
    if (node.isCompleted) return 'completed';
    return node.id === this.currentNodeId() ? 'current' : 'pending';
  }

  onFavoriteToggled(isFavorite: boolean): void {
    this.path.update((path) => path && { ...path, isFavorite });
  }

  onStepChecked(node: PathNode, box: HlmCheckbox): void {
    if (this.togglingNodes().has(node.id)) {
      // Ignored click: the box has already flipped itself, so it goes back to the step
      box.checked.set(node.isCompleted);
      return;
    }
    this.toggleNode(node.id);
  }

  submitResource(dialog: { close: () => void }): void {
    if (this.resourceForm.invalid) {
      // Spartan shows field errors on touched controls only, and its submitted
      // check covers template-driven forms, not reactive ones
      this.resourceForm.markAllAsTouched();
      return;
    }

    const current = this.path();
    const lastNode = this.nodes().at(-1);
    if (!current || !lastNode || this.isSubmittingNode()) return;

    const { title, url } = this.resourceForm.getRawValue();
    this.isSubmittingNode.set(true);

    this.api
      .addExternalNode(current.id, {
        title: title.trim(),
        url: url.trim(),
        previousNodeId: lastNode.id,
      })
      .pipe(finalize(() => this.isSubmittingNode.set(false)))
      .subscribe({
        next: () => {
          dialog.close();
          // The server places the new node, so the path comes back from it instead of being patched here
          this.reloadPath();
        },
        // The dialog stays open with what was typed, so trying again costs one click
        error: () => toast.error('No pudimos agregar el recurso. Intenta de nuevo.'),
      });
  }

  deletePendingResource(): void {
    const node = this.pendingResource();
    const current = this.path();
    if (!node || !current || this.deletingNodes().has(node.id)) return;

    this.setFlag(this.deletingNodes, node.id, true);

    this.api
      .deleteExternalNode(current.id, node.id)
      .pipe(finalize(() => this.setFlag(this.deletingNodes, node.id, false)))
      .subscribe({
        next: (response) => {
          this.path.update(
            (path) =>
              path && {
                ...path,
                progress: response.data.progress,
                nodes: path.nodes.filter((item) => item.id !== node.id),
              },
          );
        },
        error: () => toast.error('No pudimos eliminar el recurso. Intenta de nuevo.'),
      });
  }

  deletePath(): void {
    const current = this.path();
    if (!current || this.isDeletingPath()) return;

    this.isDeletingPath.set(true);

    this.api.deletePath(current.id).subscribe({
      next: () => {
        this.isDeletingPath.set(false);
        this.router.navigate(['/mis-rutas']);
      },
      error: () => {
        this.isDeletingPath.set(false);
        toast.error('No pudimos eliminar la ruta. Intenta de nuevo.');
      },
    });
  }

  // A quiet refresh: the page stays on screen while the new order comes in
  private reloadPath(): void {
    this.api.getPathById(this.pathId).subscribe({
      next: (response) => this.path.set(response.data),
      error: () => toast.error('No pudimos actualizar la ruta. Recarga la página.'),
    });
  }

  private toggleNode(nodeId: string): void {
    const current = this.path();
    if (!current) return;

    // Optimistic: the step and the bar move now and the server confirms after
    this.path.set(flipNode(current, nodeId));
    this.setFlag(this.togglingNodes, nodeId, true);

    this.api
      .toggleNodeCompletion(current.id, nodeId)
      .pipe(finalize(() => this.setFlag(this.togglingNodes, nodeId, false)))
      .subscribe({
        next: (response) => {
          // The server has the last word on both the flag and the progress
          this.path.update(
            (path) =>
              path && {
                ...path,
                progress: response.data.progress,
                nodes: path.nodes.map((node) =>
                  node.id === nodeId
                    ? { ...node, isCompleted: response.data.node.isCompleted }
                    : node,
                ),
              },
          );
        },
        error: () => {
          // Flipping back only this step keeps any other toggle that is still in flight
          this.path.update((path) => path && flipNode(path, nodeId));
          toast.error('No pudimos guardar tu progreso. Intenta de nuevo.');
        },
      });
  }

  private setFlag(flags: WritableSignal<ReadonlySet<string>>, nodeId: string, on: boolean): void {
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
}
