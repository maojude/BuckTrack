import React, { useContext } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
// Component that controls the content of the hamburger menu

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }

    navigate(route);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    clearUser();
    navigate("/login");
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] border-r border-gray-200/50 p-5 sticky top-[61px] z-20 secondary-background dark:border-[#1c1c24]">
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
        <h5 className="font-medium leading-6 secondary-background">
          {" "}
          {/*text-gray-950*/}
          {user?.fullName || ""}
        </h5>
      </div>

      {/*map through the menu data and create a button for each item*/}
      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] ${
            activeMenu == item.label
              ? "text-white dark:text-[#030307] sidebar"
              : "" //if current item is active menu then fontcolor to white and background to primary
          } py-3 px-6 rounded-lg mb-3`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;
