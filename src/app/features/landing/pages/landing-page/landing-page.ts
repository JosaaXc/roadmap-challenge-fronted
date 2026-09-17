import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCircleDot, lucideLock } from '@ng-icons/lucide';
import { RouterLink } from '@angular/router';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmProgressImports } from '@spartan-ng/helm/progress';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import {
  CATALOG_CATEGORIES,
  CATALOG_STATS,
  COURSE_STATUS_LABEL,
  LANDING_STEPS,
  SUGGESTED_PATH,
  SUGGESTED_PATH_TOPIC,
} from '../../constants/landing-constants';
import { discordIcon } from '../../../../shared/icons/brand-icons';
import { BrandLogo } from '../../../../shared/ui/brand-logo/brand-logo';

@Component({
  imports: [
    RouterLink,
    BrandLogo,
    NgIcon,
    HlmBadge,
    HlmButton,
    HlmCardImports,
    HlmProgressImports,
    HlmSeparator,
  ],
  selector: 'app-landing-page',
  templateUrl: './landing-page.html',
  viewProviders: [provideIcons({ lucideCheck, lucideCircleDot, lucideLock, discordIcon })],
})
export class LandingPage {
  protected readonly suggestedPath = SUGGESTED_PATH;
  protected readonly suggestedPathTopic = SUGGESTED_PATH_TOPIC;
  protected readonly statusLabel = COURSE_STATUS_LABEL;
  protected readonly steps = LANDING_STEPS;
  protected readonly catalogStats = CATALOG_STATS;
  protected readonly catalogCategories = CATALOG_CATEGORIES;
  // Rendered in the footer notice, so it never goes stale
  protected readonly currentYear = new Date().getFullYear();
  protected readonly completedCount = SUGGESTED_PATH.filter(
    (course) => course.status === 'completed',
  ).length;
}
