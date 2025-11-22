import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import {
  ArrowLeft,
  BookOpen,
  Hash,
  Lightbulb,
  Palette,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import Select from "./ui/Select";
import { WRITING_STYLES } from "../utils/constants";
import Button from "./ui/Button";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import { API_ENDPOINTS } from "../utils/api-endpoints";

function CreateBookModal({ isOpen, onClose, onBookCreate }) {
  const [step, setStep] = useState(1);
  const [bookTitle, setBookTitle] = useState("");
  const [chapterCount, setChapterCount] = useState(5);
  const [chapters, setChapters] = useState([]);
  const [topic, setTopic] = useState("");
  const [writingStyle, setWritingStyle] = useState(WRITING_STYLES[0]);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [isFinalisingBook, setIsFinalisingBook] = useState(false);

  const chaptersContainerRef = useRef(null);

  const { user } = useAuthContext();

  const resetModal = () => {
    setStep(1);
    setBookTitle("");
    setChapterCount(5);
    setChapters([]);
    setTopic("");
    setWritingStyle(WRITING_STYLES[0]);
    setIsGeneratingOutline(false);
    setIsFinalisingBook(false);
  };

  const handleGenerateOutline = async () => {
    const validChapterCount =
      typeof chapterCount === "string" ? parseInt(chapterCount) : chapterCount;

    if (!bookTitle || !validChapterCount || validChapterCount < 1) {
      toast.error("Book title and a valid number of chapters are required!", {
        duration: 5000,
      });

      return;
    }

    setIsGeneratingOutline(true);

    try {
      const {
        data: { outline },
      } = await axiosInstance.post(API_ENDPOINTS.AI.GENERATE_OUTLINE, {
        topic: bookTitle,
        description: topic || "",
        style: writingStyle,
        chapterCount: validChapterCount,
      });
      setChapters(outline);
      setStep(2);
      toast.success("Outline generated! Review and edit chapters if needed.");
    } catch (error) {
      console.error("Error generating book outline:", error);
      toast.error(
        error.response?.data?.message || "Failed to generate book outline."
      );
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  const handleAddChapter = () => {
    setChapters((prev) => [
      ...prev,
      {
        title: `Chapter ${prev.length + 1}`,
        description: "",
      },
    ]);
  };

  const handleEditChapter = (index, field, value) => {
    const updatedChapters = [...chapters];
    updatedChapters[index][field] = value;
    setChapters(updatedChapters);
  };

  const handleDeleteChapter = (index) => {
    if (chapters.length <= 1) return;

    setChapters((prev) => [...prev].filter((_, i) => i !== index));
  };

  const handleFinaliseBook = async () => {
    if (chapters.length === 0) {
      toast.error("At least one chapter is required!", { duration: 5000 });

      return;
    }

    setIsFinalisingBook(true);

    try {
      const {
        data: { book },
      } = await axiosInstance.post(API_ENDPOINTS.BOOKS.CREATE, {
        title: bookTitle,
        author: user?.name || "Unknown Author",
        chapters,
      });
      toast.success("eBook created successfully!");
      onBookCreate(book._id);
      onClose();
      resetModal();
    } catch (error) {
      console.error("Error while creating eBook:", error);
      toast.error(error.response?.data?.message || "Failed to create eBook!");
    } finally {
      setIsFinalisingBook(false);
    }
  };

  useEffect(() => {
    if (step === 2 && chaptersContainerRef.current) {
      const scrollableDiv = chaptersContainerRef.current;
      scrollableDiv.scrollTo({
        top: scrollableDiv.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [step, chapters.length]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        resetModal();
      }}
      title="Create New eBook"
    >
      {step === 1 && (
        <div className="space-y-4 md:space-y-5">
          {/* Progress indicator */}
          <ol className="flex items-center gap-2 mb-4 md:mb-6">
            <li
              aria-label="Step 1"
              className="size-7 md:size-8 bg-violet-100 text-violet-600 text-xs md:text-sm font-semibold rounded-full flex justify-center items-center"
            >
              1
            </li>

            <div className="flex-1 h-0.5 bg-gray-200" />

            <li
              aria-label="Step 2"
              className="size-7 md:size-8 bg-gray-100 text-gray-400 text-xs md:text-sm font-semibold rounded-full flex justify-center items-center"
            >
              2
            </li>
          </ol>

          {/* Form inputs */}
          <Input
            type="text"
            value={bookTitle}
            onChange={(event) => setBookTitle(event.target.value)}
            icon={BookOpen}
            label="Book Title"
            required
            placeholder="What should we call your eBook?"
          />

          <Input
            type="number"
            value={chapterCount}
            onChange={(event) => {
              const value = event.target.value;

              if (value === "") {
                setChapterCount("");

                return;
              }

              // parse and clamp between 1-20
              const parsed = parseInt(value);

              if (!isNaN(parsed)) {
                setChapterCount(Math.max(1, Math.min(20, parsed)));
              }
            }}
            onBlur={(event) => {
              // ensure we have a valid number
              const value = event.target.value;

              if (value === "" || isNaN(parseInt(value))) {
                setChapterCount(5);
              }
            }}
            icon={Hash}
            label="Number of Chapters"
            min="1"
            max="20"
            step="1"
            placeholder="5"
          />

          <Input
            type="text"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            icon={Lightbulb}
            label="Topic (Optional)"
            placeholder="Specific topic for AI generation"
          />

          <Select
            value={writingStyle}
            onChange={(event) => setWritingStyle(event.target.value)}
            options={WRITING_STYLES}
            icon={Palette}
            label="Writing Style"
          />

          {/* Action button */}
          <div className="pt-3 md:pt-4 flex justify-end">
            <Button
              type="button"
              onClick={handleGenerateOutline}
              isLoading={isGeneratingOutline}
              icon={Sparkles}
            >
              Generate Outline with AI
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 md:space-y-5">
          {/* Progress indicator */}
          <ol className="mb-4 md:mb-6 flex items-center gap-2">
            <li
              aria-label="Step 1 completed"
              className="size-7 md:size-8 bg-violet-100 text-violet-600 text-xs md:text-sm font-semibold rounded-full flex justify-center items-center"
            >
              &#10003;
            </li>

            <div className="flex-1 h-0.5 bg-violet-600" />

            <li
              aria-label="Step 2"
              className="size-7 md:size-8 bg-violet-100 text-violet-600 text-xs md:text-sm font-semibold rounded-full flex justify-center items-center"
            >
              2
            </li>
          </ol>

          {/* Chapter review header */}
          <section className="mb-3 md:mb-4 flex justify-between items-center">
            <h3 className="text-gray-900 text-base md:text-lg font-semibold">
              Review Chapters
            </h3>

            <span className="text-gray-500 text-xs md:text-sm">
              {chapters.length} {chapters.length === 1 ? "chapter" : "chapters"}
            </span>
          </section>

          {/* Chapters list */}
          <div
            ref={chaptersContainerRef}
            className="space-y-3 max-h-80 md:max-h-96 overflow-y-auto pr-1"
          >
            {chapters.length === 0 ? (
              <div className="bg-gray-50 text-center rounded-xl px-4 py-10 md:py-12">
                <BookOpen className="size-10 md:size-12 text-gray-300 mx-auto mb-3" />

                <p className="text-gray-500 text-xs md:text-sm">
                  No chapters yet! Add one to start...
                </p>
              </div>
            ) : (
              chapters.map(({ title, description }, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-sm focus-within:border-gray-300 focus-within:shadow-sm group"
                >
                  <div className="mb-2 md:mb-3 flex items-start gap-2 md:gap-3">
                    <div className="shrink-0 size-5 md:size-6 bg-violet-50 text-violet-600 text-xs font-semibold rounded-full mt-1 flex justify-center items-center">
                      {index + 1}
                    </div>

                    {/* Chapter title input */}
                    <input
                      type="text"
                      value={title}
                      onChange={(event) =>
                        handleEditChapter(index, "title", event.target.value)
                      }
                      placeholder="Chapter Title"
                      className="flex-1 bg-transparent text-gray-900 text-sm md:text-base font-medium border-none focus:outline-none focus:ring-0 p-0"
                    />

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteChapter(index)}
                      aria-label="Delete chapter"
                      title="Delete chapter"
                      disabled={chapters.length === 1}
                      className="opacity-0 rounded-lg p-1 md:p-1.5 transition-all duration-200 disabled:opacity-0 disabled:cursor-not-allowed group-hover:opacity-100 group-hover:bg-red-50 group-focus-within:opacity-100 group-focus-within:bg-red-50 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    >
                      <Trash2 className="size-3.5 md:size-4 text-red-500" />
                    </button>
                  </div>

                  {/* Chapter description textarea */}
                  <textarea
                    value={description}
                    onChange={(event) =>
                      handleEditChapter(
                        index,
                        "description",
                        event.target.value
                      )
                    }
                    rows={2}
                    placeholder="Brief description of what this chapter covers..."
                    className="w-full bg-transparent text-gray-600 text-xs md:text-sm placeholder-gray-400 border-none resize-none focus:outline-none focus:ring-0 p-0"
                  />
                </div>
              ))
            )}
          </div>

          {/* Action buttons */}
          <div className="border-t border-gray-100 pt-3 md:pt-4 flex flex-wrap justify-between items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => setStep(1)}
              icon={ArrowLeft}
              ariaLabel="Go back to step 1"
            >
              Back
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={handleAddChapter}
                icon={Plus}
              >
                Add Chapter
              </Button>

              <Button onClick={handleFinaliseBook} isLoading={isFinalisingBook}>
                Create eBook
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default CreateBookModal;
