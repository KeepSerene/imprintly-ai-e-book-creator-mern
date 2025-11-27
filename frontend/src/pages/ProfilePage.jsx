import { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { validateName } from "../utils/helpers";
import axiosInstance from "../lib/axios";
import { API_ENDPOINTS } from "../utils/api-endpoints";
import DashboardLayout from "../layouts/DashboardLayout";
import { Button, Input } from "../components";
import { Mail, User2 } from "lucide-react";
import toast from "react-hot-toast";

function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "" });
  const [formData, setFormData] = useState({ name: "", email: "" });

  const { user, updateUser, isLoading: authContextLoading } = useAuthContext();

  // Fetch user whenever user changes
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
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

    if (!validateForm(trimmedData)) {
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axiosInstance.put(API_ENDPOINTS.PROFILE.EDIT, {
        name: trimmedData.name,
      });
      updateUser(data.user);
      toast.success("Your profile name has been updated successfully!", {
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

  return (
    <DashboardLayout>
      <main className="max-w-2xl px-4 mx-auto">
        <h1 className="text-slate-900 text-xl md:text-2xl font-bold mt-10 mb-2">
          Profile
        </h1>
        <p className="text-slate-600 text-sm mb-8">
          Manage your account details.
        </p>

        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="flex justify-end">
              <Button type="submit" isLoading={isLoading || authContextLoading}>
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
