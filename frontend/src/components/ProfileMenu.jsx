import { API_BASE_URL } from "../utils/api-endpoints";
import { ChevronDown, ChevronUp, LogOut, User2 } from "lucide-react";
import { Link } from "react-router";

const ProfileMenu = ({
  isOpen,
  onToggle,
  avatarUrl,
  username,
  email,
  signoutCallback,
}) => (
  <nav onClick={(event) => event.stopPropagation()} className="relative">
    <button
      type="button"
      onClick={onToggle}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      className="rounded-xl p-2 inline-flex items-center gap-x-2 md:gap-x-3 transition-colors duration-200 hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
    >
      {avatarUrl ? (
        <img
          src={`${API_BASE_URL}${avatarUrl}`}
          alt={`${username}'s avatar`}
          className="size-8 md:size-9 object-cover rounded-xl shrink-0"
        />
      ) : (
        <span className="size-8 md:size-9 bg-linear-to-br from-violet-400 to-violet-500 rounded-xl inline-flex justify-center items-center shrink-0">
          <span className="text-white text-xs md:text-sm font-semibold">
            {username?.charAt(0)?.toUpperCase()}
          </span>
        </span>
      )}

      <span className="hidden md:inline-flex md:flex-col text-left min-w-0 max-w-[180px]">
        <span className="text-gray-900 text-sm font-medium truncate">
          {username}
        </span>
        <span className="text-gray-500 text-xs truncate">{email}</span>
      </span>

      {isOpen ? (
        <ChevronUp className="size-4 text-gray-400 shrink-0" />
      ) : (
        <ChevronDown className="size-4 text-gray-400 shrink-0" />
      )}
    </button>

    {/* Dropdown menu */}
    {isOpen && (
      <div className="w-56 md:w-64 bg-white border border-gray-200 rounded-xl shadow-lg mt-2 absolute right-0 z-50 overflow-hidden">
        {/* User info section */}
        <div className="border-b border-gray-100 px-3 py-3">
          <p className="text-gray-900 text-sm font-medium truncate">
            {username}
          </p>
          <p className="text-gray-500 text-xs truncate">{email}</p>
        </div>

        {/* Menu items */}
        <div className="py-1">
          <Link
            to="/profile"
            className="flex items-center gap-x-2 w-full text-sm text-gray-700 px-3 py-2 transition-colors duration-200 hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none"
          >
            <User2 className="size-4 text-gray-500" />
            <span>View Profile</span>
          </Link>
        </div>

        {/* Sign out section */}
        <div className="border-t border-gray-100 py-1">
          <button
            type="button"
            onClick={signoutCallback}
            className="flex items-center gap-x-2 w-full text-red-600 text-sm px-3 py-2 transition-colors duration-200 hover:bg-red-50 focus-visible:bg-red-50 focus-visible:outline-none"
          >
            <LogOut className="size-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    )}
  </nav>
);

export default ProfileMenu;
