import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandLogo } from '../../../../shared/ui/brand-logo/brand-logo';

@Component({
  imports: [RouterLink, BrandLogo],
  selector: 'app-landing-footer',
  templateUrl: './landing-footer.html',
  host: { class: 'contents' },
})
export class LandingFooter {
  // Rendered in the footer notice, so it never goes stale
  protected readonly currentYear = new Date().getFullYear();
}
