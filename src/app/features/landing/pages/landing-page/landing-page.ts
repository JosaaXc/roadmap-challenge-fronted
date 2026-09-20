import { Component } from '@angular/core';
import { LandingCatalog } from '../../components/landing-catalog/landing-catalog';
import { LandingClosing } from '../../components/landing-closing/landing-closing';
import { LandingFooter } from '../../components/landing-footer/landing-footer';
import { LandingHeader } from '../../components/landing-header/landing-header';
import { LandingHero } from '../../components/landing-hero/landing-hero';
import { LandingSteps } from '../../components/landing-steps/landing-steps';

@Component({
  imports: [
    LandingHeader,
    LandingHero,
    LandingSteps,
    LandingCatalog,
    LandingClosing,
    LandingFooter,
  ],
  selector: 'app-landing-page',
  templateUrl: './landing-page.html',
})
export class LandingPage {}
