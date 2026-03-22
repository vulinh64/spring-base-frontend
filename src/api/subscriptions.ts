import apiClient from "./client";

export const subscriptionApi = {
  subscribeToUser(userId: string) {
    return apiClient.post<void>(`/subscription/user/${userId}`);
  },

  subscribeToPost(postId: string) {
    return apiClient.post<void>(`/subscription/post/${postId}`);
  },
};
