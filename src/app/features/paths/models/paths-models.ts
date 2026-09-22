export interface PathEdge{
  id: string;
  isOptional: boolean;
  sourceNodeId: string;
  targetNodeId: String;
}

export interface PathNode {
  id: string;
  type: string;
  title: string;
  isCompleted: boolean;
  position: number;
  courseId?: any;
  externalUrl?: string | null;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  progress: number;
  isFavorite: boolean;
  isPublic: boolean;
  nodes: PathNode[];
  edges: PathEdge[];
  nextStep: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SinglePathResponse {
  success: boolean;
  data: LearningPath;
  meta: {
    timestamp: string;
  };
}

export interface PaginatedPathsResponse {
  success: boolean;
  data: {
    items: LearningPath[];
  };
  meta: {
    timestamp: string;
    nextCursor?: string;
    hasNextPage: boolean;
    take: number;
  };
}

export interface ToggleNodeResponse {
  success: boolean;
  data: {
    node: PathNode;
    progress: number;
  };
  meta: {
    timestamp: string;
  }
}

export interface ToggleFavoriteResponse {
  success: boolean;
  data: {
    id: string;
    isFavorite: boolean;
  };
  meta: {
    timestamp: string;
  };
}
