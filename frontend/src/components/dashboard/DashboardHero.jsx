import { ShieldCheck } from "lucide-react";

const DashboardHero = () => {
  return (
    <div
      className="
      rounded-3xl
      p-8
      bg-gradient-to-r
      from-cyan-600
      via-blue-700
      to-indigo-900
      shadow-xl
      mb-8
    "
    >
      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-4xl font-bold">

            VPN Forensic Dashboard

          </h1>

          <p className="mt-3 text-cyan-100">

            Digital Investigation & VPN Log Analytics Platform

          </p>

        </div>

        <div
          className="
          w-20
          h-20
          rounded-2xl
          bg-white/10
          flex
          items-center
          justify-center
        "
        >
          <ShieldCheck size={42}/>
        </div>

      </div>
    </div>
  );
};

export default DashboardHero;