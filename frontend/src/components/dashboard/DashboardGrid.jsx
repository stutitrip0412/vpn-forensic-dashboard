import TimelineChart from "./TimelineChart";
import CountryChart from "./CountryChart";
import ThreatChart from "./ThreatChart";
import RecentActivity from "./RecentActivity";

const DashboardGrid = () => {
  return (
    <div className="space-y-6">

      <div className="grid
grid-cols-1
xl:grid-cols-3
gap-6">
        <div className="col-span-2">
          <TimelineChart />
        </div>

        <CountryChart />
      </div>

      <div className="grid
grid-cols-1
xl:grid-cols-2
gap-6">
        <ThreatChart />
        <RecentActivity />
      </div>

    </div>
  );
};

export default DashboardGrid;