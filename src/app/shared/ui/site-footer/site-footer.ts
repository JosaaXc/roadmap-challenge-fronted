import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandLogo } from '../brand-logo/brand-logo';

// The foot of every page: the wordmark, whatever links the page projects beside it, and the
// notice. It spans the content width, like the glass bar at the top
@Component({
  selector: 'app-site-footer',
  imports: [RouterLink, BrandLogo],
  templateUrl: './site-footer.html',
  host: { class: 'block' },
})
export class SiteFooter {
  // Where the wordmark leads, and how that link is announced, as on the glass bar
  readonly homeLink = input('/');
  readonly homeLabel = input('DevTalles, ir al inicio');

  // Rendered in the notice, so it never goes stale
  protected readonly currentYear = new Date().getFullYear();
}
