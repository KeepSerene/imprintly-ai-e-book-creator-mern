import { useAuthContext } from "../../contexts/AuthContext";
import { FEATURES } from "../../utils/constants";
import { Link } from "react-router";
import { ArrowRight, ChevronRight } from "lucide-react";

function Features() {
  const { isAuthenticated } = useAuthContext();

  return (
    <article
      id="features"
      className="bg-white py-16 sm:py-20 lg:py-32 overflow-hidden relative"
    >
      {/* Subtle bg gradient */}
      <div className="bg-linear-to-b from-violet-50/50 via-transparent to-purple-50/50 absolute inset-0" />

      <div className="max-w-7xl px-6 lg:px-8 mx-auto relative">
        {/* Header */}
        <header className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16 lg:mb-20">
          {/* Badge */}
          <div className="bg-violet-100 rounded-full px-4 py-2 inline-flex items-center gap-x-2 w-fit mx-auto">
            <span className="size-2 bg-violet-600 rounded-full animate-pulse" />
            <span className="text-violet-900 text-sm font-semibold">
              Features
            </span>
          </div>

          <h2 className="text-gray-900 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight px-4">
            Your Complete
            <br />
            <span className="text-gradient">Author Toolkit</span>
          </h2>

          <p className="max-w-2xl text-gray-600 text-sm sm:text-base leading-relaxed mx-auto px-4">
            From blank page to bestseller—everything you need is built right in,
            ready when inspiration strikes.
          </p>
        </header>

        {/* Features grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {FEATURES.map(
            ({
              title,
              icon: FeatIcon,
              description,
              bgGradientColors,
              shadowColor,
            }) => (
              <li
                key={title}
                className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-7 lg:p-8 transition-all duration-300 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 focus-within:border-violet-200 focus-within:shadow-xl focus-within:shadow-violet-500/10 focus-within:-translate-y-1 relative group"
              >
                {/* Gradient overlay on hover */}
                <div className="bg-linear-to-br from-violet-50/0 to-purple-50/0 rounded-2xl absolute inset-0 transition-all duration-300 group-hover:from-violet-50/50 group-hover:to-purple-50/50 group-focus-within:from-violet-50/50 group-focus-within:to-purple-50/50" />

                <section className="space-y-3 sm:space-y-4 relative">
                  <div
                    className={`size-12 sm:size-13 lg:size-14 bg-linear-to-br ${bgGradientColors} rounded-xl shadow-lg ${shadowColor} flex justify-center items-center transition-transform duration-300 group-hover:scale-105 group-focus-within:scale-105`}
                  >
                    <FeatIcon className="size-6 sm:size-6.5 lg:size-7 text-white" />
                  </div>

                  <div>
                    <h3 className="text-gray-900 text-lg sm:text-xl font-bold mb-2 sm:mb-3 transition-colors duration-300 group-hover:text-violet-900 group-focus-within:text-violet-900">
                      {title}
                    </h3>

                    <p className="text-gray-600 text-sm sm:text-sm leading-relaxed">
                      {description}
                    </p>
                  </div>

                  <Link
                    to={isAuthenticated ? "/dashboard" : "/login"}
                    className="text-violet-600 pt-1 sm:pt-2 opacity-0 inline-flex items-center gap-x-px transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
                  >
                    <span className="text-sm font-medium">Learn more</span>
                    <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </section>
              </li>
            )
          )}
        </ul>

        {/* CTA */}
        <footer className="text-center mt-12 sm:mt-14 lg:mt-16">
          <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
            Ready to bring your book to life?
          </p>

          <Link
            to={isAuthenticated ? "/dashboard" : "/login"}
            className="bg-linear-to-r from-violet-600 to-purple-600 text-white text-sm sm:text-base font-semibold rounded-xl px-6 sm:px-8 py-3 sm:py-4 shadow-lg shadow-violet-500/30 inline-flex items-center gap-x-2 transition-all duration-200 hover:shadow-violet-500/50 hover:scale-101 focus-visible:shadow-violet-500/50 focus-visible:scale-101 group"
          >
            <span>
              {isAuthenticated ? "My Writing Space" : "Launch Your First Book"}
            </span>
            <ArrowRight className="size-4 sm:size-5 transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1" />
          </Link>
        </footer>
      </div>
    </article>
  );
}

export default Features;
