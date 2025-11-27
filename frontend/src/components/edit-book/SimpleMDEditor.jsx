import { useState, useEffect } from "react";
import { TypeOutline, Eye, EyeOff } from "lucide-react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";

function SimpleMDEditor({ value, onChange, options }) {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Listen for screen resize to handle responsive layout logic
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    // initial check
    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // If large screen: Force "live" (side-by-side)
  // If small screen: Toggle between "preview" (full preview) and "edit" (full edit) based on button state
  const editorMode = isLargeScreen ? "live" : "edit";

  return (
    <div
      className="border border-slate-200 rounded-lg shadow-sm overflow-hidden h-full flex flex-col"
      data-color-mode="light"
    >
      <header className="bg-slate-50 border-b border-slate-200 px-3 sm:px-4 py-2.5 shrink-0">
        <div className="text-slate-600 text-xs sm:text-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
          <div className="flex items-center gap-1">
            <TypeOutline className="size-3 sm:size-3.5" />
            <span className="font-medium">Markdown Editor</span>
          </div>

          <span className="text-[10px] sm:text-xs text-slate-400">
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
          preview={editorMode}
          {...options}
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
