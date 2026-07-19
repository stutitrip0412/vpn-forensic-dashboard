import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import PageContainer from "../components/layout/PageContainer";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#081120]">

      {/* Sidebar */}

      <Sidebar />

      {/* Main Content */}

      <div
        className="
          lg:ml-72
          min-h-screen
          transition-all
          duration-300
        "
      >
        {/* Header */}

        <Header />

        {/* Page */}

        <PageContainer>

          {children}

        </PageContainer>

      </div>

    </div>
  );
};

export default DashboardLayout;