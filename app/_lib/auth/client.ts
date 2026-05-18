import axios from "axios";

const CLIENT_ID = "spring-base";
const GRANT_TYPE_PASSWORD = "password";

const authClient = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
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
  await authClient.post("/refresh");
}
