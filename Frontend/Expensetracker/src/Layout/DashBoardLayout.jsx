import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideMenu from "../Layout/SideMenu";
import Navbar from "../Layout/Navbar";

const DashBoardLayout = () => {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* ===== Desktop Sidebar ===== */}
      <div className="hidden lg:flex">
        <SideMenu activeMenu={activeMenu} />
      </div>

      {/* ===== Mobile Navbar ===== */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40">
        <Navbar activeMenu={activeMenu} />
      </div>

      {/* ===== Main Content ===== */}
      <main
        className="
          flex-1 p-4 sm:p-6 lg:p-8 
          mt-16 lg:mt-0 
          overflow-y-auto
          transition-all duration-300 ease-in-out
        "
      >
        <div
          className="
            bg-white/80 backdrop-blur-xl shadow-lg rounded-3xl 
            p-4 sm:p-6 md:p-8 
            border border-gray-200/60
            min-h-[85vh]
            transition-all duration-300
          "
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashBoardLayout;
