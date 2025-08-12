'use client'
// src/components/NavBar.tsx
import React, { useState } from "react";
import { FiGlobe, FiUser, FiMenu, FiX, FiChevronDown } from "react-icons/fi";

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleCurrencyMenu = () => {
    setIsCurrencyOpen(!isCurrencyOpen);
  };

  return (
    <header className="border-b border-gray-200">

      <div className="flex justify-between items-center px-4 py-3 md:px-6">
   
        <div className="flex items-center space-x-4 md:space-x-8">
      
          <div className="flex items-center space-x-1">
            <div className="text-teal-600 text-2xl md:text-3xl font-bold">S</div>
            <span className="font-semibold tracking-tight hidden sm:inline">chamber</span>
            <span className="text-teal-600 hidden sm:inline">.</span>
            <span className="font-semibold tracking-tight hidden sm:inline">COM</span>
          </div>


          <nav className="hidden md:flex items-center space-x-5 text-sm">
            <a href="#" className="text-teal-600 font-semibold hover:underline">
              Flights
            </a>
            <a href="#" className="hover:text-teal-600">
              Cars
            </a>
            <a href="#" className="hover:text-teal-600">
              Stays
            </a>
            <a href="#" className="hover:text-teal-600">
              Magazine
            </a>
            <a href="#" className="hover:text-teal-600">
              Travel hacks
            </a>
            <a href="#" className="hover:text-teal-600">
              Deals
            </a>
          </nav>
        </div>

    
        <div className="flex items-center space-x-4 md:space-x-6">
          {/*  Desktop */}
          <div className="hidden md:flex items-center space-x-1 text-sm relative">
            <div 
              className="flex items-center cursor-pointer"
              onClick={toggleCurrencyMenu}
            >
              <FiGlobe className="text-gray-700" />
              <span className="font-medium mx-1">USD</span>
              <FiChevronDown className={`text-xs transition-transform ${isCurrencyOpen ? 'transform rotate-180' : ''}`} />
            </div>
            
            {isCurrencyOpen && (
              <div className="absolute top-full right-0 mt-2 w-32 bg-white shadow-lg rounded-md py-1 z-10">
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">USD ($)</a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">EUR (€)</a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">GBP (£)</a>
              </div>
            )}
          </div>

          {/* Desktop */}
          <a href="#" className="hidden md:block text-sm font-medium hover:text-teal-600">
            Help & support
          </a>

          <div className="hidden md:flex items-center space-x-1 text-sm">
            <FiUser className="text-gray-700" />
            <a href="#" className="font-medium hover:text-teal-600">
              Sign in
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <FiX className="text-xl" />
            ) : (
              <FiMenu className="text-xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white py-2 px-4 shadow-md">
          <nav className="flex flex-col space-y-3">
            <a href="#" className="text-teal-600 font-semibold py-2 border-b border-gray-100">
              Flights
            </a>
            <a href="#" className="py-2 border-b border-gray-100">
              Cars
            </a>
            <a href="#" className="py-2 border-b border-gray-100">
              Stays
            </a>
            <a href="#" className="py-2 border-b border-gray-100">
              Magazine
            </a>
            <a href="#" className="py-2 border-b border-gray-100">
              Travel hacks
            </a>
            <a href="#" className="py-2 border-b border-gray-100">
              Deals
            </a>
          </nav>

          <div className="mt-4 pt-4 border-t border-gray-200">
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <FiGlobe className="text-gray-700 mr-2" />
                <span>Currency</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">USD</span>
                <FiChevronDown className="text-xs" />
              </div>
            </div>

      
            <a href="#" className="block py-2 text-sm font-medium">
              Help & support
            </a>

            
            <div className="flex items-center py-2">
              <FiUser className="text-gray-700 mr-2" />
              <a href="#" className="font-medium">
                Sign in
              </a>
            </div>
          </div>
        </div>
      )}


      <div className="h-[3px] bg-teal-600 relative">
        <span className="absolute right-[20px] w-[10px] h-full bg-blue-800"></span>
        <span className="absolute right-[10px] w-[10px] h-full bg-yellow-400"></span>
      </div>
    </header>
  );
};

export default NavBar;