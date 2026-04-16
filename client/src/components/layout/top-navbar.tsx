import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { logout as logoutApi } from "@/api/auth.api";
import { Bell, HelpCircle, LogOut, UserCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Spinner } from "../ui/spinner";

const VersionBadge = ({ label = "1.2" }: { label?: string }) => (
  <span
    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
    style={{ backgroundColor: "#EDEDFC", color: "#5E5ADB" }}
  >
    {label}
  </span>
);

const TopNavbar = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    logoutApi().finally(() => {
      useAuthStore.getState().logout();
      navigate("/auth/login");
    });
    setTimeout(() => {
      setIsLoggingOut(false);
      navigate("/auth/login");
    }, 800);
  };

  const initials = user?.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header
      className="sticky top-0 z-20 flex h-14 items-center justify-between border-b px-6"
      style={{ backgroundColor: "#F7F9FC", borderColor: "#E9EDF5" }}
    >
      <div className="flex items-center gap-3">
        <Typography variant="h2">Projects</Typography>
        <VersionBadge label="1.2" />
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Help"
          className="h-9 w-9 rounded-full text-[#868FA0] hover:text-[#1A1D26]"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative h-9 w-9 rounded-full text-[#868FA0] hover:text-[#1A1D26]"
        >
          <Bell className="h-5 w-5" />
          {/* unread dot */}
          <span
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full ring-2 ring-[#F7F9FC]"
            style={{ backgroundColor: "#5E5ADB" }}
          />
        </Button>

        <div className="mx-2 h-6 w-px" style={{ backgroundColor: "#D5DBE5" }} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-9 items-center gap-2.5 rounded-full px-2 focus-visible:ring-0"
            >
              <div
                className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: "#5E5ADB" }}
              >
                {initials}
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: "#5E5ADB" }}
                >
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-medium leading-tight">
                    {user?.fullName}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              {isLoggingOut ? <Spinner /> : <LogOut className="mr-2 h-4 w-4" />}
              {isLoggingOut ? "Logging out…" : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopNavbar;
