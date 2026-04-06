import { useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { saveDraft, loadDraft, clearDraft } from "@/utils/sessionDraft";

export function useSessionDraft<T extends Record<string, unknown>>(draftKey: string) {
  const { userId } = useAuth();
  const dataRef = useRef<T | null>(null);

  const updateDraft = useCallback((data: T) => {
    dataRef.current = data;
  }, []);

  const restoreDraft = useCallback((): T | null => {
    return loadDraft(draftKey) as T | null;
  }, [draftKey]);

  const discardDraft = useCallback(() => {
    clearDraft(draftKey);
    dataRef.current = null;
  }, [draftKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    function handleSessionExpired() {
      if (dataRef.current && userId) {
        saveDraft(draftKey, dataRef.current, userId);
      }
    }

    window.addEventListener("session-expired", handleSessionExpired);
    return () => window.removeEventListener("session-expired", handleSessionExpired);
  }, [draftKey, userId]);

  return { updateDraft, restoreDraft, discardDraft };
}
