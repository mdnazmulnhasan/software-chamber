// SidebarFilters.tsx
import React, { useState } from "react";
import { IoChevronDownCircleOutline, IoChevronUpCircleOutline } from "react-icons/io5";
import { PiMinusCircleDuotone, PiPlusCircleDuotone } from "react-icons/pi";


export default function SidebarFiltersLeft() {
  const [priceAlerts, setPriceAlerts] = useState(false);
  const [cabinBags, setCabinBags] = useState(0);
  const [checkedBags, setCheckedBags] = useState(0);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    bags: true,
    stops: true,
    connections: true,
    carriers: false,
    booking: false,
  });
  const [stops, setStops] = useState("Any");
  const [allowOvernight, setAllowOvernight] = useState(true);
  const [connections, setConnections] = useState({
    selfTransfer: true,
    returnDifferentStation: true,
    arriveDifferentStation: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className=" bg-white border-r border-gray-200 p-4 text-sm">
      {/* Price Alerts */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium">Set up price alerts</h3>
          <p className="text-gray-500 text-xs">
            Receive alerts when the prices for this route change.
          </p>
        </div>
        <button
          onClick={() => setPriceAlerts(!priceAlerts)}
          className={`w-10 h-5 rounded-full flex items-center transition ${
            priceAlerts ? "bg-blue-500" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full shadow transform transition ${
              priceAlerts ? "translate-x-5" : "translate-x-1"
            }`}
          ></div>
        </button>
      </div>

      {/* Bags */}
      <div className="border-t border-gray-200 py-3">
        <button
          onClick={() => toggleSection("bags")}
          className="flex items-center justify-between w-full font-medium"
        >
          Bags
          {openSections.bags ? (
            <IoChevronUpCircleOutline className="w-4 h-4" />
          ) : (
            <IoChevronDownCircleOutline className="w-4 h-4" />
          )}
        </button>
        {openSections.bags && (
          <div className="mt-3 space-y-3">
            {/* Cabin */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span>🧳</span> Cabin baggage
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCabinBags(Math.max(0, cabinBags - 1))}
                  className="p-1 border rounded"
                >
                  <PiMinusCircleDuotone className="w-3 h-3" />
                </button>
                <span>{cabinBags}</span>
                <button
                  onClick={() => setCabinBags(cabinBags + 1)}
                  className="p-1 border rounded"
                >
                  <PiPlusCircleDuotone className="w-3 h-3" />
                </button>
              </div>
            </div>
            {/* Checked */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span>🛄</span> Checked baggage
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCheckedBags(Math.max(0, checkedBags - 1))}
                  className="p-1 border rounded"
                >
                  <PiMinusCircleDuotone className="w-3 h-3" />
                </button>
                <span>{checkedBags}</span>
                <button
                  onClick={() => setCheckedBags(checkedBags + 1)}
                  className="p-1 border rounded"
                >
                  <PiPlusCircleDuotone className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stops */}
      <div className="border-t border-gray-200 py-3">
        <button
          onClick={() => toggleSection("stops")}
          className="flex items-center justify-between w-full font-medium"
        >
          Stops
          {openSections.stops ? (
            <IoChevronUpCircleOutline className="w-4 h-4" />
          ) : (
            <IoChevronDownCircleOutline className="w-4 h-4" />
          )}
        </button>
        {openSections.stops && (
          <div className="mt-3 space-y-2">
            {["Any", "Direct", "Up to 1 stop", "Up to 2 stops"].map((stop) => (
              <label key={stop} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="stops"
                  value={stop}
                  checked={stops === stop}
                  onChange={() => setStops(stop)}
                  className="text-blue-500"
                />
                {stop}
              </label>
            ))}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={allowOvernight}
                onChange={() => setAllowOvernight(!allowOvernight)}
                className="text-blue-500"
              />
              Allow overnight stopovers
            </label>
          </div>
        )}
      </div>

      {/* Connections */}
      <div className="border-t border-gray-200 py-3">
        <button
          onClick={() => toggleSection("connections")}
          className="flex items-center justify-between w-full font-medium"
        >
          Connections
          {openSections.connections ? (
            <IoChevronUpCircleOutline className="w-4 h-4" />
          ) : (
            <IoChevronDownCircleOutline className="w-4 h-4" />
          )}
        </button>
        {openSections.connections && (
          <div className="mt-3 space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={connections.selfTransfer}
                onChange={() =>
                  setConnections((prev) => ({
                    ...prev,
                    selfTransfer: !prev.selfTransfer,
                  }))
                }
                className="text-blue-500"
              />
              Self-transfer to different station/airport
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={connections.returnDifferentStation}
                onChange={() =>
                  setConnections((prev) => ({
                    ...prev,
                    returnDifferentStation: !prev.returnDifferentStation,
                  }))
                }
                className="text-blue-500"
              />
              Allow return from a different station/airport
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={connections.arriveDifferentStation}
                onChange={() =>
                  setConnections((prev) => ({
                    ...prev,
                    arriveDifferentStation: !prev.arriveDifferentStation,
                  }))
                }
                className="text-blue-500"
              />
              Allow return to a different station/airport
            </label>
          </div>
        )}
      </div>

      {/* Carriers */}
      <div className="border-t border-gray-200 py-3">
        <button
          onClick={() => toggleSection("carriers")}
          className="flex items-center justify-between w-full font-medium"
        >
          Carriers
          {openSections.carriers ? (
            <IoChevronUpCircleOutline className="w-4 h-4" />
          ) : (
            <IoChevronDownCircleOutline className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Booking options */}
      <div className="border-t border-gray-200 py-3">
        <button
          onClick={() => toggleSection("booking")}
          className="flex items-center justify-between w-full font-medium"
        >
          Booking options
          {openSections.booking ? (
            <IoChevronUpCircleOutline className="w-4 h-4" />
          ) : (
            <IoChevronDownCircleOutline className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
