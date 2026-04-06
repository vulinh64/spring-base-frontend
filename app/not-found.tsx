import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-gray-100">404</h1>
      <p className="mt-2 text-gray-400">Page not found</p>
      <Link
        href="/"
        className="mt-4 inline-block text-blue-400 hover:underline"
      >
        Back to home
      </Link>
    </div>
  );
}
