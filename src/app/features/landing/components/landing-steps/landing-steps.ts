import { Component } from '@angular/core';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { Reveal } from '../../../../shared/ui/reveal/reveal';
import { Spotlight } from '../../../../shared/ui/spotlight/spotlight';
import { LANDING_STEPS } from '../../constants/landing-constants';

@Component({
  imports: [HlmSeparator, Reveal, Spotlight],
  selector: 'app-landing-steps',
  templateUrl: './landing-steps.html',
  host: { class: 'contents' },
})
export class LandingSteps {
  protected readonly steps = LANDING_STEPS;
}
