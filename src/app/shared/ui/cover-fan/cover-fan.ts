import { Component, computed, input, signal } from '@angular/core';
import { FanCover, FanPlace } from './cover-fan-models';

// Where a cover lands. Offsets are fractions of the cover's own width, so any size keeps the
// shape. The one before is done and greys out; pointing at a `group/fan` ancestor spreads it
const FAN_PLACES: Record<FanPlace, string> = {
  previous:
    '-translate-x-1/3 -rotate-6 scale-90 brightness-75 grayscale motion-safe:group-hover/fan:-translate-x-2/5 motion-safe:group-hover/fan:-rotate-9',
  current: 'z-20 motion-safe:group-hover/fan:-translate-y-1',
  next: 'z-10 translate-x-1/3 rotate-6 scale-90 brightness-75 motion-safe:group-hover/fan:translate-x-2/5 motion-safe:group-hover/fan:rotate-9',
};

// A fan of course covers that turns as the course in front changes. Covers are 11rem wide unless
// the consumer sets --fan-cover-width; the fan fades in once one has arrived, and leaves out any
// cover that fails
@Component({
  selector: 'app-cover-fan',
  templateUrl: './cover-fan.html',
  host: {
    'aria-hidden': 'true',
    class: 'grid place-items-center transition-opacity duration-700',
    '[class.opacity-0]': '!loaded()',
  },
})
export class CoverFan {
  readonly fan = input.required<readonly FanCover[]>();

  private readonly failed = signal<ReadonlySet<string>>(new Set());
  protected readonly loaded = signal(false);
  protected readonly shown = computed(() =>
    this.fan().filter((card) => !this.failed().has(card.cover)),
  );
  protected readonly places = FAN_PLACES;

  protected drop(cover: string): void {
    this.failed.update((failed) => new Set(failed).add(cover));
  }
}
