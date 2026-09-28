import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideEllipsis, lucideGlobe, lucideLock, lucideTrash2 } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { CoverFan } from '../../../../shared/ui/cover-fan/cover-fan';
import { FanCover } from '../../../../shared/ui/cover-fan/cover-fan-models';
import { CoverWash } from '../../../../shared/ui/cover-wash/cover-wash';
import { ParticleField } from '../../../../shared/ui/particle-field/particle-field';
import { LearningPath } from '../../models/paths-models';
import { PathTitlePipe } from '../../pipes/path-title.pipe';
import { ShortDatePipe } from '../../pipes/short-date.pipe';
import { FavoriteToggleComponent } from '../favorite-toggle/favorite-toggle.component';
import { PathProgress } from '../path-progress/path-progress';
import { PathDetailStore } from '../../services/path-detail-store';

// The way back, the path's name and actions, and its progress
@Component({
  selector: 'app-path-detail-header',
  imports: [
    RouterLink,
    NgIcon,
    HlmButton,
    HlmDropdownMenuImports,
    CoverFan,
    CoverWash,
    FavoriteToggleComponent,
    ParticleField,
    PathProgress,
    PathTitlePipe,
    ShortDatePipe,
  ],
  templateUrl: './path-detail-header.html',
  viewProviders: [
    provideIcons({ lucideChevronLeft, lucideEllipsis, lucideTrash2, lucideGlobe, lucideLock}),
  ],
  host: { class: 'block' },
})
export class PathDetailHeader {
  readonly store = inject(PathDetailStore);
  readonly path = input.required<LearningPath>();
  readonly courseCount = input.required<number>();
  readonly deleting = input(false);
  readonly backLink = input('/mis-rutas');
  readonly backLabel = input('Mis rutas');

  // Covers of the path's courses, in path order, and the few of them dealt as the fan
  readonly covers = input<readonly string[]>([]);
  readonly fan = input<readonly FanCover[]>([]);

  readonly favoriteToggled = output<boolean>();
  readonly deleteRequested = output<void>();
}
