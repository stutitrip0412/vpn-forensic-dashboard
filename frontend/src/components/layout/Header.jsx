import { useState } from "react";
import {
  Bell,
  Search,
  Menu,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUI } from "../../context/UIContext";

const Header = () => {
  const navigate = useNavigate();

  const { toggleSidebar } = useUI();

  const [open, setOpen] = useState(false);

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <header
      className="
      sticky
      top-0
      z-40
      bg-[#081120]/90
      backdrop-blur-xl
      border-b
      border-slate-800
      h-20
      px-4
      lg:px-8
      flex
      items-center
      justify-between
    "
    >
      {/* Left */}

      <div className="flex items-center gap-4">

        {/* Mobile Menu */}

        <button
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          <Menu size={24} />
        </button>

        {/* Search */}

        <div
          className="
          hidden
          md:flex
          items-center
          gap-3
          bg-[#111827]
          border
          border-slate-700
          rounded-xl
          px-4
          py-2
          w-80
        "
        >
          <Search
            size={18}
            className="text-slate-400"
          />

          <input
            placeholder="Search investigations..."
            className="
              bg-transparent
              outline-none
              text-white
              w-full
            "
          />
        </div>

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        {/* Notification */}

        <button
          className="
            relative
            p-2
            rounded-xl
            hover:bg-slate-800
            transition
          "
        >
          <Bell size={22} />

          <span
            className="
            absolute
            top-1
            right-1
            w-2
            h-2
            bg-red-500
            rounded-full
          "
          />
        </button>

        {/* User */}

        <div className="relative">

          <button
            onClick={() => setOpen(!open)}
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
              w-11
              h-11
              rounded-full
              bg-cyan-500
              text-black
              font-bold
              flex
              items-center
              justify-center
            "
            >
              {(user.username || "A")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="hidden md:block text-left">

              <p className="font-semibold">
                {user.username || "Admin"}
              </p>

              <p className="text-xs text-slate-400">
                {user.role || "Analyst"}
              </p>

            </div>

          </button>

          {/* Dropdown */}

          {open && (
            <div
              className="
                absolute
                right-0
                mt-4
                w-56
                bg-[#111827]
                border
                border-slate-700
                rounded-2xl
                overflow-hidden
                shadow-xl
              "
            >
              <button
                onClick={() => {
                  navigate("/settings");
                  setOpen(false);
                }}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-5
                  py-4
                  hover:bg-slate-800
                "
              >
                <Settings size={18} />

                Settings
              </button>

              <button
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-5
                  py-4
                  hover:bg-slate-800
                "
              >
                <User size={18} />

                Profile
              </button>

              <button
                onClick={logout}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-5
                  py-4
                  text-red-400
                  hover:bg-red-500/10
                "
              >
                <LogOut size={18} />

                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
};

export default Header;