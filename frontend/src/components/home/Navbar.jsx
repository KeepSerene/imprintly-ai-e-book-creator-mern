import { useEffect, useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router";
import { LogOut, Menu, X } from "lucide-react";
import ProfileMenu from "../ProfileMenu";
import LogoIcon from "../LogoIcon";

const navLinks = [
  { label: "Features", hash: "#features" },
  { label: "Testimonials", hash: "#testimonials" },
];

function Navbar() {
  const { isAuthenticated, user, unauthenticateUser } = useAuthContext();
  const navigate = useNavigate();

  const [activeUrlHash, setActiveUrlHash] = useState(window.location.hash);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Listen for URL hash change
  useEffect(() => {
    const updateUrlHash = () => setActiveUrlHash(window.location.hash);

    window.addEventListener("hashchange", updateUrlHash);

    return () => window.removeEventListener("hashchange", updateUrlHash);
  }, []);

  // Close profile dropdown menu when clicked outside
  useEffect(() => {
    const handleOutsideClicks = () => {
      if (isProfileMenuOpen) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClicks);

    return () => document.removeEventListener("click", handleOutsideClicks);
  }, [isProfileMenuOpen]);

  const getLgScrNavLinkClass = (hash) => {
    return `${
      activeUrlHash === hash
        ? "bg-violet-50/50 text-violet-500"
        : "bg-transparent text-gray-600"
    } text-sm font-medium rounded-lg px-4 py-2 transition-colors duration-200 hover:bg-violet-50/50 hover:text-violet-500 focus-visible:bg-violet-50 focus-visible:text-violet-600`;
  };

  const getSmScrNavLinkClass = (hash) => {
    return `${
      activeUrlHash === hash
        ? "bg-violet-50 text-violet-600"
        : "bg-transparent text-gray-700"
    } text-sm font-medium rounded-lg px-4 py-2.5 transition-colors duration-200 hover:bg-violet-50 hover:text-violet-600 focus-visible:bg-violet-50 focus-visible:text-violet-600`;
  };

  const handleSignout = () => {
    unauthenticateUser(() => navigate("/", { replace: true }));
  };

  return (
    <header className="bg-white/60 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl h-16 px-6 lg:px-8 mx-auto flex justify-between items-center gap-4">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-x-2.5 group">
          <span className="size-9 bg-linear-to-br from-violet-400 to-purple-500 rounded-xl shadow-lg shadow-violet-500/20 inline-flex justify-center items-center transition-all duration-300 group-hover:shadow-violet-500/40 group-focus-visible:shadow-violet-500/40 group-hover:scale-105 group-focus-visible:scale-105">
            <LogoIcon className="size-5 text-white" />
          </span>

          <span className="text-xl font-semibold text-gray-900 tracking-tight">
            Imprintly
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-x-1">
          {navLinks.map(({ label, hash }) => (
            <a key={label} href={hash} className={getLgScrNavLinkClass(hash)}>
              {label}
            </a>
          ))}
        </nav>

        {/* Desktop profile menu & action buttons */}
        <div className="hidden lg:flex items-center gap-x-3">
          {isAuthenticated ? (
            <ProfileMenu
              isOpen={isProfileMenuOpen}
              onToggle={(event) => {
                event.stopPropagation();
                setIsProfileMenuOpen(!isProfileMenuOpen);
              }}
              avatarUrl={user?.avatar}
              username={user?.name}
              email={user?.email}
              signoutCallback={handleSignout}
            />
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 text-sm font-medium rounded-lg px-4 py-2 transition-colors duration-200 hover:bg-gray-50 hover:text-gray-900 focus-visible:bg-gray-50 focus-visible:text-gray-900"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                className="bg-linear-to-r from-violet-400 to-purple-500 text-white font-medium rounded-lg px-5 py-2 shadow-lg shadow-violet-500/30 transition-all duration-300 hover:from-violet-700 hover:to-purple-700 hover:shadow-violet-500/50 hover:scale-105 focus-visible:from-violet-700 focus-visible:to-purple-700 focus-visible:shadow-violet-500/50 focus-visible:scale-105"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggler button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          className="lg:hidden text-gray-600 rounded-full p-2 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900"
        >
          {isMobileMenuOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/80 backdrop-blur-md border-t border-gray-100 animate-in slide-in-from-top duration-200">
          {/* Navigation */}
          <nav className="p-4 grid grid-cols-1 gap-y-1">
            {navLinks.map(({ label, hash }) => (
              <a
                key={label}
                href={hash}
                onClick={() => setIsMobileMenuOpen(false)}
                className={getSmScrNavLinkClass(hash)}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* User info & action buttons */}
          <div className="p-4 border-t border-gray-100">
            {isAuthenticated ? (
              <div className="space-y-3">
                {/* User info display */}
                <div className="px-2 flex items-center gap-x-3">
                  <div className="size-10 bg-linear-to-br from-violet-400 to-violet-500 rounded-xl flex justify-center items-center shrink-0">
                    <span className="text-white text-sm font-semibold">
                      {user?.name?.[0]?.toUpperCase() ?? "U"}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm font-medium truncate">
                      {user?.name ?? ""}
                    </p>

                    <p className="text-gray-500 text-xs truncate">
                      {user?.email ?? ""}
                    </p>
                  </div>
                </div>

                {/* Sign out button */}
                <button
                  type="button"
                  onClick={handleSignout}
                  className="w-full text-red-600 text-sm font-medium rounded-lg px-4 py-2.5 flex justify-center items-center gap-x-2 transition-colors duration-200 hover:bg-red-50 focus-visible:bg-red-50"
                >
                  <LogOut className="size-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="text-center grid grid-cols-1 gap-y-2">
                <Link
                  to="/login"
                  className="text-gray-600 text-sm font-medium rounded-lg px-4 py-2.5 transition-colors duration-200 hover:bg-gray-50 hover:text-gray-900 focus-visible:bg-gray-50 focus-visible:text-gray-900"
                >
                  Sign in
                </Link>

                <Link
                  to="/register"
                  className="bg-linear-to-r from-violet-600 to-purple-600 text-white text-sm font-medium rounded-lg px-4 py-2.5 shadow-lg shadow-violet-500/30 transition-all duration-300 hover:from-violet-700 hover:to-purple-700 hover:shadow-violet-700/50 hover:scale-101 focus-visible:from-violet-700 focus-visible:to-purple-700 focus-visible:shadow-violet-500/50 focus-visible:scale-101"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
