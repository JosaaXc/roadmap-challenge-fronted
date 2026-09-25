import { Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideExternalLink, lucideTrash2 } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCard } from '@spartan-ng/helm/card';
import { PathNode } from '../../models/paths-models';
import { LinkHostPipe } from '../../pipes/link-host.pipe';
import { StepCheckbox } from '../step-checkbox/step-checkbox';

// A link the user added to their path, the same nested under its course or loose after the last one
@Component({
  selector: 'app-resource-card',
  imports: [NgIcon, HlmButton, HlmCard, LinkHostPipe, StepCheckbox],
  templateUrl: './resource-card.html',
  viewProviders: [provideIcons({ lucideExternalLink, lucideTrash2 })],
  host: { class: 'block' },
})
export class ResourceCard {
  readonly resource = input.required<PathNode>();
  readonly busy = input(false);
  readonly deleting = input(false);

  readonly toggled = output<void>();
  readonly deleteRequested = output<void>();
}
