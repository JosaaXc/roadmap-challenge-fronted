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

// Filter and order of the Mis rutas grid, both resolved in memory
export type PathFilter = 'all' | 'favorites';
export type PathOrder = 'desc' | 'asc';

// What a Mis rutas card shows, derived from the graph the API returns
export interface PathCard {
  readonly id: string;
  readonly title: string;
  readonly courses: string;
  readonly courseCount: number;
  readonly createdAt: string;
  readonly progress: number;
  readonly nextStep: string | null;
  readonly isFavorite: boolean;
}

// Where the detail page stands while it brings its path
export type PathDetailStatus = 'loading' | 'ready' | 'not-found' | 'error';

// A resource as the user types it, before the API gives it an id
export interface NewResource {
  readonly title: string;
  readonly url: string;
}

// A course of the path with the resources that hang from it, in display order
export interface TimelineCourse {
  readonly node: PathNode;
  readonly resources: readonly PathNode[];
}

// The path as the detail page shows it: courses in order, each with its branch of resources
export interface PathTimeline {
  readonly courses: readonly TimelineCourse[];
  // Resources that lost their parent or never had one, shown after the last course
  readonly orphans: readonly PathNode[];
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
