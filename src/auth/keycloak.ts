import axios from "axios";

const authClient = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
});

export async function login(username: string, password: string): Promise<void> {
  await authClient.post("/login", { username, password });
}

export async function logout(): Promise<void> {
  await authClient.post("/logout");
}
