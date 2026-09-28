import { Component, inject, input, output, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideStar } from '@ng-icons/lucide';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { PathsApi } from '../../services/paths-api';

@Component({
  selector: 'app-favorite-toggle',
  imports: [NgIcon, HlmButton, HlmSpinner],
  templateUrl: 'favorite-toggle.component.html',
  viewProviders: [provideIcons({ lucideStar })],
})
export class FavoriteToggleComponent {
  private api = inject(PathsApi);

  pathId = input.required<string>();
  isFavorite = input.required<boolean>();

  toggled = output<boolean>();

  isToggling = signal(false);

  toggle(event: Event) {
    // The card behind this button is a link, and the star is not a way into it
    event.preventDefault();
    event.stopPropagation();

    if (this.isToggling()) return;

    this.isToggling.set(true);

    this.api.togglePathFavorite(this.pathId()).subscribe({
      next: (response) => {
        this.isToggling.set(false);
        this.toggled.emit(response.data.isFavorite);
      },
      error: () => {
        this.isToggling.set(false);
        toast.error('No pudimos actualizar tus favoritos. Intenta de nuevo.');
      },
    });
  }
}
