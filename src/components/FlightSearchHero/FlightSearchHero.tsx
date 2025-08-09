// src/components/FlightSearchHero.tsx
import React from "react";
import { FiUser, FiRefreshCw } from "react-icons/fi";
import { BsSuitcase } from "react-icons/bs";

const FlightSearchHero = () => {
  return (
    <section className="bg-teal-700 text-white py-12 relative">
      {/* Background Binary Pattern */}
      <div className="absolute inset-0 opacity-20 text-center text-sm tracking-widest select-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i}>
            0 1 1 0 1 0 0 1 0 1 0 1 1 0 1 1 0 0 1 1 0 1
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Heading */}
        <h1 className="text-3xl font-semibold mb-2 tracking-widest">
          <span className="text-white">YOU </span>
          <span className="text-white font-light">FLY</span>{" "}
          <span className="text-white">FOR</span>{" "}
          <span className="text-white">LESS</span>
        </h1>
        <p className="mb-6 text-lg">
          Book cheap flights other sites simply can’t find.
        </p>

        {/* Search Box */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-wrap items-center gap-3 text-black">
          {/* Trip Type */}
          <div className="flex items-center space-x-1 border-r pr-3">
            <span>Return</span>
            <span className="text-gray-500">▼</span>
          </div>

          {/* Class */}
          <div className="flex items-center space-x-1 border-r pr-3">
            <span>Economy</span>
            <span className="text-gray-500">▼</span>
          </div>

          {/* Passenger */}
          <div className="flex items-center space-x-1 border-r pr-3">
            <FiUser className="text-gray-600" />
            <span>1 Passenger</span>
            <span className="text-gray-500">▼</span>
          </div>

          {/* Bags */}
          <div className="flex items-center space-x-2 border-r pr-3">
            <BsSuitcase className="text-gray-600" />
            <span>1</span>
            <BsSuitcase className="text-gray-600" />
            <span>1</span>
          </div>

          {/* From */}
          <div className="flex items-center border rounded px-2 py-1 space-x-2">
            <span className="text-gray-500">From</span>
            <span className="bg-teal-600 text-white px-2 py-0.5 rounded">
              Dhaka ✕
            </span>
          </div>

          {/* To */}
          <div className="flex items-center border rounded px-2 py-1 space-x-2">
            <FiRefreshCw className="text-gray-500" />
            <span className="text-gray-500">To</span>
            <span className="bg-orange-500 text-white px-2 py-0.5 rounded">
              Dubai ✕
            </span>
            <span className="text-teal-600 font-medium">Add more</span>
          </div>

          {/* Departure */}
          <div className="flex items-center border rounded px-2 py-1 space-x-2">
            <span className="text-gray-500">Departure</span>
            <span>Sat, 16 Aug – Tue, 16</span>
          </div>

          {/* Length */}
          <div className="flex items-center border rounded px-2 py-1 space-x-2">
            <span className="text-gray-500">Length</span>
            <span>2 – 8 nights</span>
          </div>

          {/* Search Button */}
          <button className="bg-teal-700 text-white px-4 py-2 rounded">
            Search
          </button>
        </div>

        {/* Checkbox */}
        <div className="mt-3 flex items-center space-x-2">
          <input type="checkbox" className="w-4 h-4" />
          <span>
            Check accommodation with{" "}
            <span className="text-blue-600 font-medium">Booking.com</span>
          </span>
        </div>
      </div>
    </section>
  );
};

export default FlightSearchHero;
