import { useEffect } from "react";
import { getMe } from "@/api/auth.api";
import { useAuthStore } from "@/store/auth-store";
import { Spinner } from "@/components/ui/spinner";
import App from "./App";

export default function AppWrapper() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!accessToken || user) return;
    getMe()
      .then((res) => setUser(res.data))
      .catch(() => logout());
  }, [accessToken, logout, setUser, user]);

  const loading = Boolean(accessToken) && !user;

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner size="md" />
      </div>
    );
  }

  return <App />;
}
