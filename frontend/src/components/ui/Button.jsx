import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-linear-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:from-violet-700 hover:to-purple-700 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2",
  secondary:
    "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
  outline:
    "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
  destructive:
    "bg-red-600 text-white shadow-lg shadow-red-500/30 hover:bg-red-700 hover:shadow-red-500/50 focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100",
  link: "bg-transparent text-violet-600 underline-offset-4 hover:underline focus-visible:underline p-0",
};

const sizes = {
  sm: "text-sm px-3 py-1.5 rounded-lg",
  md: "text-sm px-4 py-2.5 rounded-xl",
  lg: "text-base px-6 py-3 rounded-xl",
  xl: "text-base px-8 py-4 rounded-xl",
};

const Button = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  children,
  icon: ButtonIcon,
  ariaLabel = "",
  className = "",
  ...props
}) => (
  <button
    disabled={isLoading || disabled}
    aria-label={ariaLabel}
    className={`font-medium whitespace-nowrap inline-flex justify-center items-center ${
      children ? "gap-2" : ""
    } transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
      variants[variant]
    } ${sizes[size]} ${className}`}
    {...props}
  >
    {isLoading ? (
      <Loader2 className="size-5 animate-spin" />
    ) : (
      <>
        {ButtonIcon && <ButtonIcon className="size-4" />}
        {children && <span>{children}</span>}
      </>
    )}
  </button>
);

export default Button;
