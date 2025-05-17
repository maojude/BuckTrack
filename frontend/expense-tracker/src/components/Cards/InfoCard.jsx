import React from "react";
import { getCurrencySymbol } from "../../utils/helper";
import { useTheme } from "../../context/ThemeContext";

const InfoCard = ({ icon, label, value, color }) => {
  const { currency } = useTheme();
  const currencySymbol = getCurrencySymbol(currency);
  return (
    <div className="flex gap-6 p-6 rounded-2xl border border-gray-200/50 dark:border-[#1c1c24] secondary-background">
      <div
        className={`w-14 h-14 flex items-center justify-center text-[26px] text-white ${color} rounded-full dark:text-black`}
      >
        {icon}
      </div>
      <div>
        <h6 className="mb-1 text-sm text-gray-500 ">{label}</h6>
        <span className="text-[22px]">
          {currencySymbol}
          {value}
        </span>
      </div>
    </div>
  );
};

export default InfoCard;
