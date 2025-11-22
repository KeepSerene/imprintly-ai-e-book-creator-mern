import { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router";
import toast from "react-hot-toast";
import { LockKeyhole, Mail, User2 } from "lucide-react";
import { Button, Input, LogoIcon } from "../components";
import axiosInstance from "../lib/axios";
import { API_ENDPOINTS } from "../utils/api-endpoints";
import {
  validateName,
  validateEmail,
  validatePassword,
} from "../utils/helpers";

function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });

  const { authenticateUser } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  // get the page user was trying to access, default to dashboard
  // see ProtectedRoute.jsx
  const fromPath = location.state?.from?.pathname || "/dashboard";

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
    const emailError = validateEmail(trimmedData.email);
    const passwordError = validatePassword(trimmedData.password);

    setErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
    });

    return !nameError && !emailError && !passwordError;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
    };

    if (!validateForm(trimmedData)) {
      return;
    }

    setIsLoading(true);

    try {
      // registration request
      const {
        data: { token },
      } = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, trimmedData);

      // get profile info
      const { data: profileInfo } = await axiosInstance.get(
        API_ENDPOINTS.PROFILE.GET,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // update auth context
      authenticateUser(token, profileInfo.user);

      toast.success("Welcome aboard, Author!");

      // navigate to the page user was trying to access
      navigate(fromPath, { replace: true });
    } catch (error) {
      console.error("Error signing up:", error?.message);

      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Sign up failed. Please try again.";

      toast.error(errorMessage, { duration: 5000 });

      // show error in form (email is more likely to have issues like "already exists")
      setErrors((prev) => ({
        ...prev,
        email: errorMessage,
      }));

      // clear sensitive data on error
      localStorage.clear();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 flex justify-center items-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="size-14 sm:size-16 bg-linear-to-br from-violet-400 to-violet-500 rounded-full mx-auto mb-3 sm:mb-4 shadow-md flex justify-center items-center">
            <LogoIcon className="size-7 sm:size-8 text-white" />
          </div>

          <h1 className="text-slate-900 text-2xl sm:text-3xl font-bold">
            Create Your Account
          </h1>

          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Start imprinting books with AI &mdash; your story begins here.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-lg">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-y-5 sm:gap-y-6"
          >
            <Input
              type="text"
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              icon={User2}
              error={errors.name}
            />

            <Input
              type="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="email@example.com"
              icon={Mail}
              error={errors.email}
            />

            <Input
              type="password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              icon={LockKeyhole}
              error={errors.password}
              helperText={
                !errors.password &&
                "Min 8 chars — must include upper & lowercase letters and a number"
              }
            />

            <Button
              type="submit"
              isLoading={isLoading}
              ariaLabel={isLoading ? "Creating account..." : "Sign up"}
              className="w-full"
            >
              Sign up
            </Button>
          </form>

          <p className="text-slate-600 text-center text-xs sm:text-sm mt-6 sm:mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-violet-600 font-medium transition-all duration-200 hover:text-violet-700 hover:underline focus-visible:text-violet-700 focus-visible:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default SignUpPage;
