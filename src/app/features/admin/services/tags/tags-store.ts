import { inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { CatalogApi } from '../catalog/catalog-api';

@Injectable({ providedIn: 'root' })
export class TagsStore {
  private readonly api = inject(CatalogApi);

  private readonly _tags = signal<string[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _failed = signal<boolean>(false);

  readonly tags = this._tags.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly failed = this._failed.asReadonly();

  // Every picker in a dialog asks at once, so one request serves them all
  load(): void {
    if (this._isLoading()) return;

    this._isLoading.set(true);
    this._failed.set(false);
    this.api
      .getTags()
      .pipe(finalize(() => this._isLoading.set(false)))
      .subscribe({
        next: (response) => this._tags.set(response.data),
        error: () => this._failed.set(true),
      });
  }
}
