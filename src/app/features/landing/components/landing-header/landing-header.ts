import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButton } from '@spartan-ng/helm/button';
import { BrandLogo } from '../../../../shared/ui/brand-logo/brand-logo';

@Component({
  imports: [RouterLink, HlmButton, BrandLogo],
  selector: 'app-landing-header',
  templateUrl: './landing-header.html',
  host: { class: 'contents' },
})
export class LandingHeader {}
