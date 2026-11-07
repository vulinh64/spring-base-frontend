import axios from "axios";
import type { CsrfTokenResponse, GenericResponse } from "@/types";

const CLIENT_ID = process.env.CLIENT_ID || "spring-base";
const GRANT_TYPE_PASSWORD = "password";

const authClient = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;

authClient.interceptors.request.use(async (config) => {
  if (config.method === "post") {
    // Fetch a fresh token bound to the auth service's session cookie.
    const { data } = await authClient.get<GenericResponse<CsrfTokenResponse>>("/csrf");
    config.headers.set(data.data.headerName, data.data.token);
  }
  return config;
});

export async function login(username: string, password: string): Promise<void> {
  await authClient.post("/login", {
    grantType: GRANT_TYPE_PASSWORD,
    clientId: CLIENT_ID,
    username,
    password,
  });
}

export async function logout(): Promise<void> {
  await authClient.post("/logout");
}

export async function refresh(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = authClient
      .post("/refresh")
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }

  await refreshPromise;
}
