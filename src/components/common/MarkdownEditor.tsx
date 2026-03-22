interface MarkdownEditorProps {
  content: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ content, onChange }: MarkdownEditorProps) {
  return (
    <div className="rounded border border-gray-700 bg-gray-800 overflow-hidden">
      <div className="border-b border-gray-700 px-3 py-1.5 text-xs text-gray-500">
        Markdown supported
      </div>
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        rows={16}
        className="w-full bg-transparent px-4 py-3 text-sm text-gray-100 font-mono placeholder-gray-500 focus:outline-none resize-y"
        placeholder="Write your post content in Markdown..."
      />
    </div>
  );
}
