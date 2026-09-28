// Where a cover sits in a fan: the course to take now in front, its neighbours behind
export type FanPlace = 'previous' | 'current' | 'next';

export interface FanCover {
  // The course's id, which keeps each cover on its own element while the fan turns
  readonly id: string;
  readonly cover: string;
  readonly place: FanPlace;
}

// Anything a fan can be dealt from: a path node, a catalog course
export interface FanSource {
  readonly id: string;
  readonly imageUrl?: string | null;
}
