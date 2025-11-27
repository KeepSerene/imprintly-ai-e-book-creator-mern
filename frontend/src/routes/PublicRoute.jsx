import { useAuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router";

function PublicRoute({ children }) {
  const { isLoading, isAuthenticated } = useAuthContext();

  if (isLoading) {
    return (
      <main className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="size-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="sr-only">Loading...</p>
        </div>
      </main>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicRoute;
