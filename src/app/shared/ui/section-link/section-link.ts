import { Directive, DOCUMENT, ElementRef, inject } from '@angular/core';

// An in-page link that brings its section to the middle of the screen, or to the top when
// the section is taller than the screen. The href stays, so it is still a real anchor
@Directive({
  selector: 'a[appSectionLink]',
  host: { '(click)': 'scrollToSection($event)' },
})
export class SectionLink {
  private readonly document = inject(DOCUMENT);
  private readonly anchor = inject<ElementRef<HTMLAnchorElement>>(ElementRef);

  protected scrollToSection(event: MouseEvent): void {
    // A modified click means a new tab or window, which the browser handles on its own
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      return;
    }

    const id = this.anchor.nativeElement.hash.slice(1);
    const section = id ? this.document.getElementById(id) : null;
    const view = this.document.defaultView;
    if (!section || !view) return;

    event.preventDefault();
    const reduceMotion = view.matchMedia('(prefers-reduced-motion: reduce)').matches;
    section.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: section.offsetHeight <= view.innerHeight ? 'center' : 'start',
    });
  }
}
