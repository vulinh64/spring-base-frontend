import { useState, useCallback, type ReactNode } from "react";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { remarkAlert } from "remark-github-blockquote-alert";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.min.css";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return extractText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

function CodeBlock({ children }: { children: ReactNode }) {
  const [wrapped, setWrapped] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const text = extractText(children);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [children]);

  return (
    <div className="code-block-wrapper group/code relative">
      <div className="absolute right-2 top-2 z-10 flex gap-1 opacity-0 transition-opacity group-hover/code:opacity-100">
        <button
          type="button"
          onClick={() => setWrapped((w) => !w)}
          className="rounded bg-gray-700/80 p-1.5 text-gray-400 hover:bg-gray-600 hover:text-gray-200 transition-colors"
          title={wrapped ? "Disable word wrap" : "Enable word wrap"}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {wrapped ? (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="16" y2="12" />
                <polyline points="16 8 20 12 16 16" />
                <line x1="3" y1="18" x2="10" y2="18" />
              </>
            )}
          </svg>
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded bg-gray-700/80 p-1.5 text-gray-400 hover:bg-gray-600 hover:text-gray-200 transition-colors"
          title={copied ? "Copied!" : "Copy code"}
        >
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      </div>
      <pre className={wrapped ? "code-wrap" : undefined}>
        {children}
      </pre>
    </div>
  );
}

const summaryInlineComponents: Components = {
  p: ({ children }) => <>{children}</>,
};

const components: Components = {
  pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
  summary: ({ children }) => {
    const raw = extractText(children as ReactNode);
    return (
      <summary>
        <Markdown remarkPlugins={[remarkGfm]} components={summaryInlineComponents}>
          {raw}
        </Markdown>
      </summary>
    );
  },
  h2: ({ children }) => {
    const text = extractText(children as ReactNode);
    const id = slugify(text);
    return (
      <h2 id={id} className="group flex items-center gap-2">
        <span>{children}</span>
        <a
          href={`#${id}`}
          className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-blue-400 transition-opacity no-underline font-normal text-base"
          aria-label={`Link to ${text}`}
        >
          #
        </a>
      </h2>
    );
  },
};

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert max-w-none">
      <Markdown
        remarkPlugins={[remarkGfm, [remarkAlert, { legacyTitle: true }]]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={components}
      >
        {content}
      </Markdown>
    </div>
  );
}
