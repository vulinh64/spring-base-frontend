import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { getDraftUserId, clearAllDrafts } from "@/utils/sessionDraft";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { useToast } from "@/components/common/Toast";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const redirectTo =
    (location.state as { from?: string })?.from ||
    new URLSearchParams(location.search).get("redirect") ||
    "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
      toast.error("Logged in as a different user. Unsaved work was discarded.");
      navigate("/", { replace: true });
      return;
    }

    navigate(redirectTo, { replace: true });
  }

  return (
    <div className="mx-auto max-w-sm pt-16">
      <h1 className="text-2xl font-bold text-gray-100 text-center mb-6">Login</h1>

      {error && (
        <div className="mb-4">
          <ErrorBanner message={error} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

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
