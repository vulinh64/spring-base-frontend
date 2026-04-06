import apiClient from "./client";
import type {
  Page,
  Pageable,
  SingleCommentResponse,
  CommentResponse,
  NewCommentRequest,
} from "@/types";

export const commentApi = {
  list(postId: string, pageable?: Pageable) {
    return apiClient.get<Page<SingleCommentResponse>>(`/comment/${postId}`, {
      params: pageable,
    });
  },

  add(postId: string, request: NewCommentRequest) {
    return apiClient.post<CommentResponse>(`/comment/${postId}`, request);
  },

  edit(commentId: string, request: NewCommentRequest) {
    return apiClient.patch<CommentResponse>(`/comment/${commentId}`, request);
  },
};
