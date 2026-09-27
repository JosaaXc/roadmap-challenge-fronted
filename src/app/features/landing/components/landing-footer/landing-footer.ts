import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandLogo } from '../../../../shared/ui/brand-logo/brand-logo';
import { SectionLink } from '../../../../shared/ui/section-link/section-link';

@Component({
  imports: [RouterLink, BrandLogo, SectionLink],
  selector: 'app-landing-footer',
  templateUrl: './landing-footer.html',
  host: { class: 'contents' },
})
export class LandingFooter {
  // Rendered in the footer notice, so it never goes stale
  protected readonly currentYear = new Date().getFullYear();
}
