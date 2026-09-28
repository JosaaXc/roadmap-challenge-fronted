import { booleanAttribute, Component, input, output, viewChild } from '@angular/core';
import { HlmAlertDialog, HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';

// A confirmation before an action that cannot be undone. The consumer opens it by
// reference, so the trigger can live anywhere, even inside a menu overlay
@Component({
  selector: 'app-confirm-dialog',
  imports: [HlmAlertDialogImports],
  templateUrl: './confirm-dialog.html',
  host: { class: 'contents' },
})
export class ConfirmDialog {
  // Not `title`: as a static attribute it would also land on the host as a native tooltip
  readonly heading = input.required<string>();
  readonly description = input.required<string>();
  readonly confirmLabel = input.required<string>();

  // Destructive by default: that is what almost every confirmation guards
  readonly destructive = input(true, { transform: booleanAttribute });

  readonly confirmed = output<void>();

  private readonly dialog = viewChild.required(HlmAlertDialog);

  open(): void {
    this.dialog().open();
  }
}
