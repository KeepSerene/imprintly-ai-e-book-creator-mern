import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { WRITING_STYLES } from "../utils/constants";
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

function EditBookPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [book, setBook] = useState(null);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("editor"); // "editor" | "details"
  const [isUploading, setIsUploading] = useState(false);
  const [isOutlineModalOpen, setIsOutlineModalOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [writingStyle, setWritingStyle] = useState(WRITING_STYLES[0]);
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
  }, []);

  const handleBookChange = (event) => {
    const { name, value } = event.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddChapter = () => {};

  const handleChapterChange = () => {};

  const handleDeleteChapter = (index) => {};

  const handleReorderChapters = (oldIndex, newIndex) => {};

  const handleSaveChanges = async (bookToSave = book, showToast = true) => {};

  const handleCoverImgUpload = async () => {};

  const handleGenerateOutline = async () => {};

  const handleGenerateChapterContent = async (index) => {};

  const handleExportPDF = async () => {};

  const handleExportDocx = async () => {};

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
    <>
      <div className="min-h-screen bg-slate-50 font-display flex relative">
        {/* Mobile sidebar */}
        {isSidebarOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="flex fixed inset-0 z-40 md:hidden"
          >
            <div
              onClick={() => setIsSidebarOpen(false)}
              aria-hidden="true"
              className="bg-black/20 backdrop-blur-sm fixed inset-0"
            />

            <div className="flex-1 w-full max-w-xs bg-white flex flex-col relative">
              <div className="pt-2 -mr-12 absolute top-0 right-0">
                <button
                  type="button"
                  aria-label="Close sidebar"
                  onClick={() => setIsSidebarOpen(false)}
                  className="size-10 rounded-full ml-1 flex justify-center items-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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
            </div>

            <div aria-hidden="true" className="shrink-0 w-14" />
          </div>
        )}

        {/* Desktop sidebar */}
        <div className="hidden md:flex md:shrink-0 h-screen sticky top-0">
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
        </div>

        <main className="flex-1 h-full flex flex-col">
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-3 flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open sidebar"
                className="md:hidden text-slate-500 p-2 transition-colors duration-200 hover:text-slate-800 focus-visible:text-slate-800"
              >
                <Menu className="size-6" />
              </button>

              <div className="hidden sm:flex items-center gap-x-1 bg-slate-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("editor")}
                  className={`flex-1 ${
                    activeTab === "editor"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700 focus-visible:text-slate-700"
                  } text-sm font-medium rounded-md px-4 py-2 flex justify-center items-center gap-2 transition-colors duration-200`}
                >
                  <Edit className="size-4" />
                  <span>Editor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("details")}
                  className={`flex-1 ${
                    activeTab === "details"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700 focus-visible:text-slate-700"
                  } text-sm font-medium whitespace-nowrap rounded-md px-4 py-2 flex justify-center items-center gap-2 transition-colors duration-200`}
                >
                  <NotebookText className="size-4" />
                  <span>Book Details</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <Dropdown
                trigger={
                  <Button type="button" variant="secondary" icon={FileDown}>
                    <span className="inline-flex items-center gap-1">
                      Export
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
                onClick={handleSaveChanges}
                icon={Save}
              >
                Save Changes
              </Button>
            </div>
          </header>

          {/* Editor tab */}
          <div className="w-full">
            {activeTab === "editor" ? (
              <ChapterEditorTab
                book={book}
                selectedChapterIndex={selectedChapterIndex}
                onChapterChange={handleChapterChange}
                isGenerating={isGenerating}
                onGeneratingChapterContent={handleGenerateChapterContent}
              />
            ) : (
              <BookDetailsTab
                book={book}
                onBookChange={handleBookChange}
                fileInputRef={fileInputRef}
                isUploading={isUploading}
                onCoverImageUpload={handleCoverImgUpload}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default EditBookPage;
