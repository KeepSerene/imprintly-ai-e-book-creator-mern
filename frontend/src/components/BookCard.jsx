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
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/books/${_id}`);
        }
      }}
      className="bg-white border border-gray-100 rounded-xl overflow-hidden cursor-pointer relative group transition-all duration-300 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/50 hover:-translate-y-1 focus-within:border-gray-200 focus-within:shadow-xl focus-within:shadow-gray-100/50 focus-within:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
    >
      {/* Cover image section */}
      <div className="bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden relative">
        <img
          src={coverImageUrl}
          alt={`${title} cover`}
          onError={(event) => {
            event.target.src = "/images/default-book-cover.png";
          }}
          className="w-full aspect-16/25 object-cover transition-transform duration-500 group-hover:scale-105 group-focus-within:scale-105"
        />

        {/* Action buttons */}
        <div className="opacity-0 flex items-center gap-2 absolute top-2 md:top-3 right-2 md:right-3 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              navigate(`/books/${_id}/edit`);
            }}
            aria-label="Edit book"
            title="Edit book"
            className="size-7 md:size-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg inline-flex justify-center items-center transition-all duration-200 hover:bg-white hover:scale-110 focus-visible:bg-white focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            <Edit className="size-3.5 md:size-4 text-gray-700" />
          </button>

          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete book"
            title="Delete book"
            className="size-7 md:size-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg inline-flex justify-center items-center transition-all duration-200 hover:bg-red-50 hover:scale-110 focus-visible:bg-red-50 focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 group/delete"
          >
            <Trash2 className="size-3.5 md:size-4 text-red-500 group-hover/delete:text-red-600 group-focus-visible/delete:text-red-600" />
          </button>
        </div>
      </div>

      {/* Book info overlay */}
      <section className="text-white p-4 md:p-5 absolute bottom-0 left-0 right-0">
        <div className="bg-linear-to-r from-black/80 to-transparent backdrop-blur-sm absolute inset-0" />

        <div className="relative">
          <h3 className="text-white font-semibold text-sm md:text-base leading-tight line-clamp-2 mb-0.5 md:mb-1">
            {title}
          </h3>

          <p className="text-gray-300 text-xs md:text-[13px] font-medium truncate">
            {subtitle || "No subtitle"}
          </p>
        </div>
      </section>

      {/* Bottom accent bar */}
      <div className="h-[3px] bg-linear-to-r from-orange-500 via-amber-500 to-rose-500 opacity-0 absolute bottom-0 left-0 right-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />
    </li>
  );
}

export default BookCard;
