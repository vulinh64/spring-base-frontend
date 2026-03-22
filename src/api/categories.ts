import apiClient from "./client";
import type {
  Page,
  Pageable,
  CategoryResponse,
  CategoryCreationRequest,
  CategorySearchRequest,
} from "@/types";

export const categoryApi = {
  search(params?: CategorySearchRequest & Pageable) {
    return apiClient.get<Page<CategoryResponse>>("/category/search", { params });
  },

  create(request: CategoryCreationRequest) {
    return apiClient.post<CategoryResponse>("/category", request);
  },

  delete(categoryId: string) {
    return apiClient.delete<void>(`/category/${categoryId}`);
  },
};
