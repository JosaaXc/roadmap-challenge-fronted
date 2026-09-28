export interface AdminPathOwner {
  username: string;
}

export interface AdminPath {
  id: string;
  title: string;
  description: string;
  progress: number;
  imageUrl: string;
  nodeCount: number;
  owner: AdminPathOwner;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPathsResponse {
  items: AdminPath[];
}
