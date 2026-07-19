import { Navigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;