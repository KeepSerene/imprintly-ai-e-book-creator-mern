import { Type } from "lucide-react";
import { useMemo, useState } from "react";

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
  onChapterChange = () => {},
  isGenerating,
  onGeneratingChapterContent = () => {},
}) {
  const [isInPreviewMode, setIsInPreviewMode] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const formatMarkdown = (content) => {
    return (
      content
        // Headings
        .replace(
          /^### (.*$)/gm,
          "<h3 class='text-xl font-bold mt-6 mb-4'>$1</h3>"
        )
        .replace(
          /^## (.*$)/gm,
          "<h2 class='text-2xl font-bold mt-8 mb-4'>$1</h2>"
        )
        .replace(
          /^# (.*$)/gm,
          "<h1 class='text-3xl font-bold mt-8 mb-6'>$1</h1>"
        )
        // Bold and italic
        .replace(/\*\*(.*?)\*\*/g, "<strong class='font-semibold'>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em class='italic'>$1</em>")
        // Blockquote
        .replace(
          /^> (.*$)/gm,
          "<blockquote class='text-gray-700 italic border-l-4 border-violet-500 pl-4 my-4'>$1</blockquote>"
        )
        // Unordered list
        .replace(/^\- (.*$)/gm, "<li class='list-disc ml-4 mb-1'>$1</li>")
        .replace(
          /(<li class="list-disc ml-4 mb-1">.*<\/li>)/gs,
          "<ul class='my-4'>$1</ul>"
        )
        // Ordered list
        .replace(/^\d+\. (.*$)/gm, "<li class='list-decimal ml-4 mb-1'>$1</li>")
        .replace(
          /(<li class="list-decimal ml-4 mb-1">.*<\/li>)/gs,
          "<ol class='my-4 ml-4'>$1</ol>"
        )
        // Paragraph
        .split("\n\n")
        .map((paragraph) => {
          paragraph = paragraph.trim();

          if (!paragraph) return "";

          if (paragraph.startsWith("<p")) return paragraph;

          return `<p class="text-justify mb-4">${paragraph}</p>`;
        })
        .join("")
    );
  };

  const mdeOptions = useMemo(
    () => ({
      autoFocus: true,
      spellChecker: false,
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
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

  if (selectedChapterIndex === null || !book.chapters[selectedChapterIndex]) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="text-center">
          <div className="size-16 bg-gray-100 rounded-full mx-auto mb-4 flex justify-center items-center">
            <Type className="size-8 text-gray-400" />
          </div>

          <p className="text-gray-500 text-lg">
            Select a chapter to start editing
          </p>

          <p className="text-gray-400 text-sm mt-1">
            Choose from the sidebar to begin writing
          </p>
        </div>
      </div>
    );
  }

  const currentChapter = book.chapters[selectedChapterIndex];

  return (
    <div
      className={`${
        isFullScreen ? "bg-white fixed inset-0 z-50" : "flex-1"
      } flex flex-col`}
    >
      {/* Header */}
      <header>
        <div>
          <div>
            <div>
              <h1>Editor</h1>
              <p>
                Editing{" "}
                {currentChapter.title || `Chapter ${selectedChapterIndex + 1}`}
              </p>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default ChapterEditorTab;
