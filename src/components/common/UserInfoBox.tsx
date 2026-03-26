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
          <span className="text-sm text-gray-500">
            (<button onClick={logout} className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer">Log Out</button>)
          </span>
        </>
      ) : (
        <>
          <span className="text-sm text-gray-400">You are not logged in.</span>
          <span className="text-sm text-gray-500">
            (<Link
              to="/login"
              state={{ from: location.pathname + location.search }}
              className="text-gray-400 hover:text-green-400 transition-colors"
            >Log In</Link>)
          </span>
        </>
      )}
    </div>
  );
}
