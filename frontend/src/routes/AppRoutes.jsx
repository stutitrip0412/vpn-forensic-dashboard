import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import ProtectedRoute from "./ProtectedRoute";

// Pages
import LoginPage from "../pages/auth/LoginPage";
import Dashboard from "../pages/dashboard/Dashboard";
import UploadPage from "../pages/upload/UploadPage";
import EvidencePage from "../pages/EvidencePage";
import CasesPage from "../pages/cases/CasesPage";
import CaseDetailsPage from "../pages/cases/CaseDetailsPage";

// Placeholder pages (until we build them)
// import AnalyticsPage from "../pages/AnalyticsPage";
 //import AnomaliesPage from "../pages/anomalies/AnomaliesPage";
 import SettingsPage from "../pages/settings/SettingsPage";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Authentication */}
      <Route
        path="/login"
        element={<LoginPage />}
      />

      {/* Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Upload */}
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <UploadPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Cases */}
      <Route
        path="/cases"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CasesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Case Details */}
      <Route
        path="/cases/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CaseDetailsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Evidence */}
      <Route
        path="/evidence"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <EvidencePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Analytics */}
      {/* <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AnalyticsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      /> */}

      {/* Anomalies
      { <Route
        path="/anomalies"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AnomaliesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      /> } */}

      {/* Settings */}
       <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      /> 

      {/* Redirect unknown routes */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
};

export default AppRoutes;