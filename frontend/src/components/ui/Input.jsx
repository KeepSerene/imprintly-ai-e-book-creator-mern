import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function Input({
  icon: InputIcon,
  label,
  name,
  error,
  helperText,
  className = "",
  type = "text",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isRequired = Object.keys(props).includes("required");
  const isPasswordField = type === "password";

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="w-full grid grid-cols-1 gap-y-2">
      {label && (
        <label htmlFor={name} className="text-gray-700 text-sm font-medium">
          {isRequired ? (
            <>
              <span>{label}</span>
              <span className="text-red-500">*</span>
            </>
          ) : (
            label
          )}
        </label>
      )}

      <div className="relative">
        {InputIcon && (
          <div className="pl-3 flex justify-center items-center pointer-events-none absolute inset-y-0 left-0">
            <InputIcon className="size-4 text-gray-400" />
          </div>
        )}

        <input
          type={isPasswordField ? (showPassword ? "text" : "password") : type}
          id={name}
          name={name}
          className={`w-full h-11 bg-white text-gray-900 text-sm placeholder-gray-400 px-3 py-2 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            InputIcon ? "pl-10" : ""
          } ${isPasswordField ? "pr-10" : ""} ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-200 focus:border-transparent"
          } ${className}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error ? `${name}-error` : helperText ? `${name}-helper` : undefined
          }
          {...props}
        />

        {/* Password toggle button */}
        {isPasswordField && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:text-violet-600 transition-colors duration-200"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        )}
      </div>

      {/* Error msg */}
      {error && (
        <p
          id={`${name}-error`}
          className="text-red-600 text-xs mt-1"
          role="alert"
        >
          {error}
        </p>
      )}

      {/* Helper text */}
      {!error && helperText && (
        <p id={`${name}-helper`} className="text-gray-500 text-xs mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
}

export default Input;
