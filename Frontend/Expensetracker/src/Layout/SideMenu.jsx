import React, { useContext } from "react";
import { sideMenuData } from "../Utils/data";
import { UserContext } from "../Context/UserContaxt";
import { useNavigate } from "react-router-dom";
import { HiOutlineLogout } from "react-icons/hi";

const SideMenu = ({ activeMenu }) => {
  const { user, logoutuser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
    } else {
      navigate(route);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    logoutuser?.();
    navigate("/login");
  };

  return (
    <aside
      className="
        w-64 md:w-56 h-full flex flex-col justify-between
        bg-gray-900/90 backdrop-blur-lg border-r border-gray-700/40
        text-gray-200 shadow-2xl transition-all duration-300 ease-in-out
      "
    >
      {/* ===== Top Section (Profile + Menu) ===== */}
      <div>
        {/* Profile Section */}
        <div className="flex flex-col items-center md:items-start gap-3 mt-6 px-5">
          <img
            src={
              user?.profileImage ||
              `https://ui-avatars.com/api/?name=${user?.fullName || "User"}`
            }
            alt="profile"
            className="w-14 h-14 rounded-full object-cover border-2 border-purple-500 shadow-md"
          />
          <div>
            <h5 className="text-sm font-semibold text-gray-100 truncate">
              {user?.fullName || "User"}
            </h5>
            <p className="text-xs text-gray-400">Welcome back 👋</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-700 my-5 mx-4" />

        {/* Menu Section */}
        <div className="flex flex-col items-center md:items-start px-3">
          {sideMenuData.map((item, index) => (
            <button
              key={`menu_${index}`}
              onClick={() => handleClick(item.path)}
              className={`
                w-full flex items-center justify-center md:justify-start gap-3 
                py-2.5 px-3 mb-2 rounded-lg font-medium text-sm transition-all duration-300
                ${
                  activeMenu === item.label
                    ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-md scale-[1.02]"
                    : "text-gray-300 hover:bg-gray-800/60 hover:text-white hover:scale-[1.02]"
                }
              `}
            >
              <item.icon
                className={`text-lg ${
                  activeMenu === item.label ? "text-white" : "text-purple-400"
                }`}
              />
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ===== Logout Button ===== */}
      <div className="mt-6 mb-6 px-3">
        <button
          onClick={handleLogout}
          className="
            w-full flex items-center justify-center md:justify-start gap-3 
            py-2.5 px-3 rounded-lg text-sm font-medium text-gray-300
            hover:bg-red-600/80 hover:text-white transition-all duration-300
          "
        >
          <HiOutlineLogout className="text-lg" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default SideMenu;
