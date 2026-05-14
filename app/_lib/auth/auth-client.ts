import axios from "axios";
import type { AccountInfo, GenericResponse } from "@/types";

const CLIENT_ID = process.env.NEXT_PUBLIC_AUTH_CLIENT_ID || "spring-base";

const authClient = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
});

// Both servers now return the GenericResponse<T> envelope; unwrap to .data.
authClient.interceptors.response.use((response) => {
  const body = response.data as GenericResponse<unknown>;
  return { ...response, data: body.data };
});

export async function login(username: string, password: string): Promise<AccountInfo> {
  const { data } = await authClient.post<{ user: AccountInfo }>("/login", {
    grantType: "password",
    clientId: CLIENT_ID,
    username,
    password,
  });
  return data.user;
}

export async function logout(): Promise<void> {
  await authClient.post("/logout");
}

export async function refresh(): Promise<void> {
  // refresh_token is read from the HttpOnly cookie server-side; no body needed.
  await authClient.post("/refresh");
}
