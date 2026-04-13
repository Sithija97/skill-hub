import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/layout/app-sidebar";
import TopNavbar from "@/components/layout/top-navbar";

const ProtectedLayout = () => {
  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <div className="hidden lg:block">
          <AppSidebar />
        </div>
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <TopNavbar />
          <main className="flex-1 p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
