import { useNavigate } from "react-router";
import { API_BASE_URL } from "../utils/api-endpoints";
import { Edit, Trash2 } from "lucide-react";

function BookCard({ book, onDelete }) {
  const navigate = useNavigate();

  const { _id, title, subtitle, coverImage } = book;

  const coverImageUrl = coverImage
    ? `${API_BASE_URL}${coverImage}`.replace(/\\/g, "/")
    : "/images/default-book-cover.png";

  return (
    <li
      onClick={() => navigate(`/books/${_id}`)}
      aria-label={`Visit ${title}'s details`}
      tabIndex={0}
      className="bg-white border border-gray-100 rounded-xl overflow-hidden cursor-pointer relative group transition-all duration-300 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/50 hover:-translate-y-1 focus-within:border-gray-200 focus-within:shadow-xl focus-within:shadow-gray-100/50 focus-within:-translate-y-1"
    >
      <div className="bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden relative">
        <img
          src={coverImageUrl}
          alt={`${title} cover image`}
          onError={(event) => {
            event.target.src = "";
          }}
          className="w-full aspect-16/25 object-cover transition-transform duration-500 group-hover:scale-105 group-focus-within:scale-105"
        />

        <div className="opacity-0 flex items-center gap-2 absolute top-3 right-3 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              navigate(`/books/${_id}/edit`);
            }}
            aria-label="Edit"
            className="size-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg inline-flex justify-center items-center transition-colors duration-200 hover:bg-white focus-visible:bg-white"
          >
            <Edit className="size-4 text-gray-700" />
          </button>

          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete"
            className="size-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg inline-flex justify-center items-center transition-colors duration-200 hover:bg-red-50 focus-visible:bg-red-50 group/delete"
          >
            <Trash2 className="size-4 text-red-500 group-hover/delete:text-red-600 group-focus-visible/delete:text-red-600" />
          </button>
        </div>
      </div>

      <section className="text-white p-5 absolute bottom-0 left-0 right-0">
        <div className="bg-linear-to-r from-black/80 to-transparent backdrop-blur-xs absolute inset-0" />

        <div className="relative">
          <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2">
            {title}
          </h3>

          <p className="text-gray-300 text-[13px] font-medium">{subtitle}</p>
        </div>
      </section>

      <div className="h-[3px] bg-linear-to-r from-orange-500 via-amber-500 to-rose-500 opacity-0 absolute bottom-0 left-0 right-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />
    </li>
  );
}

export default BookCard;
