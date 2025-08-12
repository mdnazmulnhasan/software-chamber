import React from "react";

const SidebarFiltersRight = () => {
  return (
    <div className=" rounded-lg shadow-md border border-gray-200 overflow-hidden bg-white">
      {/* Top button */}
      <div className="text-center border-b border-gray-200">
        <button className="w-full py-3 text-gray-800 text-sm font-medium hover:bg-gray-100">
          <div className="flex flex-col items-center">
            <span className="text-lg">⬛</span> {/* Replace with icon if needed */}
            Pricing table
          </div>
        </button>
      </div>

      {/* Card image */}
      <div className="bg-teal-900">
        <img
          src="https://images.unsplash.com/photo-1571066811602-716837d681de?q=80&w=800&auto=format&fit=crop" // Replace with actual image URL
          alt="Travel Package"
          className="w-full h-36 object-cover"
        />
      </div>

      {/* Card content */}
      <div className="p-4 text-center">
        <h2 className="text-lg font-bold text-gray-900">
          The ultimate travel package
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          The Kiwi.com Guarantee provides instant solutions to disruptions,
          continuous support, and automated travel services.
        </p>
        <button className="mt-4 bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 text-sm font-medium">
          Discover more
        </button>
      </div>
    </div>
  );
};

export default SidebarFiltersRight;
