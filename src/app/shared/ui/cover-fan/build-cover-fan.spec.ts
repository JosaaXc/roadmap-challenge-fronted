import { buildCoverFan } from './build-cover-fan';
import { FanCover, FanSource } from './cover-fan-models';

const course = (id: string, imageUrl: string | null = `${id}.jpg`): FanSource => ({ id, imageUrl });

const places = (fan: FanCover[]) => fan.map((card) => `${card.id}:${card.place}`);

describe('buildCoverFan', () => {
  const courses = [course('A'), course('B'), course('C'), course('D')];

  it('puts the course to take now in front, between the one before and the one after', () => {
    expect(places(buildCoverFan(courses, 'B'))).toEqual(['A:previous', 'B:current', 'C:next']);
  });

  it('has nothing before the first course or after the last one', () => {
    expect(places(buildCoverFan(courses, 'A'))).toEqual(['A:current', 'B:next']);
    expect(places(buildCoverFan(courses, 'D'))).toEqual(['C:previous', 'D:current']);
  });

  it('puts the last course in front once the path is finished', () => {
    expect(places(buildCoverFan(courses, null))).toEqual(['C:previous', 'D:current']);
  });

  it('keeps path order, so the covers that stay are not reordered as the fan turns', () => {
    const ids = (currentId: string) => buildCoverFan(courses, currentId).map((card) => card.id);

    expect(ids('B')).toEqual(['A', 'B', 'C']);
    expect(ids('C')).toEqual(['B', 'C', 'D']);
  });

  it('leaves out courses without a cover, and is empty for a path without courses', () => {
    const coverless = [course('A'), course('B', null), course('C')];

    expect(places(buildCoverFan(coverless, 'B'))).toEqual(['A:previous', 'C:next']);
    expect(buildCoverFan([], null)).toEqual([]);
  });
});
