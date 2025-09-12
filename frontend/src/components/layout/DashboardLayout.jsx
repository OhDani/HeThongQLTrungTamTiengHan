import React from "react";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const DashboardLayout = () => {
  const { user } = useAuth(); 
  const role = user?.role || "";

  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
