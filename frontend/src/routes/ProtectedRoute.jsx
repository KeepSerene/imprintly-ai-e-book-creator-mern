import { Navigate, useLocation } from "react-router";

function ProtectedRoute({ children }) {
  const isLoading = false;
  const isAuthenticated = true;
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
