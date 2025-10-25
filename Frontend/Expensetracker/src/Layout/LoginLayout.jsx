import React from 'react';
import Login from '../pages/Auth/Login';
import { motion } from 'framer-motion';

const LoginLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 py-8">
      <div className="w-full max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-8">
        {/* Left / Hero */}
        <div className="w-full md:w-1/2 p-4 md:p-6 md:pl-0 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-purple-500 mb-4 leading-tight md:ml-0">
            Welcome to ExpenseTracker
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white max-w-lg md:max-w-none md:mx-0">
            Track your expenses effortlessly and manage your finances with ease. Join us today to take control of your spending and reach your financial goals.
          </p>
        </div>

        {/* Right / Form */}
        <div className="w-full sm:w-3/4 md:w-1/2 p-4 sm:p-6 md:p-8">
          <Login/>
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;
