import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import { useUserAuth } from "../../hooks/useUserAuth";

const DashboardLayout = ({ children, activeMenu }) => {
  useUserAuth();

  const { user } = useContext(UserContext);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading user info...</p>
      </div>
    );
  }

  return (
    <div className="background">
      <Navbar activeMenu={activeMenu} />
      <div className="flex">
        <div className="max-[1080px]:hidden">
          <SideMenu activeMenu={activeMenu} />
        </div>
        <div className="grow mx-5">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
