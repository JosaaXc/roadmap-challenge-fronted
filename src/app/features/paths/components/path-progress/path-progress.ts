import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { HlmProgressImports } from '@spartan-ng/helm/progress';

// Progress of a path: the label, the percentage and the bar, the same on the card and the detail
@Component({
  selector: 'app-path-progress',
  imports: [HlmProgressImports],
  templateUrl: './path-progress.html',
  host: { class: 'block' },
})
export class PathProgress {
  readonly router = inject(Router);
  readonly value = input.required<number>();
}
