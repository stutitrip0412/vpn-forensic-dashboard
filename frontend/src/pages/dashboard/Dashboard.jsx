import DashboardHero from "../../components/dashboard/DashboardHero";
import StatsGrid from "../../components/dashboard/StatsGrid";
import DashboardGrid from "../../components/dashboard/DashboardGrid";

const Dashboard = () => {
  return (
    <>
      <DashboardHero />
      <StatsGrid />
      <DashboardGrid />
    </>
  );
};

export default Dashboard;