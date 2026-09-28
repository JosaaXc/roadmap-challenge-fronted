import { Component, DestroyRef, inject, input, OnInit } from "@angular/core";
import { ActivatedRoute} from "@angular/router";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { HlmAlertImports } from "@spartan-ng/helm/alert";
import { HlmButton } from "@spartan-ng/helm/button";
import { HlmSkeletonImports } from "@spartan-ng/helm/skeleton";
import { NotFoundState } from "../../../../shared/ui/not-found-state/not-found-state";
import { PathTimelineStep } from "../../../../shared/ui/path-timeline/path-timeline-step";
import { CourseStepCard } from "../../../paths/components/course-step-card/course-step-card";
import { PathDetailHeader } from "../../../paths/components/path-detail-header/path-detail-header";
import { PathDetailSkeleton } from "../../../paths/components/path-detail-skeleton/path-detail-skeleton";
import { ResourceCard } from "../../../paths/components/resource-card/resource-card";
import { PathCardComponent } from "../../../../shared/ui/path-card/path-card";
import { PathDetailStore } from "../../../paths/services/path-detail-store";
import { lucideCircleAlert } from "@ng-icons/lucide";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";


@Component({
  selector: 'app-community-path-detail-page',
  imports: [
    NgIcon,
    HlmAlertImports,
    HlmButton,
    HlmSkeletonImports,
    NotFoundState,
    PathTimelineStep,
    CourseStepCard,
    PathDetailHeader,
    PathDetailSkeleton,
    ResourceCard,
    PathCardComponent,
  ],
  templateUrl: './community-paths-detail.html',
  providers: [PathDetailStore],
  viewProviders: [provideIcons({ lucideCircleAlert })],
})
export class CommunityPathDetailPage implements OnInit {
  readonly store = inject(PathDetailStore);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly id = input.required<string>();

  // Enlaces de retorno personalizados para la comunidad
  readonly backLink = '/mis-rutas'; // O la ruta donde estén las de la comunidad
  readonly backLabel = 'Volver a la comunidad';

  readonly isReadOnly = true;

  ngOnInit() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.store.load(id);
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    });
  }
}
