const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8088";

export class BackendError extends Error {
  status: number;

  constructor(status: number) {
    super(`Backend error: ${status}`);
    this.name = "BackendError";
    this.status = status;
  }
}

export async function serverFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) throw new BackendError(res.status);
  const json = await res.json();
  return json.data ?? json;
}
