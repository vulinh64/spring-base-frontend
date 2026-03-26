import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserInfoBox } from "@/components/common/UserInfoBox";
import { SearchBar } from "@/components/common/SearchBar";

export function Header() {
  const location = useLocation();
  const showSearch = location.pathname !== "/login";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="relative border-b border-gray-800 bg-gray-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">

        {/* Mobile: hamburger + Blog title */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-gray-400 hover:text-gray-100"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor">
              <rect y="3" width="22" height="2.5" rx="1.25" />
              <rect y="9.75" width="22" height="2.5" rx="1.25" />
              <rect y="16.5" width="22" height="2.5" rx="1.25" />
            </svg>
          </button>

          <Link to="/" className="text-xl font-bold text-gray-100">
            Blog
          </Link>

          {/* Desktop search — hidden on mobile */}
          {showSearch && <SearchBar className="hidden md:block w-52" />}
        </div>

        {/* Desktop nav — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-100">
            Posts
          </Link>
          <Link to="/categories" className="text-sm text-gray-400 hover:text-gray-100">
            Categories
          </Link>
          {showSearch && <UserInfoBox />}
        </nav>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden absolute left-0 right-0 top-full z-50 border-b border-gray-800 bg-gray-900 px-4 py-4 flex flex-col gap-4">
          <Link
            to="/"
            className="text-sm text-gray-400 hover:text-gray-100"
            onClick={() => setMobileOpen(false)}
          >
            Posts
          </Link>
          <Link
            to="/categories"
            className="text-sm text-gray-400 hover:text-gray-100"
            onClick={() => setMobileOpen(false)}
          >
            Categories
          </Link>
          {showSearch && <SearchBar />}
          <hr className="border-gray-700" />
          {showSearch && <UserInfoBox />}
        </div>
      )}
    </header>
  );
}
