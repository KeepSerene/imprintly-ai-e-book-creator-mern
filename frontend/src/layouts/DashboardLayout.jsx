import { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router";
import { LogoIcon, ProfileMenu } from "../components";

function DashboardLayout({ children }) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const { user, unauthenticateUser } = useAuthContext();
  const navigate = useNavigate();

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

  const handleSignout = () => {
    unauthenticateUser(() => navigate("/", { replace: true }));
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <header className="h-14 md:h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 md:px-6 flex justify-between items-center sticky top-0 z-20 shrink-0">
        {/* Logo section */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-x-2 md:gap-x-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 rounded-lg"
        >
          <span className="size-7 md:size-8 bg-linear-to-br from-violet-400 to-violet-500 rounded-lg shadow-lg shadow-violet-500/20 flex justify-center items-center transition-all duration-300 group-hover:shadow-violet-500/40 group-focus-visible:shadow-violet-500/40 group-hover:scale-105 group-focus-visible:scale-105">
            <LogoIcon className="size-4 md:size-5 text-white" />
          </span>
          <span className="text-gray-900 font-bold text-lg md:text-xl">
            Imprintly
          </span>
        </Link>

        {/* Profile menu */}
        <ProfileMenu
          isOpen={isProfileMenuOpen}
          onToggle={(event) => {
            event.stopPropagation();
            setIsProfileMenuOpen(!isProfileMenuOpen);
          }}
          avatarUrl={user?.avatar || ""}
          username={user?.name || ""}
          email={user?.email || ""}
          signoutCallback={handleSignout}
        />
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}

export default DashboardLayout;
