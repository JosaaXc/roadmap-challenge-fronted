import { Component, input } from '@angular/core';
import { HlmProgressImports } from '@spartan-ng/helm/progress';

// Progress of a path: the label, the percentage and the bar, the same on the card and the detail
@Component({
  selector: 'app-path-progress',
  imports: [HlmProgressImports],
  templateUrl: './path-progress.html',
  host: { class: 'block' },
})
export class PathProgress {
  readonly value = input.required<number>();
}
