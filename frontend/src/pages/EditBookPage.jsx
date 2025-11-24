import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import { API_ENDPOINTS } from "../utils/api-endpoints";
import {
  ChevronDown,
  Edit,
  FileCode,
  FileDown,
  FileText,
  Menu,
  NotebookText,
  Save,
  X,
} from "lucide-react";
import {
  BookDetailsTab,
  Button,
  ChapterEditorTab,
  ChaptersSidebar,
  Dropdown,
  DropdownItem,
} from "../components";
import { arrayMove } from "@dnd-kit/sortable";

function EditBookPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [book, setBook] = useState(null);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("editor"); // "editor" | "details"
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { bookId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Fetch book on mount
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await axiosInstance.get(
          `${API_ENDPOINTS.BOOKS.GET_BY_ID}/${bookId}`
        );
        setBook(data.book);
      } catch (error) {
        console.error("Error fetching book:", error);
        toast.error("Failed to fetch book details!", { duration: 5000 });
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [bookId, navigate]);

  const handleEditBook = (event) => {
    const { name, value } = event.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddChapter = () => {
    const newChapter = {
      title: `Chapter ${book.chapters.length + 1}`,
      content: "",
    };
    const updatedChapters = [...book.chapters, newChapter];
    setBook((prev) => ({ ...prev, chapters: updatedChapters }));
    setSelectedChapterIndex(updatedChapters.length - 1);
  };

  const handleEditChapter = (name, value) => {
    const updatedChapters = [...book.chapters];
    updatedChapters[selectedChapterIndex][name] = value;
    setBook((prev) => ({ ...prev, chapters: updatedChapters }));
  };

  const handleDeleteChapter = (index) => {
    if (book.chapters.length <= 1) {
      toast.error("A book must have at least one chapter!");
      return;
    }

    const updatedChapters = book.chapters.filter((_, i) => i !== index);
    setBook((prev) => ({ ...prev, chapters: updatedChapters }));
    setSelectedChapterIndex((prevIndex) =>
      prevIndex >= index ? Math.max(0, prevIndex - 1) : prevIndex
    );
  };

  const handleReorderChapters = (oldIndex, newIndex) => {
    setBook((prev) => ({
      ...prev,
      chapters: arrayMove(prev.chapters, oldIndex, newIndex),
    }));
    setSelectedChapterIndex(newIndex);
  };

  const handleSaveChanges = async (bookToSave = book, showToast = true) => {
    setIsSaving(true);

    try {
      await axiosInstance.put(
        `${API_ENDPOINTS.BOOKS.UPDATE_CONTENT}/${bookId}`,
        bookToSave
      );

      if (showToast) {
        toast.success("Changes saved successfully!");
      }
    } catch (error) {
      console.error("Error saving chapter content:", error);
      toast.error("Failed to save changes! Please try again.", {
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCoverImgUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      toast.error("Please select an image file first.");
      return;
    }

    const formData = new FormData();
    formData.append("coverImage", file);
    setIsUploading(true);

    try {
      const { data } = await axiosInstance.put(
        `${API_ENDPOINTS.BOOKS.UPDATE_COVER}/${bookId}/cover`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setBook(data.book);
      toast.success("Cover image updated successfully!");
    } catch (error) {
      console.error("Error uploading cover image:", error);
      toast.error("Failed to upload cover image! Please try again.", {
        duration: 5000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateChapterContent = async (index) => {
    const chapter = book.chapters[index];

    if (!chapter || !chapter.title) {
      toast.error("Chapter title is required to generate content!");
      return;
    }

    setIsGenerating(true);
    const loadingToast = toast.loading("Generating content... Please wait!");

    try {
      const {
        data: { content },
      } = await axiosInstance.post(API_ENDPOINTS.AI.GENERATE_CHAPTER_CONTENT, {
        chapterTitle: chapter.title,
        chapterDescription: chapter.description || "",
        style: "Informative",
      });

      const updatedChapters = [...book.chapters];
      updatedChapters[index].content = content;
      const updatedBook = { ...book, chapters: updatedChapters };

      setBook(updatedBook);

      toast.dismiss(loadingToast);
      toast.success(`Content generated for "${chapter.title}"`, {
        duration: 3000,
      });

      await handleSaveChanges(updatedBook, false);
    } catch (error) {
      console.error("Error generating chapter content:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to generate chapter content.", { duration: 5000 });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = async () => {
    const loadingToast = toast.loading("Generating PDF...");

    try {
      const { data } = await axiosInstance.get(
        `${API_ENDPOINTS.EXPORTS.PDF}/${bookId}/pdf`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([data]));
      const linkEl = document.createElement("a");
      linkEl.href = url;
      linkEl.setAttribute("download", `${book.title}.pdf`);
      document.body.appendChild(linkEl);
      linkEl.click();
      linkEl.parentNode.removeChild(linkEl);
      window.URL.revokeObjectURL(url);

      toast.dismiss(loadingToast);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to export PDF!");
    }
  };

  const handleExportDocx = async () => {
    const loadingToast = toast.loading("Generating document...");

    try {
      const { data } = await axiosInstance.get(
        `${API_ENDPOINTS.EXPORTS.DOCX}/${bookId}/docx`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([data]));
      const linkEl = document.createElement("a");
      linkEl.href = url;
      linkEl.setAttribute("download", `${book.title}.docx`);
      document.body.appendChild(linkEl);
      linkEl.click();
      linkEl.parentNode.removeChild(linkEl);
      window.URL.revokeObjectURL(url);

      toast.dismiss(loadingToast);
      toast.success("Document downloaded successfully!");
    } catch (error) {
      console.error("Error exporting docx:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to export document!");
    }
  };

  if (isLoading || !book) {
    return (
      <main className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="size-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 text-sm">Loading Editor...</p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-display flex relative">
      {/* Mobile sidebar */}
      {isSidebarOpen && (
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Chapter navigation"
          className="flex fixed inset-0 z-40 md:hidden"
        >
          <div
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
            className="bg-black/20 backdrop-blur-sm fixed inset-0"
          />

          <nav className="flex-1 w-full max-w-xs bg-white flex flex-col relative">
            <div className="pt-2 -mr-12 absolute top-0 right-0">
              <button
                type="button"
                aria-label="Close sidebar"
                onClick={() => setIsSidebarOpen(false)}
                className="size-10 rounded-full ml-1 flex justify-center items-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white hover:bg-white/10 transition-colors"
              >
                <X className="size-6 text-white" />
              </button>
            </div>

            <ChaptersSidebar
              book={book}
              selectedChapterIndex={selectedChapterIndex}
              onSelectChapter={(index) => {
                setSelectedChapterIndex(index);
                setIsSidebarOpen(false);
              }}
              onAddChapter={handleAddChapter}
              onDeleteChapter={handleDeleteChapter}
              isGenerating={isGenerating}
              onGenerateChapterContent={handleGenerateChapterContent}
              onReorderChapters={handleReorderChapters}
            />
          </nav>

          <div aria-hidden="true" className="shrink-0 w-14" />
        </aside>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:shrink-0 h-screen sticky top-0">
        <ChaptersSidebar
          book={book}
          selectedChapterIndex={selectedChapterIndex}
          onSelectChapter={(index) => {
            setSelectedChapterIndex(index);
            setIsSidebarOpen(false);
          }}
          onAddChapter={handleAddChapter}
          onDeleteChapter={handleDeleteChapter}
          isGenerating={isGenerating}
          onGenerateChapterContent={handleGenerateChapterContent}
          onReorderChapters={handleReorderChapters}
        />
      </aside>

      <main className="flex-1 h-full flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-3 sm:p-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
              className="md:hidden text-slate-500 p-2 rounded-lg transition-colors duration-200 hover:text-slate-800 hover:bg-slate-100 focus-visible:text-slate-800 focus-visible:bg-slate-100"
            >
              <Menu className="size-6" />
            </button>

            {/* Tab switcher */}
            <nav className="hidden sm:flex items-center gap-x-1 bg-slate-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setActiveTab("editor")}
                className={`flex-1 ${
                  activeTab === "editor"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 focus-visible:text-slate-700"
                } text-sm font-medium rounded-md px-3 sm:px-4 py-2 flex justify-center items-center gap-2 transition-all duration-200`}
              >
                <Edit className="size-4" />
                <span className="hidden sm:inline">Editor</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`flex-1 ${
                  activeTab === "details"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 focus-visible:text-slate-700"
                } text-sm font-medium whitespace-nowrap rounded-md px-3 sm:px-4 py-2 flex justify-center items-center gap-2 transition-all duration-200`}
              >
                <NotebookText className="size-4" />
                <span className="hidden sm:inline">Details</span>
              </button>
            </nav>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Dropdown
              trigger={
                <Button
                  type="button"
                  variant="secondary"
                  icon={FileDown}
                  size="sm"
                >
                  <span className="hidden sm:inline-flex items-center gap-1">
                    Export
                    <ChevronDown className="size-4" />
                  </span>

                  <span className="sm:hidden">
                    <ChevronDown className="size-4" />
                  </span>
                </Button>
              }
            >
              <DropdownItem onClick={handleExportPDF}>
                <FileText className="text-slate-500 size-4" />
                Export as PDF
              </DropdownItem>

              <DropdownItem onClick={handleExportDocx}>
                <FileCode className="text-slate-500 size-4" />
                Export as Docx
              </DropdownItem>
            </Dropdown>

            <Button
              type="button"
              isLoading={isSaving}
              onClick={() => handleSaveChanges()}
              icon={Save}
              size="sm"
            >
              Save
            </Button>
          </div>
        </header>

        {/* Content area */}
        <section className="w-full flex-1 overflow-hidden">
          {activeTab === "editor" ? (
            <ChapterEditorTab
              book={book}
              selectedChapterIndex={selectedChapterIndex}
              onEditChapter={handleEditChapter}
              isGenerating={isGenerating}
              onGeneratingChapterContent={handleGenerateChapterContent}
            />
          ) : (
            <BookDetailsTab
              book={book}
              onEditBook={handleEditBook}
              fileInputRef={fileInputRef}
              isUploading={isUploading}
              onCoverImageUpload={handleCoverImgUpload}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default EditBookPage;
