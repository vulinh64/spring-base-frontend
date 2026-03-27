import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserInfoBox } from "@/components/common/UserInfoBox";
import { SearchBar } from "@/components/common/SearchBar";
import { categoryApi } from "@/api/categories";
import type { CategoryResponse } from "@/types";

export function Header() {
  const location = useLocation();
  const showSearch = location.pathname !== "/login";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [catOpen, setCatOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    categoryApi.all().then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <Link to="/tax-calculator" className="text-sm text-gray-400 hover:text-gray-100">
            Tax Calculator
          </Link>
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-100">
            Posts
          </Link>

          {/* Categories with click dropdown */}
          <div className="relative" ref={catRef}>
            <button
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-100"
              onClick={() => setCatOpen((o) => !o)}
            >
              Categories
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="currentColor"
                className={`transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`}
              >
                <path d="M1 3 L5 7 L9 3 Z" />
              </svg>
            </button>
            {catOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 rounded border border-gray-700 bg-gray-900 py-1 z-50 shadow-lg">
                <Link
                  to="/categories"
                  className="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-100"
                  onClick={() => setCatOpen(false)}
                >
                  All Categories
                </Link>
                <hr className="border-gray-700 my-1" />
                {categories.map((cat) => (
                  <Link
                    key={cat.categorySlug}
                    to={`/category/${cat.categorySlug}`}
                    className="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-100"
                    onClick={() => setCatOpen(false)}
                  >
                    {cat.displayName}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {showSearch && <UserInfoBox />}
        </nav>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden absolute left-0 right-0 top-full z-50 border-b border-gray-800 bg-gray-900 px-4 py-4 flex flex-col gap-4">
          <Link
            to="/tax-calculator"
            className="text-sm text-gray-400 hover:text-gray-100"
            onClick={() => setMobileOpen(false)}
          >
            Tax Calculator
          </Link>
          <Link
            to="/"
            className="text-sm text-gray-400 hover:text-gray-100"
            onClick={() => setMobileOpen(false)}
          >
            Posts
          </Link>

          {/* Categories with expandable sub-list */}
          <div>
            <button
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-100 w-full"
              onClick={() => setMobileCatOpen((o) => !o)}
            >
              Categories
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"
                className={`transition-transform duration-200 ${mobileCatOpen ? "rotate-180" : ""}`}
              >
                <path d="M1 3 L5 7 L9 3 Z" />
              </svg>
            </button>
            {mobileCatOpen && (
              <div className="mt-2 flex flex-col gap-2 pl-4">
                <Link
                  to="/categories"
                  className="text-sm text-gray-400 hover:text-gray-100"
                  onClick={() => { setMobileOpen(false); setMobileCatOpen(false); }}
                >
                  All Categories
                </Link>
                <hr className="border-gray-700" />
                {categories.map((cat) => (
                  <Link
                    key={cat.categorySlug}
                    to={`/category/${cat.categorySlug}`}
                    className="text-sm text-gray-400 hover:text-gray-100"
                    onClick={() => { setMobileOpen(false); setMobileCatOpen(false); }}
                  >
                    {cat.displayName}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {showSearch && <SearchBar />}
          <hr className="border-gray-700" />
          {showSearch && <UserInfoBox />}
        </div>
      )}
    </header>
  );
}
