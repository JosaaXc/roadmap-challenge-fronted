import { Component, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDialog, HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { RESOURCE_TITLE_MAX_LENGTH, RESOURCE_URL_PATTERN } from '../../constants/paths-constants';
import { PathNode } from '../../models/paths-models';
import { PathDetailStore } from '../../services/path-detail-store';

// Adds a resource under a course. It saves through the detail's store, so it only lives
// inside the path detail page, the one place that provides that store
@Component({
  selector: 'app-resource-dialog',
  imports: [
    ReactiveFormsModule,
    HlmButton,
    HlmDialogImports,
    HlmFieldImports,
    HlmInput,
    HlmSpinner,
  ],
  templateUrl: './resource-dialog.html',
  host: { class: 'contents' },
})
export class ResourceDialog {
  protected readonly store = inject(PathDetailStore);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = viewChild.required(HlmDialog);

  // The course the new resource will hang from
  protected readonly parent = signal<PathNode | null>(null);

  protected readonly titleMaxLength = RESOURCE_TITLE_MAX_LENGTH;

  protected readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(RESOURCE_TITLE_MAX_LENGTH)]],
    url: ['', [Validators.required, Validators.pattern(RESOURCE_URL_PATTERN)]],
  });

  open(parent: PathNode): void {
    this.parent.set(parent);
    this.dialog().open();
  }

  protected async submit(dialog: { close: () => void }): Promise<void> {
    if (this.form.invalid) {
      // Spartan shows field errors on touched controls only, and its submitted
      // check covers template-driven forms, not reactive ones
      this.form.markAllAsTouched();
      return;
    }

    const parent = this.parent();
    if (!parent) return;

    const { title, url } = this.form.getRawValue();
    const added = await this.store.addResource(parent.id, {
      title: title.trim(),
      url: url.trim(),
    });

    // On failure the dialog stays open with what was typed, so trying again costs one click
    if (added) dialog.close();
  }
}
