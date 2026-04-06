const DRAFT_PREFIX = "draft:";
const DRAFT_USER_KEY = "draft:userId";

function hasSessionStorage(): boolean {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function saveDraft(key: string, data: Record<string, unknown>, userId: string): void {
  if (!hasSessionStorage()) return;
  sessionStorage.setItem(DRAFT_USER_KEY, userId);
  sessionStorage.setItem(DRAFT_PREFIX + key, JSON.stringify(data));
}

export function loadDraft(key: string): Record<string, unknown> | null {
  if (!hasSessionStorage()) return null;
  const raw = sessionStorage.getItem(DRAFT_PREFIX + key);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearDraft(key: string): void {
  if (!hasSessionStorage()) return;
  sessionStorage.removeItem(DRAFT_PREFIX + key);
}

export function getDraftUserId(): string | null {
  if (!hasSessionStorage()) return null;
  return sessionStorage.getItem(DRAFT_USER_KEY);
}

export function clearAllDrafts(): void {
  if (!hasSessionStorage()) return;

  const keysToRemove: string[] = [];

  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key?.startsWith(DRAFT_PREFIX)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => sessionStorage.removeItem(key));
}
