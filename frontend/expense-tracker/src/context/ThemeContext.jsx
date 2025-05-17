// ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { UserContext } from "./userContext";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [currency, setCurrency] = useState("PHP");

  const { user } = useContext(UserContext) || {};

  // Load preferences from backend on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.AUTH.GET_PREFERENCE);
        const { theme: savedTheme, currency: savedCurrency } = res.data;

        setTheme(savedTheme);
        setCurrency(savedCurrency);
        document.documentElement.classList.toggle(
          "dark",
          savedTheme === "dark"
        );
      } catch (err) {
        console.error("Failed to load preferences:", err);
      }
    };

    if (user) loadPreferences(); // only call when user is available
  }, [user]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, currency, setCurrency }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
