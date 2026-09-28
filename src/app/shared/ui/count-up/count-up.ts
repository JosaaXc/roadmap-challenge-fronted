import { afterNextRender, DestroyRef, Directive, ElementRef, inject, input } from '@angular/core';

const DURATION_MS = 1400;

// Writes a figure into its host, counting up from zero the first time it scrolls into view and
// easing out as it lands. It writes the DOM directly, so the frames never run change detection
@Directive({ selector: '[appCountUp]' })
export class CountUp {
  readonly appCountUp = input.required<number>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private frame = 0;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      // With reduced motion the figure is simply there
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.write(this.appCountUp());
        return;
      }

      this.write(0);
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          this.count();
        },
        { threshold: 0.6 },
      );
      observer.observe(this.host);

      destroyRef.onDestroy(() => {
        observer.disconnect();
        cancelAnimationFrame(this.frame);
      });
    });
  }

  private count(): void {
    const target = this.appCountUp();
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      // Ease-out cubic: fast at first, settling onto the figure
      this.write(Math.round(target * (1 - (1 - progress) ** 3)));
      if (progress < 1) this.frame = requestAnimationFrame(step);
    };
    this.frame = requestAnimationFrame(step);
  }

  private write(value: number): void {
    this.host.textContent = String(value);
  }
}
