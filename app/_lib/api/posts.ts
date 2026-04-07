import apiClient from "./client";
import type {
  Page,
  Pageable,
  PrefetchPostProjection,
  SinglePostResponse,
  BasicPostResponse,
  PostRevisionResponse,
  PostCreationRequest,
} from "@/types";

export const postApi = {
  list(pageable?: Pageable) {
    return apiClient.get<Page<PrefetchPostProjection>>("/post", { params: pageable });
  },

  listByCategory(categorySlug: string, pageable?: Pageable) {
    return apiClient.get<Page<PrefetchPostProjection>>(`/post/category/${categorySlug}`, {
      params: pageable,
    });
  },

  search(query: string, pageable?: Pageable) {
    return apiClient.get<Page<PrefetchPostProjection>>("/post/search", {
      params: { query, ...pageable },
    });
  },

  getByIdentity(identity: string) {
    return apiClient.get<SinglePostResponse>(`/post/${identity}`);
  },

  getRevisions(id: string, pageable?: Pageable) {
    return apiClient.get<Page<PostRevisionResponse>>(`/post/${id}/revisions`, {
      params: pageable,
    });
  },

  create(request: PostCreationRequest) {
    return apiClient.post<BasicPostResponse>("/post", request);
  },

  edit(postId: string, request: PostCreationRequest) {
    return apiClient.patch<void>(`/post/${postId}`, request);
  },

  delete(postId: string) {
    return apiClient.delete<void>(`/post/${postId}`);
  },

  applyRevision(id: string, revisionNumber: number) {
    return apiClient.patch<void>(`/post/${id}/revisions`, null, {
      params: { revisionNumber },
    });
  },
};
