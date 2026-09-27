import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { TECH_ICONS } from '../../constants/tech-badges';
import { TechBadge } from '../../models/landing-models';

// One technology of the catalog. At rest only its logo carries the colour; pointing at the pill
// lights all of it, the border and a light from within
@Component({
  selector: 'li[appTechPill]',
  imports: [NgIcon],
  templateUrl: './tech-pill.html',
  viewProviders: [provideIcons(TECH_ICONS)],
  host: {
    class:
      'group/pill border-border bg-card/60 text-muted-foreground hover:border-(--tech) hover:bg-(--tech)/12 hover:text-foreground relative isolate flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors duration-300',
    '[style.--tech]': 'badge().color',
  },
})
export class TechPill {
  readonly badge = input.required<TechBadge>();
}
