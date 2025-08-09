// src/components/Header.tsx
import React from "react";
import { FiGlobe, FiUser, FiMenu } from "react-icons/fi";

const Header = () => {
  return (
    <header className="border-b border-gray-200">
      <div className="flex justify-between items-center px-6 py-3">
        {/* Left Section */}
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <div className="flex items-center space-x-1">
            <div className="text-teal-600 text-3xl font-bold">C</div>
            <span className="font-semibold tracking-tight">KIWI</span>
            <span className="text-teal-600">.</span>
            <span className="font-semibold tracking-tight">COM</span>
          </div>

          {/* Nav Links */}
          <nav className="flex items-center space-x-5 text-sm">
            <a href="#" className="text-teal-600 font-semibold hover:underline">
              Flights
            </a>
            <a href="#" className="hover:text-teal-600">Cars</a>
            <a href="#" className="hover:text-teal-600">Stays</a>
            <a href="#" className="hover:text-teal-600">Magazine</a>
            <a href="#" className="hover:text-teal-600">Travel hacks</a>
            <a href="#" className="hover:text-teal-600">Deals</a>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* Currency */}
          <div className="flex items-center space-x-1 text-sm">
            <FiGlobe className="text-gray-700" />
            <span className="font-medium">USD</span>
          </div>

          {/* Help */}
          <a href="#" className="text-sm font-medium hover:text-teal-600">
            Help & support
          </a>

          {/* Sign in */}
          <div className="flex items-center space-x-1 text-sm">
            <FiUser className="text-gray-700" />
            <a href="#" className="font-medium hover:text-teal-600">Sign in</a>
          </div>

          {/* Menu */}
          <FiMenu className="text-gray-700 text-xl cursor-pointer" />
        </div>
      </div>

      {/* Bottom border bar */}
      <div className="h-[3px] bg-teal-600 relative">
        <span className="absolute right-[20px] w-[10px] h-full bg-blue-800"></span>
        <span className="absolute right-[10px] w-[10px] h-full bg-yellow-400"></span>
      </div>
    </header>
  );
};

export default Header;
