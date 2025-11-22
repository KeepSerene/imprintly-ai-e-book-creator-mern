import { useAuthContext } from "../../contexts/AuthContext";
import { Globe } from "lucide-react";
import { Link } from "react-router";
import LogoIcon from "../LogoIcon";

const socials = [
  {
    href: "https://math-to-dev.vercel.app/",
    ariaLabel: "Visit my portfolio",
    icon: Globe,
    imgSrc: "",
  },
  {
    href: "https://github.com/KeepSerene",
    ariaLabel: "Visit my GitHub",
    icon: null,
    imgSrc: "/social-icons/github.svg",
  },
  {
    href: "https://www.linkedin.com/in/dhrubajyoti-bhattacharjee-320822318/",
    ariaLabel: "Visit my LinkedIn",
    icon: null,
    imgSrc: "/social-icons/linkedin.svg",
  },
  {
    href: "https://x.com/UsualLearner",
    ariaLabel: "Visit my X (formerly Twitter) page",
    icon: null,
    imgSrc: "/social-icons/x.svg",
  },
];

function Footer() {
  const { isAuthenticated } = useAuthContext();

  return (
    <footer className="bg-linear-to-br from-gray-950 via-gray-950 to-violet-950 text-white overflow-hidden relative">
      {/* Subtle decorative background pattern */}
      <div className="opacity-5 absolute inset-0 pointer-events-none">
        <div className="size-96 bg-violet-500 rounded-full blur-3xl absolute top-0 right-0" />
      </div>

      <div className="max-w-7xl px-6 lg:px-8 mx-auto relative">
        {/* Footer content */}
        <div className="py-12 sm:py-14 lg:py-16 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Branding */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">
            {/* Logo */}
            <a
              href="/"
              className="inline-flex items-center gap-x-2.5 group w-fit"
            >
              <span className="size-9 sm:size-10 bg-linear-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-500/30 inline-flex justify-center items-center transition-all duration-300 group-hover:shadow-violet-500/50 group-hover:scale-105 group-focus-visible:shadow-violet-500/50 group-focus-visible:scale-105">
                <LogoIcon className="size-4 sm:size-5 text-white" />
              </span>

              <span className="text-lg sm:text-xl font-semibold tracking-tight">
                Imprintly
              </span>
            </a>

            <p className="max-w-md text-gray-400 text-sm sm:text-base leading-relaxed">
              Empowering storytellers to craft, design, and share their
              narratives with the world—effortlessly.
            </p>

            {/* Social links*/}
            <ul className="pt-2 flex items-center gap-x-3">
              {socials.map(
                ({ href, ariaLabel, icon: SocialIcon, imgSrc }, index) => (
                  <li key={index}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={ariaLabel}
                      className="size-9 sm:size-10 bg-white/5 backdrop-blur-sm rounded-lg inline-flex justify-center items-center transition-all duration-200 hover:bg-violet-600 hover:scale-101 focus-visible:bg-violet-600 focus-visible:scale-101"
                    >
                      {SocialIcon ? (
                        <SocialIcon className="size-4 sm:size-5" />
                      ) : (
                        <img
                          src={imgSrc}
                          alt=""
                          className="size-4 sm:size-5 brightness-0 invert"
                        />
                      )}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Quick links */}
          <nav className="lg:col-span-1 lg:justify-self-end">
            <h3 className="text-white text-sm font-semibold mb-4">
              Quick Links
            </h3>

            <ul className="space-y-2">
              <li>
                <Link
                  to={isAuthenticated ? "/dashboard" : "/login"}
                  className="text-gray-400 text-sm transition-colors duration-300 hover:text-violet-400 focus-visible:text-violet-400 inline-block"
                >
                  Jump In
                </Link>
              </li>

              <li>
                <a
                  href="#features"
                  className="text-gray-400 text-sm transition-colors duration-300 hover:text-violet-400 focus-visible:text-violet-400 inline-block"
                >
                  Features
                </a>
              </li>

              <li>
                <a
                  href="#testimonials"
                  className="text-gray-400 text-sm transition-colors duration-300 hover:text-violet-400 focus-visible:text-violet-400 inline-block"
                >
                  Testimonials
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom bar - copyright and attribution */}
        <div className="border-t border-white/10 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-y-3 sm:gap-y-0">
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              &copy; {new Date().getFullYear()} Imprintly. All rights reserved.
            </p>

            <p className="text-gray-500 text-xs sm:text-sm flex items-center gap-x-1.5">
              <span>Crafted with</span>
              <span className="text-violet-400 text-base">💜</span>
              <span>
                by{" "}
                <a
                  href="https://github.com/KeepSerene"
                  target="_blank"
                  className="text-white transition-all duration-200 hover:underline focus-visible:underline"
                >
                  @KeepSerene
                </a>
                , for creators
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
