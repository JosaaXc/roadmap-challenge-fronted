import { computed, DestroyRef, inject, Service, signal } from '@angular/core';

// Covers to light the page with. Null while the page is still finding out which
type CoverSource = () => readonly string[] | null;

// Soft for a page whose own header already glows with the same covers, so the light spills from it
export type PageLightStrength = 'full' | 'soft';

interface PageLightSource {
  readonly covers: CoverSource;
  readonly strength: PageLightStrength;
}

// What lights the top of the shell, under the glass bar: the covers of the page on screen
@Service()
export class PageLightStore {
  private readonly source = signal<PageLightSource | null>(null);

  // Null keeps the light off. An empty list asks for the brand's glow instead
  readonly covers = computed(() => this.source()?.covers() ?? null);
  readonly strength = computed(() => this.source()?.strength ?? 'full');

  show(covers: CoverSource, strength: PageLightStrength): void {
    this.source.set({ covers, strength });
  }

  // Only the page that lit it turns it off, in case the next page has already taken over
  hide(covers: CoverSource): void {
    if (this.source()?.covers === covers) this.source.set(null);
  }
}

// Lights the page with these covers for as long as the calling component is on screen
export function lightPageWith(covers: CoverSource, strength: PageLightStrength = 'full'): void {
  const store = inject(PageLightStore);
  store.show(covers, strength);
  inject(DestroyRef).onDestroy(() => store.hide(covers));
}
