import type { AuthorResponse } from "./post";

export interface SingleCommentResponse {
  id: string;
  content: string;
  createdDateTime: string;
  updatedDateTime: string;
  isEdited: boolean;
  author: AuthorResponse | null;
}

export interface CommentResponse {
  postId: string;
  commentId: string;
  revisionNumber: number;
}

export interface NewCommentRequest {
  content: string;
}
