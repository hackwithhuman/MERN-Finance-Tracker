import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [userData , setUserData] = useState([]);

  return (
    <>
      {/* ===== Top Navbar (Mobile + Desktop) ===== */}
      <nav className="flex items-center justify-between gap-4 bg-white/80 border-b border-gray-200 backdrop-blur-md py-4 px-6 sticky top-0 z-40 shadow-sm">
        {/* Mobile Menu Button */}
        <button
          className="block lg:hidden text-gray-700 hover:text-purple-600 transition-colors"
          onClick={() => setOpenSideMenu(!openSideMenu)}
        >
          {openSideMenu ? (
            <HiOutlineX className="text-2xl" />
          ) : (
            <HiOutlineMenu className="text-2xl" />
          )}
        </button>

        {/* Brand Title */}
        <h2 className="text-2xl font-bold text-purple-600 tracking-wide">
          Expense Tracker
        </h2>

        {/* Placeholder for future user menu or logo */}
        <div className="hidden lg:block"></div>
      </nav>

      {/* ===== Mobile Side Menu Overlay ===== */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-30 transition-opacity duration-300 lg:hidden ${
          openSideMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpenSideMenu(false)} // close menu when clicking outside
      />

      {/* ===== Slide-Out Sidebar (Mobile) ===== */}
      <div
        className={`fixed top-0 left-0 w-64 h-screen bg-gray-900/95 text-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out
        ${openSideMenu ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Top spacing for logo/title */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-purple-400">Menu</h3>
          <button
            className="text-gray-400 hover:text-white"
            onClick={() => setOpenSideMenu(false)}
          >
            <HiOutlineX className="text-xl" />
          </button>
        </div>

        {/* Sidebar Content */}
        <SideMenu activeMenu={activeMenu} />
      </div>
    </>
  );
};

export default Navbar;
