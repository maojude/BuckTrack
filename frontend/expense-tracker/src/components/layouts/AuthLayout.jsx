import React from "react";
import CARD_2 from "../../assets/images/card2.png";
import { LuTrendingUpDown } from "react-icons/lu";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12"> 
        <h2 className="text-lg font-medium text-black">BuckTrack</h2>
        {children}
      </div>

      <div className="hidden md:block w-[40vw] h-screen bg-violet-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative">
        <div className="w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 -left-5" />
        <div className="w-48 h-48 rounded-[40px] bg-violet-500 absolute -bottom-7 -right-5" />

        <div className="z-20 grid grid-cols-1">
          <StatsInfoCard
            icon={<LuTrendingUpDown />}
            label="Track Your Income & Expenses"
            value="20,000"
            color="bg-primary"
          />
        </div>

        <div className="text-center pt-25">
          <p className="text-lg font-bold text-purple-600">
            Manage all your finances in one.
          </p>
        </div>
        <img
          src={CARD_2}
          className="w-64 lg:w-[90%] absolute bottom-10 shadow-lg shadow-blue-400/15"
        />
      </div>
    </div>
  );
};

export default AuthLayout;

const StatsInfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="z-10 flex gap-6 p-4 bg-white border rounded-xl border-gray-200/50">
      <div
        className={`w-12 h-12 flex items-center justify-center text-[26px] text-white ${color} rounded-full`}
      >
        {icon}
      </div>
      <div>
        <h6 className="mb-1 text-xs text-gray-500">{label}</h6>
        <span className="text-[20px]">$ {value}</span>
      </div>
    </div>
  );
};
