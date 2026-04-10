import { type ReactNode, useState } from "react";
import {
  BarChart3,
  ChevronsLeft,
  ChevronsRight,
  Menu,
  Settings,
  Users2,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserMenu } from "./user-menu";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  { label: "Dashboard", icon: BarChart3, href: "/" },
  { label: "Customers", icon: Users2, href: "/customers" },
  { label: "Settings", icon: Settings, href: "/settings", disabled: true },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const sidebarWidth = collapsed ? "w-[68px]" : "w-60";
  const contentPadding = collapsed ? "md:pl-[68px]" : "md:pl-60";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {sidebarOpen ? (
        <button
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-background/75 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 border-r border-border bg-background p-5 transition-all duration-300 md:translate-x-0",
          sidebarWidth,
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          collapsed && "px-3",
        )}
      >
        <div className="flex items-center justify-between">
          {!collapsed ? (
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                CRM Console
              </p>
              <h1 className="mt-1.5 text-lg font-semibold tracking-tight">
                Customer Hub
              </h1>
            </div>
          ) : (
            <div className="flex w-full justify-center">
              <span className="text-lg font-semibold">CH</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-5 h-px w-full bg-border" />

        <nav className="mt-5 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.href);

            if (item.disabled) {
              return (
                <button
                  key={item.label}
                  className={cn(
                    "flex w-full cursor-not-allowed items-center rounded-md text-left text-sm font-medium text-muted-foreground/50",
                    collapsed
                      ? "justify-center px-2 py-2"
                      : "gap-3 px-3 py-2",
                  )}
                  disabled
                  title={collapsed ? item.label : undefined}
                  type="button"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && item.label}
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex w-full items-center rounded-md text-left text-sm font-medium transition-colors",
                  collapsed
                    ? "justify-center px-2 py-2"
                    : "gap-3 px-3 py-2",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 text-muted-foreground hover:text-foreground md:inline-flex"
          onClick={() => setCollapsed((c) => !c)}
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
        </Button>
      </aside>

      <div className={cn("transition-all duration-300", contentPadding)}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background px-4 md:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              Welcome back
            </p>
            <h2 className="truncate text-lg font-semibold tracking-tight">
              Customer management overview
            </h2>
          </div>
          <ThemeToggle />
          <UserMenu />
        </header>

        <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
