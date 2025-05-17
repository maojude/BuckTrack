import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "../src/context/ThemeContext";
import UserProvider from "./context/userContext";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </UserProvider>
  </StrictMode>
);
