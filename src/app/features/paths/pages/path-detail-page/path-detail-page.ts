import { Location } from '@angular/common';
import { afterNextRender, Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleAlert } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButton } from '@spartan-ng/helm/button';
import { ConfirmDialog } from '../../../../shared/ui/confirm-dialog/confirm-dialog';
import { DeviMascot } from '../../../../shared/ui/devi-mascot/devi-mascot';
import { NotFoundState } from '../../../../shared/ui/not-found-state/not-found-state';
import { PathTimelineStep } from '../../../../shared/ui/path-timeline/path-timeline-step';
import { CourseStepCard } from '../../components/course-step-card/course-step-card';
import { PathDetailHeader } from '../../components/path-detail-header/path-detail-header';
import { PathDetailSkeleton } from '../../components/path-detail-skeleton/path-detail-skeleton';
import { ResourceCard } from '../../components/resource-card/resource-card';
import { ResourceDialog } from '../../components/resource-dialog/resource-dialog';
import { PathDetailNavigationState, PathNode } from '../../models/paths-models';
import { PathDetailStore } from '../../services/path-detail-store';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { PathCardComponent } from '../../../../shared/ui/path-card/path-card';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Gap between the entrances of two consecutive steps of a new path
const ENTRANCE_STAGGER_MS = 90;

@Component({
  selector: 'app-path-detail-page',
  imports: [
    RouterLink,
    NgIcon,
    HlmAlertImports,
    HlmButton,
    HlmSkeletonImports,
    ConfirmDialog,
    DeviMascot,
    NotFoundState,
    PathTimelineStep,
    CourseStepCard,
    PathDetailHeader,
    PathDetailSkeleton,
    ResourceCard,
    ResourceDialog,
    PathCardComponent
],
  templateUrl: './path-detail-page.html',
  providers: [PathDetailStore],
  viewProviders: [provideIcons({ lucideCircleAlert })],
})
export class PathDetailPage implements OnInit {
  readonly store = inject(PathDetailStore);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly destroyRed = inject(DestroyRef);

  // Set by the generation screen: only a path built a moment ago plays its entrance
  private readonly justGenerated =
    (inject(Router).currentNavigation()?.extras.state as PathDetailNavigationState | undefined)
      ?.justGenerated === true;

  // Bound from the :id route parameter
  readonly id = input.required<string>();

  readonly backLink = this.route.snapshot.queryParamMap.get('from') === 'admin-public-paths'
    ? '/admin/public-paths'
    : '/mis-rutas';
  readonly backLabel = this.route.snapshot.queryParamMap.get('from') === 'admin-public-paths'
    ? 'Volver a rutas públicas'
    : 'Mis rutas';

  // The resource waiting on its confirmation dialog
  protected readonly pendingResource = signal<PathNode | null>(null);

  constructor() {
    // The flag lives in the history entry, so it is dropped once used: a reload or a trip
    // back through history is a normal visit
    if (this.justGenerated) {
      afterNextRender(() => {
        const state = { ...(this.location.getState() as object), justGenerated: false };
        this.location.replaceState(this.location.path(), '', state);
      });
    }
  }

  ngOnInit() {
    this.route.paramMap
    .pipe(takeUntilDestroyed(this.destroyRed))
    .subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.store.load(this.id());
      }
    });
  }

  protected enterDelay(index: number): number | null {
    return this.justGenerated ? index * ENTRANCE_STAGGER_MS : null;
  }

  protected confirmResourceDeletion(resource: PathNode, dialog: ConfirmDialog): void {
    this.pendingResource.set(resource);
    dialog.open();
  }

  protected deletePendingResource(): void {
    const resource = this.pendingResource();
    if (resource) this.store.deleteResource(resource.id);
  }
}
