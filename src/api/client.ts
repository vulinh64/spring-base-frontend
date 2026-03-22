import axios from "axios";
import type { GenericResponse } from "@/types";

const apiClient = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => {
    const body = response.data as GenericResponse<unknown>;
    return { ...response, data: body.data };
  },
  async (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("session-expired"));

        await new Promise((r) => setTimeout(r, 0));

        const currentPath = window.location.pathname + window.location.search;
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
      return Promise.reject(error);
    }

    if (axios.isAxiosError(error) && error.response?.data) {
      const body = error.response.data as GenericResponse<unknown>;
      return Promise.reject(
        new ApiError(body.errorCode, body.displayMessage, error.response.status)
      );
    }
    return Promise.reject(error);
  }
);

export class ApiError extends Error {
  errorCode: string;
  displayMessage: string;
  status: number;

  constructor(errorCode: string, displayMessage: string, status: number) {
    super(displayMessage);
    this.name = "ApiError";
    this.errorCode = errorCode;
    this.displayMessage = displayMessage;
    this.status = status;
  }
}

export default apiClient;
