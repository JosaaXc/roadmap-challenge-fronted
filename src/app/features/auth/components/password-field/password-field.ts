import { booleanAttribute, Component, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEye, lucideEyeOff } from '@ng-icons/lucide';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';

let nextId = 0;

// A password input with its show and hide toggle. A new password states the backend's
// rules up front and reports each one it misses; a current one only has to be there
@Component({
  selector: 'app-password-field',
  imports: [ReactiveFormsModule, NgIcon, HlmFieldImports, HlmInputGroupImports],
  templateUrl: './password-field.html',
  viewProviders: [provideIcons({ lucideEye, lucideEyeOff })],
  host: { class: 'contents' },
})
export class PasswordField {
  readonly control = input.required<FormControl<string>>();
  readonly label = input.required<string>();
  readonly isNew = input(false, { transform: booleanAttribute });

  protected readonly inputId = `password-field-${nextId++}`;
  protected readonly visible = signal(false);
}
