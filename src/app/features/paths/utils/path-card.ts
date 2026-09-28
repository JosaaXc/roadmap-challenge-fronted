import { PREVIEW_COURSES } from '../constants/paths-constants';
import { LearningPath, PathCard } from '../models/paths-models';

// What a Mis rutas card shows. Only catalogue courses count: external links are the user's additions
export function toPathCard(path: LearningPath): PathCard {
  const nodes = path.nodes || [];

  const courses = nodes.filter((node: any) => node.type === 'DEVTALLES_COURSE');

  const firstTitles = courses.slice(0, PREVIEW_COURSES).map((node: any) => node.title);
  const remaining = courses.length - firstTitles.length;

  let coursesText = '';

  if (courses.length > 0) {
    // Si tenemos nodos (caso normal: Mis Rutas)
    coursesText =
      remaining > 0
        ? `${firstTitles.join(', ')} y ${remaining} curso${remaining === 1 ? '' : 's'} más`
        : firstTitles.join(', ');
  } else if (!path.nodes && path.nodeCount) {
    // Si NO tenemos nodos pero el backend mandó la cuenta (caso: Rutas Relacionadas)
    coursesText = `${path.nodeCount} curso${path.nodeCount === 1 ? '' : 's'} en total`;
  }

  return {
    id: path?.id,
    title: path?.title,
    courses: coursesText,
    courseCount: path.nodes ? courses.length : (path.nodeCount || 0),
    createdAt: path?.createdAt,
    imageUrl: path?.imageUrl,
    progress: path?.progress || 0,
    nextStep: path?.nextStep || null,
    isFavorite: path?.isFavorite || false,
    isPublic: path?.isPublic || false,
    isFork: path?.isFork || false,
    hasLiked: path?.hasLiked || false,
    likesCount: path?.likesCount || 0,
    forksCount: path?.forksCount || 0,
    forkedFrom: path?.forkedFrom || '',
    owner: path?.owner,
  };
}
