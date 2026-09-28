import { Pipe, PipeTransform } from '@angular/core';

// Spelled out rather than taken from Intl: the Spanish locale abbreviates September as "sept"
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

// "24 sep 2026", the date format of the paths pages
@Pipe({ name: 'shortDate' })
export class ShortDatePipe implements PipeTransform {
  transform(isoDate: string): string {
    const date = new Date(isoDate);
    return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  }
}
