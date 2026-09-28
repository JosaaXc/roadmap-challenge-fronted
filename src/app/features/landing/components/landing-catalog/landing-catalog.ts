import { Component, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePause, lucidePlay } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { CountUp } from '../../../../shared/ui/count-up/count-up';
import { Reveal } from '../../../../shared/ui/reveal/reveal';
import { LandingStore } from '../../services/landing-store';
import { TechMarquee } from '../tech-marquee/tech-marquee';

@Component({
  imports: [NgIcon, HlmButton, HlmSeparator, CountUp, Reveal, TechMarquee],
  selector: 'app-landing-catalog',
  templateUrl: './landing-catalog.html',
  viewProviders: [provideIcons({ lucidePause, lucidePlay })],
  host: { class: 'contents' },
})
export class LandingCatalog {
  protected readonly store = inject(LandingStore);

  // One button for both rows, so a single press stills the whole marquee
  protected readonly marqueePaused = signal(false);

  constructor() {
    this.store.loadCatalog();
  }
}
