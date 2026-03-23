import { Link, useLocation } from "react-router-dom";
import { UserInfoBox } from "@/components/common/UserInfoBox";
import { SearchBar } from "@/components/common/SearchBar";

export function Header() {
  const location = useLocation();
  const showSearch = location.pathname !== "/login";

  return (
    <header className="border-b border-gray-800 bg-gray-900">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold text-gray-100">
            Blog
          </Link>
          {showSearch && <SearchBar className="w-52" />}
        </div>

        <nav className="flex items-center gap-6">
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-100">
            Posts
          </Link>
          <Link to="/categories" className="text-sm text-gray-400 hover:text-gray-100">
            Categories
          </Link>
          <UserInfoBox />
        </nav>
      </div>
    </header>
  );
}
