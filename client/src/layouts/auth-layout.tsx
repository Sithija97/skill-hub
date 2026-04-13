import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="grid min-h-screen">
      <section className="flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </section>
    </div>
  );
};

export default AuthLayout;
