import { Component } from '@angular/core';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';

// The shape of the path detail while it loads, so nothing jumps when the path lands
@Component({
  selector: 'app-path-detail-skeleton',
  imports: [HlmSkeleton],
  templateUrl: './path-detail-skeleton.html',
  host: { class: 'block' },
})
export class PathDetailSkeleton {
  // Enough placeholders to hint at a path without guessing its length
  protected readonly steps = [0, 1, 2, 3];
}
