import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-gray-100">404</h1>
      <p className="mt-2 text-gray-400">Page not found</p>
      <Link to="/" className="mt-4 inline-block text-blue-400 hover:underline">
        Back to home
      </Link>
    </div>
  );
}
