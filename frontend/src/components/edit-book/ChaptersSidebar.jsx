import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useNavigate } from "react-router";
import Button from "../ui/Button";
import { ArrowLeft, GripVertical, Plus, Sparkles, Trash2 } from "lucide-react";

function SortableItem({
  chapter,
  index,
  selectedChapterIndex,
  onSelectChapter,
  onDeleteChapter,
  isGenerating,
  onGenerateChapterContent,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chapter._id || `new-${index}` });

  const styles = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : "auto",
  };

  return (
    <li
      ref={setNodeRef}
      style={styles}
      className={`bg-white rounded-lg shadow-sm overflow-hidden flex items-center gap-2 transition-all duration-200 hover:shadow-md focus-within:shadow-md relative group ${
        isDragging ? "ring-2 ring-violet-400" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => onSelectChapter(index)}
        title={chapter.title}
        className={`flex-1 text-sm text-left rounded-l-lg p-3 flex items-center gap-2 transition-colors duration-200 ${
          selectedChapterIndex === index
            ? "bg-violet-50 text-violet-800 font-semibold border-l-4 border-violet-600"
            : "text-slate-600 hover:bg-slate-50 focus-visible:bg-slate-50"
        }`}
      >
        {/* Drag handle */}
        <span
          className="shrink-0 cursor-grab active:cursor-grabbing hover:text-slate-600 transition-colors"
          {...listeners}
          {...attributes}
        >
          <GripVertical className="size-4 text-slate-400" />
        </span>

        <span className="flex-1 max-w-[200px] truncate">{chapter.title}</span>
      </button>

      {/* Action buttons */}
      <div className="bg-white px-2 py-3 opacity-0 flex items-center gap-1 absolute right-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 shadow-lg rounded-l">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onGenerateChapterContent(index);
          }}
          isLoading={isGenerating}
          icon={Sparkles}
          ariaLabel="Generate chapter content with AI"
          title="Generate Chapter Content with AI"
          className="px-2 py-2 text-violet-600 hover:text-violet-700 hover:bg-violet-50"
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteChapter(index);
          }}
          icon={Trash2}
          ariaLabel="Delete chapter"
          title="Delete Chapter"
          className="px-2 py-2 text-red-500 hover:text-red-600 hover:bg-red-50"
        />
      </div>
    </li>
  );
}

function ChaptersSidebar({
  book,
  selectedChapterIndex,
  onSelectChapter,
  onAddChapter,
  onDeleteChapter,
  isGenerating,
  onGenerateChapterContent,
  onReorderChapters,
}) {
  const navigate = useNavigate();

  const chapterIds =
    book?.chapters?.map((chapter, index) => chapter?._id || `new-${index}`) ||
    [];

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = chapterIds.indexOf(active.id);
      const newIndex = chapterIds.indexOf(over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorderChapters(oldIndex, newIndex);
      }
    }
  };

  return (
    <aside className="w-full md:w-80 h-full bg-white border-r border-slate-200 flex flex-col shadow-sm">
      {/* Header */}
      <header className="border-b border-slate-200 p-4 bg-slate-50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard")}
          icon={ArrowLeft}
          className="hover:bg-slate-100"
        >
          Back to Dashboard
        </Button>

        <div className="mt-4">
          <h2
            title={book.title}
            className="text-slate-800 text-base font-semibold truncate"
          >
            {book.title}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {book.chapters.length}{" "}
            {book.chapters.length === 1 ? "chapter" : "chapters"}
          </p>
        </div>
      </header>

      {/* Chapters list */}
      <nav className="flex-1 overflow-y-auto">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={chapterIds}
            strategy={verticalListSortingStrategy}
          >
            {book.chapters.length > 0 ? (
              <ul className="space-y-2 p-4">
                {book.chapters.map((chapter, index) => (
                  <SortableItem
                    key={chapter._id ?? `new-${index}`}
                    chapter={chapter}
                    index={index}
                    selectedChapterIndex={selectedChapterIndex}
                    onSelectChapter={onSelectChapter}
                    onDeleteChapter={onDeleteChapter}
                    isGenerating={isGenerating}
                    onGenerateChapterContent={onGenerateChapterContent}
                  />
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center">
                <p className="text-slate-400 text-sm">
                  No chapters yet. Add your first chapter to get started!
                </p>
              </div>
            )}
          </SortableContext>
        </DndContext>
      </nav>

      <footer className="border-t border-slate-200 p-4 bg-slate-50">
        <Button
          type="button"
          variant="secondary"
          onClick={onAddChapter}
          icon={Plus}
          className="w-full shadow-sm hover:shadow transition-shadow"
        >
          New Chapter
        </Button>
      </footer>
    </aside>
  );
}

export default ChaptersSidebar;
