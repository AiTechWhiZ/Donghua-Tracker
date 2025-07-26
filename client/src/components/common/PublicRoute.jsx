import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import AppLoader from "./AppLoader";

const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <AppLoader />;
  }

  // Redirect to dashboard if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Render children if not authenticated
  return children;
};

export default PublicRoute;
