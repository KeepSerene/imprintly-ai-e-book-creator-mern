import { UploadCloud, Image as ImageIcon } from "lucide-react";
import { API_BASE_URL } from "../../utils/api-endpoints";
import Button from "../ui/Button";
import Input from "../ui/Input";

function BookDetailsTab({
  book,
  onEditBook,
  fileInputRef,
  isUploading,
  onCoverImageUpload,
}) {
  const coverImageUrl = book.coverImage
    ? `${API_BASE_URL}${book.coverImage}`.replace(/\\/g, "/")
    : null;

  return (
    <div className="max-w-4xl p-4 sm:p-6 lg:p-8 mx-auto">
      <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
        <h3 className="text-slate-900 text-base sm:text-lg font-semibold mb-4">
          Book Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Input
            type="text"
            label="Title"
            name="title"
            value={book.title}
            onChange={onEditBook}
          />

          <Input
            type="text"
            label="Author"
            name="author"
            value={book.author}
            onChange={onEditBook}
          />

          <div className="md:col-span-2">
            <Input
              type="text"
              label="Subtitle"
              name="subtitle"
              value={book.subtitle || ""}
              onChange={onEditBook}
            />
          </div>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 mt-6 sm:mt-8 shadow-sm">
        <h3 className="text-slate-900 text-base sm:text-lg font-semibold mb-4">
          Cover Image
        </h3>

        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          {/* Cover image display with empty state */}
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt="Cover image"
              className="w-full sm:w-32 h-48 sm:h-48 bg-slate-100 object-cover rounded-lg shadow-sm"
            />
          ) : (
            <div className="w-full sm:w-32 h-48 bg-linear-to-br from-violet-50 to-purple-50 border-2 border-dashed border-violet-200 rounded-lg shadow-sm flex flex-col items-center justify-center gap-2 p-4">
              <div className="size-12 bg-violet-100 rounded-full flex items-center justify-center">
                <ImageIcon className="size-6 text-violet-600" />
              </div>
              <p className="text-xs text-center text-slate-500 font-medium">
                No cover image
              </p>
            </div>
          )}

          {/* Upload section */}
          <div className="flex-1 w-full flex flex-col gap-y-3 sm:gap-y-4">
            <div className="space-y-1">
              <label
                htmlFor="cover-image"
                className="text-slate-700 text-xs sm:text-sm font-medium block"
              >
                Upload Cover Image
              </label>
              <p className="text-slate-500 text-xs">
                Recommended size: 600x800px (max 2MB)
              </p>
            </div>

            <input
              type="file"
              name="coverImage"
              id="cover-image"
              ref={fileInputRef}
              onChange={onCoverImageUpload}
              accept="image/*"
              className="hidden"
            />

            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef?.current?.click()}
              isLoading={isUploading}
              icon={UploadCloud}
              size="sm"
              className="w-full sm:w-fit"
            >
              {coverImageUrl ? "Change Image" : "Upload Image"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BookDetailsTab;
