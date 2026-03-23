import { slugify } from "./MarkdownRenderer";

interface TableOfContentsProps {
  headings: string[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
        On this page
      </p>
      <ul className="space-y-2 border-l border-gray-800 pl-3">
        {headings.map((heading) => (
          <li key={heading}>
            <a
              href={`#${slugify(heading)}`}
              className="block text-sm text-gray-400 hover:text-gray-100 transition-colors leading-snug"
            >
              {heading}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
