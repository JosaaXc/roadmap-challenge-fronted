import { Component, computed, input, signal } from '@angular/core';

// A path's covers side by side, blurred into one slowly drifting wash of their colours. It fills
// the positioned box it sits in, behind its content, and fades in once a cover has arrived
@Component({
  selector: 'app-cover-wash',
  templateUrl: './cover-wash.html',
  host: {
    'aria-hidden': 'true',
    class:
      'pointer-events-none absolute inset-0 -z-10 overflow-hidden transition-opacity duration-700',
    '[class.opacity-0]': '!loaded()',
  },
})
export class CoverWash {
  readonly covers = input.required<readonly string[]>();

  private readonly failed = signal<ReadonlySet<string>>(new Set());
  protected readonly loaded = signal(false);
  protected readonly shown = computed(() =>
    this.covers().filter((cover) => !this.failed().has(cover)),
  );

  protected drop(cover: string): void {
    this.failed.update((failed) => new Set(failed).add(cover));
  }
}
