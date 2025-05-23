import React from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import Savings from "./pages/Dashboard/Savings";
import Settings from "./pages/Dashboard/Settings";
import { Toaster } from "react-hot-toast";
import Reports from "./pages/Dashboard/Reports";

const App = () => {
  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/signUp" exact element={<SignUp />} />
            <Route path="/dashboard" exact element={<Home />} />
            <Route path="/income" exact element={<Income />} />
            <Route path="/expense" exact element={<Expense />} />
            <Route path="/savings" exact element={<Savings />} />
            <Route path="/reports" exact element={<Reports />} />
            <Route path="/settings" exact element={<Settings />} />
          </Routes>
        </Router>
      </div>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </>
  );
};
export default App;

const Root = () => {
  // Check if token exists in local storage
  const isAuthenticated = !!localStorage.getItem("token");

  // for testing
  console.log(
    "token:",
    localStorage.getItem("token"),
    "authenticated?",
    isAuthenticated
  );

  // Redirect to dashboard if authenticated, otherwise redirect to login
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};
