import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideEllipsis, lucideTrash2 } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { LearningPath } from '../../models/paths-models';
import { PathTitlePipe } from '../../pipes/path-title.pipe';
import { ShortDatePipe } from '../../pipes/short-date.pipe';
import { FavoriteToggleComponent } from '../favorite-toggle/favorite-toggle.component';
import { PathProgress } from '../path-progress/path-progress';

// The way back, the path's name and actions, and its progress
@Component({
  selector: 'app-path-detail-header',
  imports: [
    RouterLink,
    NgIcon,
    HlmButton,
    HlmDropdownMenuImports,
    FavoriteToggleComponent,
    PathProgress,
    PathTitlePipe,
    ShortDatePipe,
  ],
  templateUrl: './path-detail-header.html',
  viewProviders: [provideIcons({ lucideChevronLeft, lucideEllipsis, lucideTrash2 })],
  host: { class: 'block' },
})
export class PathDetailHeader {
  readonly path = input.required<LearningPath>();
  readonly courseCount = input.required<number>();
  readonly deleting = input(false);

  readonly favoriteToggled = output<boolean>();
  readonly deleteRequested = output<void>();
}
