import { useState, useRef, useEffect, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";

export function Header() {
  const { authenticated, username, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (location.pathname === "/search") {
      const params = new URLSearchParams(location.search);
      setQuery(params.get("q") ?? "");
    }
  }, [location.pathname, location.search]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      inputRef.current?.blur();
      mobileInputRef.current?.blur();
    }
  }

  function handleMouseEnter() {
    setExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 150);
  }

  function handleBlur() {
    if (!query.trim()) {
      setExpanded(false);
    }
  }

  return (
    <header className="border-b border-gray-800 bg-gray-900">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-gray-100">
          Blog
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-100">
            Posts
          </Link>
          <Link to="/categories" className="text-sm text-gray-400 hover:text-gray-100">
            Categories
          </Link>

          {authenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/post/new"
                className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
              >
                New Post
              </Link>
              <span className="text-sm text-gray-400">{username}</span>
              <button
                onClick={logout}
                className="text-sm text-gray-400 hover:text-gray-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-sm text-gray-400 hover:text-gray-100">
              Login
            </Link>
          )}

          {/* Desktop: hover-expand search */}
          <form
            onSubmit={handleSubmit}
            onMouseEnter={handleMouseEnter}
            className="hidden md:flex items-center"
          >
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={handleBlur}
              placeholder="Search posts..."
              className={`rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200 origin-right ${
                expanded ? "w-48 opacity-100 mr-2" : "w-0 opacity-0 border-transparent p-0"
              }`}
            />
            <button
              type="submit"
              className="text-gray-400 hover:text-gray-100 transition-colors cursor-pointer"
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
              </svg>
            </button>
          </form>
        </nav>
      </div>

      {/* Mobile: full-width search below header */}
      <form
        onSubmit={handleSubmit}
        className="flex md:hidden items-center gap-2 px-4 pb-3"
      >
        <input
          ref={mobileInputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts..."
          className="flex-1 rounded border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="text-gray-400 hover:text-gray-100 transition-colors"
          aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
          </svg>
        </button>
      </form>
    </header>
  );
}
