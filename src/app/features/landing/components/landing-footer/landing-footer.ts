import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SectionLink } from '../../../../shared/ui/section-link/section-link';
import { SiteFooter } from '../../../../shared/ui/site-footer/site-footer';

// The footer of the public pages: the shared one, with a link to the catalog and, on the
// landing, to its own sections
@Component({
  imports: [RouterLink, RouterLinkActive, SectionLink, SiteFooter],
  selector: 'app-landing-footer',
  templateUrl: './landing-footer.html',
  host: { class: 'contents' },
})
export class LandingFooter {
  // Links to the landing's own sections, which lead nowhere on any other page
  readonly sectionLinks = input(true);
}
