import { TypeOutline } from "lucide-react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";

function SimpleMDEditor({ value, onChange, options }) {
  return (
    <div
      className="border border-slate-200 rounded-lg shadow-sm overflow-hidden h-full flex flex-col"
      data-color-mode="light"
    >
      <header className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 shrink-0">
        <div className="text-slate-600 text-sm flex items-center gap-2">
          <TypeOutline className="size-4" />
          <span className="font-medium">Markdown Editor</span>
          <span className="text-xs text-slate-400 ml-auto">
            Supports code highlighting
          </span>
        </div>
      </header>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <MDEditor
          value={value}
          onChange={onChange}
          height="100%"
          preview="live"
          previewOptions={{
            rehypePlugins: [[rehypeSanitize]],
          }}
          commands={[
            commands.bold,
            commands.italic,
            commands.strikethrough,
            commands.hr,
            commands.heading,
            commands.divider,
            commands.link,
            commands.code,
            commands.codeBlock,
            commands.image,
            commands.divider,
            commands.unorderedListCommand,
            commands.orderedListCommand,
            commands.checkedListCommand,
          ]}
          textareaProps={{
            placeholder:
              "Start writing your chapter content here...\n\nTip: Use ```language to create code blocks with syntax highlighting",
          }}
        />
      </div>
    </div>
  );
}

export default SimpleMDEditor;
