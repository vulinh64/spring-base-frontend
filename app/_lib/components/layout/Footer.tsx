import Link from "next/link";
import { SocialContact } from "@/components/common/SocialContact";
import { Hr } from "@/components/common/Hr";

const NAV_LINKS = [
  { href: "/posts", label: "Posts" },
  { href: "/categories", label: "Categories" },
  { href: "/tax-calculator", label: "Tax Calculator" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-800 bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col items-center gap-6">

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-gray-400 hover:text-gray-100 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <Hr className="w-full" />

        <SocialContact />

        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-xs text-gray-500">
            Built with Next.js &amp; Spring Boot
          </p>
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Vu Linh
          </p>
        </div>

      </div>
    </footer>
  );
}
