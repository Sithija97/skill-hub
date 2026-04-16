import { NavLink } from "react-router-dom";
import { LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import SidebarLogo from "@/components/layout/sidebar-logo";

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  end?: boolean;
}

const navItems: NavItem[] = [
  { to: "/", icon: LayoutDashboard, label: "Home", end: true },
];

const NavIconButton = ({ to, icon: Icon, label, end }: NavItem) => (
  // <Tooltip content={label}>
  //   <NavLink
  //     to={to}
  //     end={end}
  //     className={({ isActive }) =>
  //       cn(
  //         "flex h-10 w-10 items-center justify-center rounded-md transition-colors",
  //         isActive
  //           ? "bg-[#201D7A] text-white ring-1 ring-[#2A278F]"
  //           : "text-[#A1A9B8] hover:bg-white/10 hover:text-white",
  //       )
  //     }
  //   >
  //     <Icon className="h-[18px] w-[18px]" />
  //   </NavLink>
  // </Tooltip>
  <NavLink to={to} end={end}>
    <Tooltip content={label}>
      <button
        aria-label={label}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-md transition-colors",
          "text-[#A1A9B8] hover:bg-white/10 hover:text-white",
        )}
      >
        <Icon className="h-[18px] w-[18px]" />
      </button>
    </Tooltip>
  </NavLink>
);

const AppSidebar = () => {
  return (
    <TooltipProvider delayDuration={200}>
      <aside className="flex h-screen w-[72px] flex-col items-center bg-[#151357] py-5">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center">
          <SidebarLogo />
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col items-center gap-2">
          {navItems.map((item) => (
            <NavIconButton key={item.to} {...item} />
          ))}
        </nav>

        {/* Settings */}
        <div className="flex flex-col items-center gap-2">
          <Tooltip content="Settings">
            <button
              aria-label="Settings"
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-md transition-colors",
                "text-[#A1A9B8] hover:bg-white/10 hover:text-white",
              )}
            >
              <Settings className="h-[18px] w-[18px]" />
            </button>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default AppSidebar;
