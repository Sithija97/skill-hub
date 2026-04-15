import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";

const PublicOnlyRoute = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;
