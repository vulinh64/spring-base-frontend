import type { CategoryResponse } from "./category";

export interface AuthorResponse {
  id: string;
  username: string;
  email: string;
}

export interface TagData {
  id: string;
  displayName: string;
}

export interface PrefetchPostProjection {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  authorId: string;
  author: AuthorResponse | null;
  category: CategoryResponse;
  createdDateTime: string;
  updatedDateTime: string;
}

export interface SinglePostResponse {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  postContent: string;
  createdDateTime: string;
  updatedDateTime: string;
  authorId: string;
  author: AuthorResponse | null;
  category: CategoryResponse;
  tags: TagData[];
  commentCount: number;
}

export interface BasicPostResponse {
  id: string;
  revisionNumber: number;
  title: string;
  excerpt: string;
  slug: string;
  createdDateTime: string;
  updatedDateTime: string;
  authorId: string;
  category: CategoryResponse;
  tags: TagData[];
}

export interface PostRevisionResponse {
  postId: string;
  revisionNumber: number;
  revisionType: string;
  title: string;
  slug: string;
  excerpt: string;
  postContent: string;
  authorId: string;
  categoryId: string;
  tags: string;
  revisionCreatedDateTime: string;
  revisionCreatedBy: string;
}

export interface PostCreationRequest {
  title: string;
  excerpt: string;
  postContent: string;
  slug: string;
  categoryId?: string;
  tags?: string[];
}
