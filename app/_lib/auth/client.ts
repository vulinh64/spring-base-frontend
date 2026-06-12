import axios from "axios";

const CLIENT_ID = process.env.CLIENT_ID || "spring-base";
const GRANT_TYPE_PASSWORD = "password";

const authClient = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;

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
