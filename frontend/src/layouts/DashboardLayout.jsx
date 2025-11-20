import { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router";
import { PencilLine } from "lucide-react";
import { ProfileMenu } from "../components";

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
    <main className="h-screen bg-gray-50 flex">
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white/60 backdrop-blur-sm border border-gray-200 px-6 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-x-4">
            <Link to="/dashboard" className="inline-flex items-center gap-x-3">
              <span className="size-8 bg-linear-to-br from-violet-400 to-violet-500 rounded-lg flex justify-center items-center">
                <PencilLine className="size-5 text-white" />
              </span>

              <span className="text-black font-bold text-xl">Imprintly</span>
            </Link>
          </div>

          <div className="flex items-center gap-x-3">
            <ProfileMenu
              isOpen={isProfileMenuOpen}
              onToggle={(event) => {
                event.stopPropagation();
                setIsProfileMenuOpen(!isProfileMenuOpen);
              }}
              avatarUrl={user?.avatarUrl || ""}
              username={user?.name || ""}
              email={user?.email || ""}
              signoutCallback={handleSignout}
            />
          </div>
        </header>

        <div className="flex-1">{children}</div>
      </div>
    </main>
  );
}

export default DashboardLayout;
