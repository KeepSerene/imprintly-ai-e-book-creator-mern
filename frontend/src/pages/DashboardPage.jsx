import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "../lib/axios";
import { API_ENDPOINTS } from "../utils/api-endpoints";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import { BookCard, Button, CreateBookModal } from "../components";
import { Book, BookPlus, PencilLine } from "lucide-react";

// Skeleton loader for book card
const BookCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm animate-pulse">
    <div className="w-full aspect-16/25 bg-gray-200 rounded-t-xl" />

    <div className="p-4">
      <div className="w-3/4 h-5 md:h-6 bg-gray-200 rounded mb-2" />
      <div className="w-1/2 h-3 md:h-4 bg-gray-200 rounded" />
    </div>
  </div>
);

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isDeleting,
}) => {
  // Escape key handler
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen && !isDeleting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, isDeleting]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="min-h-screen px-4 flex justify-center items-center">
        {/* Backdrop */}
        <div
          onClick={!isDeleting ? onClose : undefined}
          className="bg-black/50 backdrop-blur-sm fixed inset-0 animate-in fade-in duration-200"
          aria-hidden="true"
        />

        {/* Modal */}
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          className="max-w-md w-full bg-white rounded-xl p-5 md:p-6 shadow-xl relative animate-in zoom-in-95 duration-200"
        >
          <h3
            id="delete-modal-title"
            className="text-gray-900 text-base md:text-lg font-semibold mb-3 md:mb-4 pr-4 wrap-break-word"
          >
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-600 text-sm md:text-base mb-5 md:mb-6">
            {message}
          </p>

          {/* Action buttons */}
          <div className="flex justify-end items-center gap-x-2 md:gap-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={onConfirm}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

function DashboardPage() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateBookModalOpen, setIsCreateBookModalOpen] = useState(false);
  const [bookToDeleteId, setBookToDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  // Fetch books on mount
  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);

      try {
        const { data } = await axiosInstance.get(API_ENDPOINTS.BOOKS.GET_ALL);
        setBooks(data.books);
      } catch (error) {
        console.error("Error fetching user books:", error);
        toast.error("Failed to load your library!", { duration: 5000 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleDeleteBook = async () => {
    if (!bookToDeleteId) return;

    setIsDeleting(true);

    try {
      await axiosInstance.delete(
        `${API_ENDPOINTS.BOOKS.DELETE}/${bookToDeleteId}`
      );
      // update local state
      setBooks((prev) => prev.filter((b) => b._id !== bookToDeleteId));
      toast.success("Book removed successfully!");
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Failed to remove book!");
    } finally {
      setIsDeleting(false);
      setBookToDeleteId(null);
    }
  };

  const handleCreateBook = (bookId) => {
    setIsCreateBookModalOpen(false);
    navigate(`/books/${bookId}/edit`);
  };

  return (
    <DashboardLayout>
      <main className="container max-w-7xl p-4 md:p-6 mx-auto">
        <header className="mb-6 md:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-gray-900 text-xl md:text-2xl font-bold mb-1">
              Library
            </h1>

            <p className="text-gray-600 text-xs md:text-sm">
              Manage your collection and bring stories to life
            </p>
          </div>

          {/* Create button */}
          <Button
            type="button"
            onClick={() => setIsCreateBookModalOpen(true)}
            icon={BookPlus}
            className="w-full sm:w-auto"
          >
            Craft New Book
          </Button>
        </header>

        {/* Content area */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {Array(4)
              .fill(1)
              .map((_, index) => (
                <BookCardSkeleton key={index} />
              ))}
          </div>
        ) : books.length === 0 ? (
          // Empty state
          <section className="text-center border-2 border-dashed border-gray-200 rounded-xl py-12 md:py-16 mt-8 flex flex-col justify-center items-center">
            <div className="size-14 md:size-16 bg-gray-100 rounded-full mb-4 flex justify-center items-center">
              <Book className="size-7 md:size-8 text-gray-400" />
            </div>

            <h3 className="text-gray-900 text-base md:text-lg font-medium mb-2">
              Your library awaits
            </h3>

            <p className="max-w-md text-gray-500 text-sm md:text-base mb-6 px-4">
              Begin your creative journey and publish your first masterpiece.
            </p>

            <Button
              type="button"
              onClick={() => setIsCreateBookModalOpen(true)}
              icon={PencilLine}
            >
              Start Writing
            </Button>
          </section>
        ) : (
          // Books grid
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onDelete={(event) => {
                  event.stopPropagation();
                  setBookToDeleteId(book._id);
                }}
              />
            ))}
          </ul>
        )}

        {/* Delete confirmation modal */}
        <DeleteConfirmationModal
          isOpen={Boolean(bookToDeleteId)}
          onClose={() => !isDeleting && setBookToDeleteId(null)}
          onConfirm={handleDeleteBook}
          isDeleting={isDeleting}
          title={`Remove "${
            books.find((b) => b?._id === bookToDeleteId)?.title || "this book"
          }"?`}
          message="This action is permanent and cannot be undone. All chapters and content will be lost."
        />

        {/* Create book modal */}
        <CreateBookModal
          isOpen={isCreateBookModalOpen}
          onClose={() => setIsCreateBookModalOpen(false)}
          onBookCreate={handleCreateBook}
        />
      </main>
    </DashboardLayout>
  );
}

export default DashboardPage;
