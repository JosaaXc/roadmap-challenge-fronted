import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { DeviMascot } from '../devi-mascot/devi-mascot';

// The app's one 404, for an unknown address and for a path that is gone alike. Home is '/',
// which the guards turn into the landing or into Mis rutas depending on the visitor
@Component({
  selector: 'app-not-found-state',
  imports: [RouterLink, HlmButton, HlmEmptyImports, DeviMascot],
  templateUrl: './not-found-state.html',
  host: { class: 'block' },
})
export class NotFoundState {
  // Why this page might be missing, in the words of the place that could not find it
  readonly description = input.required<string>();
}
