import React, { useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { Switch } from "@headlessui/react";
import { useTheme } from "../../context/ThemeContext";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [currency, setCurrency] = useState("PHP");

  const darkMode = theme === "dark";

  const handleSave = () => {
    // TODO: Save preferences like currency to backend or localStorage
    console.log({ theme, currency });
  };

  return (
    <DashboardLayout activeMenu="Settings">
      <div className="card my-5">
        <div className="p-5">
          <h2 className="text-2xl font-semibold mb-4">Settings</h2>

          <div className="space-y-6 max-w-md">
            {/* Currency preference */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full border px-3 py-2 rounded-md dark:bg-gray-800 dark:text-white"
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
              className="add-btn-fill text-white px-4 py-2 rounded-md"
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
