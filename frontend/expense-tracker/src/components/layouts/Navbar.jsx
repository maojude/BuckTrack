import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";
// Navbar serves as the header of the dashboard layout
// Controls the hamburger menu icon and the side menu

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  return (
    <div className="flex gap-5 border border-b border-gray-200/60 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30 secondary-background dark:border-[#1c1c24]">
      <button
        className="block lg:hidden text-black dark:text-white"
        onClick={() => {
          setOpenSideMenu(!openSideMenu);
        }}
      >
        {/* Icon for opening and closing the side menu */}
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      <h2 className="text-lg font-medium secondary-background">BuckTrack</h2>

      {/*If openSideMenu is true then open sidemenu*/}
      {openSideMenu && (
        <div className="fixed top-[61px] -ml-4 secondary-background">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
