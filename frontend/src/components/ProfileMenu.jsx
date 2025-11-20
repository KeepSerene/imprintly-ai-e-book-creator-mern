import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router";

function ProfileMenu({
  isOpen,
  onToggle,
  avatarUrl,
  username,
  email,
  signoutCallback,
}) {
  return (
    <div onClick={(event) => event.stopPropagation()} className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="rounded-xl p-2 inline-flex items-center gap-x-3 transition-colors duration-200 hover:bg-gray-50 focus-visible:bg-gray-50"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${username}'s avatar`}
            className="size-9 object-cover rounded-xl"
          />
        ) : (
          <span className="size-8 bg-linear-to-br from-violet-400 to-violet-500 rounded-xl inline-flex justify-center items-center">
            <span className="text-white text-sm font-semibold">
              {username?.charAt(0)?.toUpperCase()}
            </span>
          </span>
        )}

        <span className="hidden md:inline-flex md:flex-col text-left">
          <span className="text-gray-900 text-sm font-medium">{username}</span>

          <span className="text-gray-500 text-xs">{email}</span>
        </span>

        {isOpen ? (
          <ChevronUp className="size-4 text-gray-400" />
        ) : (
          <ChevronDown className="size-4 text-gray-400" />
        )}
      </button>

      {isOpen && (
        <ul className="w-56 bg-white border border-gray-100 rounded-xl py-2 mt-2 shadow-lg absolute right-0 z-100">
          <li className="border-b border-gray-100 px-4 py-3">
            <p className="text-gray-900 text-sm font-medium">{username}</p>

            <p className="text-gray-500 text-xs">{email}</p>
          </li>

          <li>
            <Link
              to="/profile"
              className="inline-block w-full text-sm px-4 py-2 transition-colors duration-200 hover:bg-gray-50 focus-visible:bg-gray-50"
            >
              View Profile
            </Link>
          </li>

          <li className="border-t border-gray-100 pt-2 mt-2 ">
            <button
              type="button"
              onClick={signoutCallback}
              className="inline-block w-full text-red-600 text-sm px-4 py-2 transition-colors duration-200 hover:bg-red-50 focus-visible:bg-red-50"
            >
              Sign Out
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

export default ProfileMenu;
