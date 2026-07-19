import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout.jsx';
import { ProtectedRoute } from './routes/ProtectedRoute.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { CasesListPage } from './pages/CasesListPage.jsx';
import { CaseDetailPage } from './pages/CaseDetailPage.jsx';
import { AdminUsersPage } from './pages/AdminUsersPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/cases" replace />} />
        <Route path="/cases" element={<CasesListPage />} />
        <Route path="/cases/:id" element={<CaseDetailPage />} />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute minimumRole="admin">
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
