export interface PathEdge{
  id: string;
  isOptional: boolean;
  sourceNodeId: string;
  targetNodeId: string;
}

export interface PathNode {
  id: string;
  type: string;
  title: string;
  isCompleted: boolean;
  position: number;
  courseId?: any;
  externalUrl?: string | null;
  deletedAt: string;
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
  deletedAt: string;
}

export interface ApiMeta {
  timestamp: string;
  nextCursor?: string;
  hasNextPage: boolean;
  take?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: ApiMeta;
}

export interface PaginatedData<T> {
  items: T[];
}

export interface NodeUpdateData {
  node: PathNode;
  progress: number;
}

export interface FavoriteUpdateData {
  id: string;
  isFavorite: boolean;
}

export interface AddExternalNodeRequest {
  title: string;
  url: string;
  previousNodeId: string;
}

// GET /paths/:id
export type SinglePathResponse = ApiResponse<LearningPath>;

// GET /paths (Listado de rutas)
export type PaginatedPathsResponse = ApiResponse<PaginatedData<LearningPath>>;

// PATCH /paths/:id/favorite
export type ToggleFavoriteResponse = ApiResponse<FavoriteUpdateData>;

// PATCH /paths/:id/nodes
export type ToggleNodeResponse = ApiResponse<NodeUpdateData>;

// POST /paths/:id/nodes
export type AddNodeResponse = ApiResponse<NodeUpdateData>;

// DELETE /paths/:id/nodes/:nodeID
export type DeleteNodeResponse = ApiResponse<NodeUpdateData>;
