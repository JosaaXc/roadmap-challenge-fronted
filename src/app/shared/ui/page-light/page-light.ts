import { Component, inject } from '@angular/core';
import { CoverWash } from '../cover-wash/cover-wash';
import { PageLightStore } from './page-light-store';

// The light at the top of the shell, up behind the glass bar: the covers of the page on screen,
// blurred into one still wash, or the brand's glow while there are none. It is gone before the
// content, and lives in the layout so it can span the whole window
@Component({
  selector: 'app-page-light',
  imports: [CoverWash],
  templateUrl: './page-light.html',
  host: {
    'aria-hidden': 'true',
    class:
      'pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem] mask-b-from-25% transition-opacity duration-700',
    '[class.opacity-75]': "strength() === 'full'",
    '[class.opacity-45]': "strength() === 'soft'",
  },
})
export class PageLight {
  private readonly store = inject(PageLightStore);
  protected readonly covers = this.store.covers;
  protected readonly strength = this.store.strength;
}
