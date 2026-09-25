import { booleanAttribute, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCircleDot, lucideLock } from '@ng-icons/lucide';
import { TimelineStepState } from './path-timeline-models';

// One step of a path timeline: its marker, the rail down to the next step and the projected card
// The host is the <li>, so the consumer keeps its own <ol> and the gap between steps
@Component({
  selector: 'li[appPathTimelineStep]',
  imports: [NgIcon],
  templateUrl: './path-timeline-step.html',
  viewProviders: [provideIcons({ lucideCheck, lucideCircleDot, lucideLock })],
  host: { class: 'relative flex items-start gap-3' },
})
export class PathTimelineStep {
  readonly state = input.required<TimelineStepState>();

  // The last step has no rail below it
  readonly last = input(false, { transform: booleanAttribute });

  // Keeps the travelled rail retracted until the consumer reveals it
  readonly revealed = input(true);

  // Staggers the rail when several steps reveal at once, in milliseconds
  readonly revealDelay = input(0);

  // Pending steps show a lock, for previews where they cannot be taken yet
  readonly lockPending = input(false, { transform: booleanAttribute });
}
