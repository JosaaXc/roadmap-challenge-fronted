import { inject, signal, WritableSignal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";

export function injectOAuthError(): WritableSignal<string | null> {
  const route = inject(ActivatedRoute);
  const errorMessage = signal<string | null>(null);

  route.queryParams
  .pipe(takeUntilDestroyed())
  .subscribe(params => {
    if (params['error'] === 'access_denied' || params['error'] === 'canceled') {
      errorMessage.set('Cancelaste la autorización con Discord');
    }
  });
  return errorMessage;
}
