import { UploadCloud } from "lucide-react";
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
  const coverImageUrl = book.coverImage.startsWith("http")
    ? book.coverImage
    : `${API_BASE_URL}${book.coverImage}`.replace(/\\/g, "/");

  return (
    <div className="max-w-4xl p-8 mx-auto">
      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-slate-900 text-lg font-semibold mb-4">
          Book Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      <section className="bg-white border border-slate-200 rounded-xl p-6 mt-8 shadow-sm">
        <h3 className="text-slate-900 text-lg font-semibold mb-4">
          Cover Image
        </h3>

        <div className="flex items-start gap-6">
          <img
            src={coverImageUrl}
            alt="Cover image"
            className="w-32 h-48 bg-slate-100 object-cover rounded-lg shadow-sm"
          />

          <div className="flex flex-col gap-y-4">
            <label htmlFor="cover-image" className="text-slate-600 text-sm">
              Upload a new cover image. Recommended size: 600x800.
            </label>

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
            >
              Upload
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BookDetailsTab;
