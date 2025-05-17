import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { Switch } from "@headlessui/react";
import { useTheme } from "../../context/ThemeContext";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import { API_PATHS } from "../../utils/apiPaths";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === "dark";

  const { currency, setCurrency } = useTheme();

  const handleSave = async () => {
    try {
      await axiosInstance.put(API_PATHS.AUTH.UPDATE_THEME, {
        theme,
        currency,
      });

      setCurrency(currency);
      toast.success("Preferences saved");
    } catch (error) {
      console.error("Failed to save preferences:", error);
      toast.error("Failed to save preferences");
    }
  };

  return (
    <DashboardLayout activeMenu="Settings">
      <div className="my-5 card">
        <div className="p-5">
          <h2 className="mb-4 text-2xl font-semibold">Settings</h2>

          <div className="max-w-md space-y-6">
            {/* Currency preference */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
              >
                <option value="PHP">PHP - Philippine Peso</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="JPY">JPY - Japanese Yen</option>
              </select>
            </div>

            {/* Theme toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Dark Mode
              </span>
              <Switch
                checked={darkMode}
                onChange={toggleTheme}
                className={`${
                  darkMode ? "bg-gray-900" : "bg-gray-300"
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span
                  className={`${
                    darkMode ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="px-4 py-2 text-white rounded-md add-btn-fill"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
