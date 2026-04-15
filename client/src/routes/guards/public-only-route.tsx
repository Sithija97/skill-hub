import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";

const PublicOnlyRoute = () => {
  const accessToken = useAuthStore((s) => s.accessToken);

  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;
