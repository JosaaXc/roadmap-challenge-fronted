import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandLogo } from '../brand-logo/brand-logo';

// The floating glass bar at the top of every page that has one: it rides along while the
// page scrolls and blurs whatever passes behind it. The wordmark is built in, the actions
// are projected. It sticks inside its parent, so the host has to sit directly in the page
@Component({
  selector: 'app-glass-header',
  imports: [RouterLink, BrandLogo],
  templateUrl: './glass-header.html',
  // The strip around the bar is only spacing: it lets clicks through to the page below
  host: { class: 'pointer-events-none sticky top-0 z-40 block px-4 pt-3 sm:px-6 sm:pt-4' },
})
export class GlassHeader {
  // Where the wordmark leads, and how that link is announced
  readonly homeLink = input('/');
  readonly homeLabel = input('DevTalles, ir al inicio');
}
