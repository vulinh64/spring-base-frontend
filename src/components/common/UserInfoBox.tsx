import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";

export function UserInfoBox() {
  const { authenticated, username, logout } = useAuth();
  const location = useLocation();

  const displayName =
    username && username.length > 30 ? username.slice(0, 30) + "…" : username;

  return (
    <div className="inline-flex items-center gap-4 px-2 py-1">
      {authenticated ? (
        <>
          <span className="text-sm text-gray-300">
            Welcome, <span className="font-medium text-gray-100">{displayName}</span>
          </span>
          <button
            onClick={logout}
            className="rounded bg-gray-700 px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-600 transition-colors"
          >
            Log Out
          </button>
        </>
      ) : (
        <>
          <span className="text-sm text-gray-400">You are not logged in.</span>
          <Link
            to="/login"
            state={{ from: location.pathname + location.search }}
            className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 transition-colors"
          >
            Log In
          </Link>
        </>
      )}
    </div>
  );
}
