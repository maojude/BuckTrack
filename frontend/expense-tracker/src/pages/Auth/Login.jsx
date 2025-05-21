import React, { useState, useContext } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { Link } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import { API_PATHS, BASE_URL } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../context/userContext";
import emailjs from "@emailjs/browser";

//for google authentication
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebaseConfig";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext); // to update user data in context

  const [staySignedIn, setStaySignedIn] = useState(false);


  const navigate = useNavigate();

  // Handle Login Form Submit
  const handleLogin = async (e) => {
    e.preventDefault(); //prevent default form submission (refreshing the page)

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setError("");

    // Login API call
    try {
      const userAgent = navigator.userAgent;

      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
        metadata: {
          userAgent,
        },
      });

      const { token, user } = response.data; //extracts from the backend response

      if (token) {
        if (staySignedIn) {
          localStorage.setItem("token", token); // persists across restarts
        } else {
          sessionStorage.setItem("token", token); // clears when tab is closed
        }
        updateUser(user); // update user data in context
        navigate("/dashboard"); // redirect to dashboard
      }

    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  // handle login using google
  const handleGoogleLogin = async () => {
    try {
      console.log("Start Google login...");
      const result = await signInWithPopup(auth, provider);
      console.log("Popup success:", result);

      const idToken = await result.user.getIdToken(); // Firebase ID token (diff from jwt token)
      console.log("Got ID token:", idToken);

      const response = await axiosInstance.post(API_PATHS.AUTH.GOOGLE_LOGIN, {
        idToken,
      });
      console.log("Backend response:", response);

      const { token, user, isNewUser } = response.data;
      console.log("Token + User:", token, user);

      // Save app's JWT (from backend)
      if (staySignedIn) {
        localStorage.setItem("token", token); // persists across restarts
      } else {
        sessionStorage.setItem("token", token); // clears when tab is closed
      }
      console.log("Login successful!");
      updateUser(user);
      console.log("User updated:", user);

      if (isNewUser) {
        try {
          await emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            {
              name: user.fullName,
              email: user.email,
            },
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
          );
          console.log("Welcome email sent to new user!");
        } catch (emailError) {
          console.error("Failed to send welcome email:", emailError);
        }
      }

      navigate("/dashboard");
      console.log("Navigated to dashboard");
    } catch (error) {
      console.error("Google sign-in failed:", error);

      if (error.response && error.response.data.message) {
        setError(error.response.data.message); // This shows your custom backend message
      } else {
        setError("Google login failed. Please try again.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to log in.
        </p>

        {/* when form is submitted, handleLogin function is called */}
        <form onSubmit={handleLogin}>
          {/* Input with props */}
          {/* onChange passes the function to the real onChange */}
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 characters"
            type="password"
          />

          {/* Error message set from handleLogin function */}
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <label className="flex items-center gap-2 mt-2 mb-2 text-sm">
            <input
              type="checkbox"
              checked={staySignedIn}
              onChange={() => setStaySignedIn(!staySignedIn)}
              className="accent-violet-600"
            />
            Stay signed in
          </label>

          <button type="submit" className="btn-primary">
            LOGIN
          </button>

          {/* Google Login */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center w-full gap-2 px-4 py-2 transition bg-white border border-gray-300 rounded text-slate-700 hover:shadow-md"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span>Continue with Google</span>
            </button>
          </div>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <Link className="font-medium underline text-primary" to="/signUp">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
