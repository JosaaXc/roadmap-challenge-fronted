import { CommonModule } from "@angular/common";
import { Component, inject, input, output, signal } from "@angular/core";
import { PathsApi } from "../../services/paths-api";
import { HlmButton } from "@spartan-ng/helm/button";

@Component({
  selector: 'app-favorite-toggle',
  standalone: true,
  imports: [CommonModule, HlmButton],
  templateUrl: 'favorite-toggle.component.html'
})
export class FavoriteToggleComponent {
  private api = inject(PathsApi);

  pathId = input.required<string>();
  isFavorite = input.required<boolean>();

  variant = input<'text' | 'icon'>('icon');

  toggled = output<boolean>();

  isToggling = signal(false);

  toggle(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if(this.isToggling()) return;

    this.isToggling.set(true);

    this.api.togglePathFavorite(this.pathId()).subscribe({
      next: (response) => {
        this.isToggling.set(false);
        this.toggled.emit(response.data.isFavorite);
      }, error: () => this.isToggling.set(false)
    });
  }
}
