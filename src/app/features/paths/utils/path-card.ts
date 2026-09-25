import { PREVIEW_COURSES } from '../constants/paths-constants';
import { LearningPath, PathCard } from '../models/paths-models';

// What a Mis rutas card shows. Only catalogue courses count: external links are the user's additions
export function toPathCard(path: LearningPath): PathCard {
  const courses = path.nodes.filter((node) => node.type === 'DEVTALLES_COURSE');
  const firstTitles = courses.slice(0, PREVIEW_COURSES).map((node) => node.title);
  const remaining = courses.length - firstTitles.length;

  return {
    id: path.id,
    title: path.title,
    courses:
      remaining > 0
        ? `${firstTitles.join(', ')} y ${remaining} curso${remaining === 1 ? '' : 's'} más`
        : firstTitles.join(', '),
    courseCount: courses.length,
    createdAt: path.createdAt,
    progress: path.progress,
    nextStep: path.nextStep,
    isFavorite: path.isFavorite,
  };
}
