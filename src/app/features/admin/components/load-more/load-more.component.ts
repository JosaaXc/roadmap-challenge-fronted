import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-load-more',
  standalone: true,
  imports: [HlmButtonImports],
  template: `
    @if (hasNextPage) {
      <div class="mt-6 flex justify-center">
        <button hlmBtn variant="outline" (click)="loadMore.emit()" [disabled]="isLoadingMore">
          @if (isLoadingMore) {
            Cargando más...
          } @else {
            Cargar más
          }
        </button>
      </div>
    }
  `,
})
export class LoadMoreComponent {
  @Input({ required: true }) hasNextPage = false;
  @Input({ required: true }) isLoadingMore = false;
  @Output() loadMore = new EventEmitter<void>();
}
