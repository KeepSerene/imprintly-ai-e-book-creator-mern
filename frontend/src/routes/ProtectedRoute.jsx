import { Navigate, useLocation } from "react-router";
import { useAuthContext } from "../contexts/AuthContext";

function ProtectedRoute({ children }) {
  const { isLoading, isAuthenticated } = useAuthContext();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
