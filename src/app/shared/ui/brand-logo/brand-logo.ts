import { Component } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

// DevTalles wordmark inside its bordered pill
// Presentational only: the consumer decides whether it links anywhere and where to
// Host classes go through spartan's `classes()`, so a consumer can override any of them with a plain `class` attribute
@Component({
  selector: 'app-brand-logo',
  templateUrl: './brand-logo.html',
})
export class BrandLogo {
  constructor() {
    classes(
      () => 'border-border inline-flex w-fit items-center rounded-lg border px-2 py-1.5 sm:px-3',
    );
  }
}
