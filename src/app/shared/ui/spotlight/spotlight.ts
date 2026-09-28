import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';

// Follows the pointer across its host as --spot-x and --spot-y, for a light the host paints at
// that point. A plain DOM listener, so moving the pointer never schedules change detection
@Directive({ selector: '[appSpotlight]' })
export class Spotlight {
  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

    const follow = (event: PointerEvent) => {
      const box = host.getBoundingClientRect();
      host.style.setProperty('--spot-x', `${event.clientX - box.left}px`);
      host.style.setProperty('--spot-y', `${event.clientY - box.top}px`);
    };

    host.addEventListener('pointermove', follow);
    inject(DestroyRef).onDestroy(() => host.removeEventListener('pointermove', follow));
  }
}
