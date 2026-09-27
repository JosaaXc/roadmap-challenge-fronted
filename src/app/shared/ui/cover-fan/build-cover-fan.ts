import { FanCover, FanPlace, FanSource } from './cover-fan-models';

// A fan of covers: the course to take now in front and its neighbours behind, in path order so
// the covers that stay keep their elements as it turns. A finished path puts its last course in front
export function buildCoverFan(courses: readonly FanSource[], currentId: string | null): FanCover[] {
  const current = courses.findIndex((course) => course.id === currentId);
  const front = current === -1 ? courses.length - 1 : current;

  const around: [FanSource | undefined, FanPlace][] = [
    [courses[front - 1], 'previous'],
    [courses[front], 'current'],
    [courses[front + 1], 'next'],
  ];
  return around.flatMap(([course, place]) =>
    course?.imageUrl ? [{ id: course.id, cover: course.imageUrl, place }] : [],
  );
}
