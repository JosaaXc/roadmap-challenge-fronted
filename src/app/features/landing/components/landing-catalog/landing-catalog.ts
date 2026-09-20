import { Component } from '@angular/core';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { CATALOG_CATEGORIES, CATALOG_STATS } from '../../constants/landing-constants';

@Component({
  imports: [HlmBadge, HlmSeparator],
  selector: 'app-landing-catalog',
  templateUrl: './landing-catalog.html',
  host: { class: 'contents' },
})
export class LandingCatalog {
  protected readonly catalogStats = CATALOG_STATS;
  protected readonly catalogCategories = CATALOG_CATEGORIES;
}
