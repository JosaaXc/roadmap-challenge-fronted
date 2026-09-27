import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';

// Fades its host in, rising a little, the first time it scrolls into view. With reduced motion
// nothing is held back, and once shown it stays. Meant for wrappers: the delay only staggers
// the entrance, so hosts should not carry transitions of their own
@Directive({
  selector: '[appReveal]',
  host: {
    class:
      'motion-safe:transition motion-safe:duration-700 motion-safe:ease-out motion-safe:data-[reveal=pending]:translate-y-6 motion-safe:data-[reveal=pending]:opacity-0',
    '[attr.data-reveal]': 'shown() ? "shown" : "pending"',
    '[style.transition-delay.ms]': 'revealDelay()',
  },
})
export class Reveal {
  // Staggers hosts that come into view together, in milliseconds
  readonly revealDelay = input(0);

  protected readonly shown = signal(false);

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          this.shown.set(true);
        },
        { threshold: 0.15 },
      );
      observer.observe(host);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
