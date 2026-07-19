import {
  LayoutDashboard,
  Upload,
  FolderOpen,
  FileText,
  Settings,
  LogOut,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useUI } from "../../context/UIContext";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    title: "Upload Logs",
    icon: Upload,
    path: "/upload",
  },
  {
    title: "Cases",
    icon: FolderOpen,
    path: "/cases",
  },
  {
    title: "Evidence",
    icon: FileText,
    path: "/evidence",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const {
    sidebarOpen,
    closeSidebar,
  } = useUI();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <>
      {/* Overlay */}

      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          fixed
          top-0
          left-0
          h-screen
          w-72
          bg-[#0B1220]
          border-r
          border-slate-800
          z-50
          flex
          flex-col
          transition-transform
          duration-300

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          lg:translate-x-0
        `}
      >
        {/* Header */}

        <div className="h-20 border-b border-slate-800 flex items-center justify-between px-6">

          <Logo />

          <button
            onClick={closeSidebar}
            className="lg:hidden"
          >
            <X />
          </button>

        </div>

        {/* Navigation */}

        <div className="flex-1 overflow-y-auto p-4">

          <div className="space-y-2">

            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.title}
                  to={item.path}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `
                    flex
                    items-center
                    gap-4
                    px-5
                    py-4
                    rounded-xl
                    transition

                    ${
                      isActive
                        ? "bg-cyan-600 text-white"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }
                  `
                  }
                >
                  <Icon size={20} />

                  <span>{item.title}</span>
                </NavLink>
              );
            })}

          </div>

        </div>

        {/* Logout */}

        <div className="border-t border-slate-800 p-4">

          <button
            onClick={logout}
            className="
              w-full
              flex
              items-center
              gap-3
              px-5
              py-4
              rounded-xl
              text-red-400
              hover:bg-red-500/10
              transition
            "
          >
            <LogOut size={20} />

            Logout
          </button>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;