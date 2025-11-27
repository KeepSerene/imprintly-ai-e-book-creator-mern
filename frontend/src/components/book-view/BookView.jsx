import { useState } from "react";
import BookViewSidebar from "./BookViewSidebar";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { formatMdContent } from "../../utils/helpers";

function BookView({ book }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState(18);

  if (!book.chapters || book.chapters.length === 0) {
    return (
      <main className="h-[calc(100vh-64px)] bg-white flex items-center justify-center">
        <p className="text-gray-500">No chapters available.</p>
      </main>
    );
  }

  const selectedChapter = book.chapters[selectedChapterIndex];

  return (
    <div className="h-[calc(100vh-64px)] bg-white text-gray-900 flex">
      {/* Sidebar */}
      <BookViewSidebar
        isOpen={isSidebarOpen}
        book={book}
        selectedChapterIndex={selectedChapterIndex}
        onSelectChapter={setSelectedChapterIndex}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-gray-100 p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
              className="lg:hidden rounded-lg p-2 transition-colors duration-200 hover:bg-gray-100 focus-visible:bg-gray-100"
            >
              <Menu className="size-5" />
            </button>

            <div>
              <h1 className="text-base md:text-lg font-semibold truncate">
                {book.title}
              </h1>

              <p className="text-gray-500 text-sm">by {book.author}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Font side controls */}
            <div className="mr-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                aria-label="Reduce font size"
                title="Reduce font size"
                className="font-bold text-sm rounded-lg p-2 transition-colors duration-200 hover:bg-gray-100 focus-visible:bg-gray-100"
              >
                A-
              </button>

              <span className="text-gray-500 text-sm">{fontSize}px</span>

              <button
                type="button"
                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                aria-label="Increase font size"
                title="Increase font size"
                className="font-bold text-lg rounded-lg p-2 transition-colors duration-200 hover:bg-gray-100 focus-visible:bg-gray-100"
              >
                A+
              </button>
            </div>
          </div>
        </header>

        {/* Reading area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl px-6 py-4 mx-auto">
            <div
              style={{
                fontFamily: "Charter, Georgia, 'Times New Roman', serif",
                fontSize,
                lineHeight: 1.7,
              }}
              className="reading-content"
              dangerouslySetInnerHTML={{
                __html: formatMdContent(selectedChapter.content),
              }}
            />

            {/* Navigation */}
            <footer className="border-t border-gray-200 pt-8 mt-16 flex justify-between items-center">
              <button
                type="button"
                onClick={() =>
                  setSelectedChapterIndex(Math.max(0, selectedChapterIndex - 1))
                }
                disabled={selectedChapterIndex === 0}
                className="bg-gray-100 rounded-lg px-4 py-2 inline-flex items-center gap-2 transition-colors duration-150 hover:bg-gray-200 focus-visible:bg-gray-200 disabled:opacity-50"
              >
                <ChevronLeft className="size-4" />
                <span>Previous Chapter</span>
              </button>

              <span className="text-gray-500 text-sm">
                {selectedChapterIndex + 1} of {book.chapters.length}
              </span>

              <button
                type="button"
                onClick={() =>
                  setSelectedChapterIndex(
                    Math.min(selectedChapterIndex + 1, book.chapters.length - 1)
                  )
                }
                disabled={selectedChapterIndex === book.chapters.length - 1}
                className="bg-gray-100 rounded-lg px-4 py-2 inline-flex items-center gap-2 transition-colors duration-150 hover:bg-gray-200 focus-visible:bg-gray-200 disabled:opacity-50"
              >
                <span>Next Chapter</span>
                <ChevronRight className="size-4" />
              </button>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BookView;
