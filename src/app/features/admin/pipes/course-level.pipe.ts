import { Pipe, PipeTransform } from '@angular/core';

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: 'Principiante',
  INTERMEDIATE: 'Intermedio',
  ADVANCED: 'Avanzado',
};

@Pipe({ name: 'courseLevel' })
export class CourseLevelPipe implements PipeTransform {
  transform(level: string): string {
    return LEVEL_LABELS[level] ?? level;
  }
}