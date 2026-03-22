export interface CategoryResponse {
  id: string;
  categorySlug: string;
  displayName: string;
  postCount: number;
}

export interface CategoryCreationRequest {
  displayName: string;
}

export interface CategorySearchRequest {
  displayName?: string;
  slug?: string;
}
