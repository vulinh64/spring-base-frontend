"use client";

import { useState, type FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/auth/AuthProvider";
import { getDraftUserId, clearAllDrafts } from "@/utils/sessionDraft";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { useToast } from "@/components/common/Toast";

function LoginPageInner() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const redirectTo = searchParams.get("redirect") || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    let loggedInUserId: string;

    try {
      loggedInUserId = await login(username, password);
    } catch {
      setError("Invalid username or password.");
      setLoading(false);
      return;
    }

    setLoading(false);

    const previousUserId = getDraftUserId();

    if (previousUserId && previousUserId !== loggedInUserId) {
      clearAllDrafts();
      toast.error(
        "Logged in as a different user. Unsaved work was discarded."
      );
      router.replace("/");
      return;
    }

    router.replace(redirectTo);
  }

  const legendCls =
    "text-xs text-gray-400 px-1 group-focus-within/field:text-blue-400 transition-colors py-4";
  const inputCls =
    "w-full bg-transparent text-lg text-gray-100 focus:outline-none placeholder-gray-600 py-2 pl-1 font-['JetBrains_Mono']";

  return (
    <div className="mx-auto max-w-sm pt-16">
      <h1 className="text-2xl font-bold text-gray-100 text-center mb-6">
        Login
      </h1>

      {error && (
        <div className="mb-4">
          <ErrorBanner message={error} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <fieldset className="group/field rounded border border-gray-600 px-3 pt-0 pb-2 focus-within:border-blue-500 transition-colors">
          <legend className={legendCls}>Username</legend>
          <input
            id="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputCls}
          />
        </fieldset>

        <fieldset className="group/field rounded border border-gray-600 px-3 pt-0 pb-2 focus-within:border-blue-500 transition-colors">
          <legend className={legendCls}>Password</legend>
          <div className="flex items-center">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="ml-2 text-gray-500 hover:text-gray-300 transition-colors shrink-0"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  );
}
