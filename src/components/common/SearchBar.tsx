import { useState, type SubmitEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function SearchBar({ className }: { className?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [prevLocation, setPrevLocation] = useState(location);

  if (location !== prevLocation) {
    setPrevLocation(location);
    if (location.pathname === "/search") {
      setQuery(new URLSearchParams(location.search).get("q") ?? "");
    }
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className ?? "w-full lg:w-[30%]"}>
      <div className="flex items-center rounded border border-gray-700 bg-gray-800 px-3 py-1.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts..."
          className="flex-1 min-w-0 bg-transparent text-sm text-gray-100 placeholder-gray-500 focus:outline-none"
        />
        <button
          type="submit"
          className="ml-2 shrink-0 text-gray-400 hover:text-gray-100 transition-colors cursor-pointer"
          aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </form>
  );
}
