import { useEffect, useState, useRef } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { validateName } from "../utils/helpers";
import axiosInstance from "../lib/axios";
import { API_ENDPOINTS, API_BASE_URL } from "../utils/api-endpoints";
import DashboardLayout from "../layouts/DashboardLayout";
import { Button, Input } from "../components";
import { Mail, User2, Camera, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isDeletingAvatar, setIsDeletingAvatar] = useState(false);
  const [errors, setErrors] = useState({ name: "" });
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [hasNameChanged, setHasNameChanged] = useState(false);
  const [hasAvatarChanged, setHasAvatarChanged] = useState(false);

  const fileInputRef = useRef(null);
  const { user, updateUser, isLoading: authContextLoading } = useAuthContext();

  // Fetch user whenever user changes
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, name: user.name, email: user.email }));
      setAvatarPreview(user.avatar ? `${API_BASE_URL}${user.avatar}` : null);
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Check if name has changed from original
    if (name === "name") {
      setHasNameChanged(value.trim() !== user?.name);
    }

    // clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, GIF, and WebP images are allowed!", {
        duration: 5000,
      });

      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB!", { duration: 5000 });

      return;
    }

    setSelectedAvatarFile(file);

    // create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setHasAvatarChanged(true);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteAvatar = async () => {
    if (!user?.avatar) {
      toast.error("No avatar to delete!", { duration: 5000 });

      return;
    }

    setIsDeletingAvatar(true);

    try {
      const { data } = await axiosInstance.delete(
        API_ENDPOINTS.PROFILE.DELETE_AVATAR
      );

      updateUser(data.user);
      setAvatarPreview(null);
      setSelectedAvatarFile(null);
      setHasAvatarChanged(false);

      toast.success("Avatar deleted successfully!");
    } catch (error) {
      console.error("Error deleting avatar:", error?.message);

      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to delete avatar. Please try again.";

      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setIsDeletingAvatar(false);
    }
  };

  const validateForm = (trimmedData) => {
    const nameError = validateName(trimmedData.name);

    setErrors({
      name: nameError,
    });

    return !nameError;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
    };

    // upload avatar first if there's a new file
    if (selectedAvatarFile) {
      setIsUploadingAvatar(true);

      try {
        const avatarFormData = new FormData();
        avatarFormData.append("avatar", selectedAvatarFile);

        const { data: avatarData } = await axiosInstance.put(
          API_ENDPOINTS.PROFILE.UPLOAD_AVATAR,
          avatarFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        updateUser(avatarData.user);
        setSelectedAvatarFile(null);
        setHasAvatarChanged(false);

        toast.success("Avatar updated successfully!");
      } catch (error) {
        console.error("Error uploading avatar:", error?.message);

        const errorMessage =
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Avatar upload failed. Please try again.";

        toast.error(errorMessage, { duration: 5000 });
        setIsUploadingAvatar(false);
        return;
      } finally {
        setIsUploadingAvatar(false);
      }
    }

    if (!validateForm(trimmedData)) {
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axiosInstance.put(API_ENDPOINTS.PROFILE.EDIT, {
        name: trimmedData.name,
      });

      updateUser(data.user);
      setHasNameChanged(false);

      toast.success("Your profile has been updated successfully!", {
        duration: 5000,
      });
    } catch (error) {
      console.error("Error updating profile:", error?.message);

      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Profile update failed. Please try again.";

      toast.error(errorMessage, { duration: 5000 });

      setErrors((prev) => ({
        ...prev,
        name: errorMessage,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const isSaveDisabled = !hasNameChanged && !hasAvatarChanged;

  return (
    <DashboardLayout>
      <main className="max-w-2xl px-4 py-6 mx-auto">
        <h1 className="text-slate-900 text-xl md:text-2xl font-bold mb-2">
          Profile
        </h1>
        <p className="text-slate-600 text-sm mb-8">
          Manage your account details and profile picture.
        </p>

        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-6 pb-6 border-b border-slate-100">
              <div className="relative group">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile avatar"
                    className="size-24 sm:size-28 object-cover rounded-full ring-4 ring-violet-100 transition-all duration-200 group-hover:ring-violet-200"
                  />
                ) : (
                  <div className="size-24 sm:size-28 bg-linear-to-br from-violet-400 to-violet-500 rounded-full ring-4 ring-violet-100 flex items-center justify-center transition-all duration-200 group-hover:ring-violet-200">
                    <span className="text-white text-3xl sm:text-4xl font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}

                {/* Upload overlay on hover */}
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Camera className="size-6 text-white" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={handleAvatarButtonClick}
                  disabled={isUploadingAvatar || isDeletingAvatar}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-violet-600 bg-violet-50 rounded-lg transition-all duration-200 hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera className="size-4" />
                  {avatarPreview ? "Change Avatar" : "Upload Avatar"}
                </button>

                {user?.avatar && (
                  <button
                    type="button"
                    onClick={handleDeleteAvatar}
                    disabled={isUploadingAvatar || isDeletingAvatar}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg transition-all duration-200 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeletingAvatar ? (
                      <>
                        <div className="size-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="size-4" />
                        Remove
                      </>
                    )}
                  </button>
                )}
              </div>

              <p className="text-slate-500 text-xs text-center max-w-xs">
                Recommended: Square image, at least 200x200px. Max size: 2MB.
                Supported formats: JPEG, PNG, GIF, WebP.
              </p>
            </div>

            {/* Name and Email Fields */}
            <div className="space-y-6">
              <Input
                type="text"
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                icon={User2}
                required
                placeholder="John Doe"
                error={errors.name}
              />

              <Input
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
                disabled
                helperText="Registered email cannot be modified."
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={isLoading || authContextLoading || isUploadingAvatar}
                disabled={isSaveDisabled}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </main>
    </DashboardLayout>
  );
}

export default ProfilePage;
