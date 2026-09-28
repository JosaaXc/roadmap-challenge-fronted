import { CommonModule} from "@angular/common";
import { Component, inject, input } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { HlmCardImports } from "@spartan-ng/helm/card";
import { PathProgress } from "../../../features/paths/components/path-progress/path-progress";
import { lucideGitFork, lucideNetwork } from "@ng-icons/lucide";
import { FavoriteToggleComponent } from "../../../features/paths/components/favorite-toggle/favorite-toggle.component";
import { PathsStore } from "../../../features/paths/services/paths-store";
import { ShortDatePipe } from "../../../features/paths/pipes/short-date.pipe";
import { HlmAvatarImports } from "@spartan-ng/helm/avatar";
import { LikeButtonComponent } from "../like-button/like-button";
import { ForkButtonComponent } from "../fork-button/fork-button";
import { HlmBadge } from "@spartan-ng/helm/badge";


@Component({
  selector: 'app-path-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HlmCardImports,
    NgIcon,
    PathProgress,
    FavoriteToggleComponent,
    ShortDatePipe,
    HlmAvatarImports,
    LikeButtonComponent,
    ForkButtonComponent,
    HlmBadge
],
  providers: [provideIcons({ lucideNetwork, lucideGitFork })],
  templateUrl: './path-card.html',
  host: { class: 'block h-full' },
})
export class PathCardComponent {
  readonly router = inject(Router);
  readonly store = inject(PathsStore);
  readonly card = input.required<any>();
  readonly linkPrefix = input<string>('/mis-rutas');
  readonly isOwner = input<boolean>(false);
  readonly showLike = input<boolean>(true);

  onPathForked(newPath: any) {
    this.router.navigate(['/mis-rutas', newPath.id]);
  }
}
