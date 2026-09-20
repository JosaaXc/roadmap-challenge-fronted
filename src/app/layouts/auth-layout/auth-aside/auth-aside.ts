import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandLogo } from '../../../shared/ui/brand-logo/brand-logo';
import { DeviMascot } from '../../../shared/ui/devi-mascot/devi-mascot';
import { SAMPLE_PATH, SAMPLE_PATH_TOPIC } from '../../../shared/ui/suggested-path-card/sample-path';
import { SuggestedPathCard } from '../../../shared/ui/suggested-path-card/suggested-path-card';

// What the visitor gets back by signing in, shown beside the form
@Component({
  imports: [RouterLink, BrandLogo, DeviMascot, SuggestedPathCard],
  selector: 'app-auth-aside',
  templateUrl: './auth-aside.html',
  host: { class: 'contents' },
})
export class AuthAside {
  protected readonly samplePath = SAMPLE_PATH;
  protected readonly samplePathTopic = SAMPLE_PATH_TOPIC;
}
