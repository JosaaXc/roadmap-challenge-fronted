// The API answers with PathResponseDto, which leaves out every soft-delete
// column: deleted nodes and edges are already filtered by the query itself
export interface PathEdge {
  id: string;
  isOptional: boolean;
  sourceNodeId: string;
  targetNodeId: string;
}

// Courses from the catalogue, or links the user added to their own path
export type PathNodeType = 'DEVTALLES_COURSE' | 'EXTERNAL_LINK';

export interface PathNode {
  id: string;
  type: PathNodeType;
  title: string;
  isCompleted: boolean;
  position: number;
  courseId?: any;
  // Cover of the course behind the node, null on external links
  imageUrl?: string | null;
  // Page of the course on the academy. Not sent yet: the name is a proposal for the backend
  courseUrl?: string | null;
  externalUrl?: string | null;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  progress: number;
  // Cover of the first course, kept as the path cover when it was generated
  imageUrl?: string | null;
  isFavorite: boolean;
  isPublic: boolean;
  nodes: PathNode[];
  edges: PathEdge[];
  // Title of the first unfinished node, null once the path is complete
  nextStep: string | null;
  createdAt: string;
  updatedAt?: string;
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
