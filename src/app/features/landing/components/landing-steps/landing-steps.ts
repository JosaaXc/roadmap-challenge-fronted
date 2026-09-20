import { Component } from '@angular/core';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { LANDING_STEPS } from '../../constants/landing-constants';

@Component({
  imports: [HlmSeparator],
  selector: 'app-landing-steps',
  templateUrl: './landing-steps.html',
  host: { class: 'contents' },
})
export class LandingSteps {
  protected readonly steps = LANDING_STEPS;
}
