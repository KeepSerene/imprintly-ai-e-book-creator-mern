import { BookOpen, ChevronLeft } from "lucide-react";

function BookViewSidebar({
  isOpen,
  book,
  selectedChapterIndex,
  onSelectChapter,
  onClose,
}) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="bg-black/20 backdrop-blur-sm fixed inset-0 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-80 h-full bg-white border-r border-gray-100 fixed lg:relative left-0 top-0 transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="border-b border-gray-100 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <BookOpen className="size-5 text-violet-600" />
              <span className="text-gray-900 font-medium">Chapters</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close sidebar"
              title="Close sidebar"
              className="lg:hidden rounded-full p-1 transition-colors duration-150 hover:bg-gray-100 focus-visible:bg-gray-100"
            >
              <ChevronLeft className="size-4" />
            </button>
          </div>
        </div>

        <ul className="h-full pb-20 overflow-y-auto">
          {book.chapters.map((chapter, index) => (
            <li key={index} className="border-b last:border-b-0 border-gray-50">
              <button
                type="button"
                onClick={() => {
                  onSelectChapter(index);
                  onClose();
                }}
                className={`w-full text-left p-4 flex flex-col gap-1 hover:bg-gray-50 transition-colors duration-200 ${
                  selectedChapterIndex === index
                    ? "bg-violet-50 border-l-4 border-l-violet-600 rounded-l-lg"
                    : ""
                }`}
              >
                <span
                  title={chapter.title}
                  className={`text-sm font-medium truncate ${
                    selectedChapterIndex === index
                      ? "text-violet-900"
                      : "text-gray-900"
                  }`}
                >
                  {chapter.title}
                </span>

                <span className="text-gray-500 text-xs">
                  Chapter {index + 1}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}

export default BookViewSidebar;
