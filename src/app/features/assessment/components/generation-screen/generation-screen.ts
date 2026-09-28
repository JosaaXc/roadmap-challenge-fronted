import {
  afterRenderEffect,
  Component,
  computed,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleAlert } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { DeviMascot } from '../../../../shared/ui/devi-mascot/devi-mascot';
import { TimelineStepState } from '../../../../shared/ui/path-timeline/path-timeline-models';
import { PathTimelineStep } from '../../../../shared/ui/path-timeline/path-timeline-step';
import { GENERATION_STEPS } from '../../constants/assessment-constants';
import { GenerationStatus } from '../../models/assessment-models';

// The whole screen while the path is generated, and where its two failures land
@Component({
  selector: 'app-generation-screen',
  imports: [NgIcon, HlmAlertImports, HlmButton, HlmEmptyImports, DeviMascot, PathTimelineStep],
  templateUrl: './generation-screen.html',
  viewProviders: [provideIcons({ lucideCircleAlert })],
})
export class GenerationScreen {
  // Idle renders nothing: the page shows the questionnaire instead
  readonly status = input.required<GenerationStatus>();

  // Steps already done; the one at this index is in progress
  readonly completedSteps = input.required<number>();

  readonly retried = output<void>();
  readonly reviewRequested = output<void>();

  protected readonly steps = GENERATION_STEPS;

  // The markers say nothing to a screen reader, so the step in progress is read out instead
  protected readonly announcement = computed(
    () => this.steps[this.completedSteps()] ?? 'Tu ruta está lista',
  );

  private readonly primaryAction = viewChild<ElementRef<HTMLButtonElement>>('primaryAction');

  constructor() {
    // The button that started it all is gone, so focus lands on the way forward
    afterRenderEffect(() => this.primaryAction()?.nativeElement.focus());
  }

  protected stepState(index: number): TimelineStepState {
    const done = this.completedSteps();
    if (index < done) return 'completed';
    return index === done ? 'current' : 'pending';
  }
}
