import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

const TopNavbar = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur">
      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search" className="pl-9" />
      </div>

      <div className="ml-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium leading-none">
            {user?.name ?? "User"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
