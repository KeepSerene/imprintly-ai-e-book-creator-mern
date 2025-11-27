import { useAuthContext } from "../../contexts/AuthContext";
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";
import { Link } from "react-router";
import React from "react";

const stats = [
  {
    value: "50K+",
    label: "Books Created",
  },
  {
    value: "4.9/5",
    label: "User Rating",
  },
  {
    value: "10min",
    label: "Avg. Creation",
  },
];

function Hero() {
  const { isAuthenticated } = useAuthContext();

  return (
    <article className="bg-linear-to-br from-violet-50 via-white to-purple-50 overflow-hidden relative">
      {/* Floating background elements */}
      <div className="size-64 bg-violet-200/30 backdrop-blur-3xl rounded-full absolute left-10 top-20 animate-pulse" />
      <div className="size-96 bg-purple-200/20 backdrop-blur-3xl rounded-full absolute right-10 bottom-20 animate-pulse delay-700" />

      <div className="max-w-7xl px-6 lg:px-8 py-16 sm:py-20 lg:py-32 mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
          {/* Hero banner */}
          <div className="order-1 lg:order-2 lg:pl-8 relative">
            <div className="relative">
              {/* Gradient glow effect behind the banner */}
              <div className="bg-linear-to-r from-violet-600 to-purple-600 opacity-20 blur-2xl rounded-3xl absolute -inset-4" />

              {/* Main hero banner card */}
              <div className="bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden relative">
                <img
                  src="/images/hero-image.png"
                  alt="Imprintly AI eBook creation interface"
                  className="w-full h-auto select-none"
                />
              </div>

              {/* Decorative desktop geometric shapes */}
              <div className="hidden lg:block size-20 bg-violet-400/20 rounded-2xl absolute -left-8 -top-8 rotate-12" />
              <div className="hidden lg:block size-32 bg-purple-400/20 rounded-full absolute -right-6 -bottom-6" />
            </div>
          </div>

          {/* Content column */}
          <section className="order-2 lg:order-1 max-w-xl space-y-6 lg:space-y-8">
            {/* Badge */}
            <div className="bg-white/80 backdrop-blur-sm border border-violet-100 rounded-full px-4 py-2 shadow-sm inline-flex items-center gap-x-2 w-fit">
              <WandSparkles className="size-4 text-violet-600" />
              <span className="text-violet-900 text-sm font-medium">
                Smart Publishing Platform
              </span>
            </div>

            {/* Main headline */}
            <h1 className="text-gray-900 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Turn Ideas Into
              <br />
              <span className="text-gradient">Published eBooks</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Write, design, and export professional eBooks in minutes. Your
              personal publishing assistant that handles the heavy lifting.
            </p>

            {/* CTA links */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                to={isAuthenticated ? "/dashboard" : "/login"}
                className="bg-linear-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl px-8 py-4 shadow-lg shadow-violet-500/30 inline-flex items-center gap-x-2 transition-all duration-200 hover:shadow-violet-500/50 hover:scale-101 focus-visible:shadow-violet-500/50 focus-visible:scale-101 group w-full sm:w-auto justify-center"
              >
                <span>
                  {isAuthenticated ? "Go to Dashboard" : "Make Your Imprint"}
                </span>
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1" />
              </Link>

              <a
                href="#features"
                className="text-gray-700 font-medium inline-flex items-center gap-x-2 transition-colors duration-200 hover:text-violet-600 focus-visible:text-violet-600 w-full sm:w-auto justify-center sm:justify-start"
              >
                <Sparkles className="size-5 text-violet-600" />
                <span>View Features</span>
              </a>
            </div>

            {/* Stats section */}
            <div className="pt-6 lg:pt-8 flex flex-wrap items-center gap-6 lg:gap-8">
              {stats.map(({ value, label }, index) => (
                <React.Fragment key={index}>
                  <div className="shrink-0">
                    <p className="text-gray-900 text-xl sm:text-2xl font-bold">
                      {value}
                    </p>

                    <p className="text-gray-600 text-sm">{label}</p>
                  </div>

                  {/* Divider */}
                  {index !== stats.length - 1 && (
                    <div className="h-12 w-px bg-gray-200 hidden sm:block" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}

export default Hero;
