const Input = ({
  icon: InputIcon,
  label,
  name,
  error,
  helperText,
  className = "",
  ...props
}) => (
  <div className="w-full grid grid-cols-1 gap-y-2">
    {label && (
      <label htmlFor={name} className="text-gray-700 text-sm font-medium">
        {label}
      </label>
    )}

    <div className="relative">
      {InputIcon && (
        <div className="pl-3 flex justify-center items-center pointer-events-none absolute inset-y-0 left-0">
          <InputIcon className="size-4 text-gray-400" />
        </div>
      )}

      <input
        id={name}
        name={name}
        className={`w-full h-11 bg-white text-gray-900 text-sm placeholder-gray-400 px-3 py-2 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          InputIcon ? "pl-10" : ""
        } ${
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

export default Input;
