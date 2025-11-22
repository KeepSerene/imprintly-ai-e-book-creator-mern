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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: chapter._id || `new-${index}` });

  const styles = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={styles}
      className="bg-white rounded-lg shadow-sm overflow-hidden flex items-center gap-2 transition-shadow duration-200 hover:shadow-md focus-within:shadow-md relative group"
    >
      <button
        type="button"
        onClick={() => onSelectChapter(index)}
        title={chapter.title}
        className={`flex-1 text-sm text-left rounded-l-lg p-3 flex items-center gap-2 transition-colors duration-200 ${
          selectedChapterIndex === index
            ? "bg-violet-50/50 text-violet-800 font-semibold"
            : "text-slate-600 hover:bg-slate-100 focus-visible:bg-slate-100"
        }`}
      >
        <GripVertical
          className="shrink-0 size-4 text-slate-400 cursor-grab"
          {...listeners}
          {...attributes}
        />
        <span className="max-w-[200px] truncate">{chapter.title}</span>
      </button>

      <div className="bg-white px-2 py-3 opacity-0 flex items-center gap-2 absolute right-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onGenerateChapterContent(index)}
          isLoading={isGenerating}
          icon={Sparkles}
          ariaLabel="Generate chapter content with AI"
          title="Generate Chapter Content with AI"
          className="px-2 py-2 text-violet-800"
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onDeleteChapter(index)}
          icon={Trash2}
          ariaLabel="Delete chapter"
          title="Delete Chapter"
          className="px-2 py-2 text-red-500"
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

    if (active.id !== over.id) {
      const oldIndex = chapterIds.indexOf(active.id);
      const newIndex = chapterIds.indexOf(over.id);
      onReorderChapters(oldIndex, newIndex);
    }
  };

  return (
    <aside className="w-80 h-full bg-white border-r border-slate-200 flex flex-col">
      <header className="border-b border-slate-200 p-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard")}
          icon={ArrowLeft}
        >
          Back to Dashboard
        </Button>

        <h2
          title={book.title}
          className="max-w-[250px] text-slate-800 text-base font-semibold truncate mt-4"
        >
          {book.title}
        </h2>
      </header>

      <div className="flex-1 overflow-y-auto">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={chapterIds}
            strategy={verticalListSortingStrategy}
          >
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
          </SortableContext>
        </DndContext>
      </div>

      <div className="border-t border-slate-200 p-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onAddChapter}
          icon={Plus}
          className="w-full"
        >
          New Chapter
        </Button>
      </div>
    </aside>
  );
}

export default ChaptersSidebar;
