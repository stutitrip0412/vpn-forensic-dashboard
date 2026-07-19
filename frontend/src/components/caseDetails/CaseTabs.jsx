import {
  LayoutDashboard,
  FileText,
  Database,
  NotebookPen,
  Clock3,
  ShieldAlert,
  Download
} from "lucide-react";

const tabs = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    id: "evidence",
    label: "Evidence",
    icon: FileText,
  },
  {
    id: "logs",
    label: "Logs",
    icon: Database,
  },
  {
    id: "notes",
    label: "Notes",
    icon: NotebookPen,
  },
  {
    id: "timeline",
    label: "Timeline",
    icon: Clock3,
  },
  {
    id: "analysis",
    label: "VPN Analysis",
    icon: ShieldAlert,
  },
   {
    id: "export",
    label: "Export",
    icon: Download,
  },
];

const CaseTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-2">

      <div className="flex flex-wrap gap-2">

        {tabs.map((tab) => {
          const Icon = tab.icon;

          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex
                items-center
                gap-2
                px-5
                py-3
                rounded-xl
                transition-all
                duration-300
                font-medium
                ${
                  active
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }
              `}
            >
              <Icon size={18} />

              {tab.label}
            </button>
          );
        })}

      </div>

    </div>
  );
};

export default CaseTabs;