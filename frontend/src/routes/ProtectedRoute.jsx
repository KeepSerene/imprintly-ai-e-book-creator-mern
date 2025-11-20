import { Navigate, useLocation } from "react-router";
import { useAuthContext } from "../contexts/AuthContext";

function ProtectedRoute({ children }) {
  const { isLoading, isAuthenticated } = useAuthContext();
  const location = useLocation();

  // loading state while checking authentication
  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="size-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 text-sm">Loading...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
