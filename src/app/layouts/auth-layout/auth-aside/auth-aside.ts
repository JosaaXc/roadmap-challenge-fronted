import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { BrandLogo } from '../../../shared/ui/brand-logo/brand-logo';
import { DeviMascot } from '../../../shared/ui/devi-mascot/devi-mascot';
import { SAMPLE_PATH, SAMPLE_PATH_TOPIC } from '../../../shared/ui/suggested-path-card/sample-path';
import { SuggestedPathCard } from '../../../shared/ui/suggested-path-card/suggested-path-card';
import { AUTH_ASIDE_CONTENT, AuthAsideVariant } from './auth-aside-content';

// What the visitor gets back by signing in, shown beside the form
@Component({
  imports: [RouterLink, BrandLogo, DeviMascot, SuggestedPathCard],
  selector: 'app-auth-aside',
  templateUrl: './auth-aside.html',
  host: { class: 'contents' },
})
export class AuthAside {
  private readonly router = inject(Router);

  protected readonly samplePath = SAMPLE_PATH;
  protected readonly samplePathTopic = SAMPLE_PATH_TOPIC;

  // The aside lives in the layout, so it follows the child route across navigations
  private readonly variant = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activeVariant()),
    ),
    { initialValue: this.activeVariant() },
  );

  protected readonly content = computed(() => AUTH_ASIDE_CONTENT[this.variant()]);

  private activeVariant(): AuthAsideVariant {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) route = route.firstChild;
    return route.data['authAside'] ?? 'sign-in';
  }
}
