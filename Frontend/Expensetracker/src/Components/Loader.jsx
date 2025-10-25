import React from 'react'

const Loader = () => {
    // src/components/Loader.jsx

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <div className="relative">
                {/* Outer Glow Circle */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 blur-xl opacity-70 animate-pulse"></div>

                {/* Main Spinner */}
                <div className="relative w-24 h-24 border-4 border-transparent border-t-purple-400 border-r-pink-400 rounded-full animate-spin"></div>

                {/* Center Dot */}
                <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-gradient-to-tr from-pink-400 to-purple-500 rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
            </div>
        </div>
    );
};





export default Loader;