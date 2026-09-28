import { Pipe, PipeTransform } from '@angular/core';

// The generator prefixes every title the same way, which says nothing once it is on screen
const TITLE_PREFIX = /^Ruta Personalizada:\s*/i;

@Pipe({ name: 'pathTitle' })
export class PathTitlePipe implements PipeTransform {
  transform(title: string): string {
    return title.replace(TITLE_PREFIX, '');
  }
}
