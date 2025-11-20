import { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import axiosInstance from "../lib/axios";
import { API_ENDPOINTS } from "../utils/api-endpoints";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import { BookCard, Button } from "../components";
import { Book, BookPlus } from "lucide-react";

// Skeleton loader for book card
const BookCardSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-lg shadow-sm animate-pulse">
    <div className="w-full aspect-16/25 bg-slate-200 rounded-t-lg" />

    <div className="p-4">
      <div className="w-3/4 h-6 bg-slate-200 rounded mb-2" />
      <div className="w-1/2 h-4 bg-slate-200 rounded" />
    </div>
  </div>
);

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="min-h-screen text-center px-4 flex justify-center items-center">
        <div onClick={onClose} className="bg-black/50 fixed inset-0" />

        <section className="max-w-md w-full bg-white rounded-lg p-6 shadow-xl relative">
          <h3 className="text-slate-900 text-lg font-semibold mb-4">{title}</h3>

          <p className="text-slate-600 mb-6">{message}</p>

          <div className="flex justify-end items-center gap-x-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>

            <Button variant="destructive" onClick={onConfirm}>
              Confirm
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

  const { user } = useAuthContext();
  const navigate = useNavigate();

  // TODO: Refetch books on book creation???

  // Fetch books on mount
  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);

      try {
        const { data } = await axiosInstance.get(API_ENDPOINTS.BOOKS.GET_ALL);
        setBooks(data.books);
      } catch (error) {
        console.error("Error fetching user books:", error);
        toast.error("Failed to fetch your books!", { duration: 5000 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleDeleteBook = async () => {
    if (!bookToDeleteId) return;

    try {
      // delete request
      await axiosInstance.delete(
        `${API_ENDPOINTS.BOOKS.DELETE}/${bookToDeleteId}`
      );
      // local UI update
      setBooks((prev) => [...prev].filter((b) => b._id !== bookToDeleteId));
      toast.success("Deleted your eBook successfully!");
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Failed to delete your eBook!");
    } finally {
      setBookToDeleteId(null);
    }
  };

  const handleCreateBook = (bookId) => {
    setIsCreateBookModalOpen(false);
    navigate(`/books/${bookId}/edit`);
  };

  return (
    <DashboardLayout>
      <div className="container p-6 mx-auto">
        <section className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-slate-900 text-lg font-bold">Your Books</h1>

            <p className="text-slate-600 text-[13px]">
              Create, edit, and manage all your books!
            </p>
          </div>

          <Button
            onClick={() => setIsCreateBookModalOpen(true)}
            icon={BookPlus}
          >
            Create New eBook
          </Button>
        </section>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(4)
              .fill(1)
              .map((_, index) => (
                <BookCardSkeleton key={index} />
              ))}
          </div>
        ) : books.length === 0 ? (
          <section className="text-center border-2 border-dashed border-slate-200 rounded-xl py-12 mt-8 flex flex-col justify-center items-center">
            <div className="size-16 bg-slate-100 rounded-full mb-4 flex justify-center items-center">
              <Book className="size-8 text-slate-400" />
            </div>

            <h3 className="text-slate-900 text-lg font-medium mb-2">
              No eBooks found
            </h3>

            <p className="max-w-md text-slate-500 mb-6">
              Get started by creating your first one.
            </p>

            <Button
              onClick={() => setIsCreateBookModalOpen(true)}
              icon={BookPlus}
            >
              Start Your First eBook
            </Button>
          </section>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

        <DeleteConfirmationModal
          isOpen={Boolean(bookToDeleteId)}
          onClose={() => setBookToDeleteId(null)}
          onConfirm={handleDeleteBook}
          title={`Delete "${
            books.find((b) => b?._id === bookToDeleteId)?.title || "eBook"
          }"`}
          message="Are you sure? This action cannot be undone!"
        />
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;
