import { Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import {
  SAMPLE_PATH,
  SAMPLE_PATH_TOPIC,
} from '../../../../shared/ui/suggested-path-card/sample-path';
import { SuggestedPathCard } from '../../../../shared/ui/suggested-path-card/suggested-path-card';

@Component({
  imports: [HlmButton, SuggestedPathCard],
  selector: 'app-landing-hero',
  templateUrl: './landing-hero.html',
  host: { class: 'contents' },
})
export class LandingHero {
  protected readonly samplePath = SAMPLE_PATH;
  protected readonly samplePathTopic = SAMPLE_PATH_TOPIC;
}
