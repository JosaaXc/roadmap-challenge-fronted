import { Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideExternalLink, lucidePlus } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCard } from '@spartan-ng/helm/card';
import { TimelineStepState } from '../../../../shared/ui/path-timeline/path-timeline-models';
import { PathNode } from '../../models/paths-models';
import { StepCheckbox } from '../step-checkbox/step-checkbox';

// A course on the path detail timeline, with the button that hangs resources from it
@Component({
  selector: 'app-course-step-card',
  imports: [NgIcon, HlmButton, HlmCard, StepCheckbox],
  templateUrl: './course-step-card.html',
  viewProviders: [provideIcons({ lucideExternalLink, lucidePlus })],
  host: { class: 'block' },
})
export class CourseStepCard {
  readonly course = input.required<PathNode>();

  // Numbered among courses only: resources are optional branches off them
  readonly step = input.required<number>();

  readonly state = input.required<TimelineStepState>();
  readonly busy = input(false);

  readonly toggled = output<void>();
  readonly resourceRequested = output<void>();
}
