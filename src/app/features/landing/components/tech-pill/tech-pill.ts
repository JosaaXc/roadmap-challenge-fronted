import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { TECH_ICONS } from '../../constants/tech-badges';
import { TechBadge } from '../../models/landing-models';

// One technology of the catalog. At rest only its logo carries the colour; pointing at the pill
// lights all of it, the border and a light from within. As a toggle button, pressed keeps it lit
@Component({
  selector: 'li[appTechPill], button[appTechPill]',
  imports: [NgIcon],
  templateUrl: './tech-pill.html',
  viewProviders: [provideIcons(TECH_ICONS)],
  host: {
    class:
      'group/pill border-border bg-card/60 text-muted-foreground hover:border-(--tech) hover:bg-(--tech)/12 hover:text-foreground aria-pressed:border-(--tech) aria-pressed:bg-(--tech)/12 aria-pressed:text-foreground focus-visible:ring-ring relative isolate flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors duration-300 outline-none focus-visible:ring-2',
    '[style.--tech]': 'badge().color',
  },
})
export class TechPill {
  readonly badge = input.required<TechBadge>();
  // How many courses carry it, for a pill that filters them
  readonly count = input<number | null>(null);
}
