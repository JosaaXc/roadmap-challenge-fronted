import { Component, input, output } from '@angular/core';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';

// The "Completado" box of a step. While its call is in flight it refuses new clicks,
// because the endpoint flips the flag and a second click would undo the first
@Component({
  selector: 'app-step-checkbox',
  imports: [HlmCheckbox],
  templateUrl: './step-checkbox.html',
  host: { class: 'contents' },
})
export class StepCheckbox {
  readonly checked = input.required<boolean>();
  readonly busy = input(false);

  // Read after "Completado" by screen readers, so each box has a name of its own
  readonly stepTitle = input.required<string>();

  readonly toggled = output<void>();

  protected onChange(box: HlmCheckbox): void {
    if (this.busy()) {
      // Ignored click: the box has already flipped itself, so it goes back to the step
      box.checked.set(this.checked());
      return;
    }
    this.toggled.emit();
  }
}
