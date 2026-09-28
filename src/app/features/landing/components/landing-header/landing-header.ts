import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButton } from '@spartan-ng/helm/button';
import { GlassHeader } from '../../../../shared/ui/glass-header/glass-header';

@Component({
  imports: [RouterLink, HlmButton, GlassHeader],
  selector: 'app-landing-header',
  templateUrl: './landing-header.html',
  // Box-less, so the glass bar sticks along the whole page instead of inside this host
  host: { class: 'contents' },
})
export class LandingHeader {}
