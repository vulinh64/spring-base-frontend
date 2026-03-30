import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {slugify} from "@/utils/slugify.ts";

function InlineMarkdown({ text }: { text: string }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <>{children}</>,
        code: ({ children }) => (
          <code className="rounded bg-gray-800 px-1 py-0.5 text-red-400 text-xs">
            {children}
          </code>
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

interface TableOfContentsProps {
  headings: string[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [btnVisible, setBtnVisible] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length <= 1) return;

    const SHOW_THRESHOLD = 6 * 24;   // button visibility: 6 lines from top
    const ACTIVE_THRESHOLD = 120;    // active heading: ~below the fixed header

    const update = () => {
      const h2s = Array.from(document.querySelectorAll("h2"));
      if (h2s.length === 0) return;

      // Button visibility: show when first H2 is within threshold of top
      setBtnVisible(h2s[0].getBoundingClientRect().top <= SHOW_THRESHOLD);

      // Active heading: last H2 whose top edge is at or above the threshold
      let active: string | null = null;
      for (const h2 of h2s) {
        if (h2.getBoundingClientRect().top <= ACTIVE_THRESHOLD) {
          active = h2.id || null;
        }
      }
      setActiveId(active);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [headings]);

  if (headings.length <= 1) return null;

  const panelWidth = 256;

  const isActive = (heading: string) => slugify(heading) === activeId;

  const linkClass = (heading: string) =>
    `block text-sm transition-colors leading-snug ${
      isActive(heading)
        ? "text-green-400 font-medium"
        : "text-gray-400 hover:text-gray-100"
    }`;

  const desktopTocList = (
    <ul className="space-y-2 border-l border-gray-700 pl-3">
      {headings.map((heading) => (
        <li key={heading} className="flex items-start gap-1.5">
          <span className={`mt-0.5 select-none text-xs ${isActive(heading) ? "text-green-500" : "text-gray-600"}`}>•</span>
          <a href={`#${slugify(heading)}`} className={linkClass(heading)}>
            <InlineMarkdown text={heading} />
          </a>
        </li>
      ))}
    </ul>
  );

  const mobileTocList = (
    <ul className="space-y-2">
      {headings.map((heading) => (
        <li key={heading}>
          <a
            href={`#${slugify(heading)}`}
            onClick={() => setIsOpen(false)}
            className={linkClass(heading)}
          >
            <InlineMarkdown text={heading} />
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Desktop: static sticky sidebar — acts as flex child in PostDetailPage */}
      <nav className="hidden lg:block w-64 shrink-0 sticky top-8 self-start">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
          On this page
        </p>
        {desktopTocList}
      </nav>

      {/* Mobile only: floating toggle button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="lg:hidden fixed z-50 bg-gray-800 border border-r-0 border-gray-700 rounded-l-md px-2 py-2.5 text-gray-400 hover:bg-gray-700 hover:text-gray-200 transition-colors shadow-lg"
        style={{
          top: "5rem",
          right: isOpen ? panelWidth : 0,
          opacity: btnVisible ? 1 : 0,
          pointerEvents: btnVisible ? "auto" : "none",
          transition: "right 300ms ease-in-out, opacity 200ms ease-in-out",
        }}
        aria-label={isOpen ? "Close table of contents" : "Open table of contents"}
      >
        {isOpen ? <ChevronRightIcon /> : <HamburgerIcon />}
      </button>

      {/* Mobile only: slide-in panel from the right */}
      <div
        className="lg:hidden fixed top-0 right-0 h-full bg-gray-900 border-l border-gray-800 shadow-2xl z-40 overflow-y-auto pt-14 pb-8 px-5 transition-transform duration-300 ease-in-out"
        style={{
          width: panelWidth,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
          On this page
        </p>
        {mobileTocList}
      </div>

      {/* Mobile only: backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

function HamburgerIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
