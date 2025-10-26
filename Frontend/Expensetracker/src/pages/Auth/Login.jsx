import React, { useContext, useEffect, useState } from "react";
import SignUp from "./SignUp";
import Input from "../../Components/input";
import { validateEmail } from "../../Utils/helper";
import toast from "react-hot-toast";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPath";
import { useNavigate } from "react-router-dom";
import {motion } from "framer-motion";

import { UserContext } from "../../Context/UserContaxt";

const Login = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {updateUser} = useContext(UserContext)

  // if user clicks on signup
  if (showSignup) {
    return (
      <div className="w-full max-w-md mx-auto">
      <motion.div
          initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 , animationDelay:3 }}
        exit={{ x: '-100%', opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <SignUp />
      </motion.div>
    </div>
    );
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    // validation checks
    if (!validateEmail(email)) {
      setError("*Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("*Password is required");
      return;
    }

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, user } = await response.data;

      if (token) {
        localStorage.setItem("token", token);
        toast.success("Login successful");
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
  console.log("Login error:", error.response?.data || error.message);

  if (error.response && error.response.data.message) {
    setError(error.response.data.message);
    toast.error(error.response.data.message);
  } else {
    setError("Something went wrong. Please try again later.");
  }
}


  };

  return (
    <div className="backdrop-blur-md bg-white/10 border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <h2 className="text-3xl font-semibold text-center mb-6 text-white tracking-wide">
        Welcome Back
      </h2>
      <p className="text-gray-300 text-center">
        Please enter your credentials to continue
      </p>
      <form className="space-y-5" onSubmit={handleLogin}>
        <Input
          type="email"
          placeholder="you@example.com"
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="••••••••"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          type="submit"
          className="w-full bg-purple-600/80 hover:bg-purple-700/90 text-white py-2 rounded-lg font-medium focus:ring-4 focus:ring-purple-400 transition-all"
        >
          Sign In
        </button>
      </form>

      <p className="text-sm text-center text-gray-400 mt-6">
        Don’t have an account?{" "}
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowSignup(true);
          }}
          className="text-purple-400 font-medium hover:underline"
        >
          Sign up
        </button>
      </p>
    </div>
  );
};

export default Login;
