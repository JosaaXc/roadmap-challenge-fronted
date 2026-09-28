import { Pipe, PipeTransform } from '@angular/core';

// "https://www.youtube.com/watch?v=…" → "youtube.com": tells what kind of resource a link is
// before anyone opens it. A value that does not parse as a URL comes back as it is
@Pipe({ name: 'linkHost' })
export class LinkHostPipe implements PipeTransform {
  transform(url: string): string {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  }
}
