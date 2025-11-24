import { Eye, Maximize2, Minimize2, Sparkles, TypeOutline } from "lucide-react";
import { useMemo, useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import SimpleMDEditor from "./SimpleMDEditor";

function ChapterEditorTab({
  book = {
    title: "Untitled",
    chapters: [
      {
        title: "Chapter 1",
        content: "_",
      },
    ],
  },
  selectedChapterIndex = 0,
  onEditChapter = () => {},
  isGenerating,
  onGeneratingChapterContent = () => {},
}) {
  const [isInPreviewMode, setIsInPreviewMode] = useState(false);
  const [isInFullScreenMode, setIsInFullScreenMode] = useState(false);

  const formatMarkdown = (content) => {
    return (
      content
        // Code blocks (must come before inline code)
        .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
          const language = lang || "text";

          return `<pre class="bg-slate-900 text-slate-100 rounded-lg p-4 my-4 overflow-x-auto"><code class="language-${language} text-sm font-mono">${code.trim()}</code></pre>`;
        })
        // Inline code
        .replace(
          /`([^`]+)`/g,
          '<code class="bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
        )
        // Headings
        .replace(
          /^### (.*$)/gm,
          "<h3 class='text-xl font-bold mt-6 mb-4 text-slate-900'>$1</h3>"
        )
        .replace(
          /^## (.*$)/gm,
          "<h2 class='text-2xl font-bold mt-8 mb-4 text-slate-900'>$1</h2>"
        )
        .replace(
          /^# (.*$)/gm,
          "<h1 class='text-3xl font-bold mt-8 mb-6 text-slate-900'>$1</h1>"
        )
        // Bold and italic
        .replace(
          /\*\*(.*?)\*\*/g,
          "<strong class='font-semibold text-slate-900'>$1</strong>"
        )
        .replace(/\*(.*?)\*/g, "<em class='italic text-slate-700'>$1</em>")
        // Blockquote
        .replace(
          /^> (.*$)/gm,
          "<blockquote class='text-slate-700 italic border-l-4 border-violet-500 pl-4 my-4 bg-violet-50/50 py-2 rounded-r'>$1</blockquote>"
        )
        // Unordered list
        .replace(/^\- (.*$)/gm, "<li class='ml-6 mb-2 text-slate-700'>$1</li>")
        .replace(
          /(<li class="ml-6 mb-2 text-slate-700">.*<\/li>)/gs,
          "<ul class='list-disc my-4'>$1</ul>"
        )
        // Ordered list
        .replace(
          /^\d+\. (.*$)/gm,
          "<li class='ml-6 mb-2 text-slate-700'>$1</li>"
        )
        .replace(
          /(<li class="ml-6 mb-2 text-slate-700">.*<\/li>)/gs,
          "<ol class='list-decimal my-4'>$1</ol>"
        )
        // Paragraph
        .split("\n\n")
        .map((paragraph) => {
          paragraph = paragraph.trim();
          if (!paragraph) return "";
          if (paragraph.startsWith("<")) return paragraph;
          return `<p class="text-slate-700 leading-relaxed mb-4">${paragraph}</p>`;
        })
        .join("")
    );
  };

  const mdEditorOptions = useMemo(
    () => ({
      autoFocus: true,
      spellChecker: false,
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "code",
        "unordered-list",
        "ordered-list",
        "|",
        "link",
        "image",
        "|",
        "preview",
        "side-by-side",
        "fullscreen",
      ],
    }),
    []
  );

  if (
    selectedChapterIndex === null ||
    !book ||
    !Array.isArray(book.chapters) ||
    !book.chapters[selectedChapterIndex]
  ) {
    return (
      <section className="flex-1 flex justify-center items-center p-8">
        <div className="text-center">
          <div className="size-16 bg-slate-100 rounded-full mx-auto mb-4 flex justify-center items-center">
            <TypeOutline className="size-8 text-slate-400" />
          </div>

          <h2 className="text-slate-700 text-lg font-semibold mb-2">
            Select a chapter to start editing
          </h2>

          <p className="text-slate-400 text-sm">
            Choose from the sidebar to begin writing
          </p>
        </div>
      </section>
    );
  }

  const currentChapter = book.chapters[selectedChapterIndex];

  return (
    <article
      className={`${
        isInFullScreenMode ? "bg-white fixed inset-0 z-50" : "flex-1"
      } flex flex-col`}
    >
      {/* Header */}
      <header className="bg-white border-b border-slate-100 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-slate-900 text-lg sm:text-xl lg:text-2xl font-bold truncate">
                Editor
              </h1>

              <p className="max-w-[300px] sm:max-w-full text-slate-500 text-sm sm:text-base mt-1 truncate">
                Editing:{" "}
                <span
                  title={
                    currentChapter.title ||
                    `Chapter ${selectedChapterIndex + 1}`
                  }
                  className="text-slate-700 font-medium"
                >
                  {currentChapter.title ||
                    `Chapter ${selectedChapterIndex + 1}`}
                </span>
              </p>
            </div>

            {/* Editor controls */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <nav className="border border-slate-200 rounded-lg overflow-hidden flex items-center shadow-sm">
                <button
                  type="button"
                  onClick={() => setIsInPreviewMode(false)}
                  className={`text-xs sm:text-sm font-medium px-3 py-2 transition-all duration-150 ${
                    !isInPreviewMode
                      ? "bg-violet-50 text-violet-700 border-r border-violet-200"
                      : "text-slate-600 hover:bg-slate-50 focus-visible:bg-slate-50"
                  }`}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => setIsInPreviewMode(true)}
                  className={`text-xs sm:text-sm font-semibold px-3 py-2 transition-all duration-150 ${
                    isInPreviewMode
                      ? "bg-violet-50 text-violet-700"
                      : "text-slate-600 hover:bg-slate-50 focus-visible:bg-slate-50"
                  }`}
                >
                  Preview
                </button>
              </nav>

              <button
                type="button"
                onClick={() => setIsInFullScreenMode(!isInFullScreenMode)}
                aria-label={
                  isInFullScreenMode ? "Exit full screen" : "Full screen"
                }
                title={isInFullScreenMode ? "Exit Full Screen" : "Full Screen"}
                className="text-slate-600 rounded-lg p-2 transition-all duration-150 hover:bg-slate-100 focus-visible:bg-slate-100 border border-slate-200 shadow-sm"
              >
                {isInFullScreenMode ? (
                  <Minimize2 className="size-4" />
                ) : (
                  <Maximize2 className="size-4" />
                )}
              </button>

              <Button
                type="button"
                onClick={() => onGeneratingChapterContent(selectedChapterIndex)}
                isLoading={isGenerating}
                icon={Sparkles}
                size="sm"
                className="shadow-sm"
              >
                <span className="hidden sm:inline">Generate with AI</span>
                <span className="sm:hidden">AI</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content area */}
      <section className="flex-1 overflow-hidden">
        <div className="h-full bg-white px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="h-full bg-white">
            <div className="space-y-4 sm:space-y-6 h-full flex flex-col">
              {/* Chapter title input */}
              <div>
                <Input
                  label="Chapter Title"
                  name="title"
                  value={currentChapter.title || ""}
                  onChange={(e) => onEditChapter("title", e.target.value)}
                  placeholder="Enter chapter title..."
                  className="text-lg sm:text-xl font-semibold"
                />
              </div>

              {/* Editor/preview area */}
              <div className="flex-1 min-h-0 overflow-hidden">
                {isInPreviewMode ? (
                  <div className="h-full border border-slate-200 rounded-lg overflow-hidden flex flex-col shadow-sm">
                    <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 shrink-0">
                      <div className="text-slate-600 text-sm flex items-center gap-2">
                        <Eye className="size-4" />
                        <span className="font-medium">Preview Mode</span>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                      <article
                        style={{
                          fontFamily:
                            "Charter, Georgia, 'Times New Roman', serif",
                          lineHeight: 1.7,
                        }}
                        className="formatted-content prose prose-slate max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: currentChapter.content
                            ? formatMarkdown(currentChapter.content)
                            : "<p class='text-slate-400 italic text-center py-12'>No content yet. Start typing to see preview here.</p>",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-full">
                    <SimpleMDEditor
                      value={currentChapter.content || ""}
                      onChange={(value) => onEditChapter("content", value)}
                      options={mdEditorOptions}
                    />
                  </div>
                )}
              </div>

              {/* Status bar */}
              <footer className="text-slate-500 text-xs sm:text-sm border-t border-slate-100 pt-3 sm:pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 shrink-0">
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                  <span className="flex items-center gap-1">
                    <span className="font-medium text-slate-600">Words:</span>
                    <span className="text-slate-900 font-semibold">
                      {currentChapter.content
                        ? currentChapter.content
                            .split(/\s+/)
                            .filter((word) => word.length > 0).length
                        : 0}
                    </span>
                  </span>

                  <span className="flex items-center gap-1">
                    <span className="font-medium text-slate-600">
                      Characters:
                    </span>
                    <span className="text-slate-900 font-semibold">
                      {currentChapter.content
                        ? currentChapter.content.length
                        : 0}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="size-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-slate-600 font-medium">Auto-saved</span>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

export default ChapterEditorTab;
