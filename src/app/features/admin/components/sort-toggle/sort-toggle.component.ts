import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideChevronUp } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-sort-toggle',
  standalone: true,
  imports: [HlmButtonImports, NgIcon],
  providers: [provideIcons({ lucideChevronDown, lucideChevronUp })],
  templateUrl: './sort-toggle.component.html',
})
export class SortToggleComponent {
  @Input() order: 'asc' | 'desc' = 'desc';
  @Output() toggle = new EventEmitter<void>();
}
