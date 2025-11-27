import { useNavigate, useRouteError } from "react-router";
import { Home, ArrowLeft, AlertTriangle, FileQuestion } from "lucide-react";
import { useState } from "react";

function ErrorPage() {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  const error = useRouteError();
  const isErrorBoundary = error != null;

  let is404 = false;
  let errorTitle = "Something Went Wrong";
  let errorMessage =
    "An unexpected error occurred. Don't worry, we're working on fixing it.";
  let errorDetails = null;

  if (isErrorBoundary && error) {
    // error thrown and caught by error boundary
    console.error("Error boundary caught:", error);

    // check if it's a Response object
    if (error instanceof Response) {
      is404 = error.status === 404;
      errorTitle = is404 ? "Page Not Found" : `Error ${error.status}`;
      errorMessage = error.statusText || errorMessage;
    }
    // check if error has status property
    else if (error?.status === 404) {
      is404 = true;
      errorTitle = "Page Not Found";
      errorMessage =
        error.statusText || "The page you're looking for doesn't exist.";
    }
    // regular JS error
    else if (error instanceof Error) {
      errorTitle = "Something Went Wrong";
      errorMessage = "An unexpected error occurred while loading this page.";
      errorDetails = error.message;
    }
    // unknown error type
    else {
      errorDetails = error?.message || String(error);
    }
  } else {
    // no error object - this is a catch-all 404 route
    is404 = true;
    errorTitle = "Page Not Found";
    errorMessage =
      "The page you're looking for doesn't exist. It might have been moved or deleted.";
  }

  const handleGoHome = () => {
    navigate("/dashboard");
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      handleGoHome();
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Error card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
          <section className="p-6 sm:p-8 md:p-12 space-y-6 text-center">
            {/* Error icon */}
            <div className="size-20 sm:size-24 bg-linear-to-br from-red-50 to-rose-100 rounded-2xl flex items-center justify-center mx-auto">
              {is404 ? (
                <FileQuestion className="size-10 sm:size-12 text-red-600" />
              ) : (
                <AlertTriangle className="size-10 sm:size-12 text-red-600" />
              )}
            </div>

            {/* Error code badge */}
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full">
              <span className="font-mono font-bold text-sm">
                {is404 ? "404" : "ERROR"}
              </span>
            </div>

            {/* Error title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900">
              {errorTitle}
            </h1>

            {/* Error message */}
            <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-md mx-auto leading-relaxed">
              {errorMessage}
            </p>

            {/* Technical error details (only for non-404 errors) */}
            {errorDetails && !is404 && (
              <div className="w-full max-w-lg mx-auto">
                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full text-left bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                >
                  <div className="px-4 py-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      Technical Details
                    </span>

                    <svg
                      className={`size-5 text-slate-500 transition-transform ${
                        showDetails ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  {showDetails && (
                    <div className="px-4 pb-3 border-t border-slate-200">
                      <code className="text-xs text-red-600 break-all block mt-2 font-mono">
                        {errorDetails}
                      </code>
                    </div>
                  )}
                </button>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto pt-4 justify-center">
              <button
                type="button"
                onClick={handleGoBack}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-900 rounded-xl font-medium hover:bg-slate-200 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all"
              >
                <ArrowLeft className="size-4" />
                <span>Go Back</span>
              </button>

              <button
                type="button"
                onClick={handleGoHome}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:from-violet-700 hover:to-purple-700 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all"
              >
                <Home className="size-4" />
                <span>Go Home</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default ErrorPage;
