import { booleanAttribute, Component, computed, input } from '@angular/core';
import { TechBadge } from '../../models/landing-models';
import { TechPill } from '../tech-pill/tech-pill';

// Seconds each pill takes to cross, so rows of any length slide at the same pace
const SECONDS_PER_BADGE = 3.5;

// A row of pills sliding on a loop. It stops under the pointer and while paused, and for good
// with reduced motion, where it wraps into a still list instead
@Component({
  selector: 'app-tech-marquee',
  imports: [TechPill],
  templateUrl: './tech-marquee.html',
  // Clipped sideways only, so the glow of a lit pill is not cut off above and below
  host: { class: 'group/marquee flex overflow-x-clip mask-x-from-90% motion-reduce:mask-none' },
})
export class TechMarquee {
  readonly badges = input.required<readonly TechBadge[]>();

  // Names the list for screen readers, which get it once and still
  readonly label = input.required<string>();

  // Slides to the right instead of the left
  readonly reverse = input(false, { transform: booleanAttribute });
  readonly paused = input(false);

  protected readonly duration = computed(() => this.badges().length * SECONDS_PER_BADGE);
}
