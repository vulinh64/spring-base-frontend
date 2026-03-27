import { useRef, useState, useEffect, type ReactNode } from "react";

interface MarkdownEditorProps {
  content: string;
  onChange: (value: string) => void;
}

interface LinkModal {
  open: boolean;
  url: string;
  displayName: string;
}

interface TableModal {
  open: boolean;
  columns: string;
  rows: string;
  excludeHeader: boolean;
}

export function MarkdownEditor({ content, onChange }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [linkModal, setLinkModal] = useState<LinkModal>({ open: false, url: "", displayName: "" });
  const [tableModal, setTableModal] = useState<TableModal>({ open: false, columns: "2", rows: "2", excludeHeader: false });
  const [headingOpen, setHeadingOpen] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (headingRef.current && !headingRef.current.contains(e.target as Node)) {
        setHeadingOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Uses execCommand so insertions are recorded in the browser's native undo stack (Ctrl+Z).
  // execCommand is deprecated but remains the only way to preserve undo history in a textarea.
  function execInsert(text: string, cursorOffset?: number) {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.focus();
    document.execCommand("insertText", false, text);
    if (cursorOffset !== undefined) {
      const pos = ta.selectionStart - text.length + cursorOffset;
      ta.setSelectionRange(pos, pos);
    }
  }

  function wrapSelection(before: string, after: string) {
    const ta = textareaRef.current;
    if (!ta) return;
    const selected = ta.value.slice(ta.selectionStart, ta.selectionEnd);
    if (selected.length > 0) {
      execInsert(before + selected + after);
    } else {
      execInsert(before + after, before.length);
    }
  }

  function insertAdmonition(type: string) {
    const ta = textareaRef.current;
    if (!ta) return;
    const prefix = ta.selectionStart > 0 && ta.value[ta.selectionStart - 1] !== "\n" ? "\n\n" : "";
    execInsert(`${prefix}> [!${type}]\n> `);
  }

  function insertHeading(level: number) {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = ta.value.lastIndexOf("\n", start - 1) + 1;
    const lineText = ta.value.slice(lineStart);
    const existingMatch = lineText.match(/^(#{1,6}) /);
    const newPrefix = "#".repeat(level) + " ";
    ta.focus();
    if (existingMatch) {
      const oldPrefix = existingMatch[1] + " ";
      ta.setSelectionRange(lineStart, lineStart + oldPrefix.length);
      document.execCommand("insertText", false, newPrefix);
      const newCursor = Math.max(lineStart + newPrefix.length, start - oldPrefix.length + newPrefix.length);
      ta.setSelectionRange(newCursor, newCursor);
    } else {
      ta.setSelectionRange(lineStart, lineStart);
      document.execCommand("insertText", false, newPrefix);
      ta.setSelectionRange(start + newPrefix.length, start + newPrefix.length);
    }
  }

  function insertLinePrefix(prefix: string) {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = ta.value.lastIndexOf("\n", start - 1) + 1;
    ta.focus();
    ta.setSelectionRange(lineStart, lineStart);
    document.execCommand("insertText", false, prefix);
    ta.setSelectionRange(start + prefix.length, start + prefix.length);
  }

  function insertTable() {
    const cols = Math.max(1, parseInt(tableModal.columns) || 2);
    const rows = Math.max(1, parseInt(tableModal.rows) || 2);
    const { excludeHeader } = tableModal;
    const cell = (text: string) => ` ${text} `;
    const colArr = Array.from({ length: cols });

    const headerRow = "| " + colArr.map((_, i) => cell(excludeHeader ? "" : `Column ${i + 1}`)).join("|") + "|";
    const separator = "| " + colArr.map(() => " --- ").join("|") + "|";
    const dataRow = () => "| " + colArr.map(() => cell("")).join("|") + "|";
    const dataRows = Array.from({ length: rows }, dataRow);
    const table = [headerRow, separator, ...dataRows].join("\n");

    const ta = textareaRef.current;
    if (!ta) return;
    const prefix = ta.selectionStart > 0 && ta.value[ta.selectionStart - 1] !== "\n" ? "\n\n" : "";
    setTableModal({ open: false, columns: "2", rows: "2", excludeHeader: false });
    setTimeout(() => execInsert(prefix + table + "\n"), 0);
  }

  function insertLink() {
    const { url, displayName } = linkModal;
    if (!url || !displayName) return;
    setLinkModal({ open: false, url: "", displayName: "" });
    setTimeout(() => execInsert(`[${displayName}](${url})`), 0);
  }

  return (
    <div className="rounded border border-gray-700 bg-gray-800 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-gray-700 px-3 py-2 flex-wrap">
        {/* Headings dropdown */}
        <div className="relative" ref={headingRef}>
          <button
            type="button"
            title="Heading"
            onClick={() => setHeadingOpen((o) => !o)}
            className="flex items-center gap-1 rounded px-3 py-1.5 text-sm text-gray-400 hover:bg-gray-700 hover:text-gray-100"
          >
            Heading
            <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor"
              className={`transition-transform duration-150 ${headingOpen ? "rotate-180" : ""}`}
            >
              <path d="M1 3 L5 7 L9 3 Z" />
            </svg>
          </button>
          {headingOpen && (
            <div className="absolute left-0 top-full mt-1 w-28 rounded border border-gray-700 bg-gray-900 py-1 z-50 shadow-lg">
              {[1, 2, 3, 4].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => { insertHeading(level); setHeadingOpen(false); }}
                  className="flex w-full items-baseline gap-2 px-3 py-1.5 text-left text-gray-400 hover:bg-gray-800 hover:text-gray-100"
                >
                  <span className="text-xs font-mono text-gray-500">{"#".repeat(level)}</span>
                  <span style={{ fontSize: `${1 - (level - 1) * 0.1}rem` }} className="font-bold">H{level}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <ToolbarBtn onClick={() => wrapSelection("**", "**")} title="Bold">
          <span className="font-bold">B</span>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => wrapSelection("*", "*")} title="Italic">
          <span className="italic">I</span>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => wrapSelection("***", "***")} title="Bold Italic">
          <span className="font-bold italic">BI</span>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => wrapSelection("~~", "~~")} title="Strikethrough">
          <span className="line-through">S</span>
        </ToolbarBtn>

        <Divider />

        <ToolbarBtn onClick={() => wrapSelection("`", "`")} title="Inline code">
          <span className="font-mono">`code`</span>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => wrapSelection("```text\n", "\n```")} title="Code block">
          <span className="font-mono">```</span>
        </ToolbarBtn>

        <Divider />

        <ToolbarBtn onClick={() => insertLinePrefix("> ")} title="Block quote">
          <span>❝</span>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => insertLinePrefix("- ")} title="Bullet list">
          <span>• List</span>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => insertLinePrefix("1. ")} title="Ordered list">
          <span>1. List</span>
        </ToolbarBtn>

        <Divider />

        <ToolbarBtn onClick={() => setLinkModal((m) => ({ ...m, open: true }))} title="Hyperlink">
          <span>Link</span>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => setTableModal((m) => ({ ...m, open: true }))} title="Table">
          <span>Table</span>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => insertLinePrefix("---")} title="Horizontal rule">
          <span>HR</span>
        </ToolbarBtn>

      </div>

      {/* Admonition row */}
      <div className="flex items-center gap-1 border-b border-gray-700 px-3 py-2 flex-wrap">
        <span className="text-xs text-gray-500 mr-1">Admonition</span>
        <Divider />
        {[
          { type: "NOTE",      color: "text-blue-400"   },
          { type: "TIP",       color: "text-green-400"  },
          { type: "IMPORTANT", color: "text-purple-400" },
          { type: "WARNING",   color: "text-yellow-400" },
          { type: "CAUTION",   color: "text-red-400"    },
        ].map(({ type, color }) => (
          <button
            key={type}
            type="button"
            onClick={() => insertAdmonition(type)}
            className={`rounded px-3 py-1.5 text-sm hover:bg-gray-700 ${color}`}
          >
            {type}
          </button>
        ))}
      </div>

      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        rows={16}
        className="w-full bg-transparent px-4 py-3 text-sm text-gray-100 font-mono placeholder-gray-500 focus:outline-none resize-y"
        placeholder="Write your post content in Markdown..."
      />

      {/* Link modal */}
      {linkModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-lg border border-gray-700 bg-gray-900 p-5 shadow-xl">
            <h3 className="text-sm font-semibold text-gray-100 mb-4">Insert Link</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Display Name</label>
                <input
                  autoFocus
                  type="text"
                  value={linkModal.displayName}
                  onChange={(e) => setLinkModal((m) => ({ ...m, displayName: e.target.value }))}
                  className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-100 focus:border-blue-500 focus:outline-none"
                  placeholder="Link text"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">URL</label>
                <input
                  type="text"
                  value={linkModal.url}
                  onChange={(e) => setLinkModal((m) => ({ ...m, url: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === "Enter") insertLink(); }}
                  className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-100 focus:border-blue-500 focus:outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setLinkModal({ open: false, url: "", displayName: "" })}
                className="rounded border border-gray-700 px-3 py-1.5 text-xs text-gray-400 hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertLink}
                disabled={!linkModal.url || !linkModal.displayName}
                className="rounded bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Table modal */}
      {tableModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-lg border border-gray-700 bg-gray-900 p-5 shadow-xl">
            <h3 className="text-sm font-semibold text-gray-100 mb-4">Insert Table</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">Columns</label>
                  <input
                    autoFocus
                    type="number"
                    min={1}
                    value={tableModal.columns}
                    onChange={(e) => setTableModal((m) => ({ ...m, columns: e.target.value }))}
                    className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">
                    Rows{!tableModal.excludeHeader && <span className="text-gray-500"> (excl. header)</span>}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={tableModal.rows}
                    onChange={(e) => setTableModal((m) => ({ ...m, rows: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter") insertTable(); }}
                    className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tableModal.excludeHeader}
                  onChange={(e) => setTableModal((m) => ({ ...m, excludeHeader: e.target.checked }))}
                  className="rounded border-gray-600 bg-gray-800 accent-blue-500"
                />
                <span className="text-xs text-gray-400">Exclude header row</span>
              </label>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setTableModal({ open: false, columns: "2", rows: "2", excludeHeader: false })}
                className="rounded border border-gray-700 px-3 py-1.5 text-xs text-gray-400 hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertTable}
                disabled={!tableModal.columns || !tableModal.rows}
                className="rounded bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ToolbarBtn({ onClick, title, children }: { onClick: () => void; title: string; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="rounded px-3 py-1.5 text-sm text-gray-400 hover:bg-gray-700 hover:text-gray-100"
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-gray-700 mx-1.5" />;
}
