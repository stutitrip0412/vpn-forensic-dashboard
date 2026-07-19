import { NavLink } from "react-router-dom";

const SidebarItem = ({ icon: Icon, title, path }) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-300
        ${
          isActive
            ? "bg-cyan-500 text-black"
            : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }`
      }
    >
      <Icon size={20} />

      <span>{title}</span>
    </NavLink>
  );
};

export default SidebarItem;