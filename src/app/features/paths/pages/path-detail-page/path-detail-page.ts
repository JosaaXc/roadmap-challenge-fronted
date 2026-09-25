import { Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleAlert } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { ConfirmDialog } from '../../../../shared/ui/confirm-dialog/confirm-dialog';
import { DeviMascot } from '../../../../shared/ui/devi-mascot/devi-mascot';
import { PathTimelineStep } from '../../../../shared/ui/path-timeline/path-timeline-step';
import { CourseStepCard } from '../../components/course-step-card/course-step-card';
import { PathDetailHeader } from '../../components/path-detail-header/path-detail-header';
import { PathDetailSkeleton } from '../../components/path-detail-skeleton/path-detail-skeleton';
import { ResourceCard } from '../../components/resource-card/resource-card';
import { ResourceDialog } from '../../components/resource-dialog/resource-dialog';
import { PathNode } from '../../models/paths-models';
import { PathDetailStore } from '../../services/path-detail-store';

@Component({
  selector: 'app-path-detail-page',
  imports: [
    RouterLink,
    NgIcon,
    HlmAlertImports,
    HlmButton,
    HlmEmptyImports,
    ConfirmDialog,
    DeviMascot,
    PathTimelineStep,
    CourseStepCard,
    PathDetailHeader,
    PathDetailSkeleton,
    ResourceCard,
    ResourceDialog,
  ],
  templateUrl: './path-detail-page.html',
  providers: [PathDetailStore],
  viewProviders: [provideIcons({ lucideCircleAlert })],
})
export class PathDetailPage implements OnInit {
  protected readonly store = inject(PathDetailStore);

  // Bound from the :id route parameter
  readonly id = input.required<string>();

  // The resource waiting on its confirmation dialog
  protected readonly pendingResource = signal<PathNode | null>(null);

  ngOnInit() {
    this.store.load(this.id());
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
