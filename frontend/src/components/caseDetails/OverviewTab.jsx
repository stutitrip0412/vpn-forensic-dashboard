import {
  Shield,
  User,
  Users,
  CalendarDays,
  FileText,
  Lock,
  Clock,
} from "lucide-react";

const InfoCard = ({ icon: Icon, title, value, color = "text-cyan-400" }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/40 transition-all">

    <div className="flex items-center gap-3 mb-3">

      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">

        <Icon className={color} size={20} />

      </div>

      <span className="text-slate-400 text-sm">

        {title}

      </span>

    </div>

    <p className="text-white text-lg font-semibold break-words">

      {value || "--"}

    </p>

  </div>
);

const StatusBadge = ({ status }) => {
  const value = status?.toLowerCase() || "open";

  const styles = {
    open: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    investigating:
      "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    closed: "bg-red-500/20 text-red-400 border-red-500/30",
    archived:
      "bg-slate-600/20 text-slate-300 border-slate-600/30",
  };

  return (
    <span
      className={`px-4 py-2 rounded-full border text-sm font-medium ${
        styles[value] || styles.open
      }`}
    >
      {status || "Open"}
    </span>
  );
};

const OverviewTab = ({ caseData }) => {
  return (
    <div className="space-y-8">

      {/* Investigation Summary */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

        <h2 className="text-2xl font-bold mb-6">

          Investigation Summary

        </h2>

        <div className="grid lg:grid-cols-2 gap-6">

          <InfoCard
            icon={FileText}
            title="Case Name"
            value={caseData?.name}
          />

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

            <div className="flex items-center gap-3 mb-4">

              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">

                <Shield
                  className="text-cyan-400"
                  size={20}
                />

              </div>

              <span className="text-slate-400 text-sm">

                Investigation Status

              </span>

            </div>

            <StatusBadge status={caseData?.status} />

          </div>

        </div>

      </div>

      {/* Description */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

        <h2 className="text-xl font-semibold mb-5">

          Description

        </h2>

        <p className="text-slate-300 leading-8">

          {caseData?.description ||
            "No investigation description available."}

        </p>

      </div>

      {/* Details */}

      <div className="grid lg:grid-cols-2 gap-6">

        <InfoCard
          icon={User}
          title="Created By"
          value={caseData?.createdBy?.username}
        />

        <InfoCard
          icon={CalendarDays}
          title="Created On"
          value={
            caseData?.createdAt
              ? new Date(
                  caseData.createdAt
                ).toLocaleString()
              : "--"
          }
        />

        <InfoCard
          icon={Clock}
          title="Last Updated"
          value={
            caseData?.updatedAt
              ? new Date(
                  caseData.updatedAt
                ).toLocaleString()
              : "--"
          }
        />

        <InfoCard
          icon={Lock}
          title="Legal Hold"
          value={
            caseData?.legalHold
              ? "Enabled"
              : "Disabled"
          }
          color={
            caseData?.legalHold
              ? "text-emerald-400"
              : "text-red-400"
          }
        />

      </div>

      {/* Assigned Investigators */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

        <h2 className="text-xl font-semibold flex items-center gap-3 mb-6">

          <Users className="text-cyan-400" />

          Assigned Investigators

        </h2>

        {caseData?.assignedUsers?.length ? (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">

            {caseData.assignedUsers.map((user) => (

              <div
                key={user._id}
                className="
                  bg-[#111827]
                  border
                  border-slate-800
                  rounded-xl
                  p-4
                  flex
                  items-center
                  gap-4
                "
              >

                <div
                  className="
                    w-12
                    h-12
                    rounded-full
                    bg-cyan-600
                    flex
                    items-center
                    justify-center
                    text-lg
                    font-bold
                  "
                >
                  {user.username?.charAt(0).toUpperCase()}
                </div>

                <div>

                  <h3 className="font-semibold">

                    {user.username}

                  </h3>

                  <p className="text-sm text-slate-400 capitalize">

                    {user.role}

                  </p>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="text-center py-10 text-slate-500">

            No investigators assigned.

          </div>

        )}

      </div>

    </div>
  );
};

export default OverviewTab;