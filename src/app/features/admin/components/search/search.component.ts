import { Component, DestroyRef, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule, NgIcon, HlmInputImports],
  providers: [provideIcons({ lucideSearch })],
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {
  @Output() search = new EventEmitter<string | undefined>();
  readonly searchControl = new FormControl('');
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        const term = val?.trim() || undefined;
        this.search.emit(term);
      });
  }
}
