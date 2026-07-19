import { useNavigate } from "react-router-dom";
import {
  User,
  Shield,
  Bell,
  Moon,
  Download,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const navigate = useNavigate();

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");

    navigate("/login");
  };

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold">
          Settings
        </h1>

        <p className="text-slate-400 mt-2">
          Manage your account and application preferences.
        </p>

      </div>

      {/* Profile */}

      <div className="bg-[#111827] rounded-2xl border border-slate-800 p-6">

        <div className="flex items-center gap-5">

          <div className="w-20 h-20 rounded-full bg-cyan-500 flex items-center justify-center text-3xl font-bold text-black">

            {(user.username || "A")
              .charAt(0)
              .toUpperCase()}

          </div>

          <div>

            <h2 className="text-2xl font-semibold">

              {user.username || "Administrator"}

            </h2>

            <p className="text-slate-400">

              {user.email || "admin@vpn.local"}

            </p>

            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-cyan-600 text-sm">

              {user.role || "Analyst"}

            </span>

          </div>

        </div>

      </div>

      {/* Options */}

      <div className="grid lg:grid-cols-2 gap-6">

        <SettingCard
          icon={User}
          title="Profile"
          description="Manage account information."
        />

        <SettingCard
          icon={Shield}
          title="Security"
          description="Password & authentication."
        />

        <SettingCard
          icon={Bell}
          title="Notifications"
          description="Manage notification settings."
        />

        <SettingCard
          icon={Moon}
          title="Appearance"
          description="Dark mode enabled."
        />

      </div>

      {/* Export */}

      <div className="bg-[#111827] rounded-2xl border border-slate-800 p-6 flex justify-between items-center flex-wrap gap-4">

        <div>

          <h3 className="text-xl font-semibold">

            Export Investigation Data

          </h3>

          <p className="text-slate-400 mt-2">

            Download investigation metadata.

          </p>

        </div>

        <button
          className="
            flex
            items-center
            gap-2
            bg-cyan-600
            hover:bg-cyan-500
            px-6
            py-3
            rounded-xl
          "
        >
          <Download size={18} />

          Export

        </button>

      </div>

      {/* Logout */}

      <div className="bg-[#111827] rounded-2xl border border-red-700 p-6 flex justify-between items-center flex-wrap gap-4">

        <div>

          <h3 className="text-xl font-semibold text-red-400">

            Logout

          </h3>

          <p className="text-slate-400">

            End the current investigation session.

          </p>

        </div>

        <button
          onClick={logout}
          className="
            flex
            items-center
            gap-2
            bg-red-600
            hover:bg-red-500
            px-6
            py-3
            rounded-xl
          "
        >
          <LogOut size={18} />

          Logout

        </button>

      </div>

    </div>
  );
};

const SettingCard = ({
  icon: Icon,
  title,
  description,
}) => (
  <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 hover:border-cyan-600 transition">

    <Icon
      className="text-cyan-400 mb-4"
      size={28}
    />

    <h3 className="text-xl font-semibold">

      {title}

    </h3>

    <p className="text-slate-400 mt-2">

      {description}

    </p>

  </div>
);

export default SettingsPage;