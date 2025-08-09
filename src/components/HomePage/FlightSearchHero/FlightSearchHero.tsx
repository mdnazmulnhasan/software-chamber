// app/components/FlightSearchHero.tsx
'use client';

import { useState } from "react";
import { FiUser, FiRefreshCw, FiArrowRight } from "react-icons/fi";
import { BsSuitcase } from "react-icons/bs";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface SearchParams {
  tripType: string;
  class: string;
  passengers: number;
  cabinBags: number;
  checkedBags: number;
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate: Date | null;
  minNights: number;
  maxNights: number;
}

const FlightSearchHero = () => {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    tripType: "return",
    class: "economy",
    passengers: 1,
    cabinBags: 1,
    checkedBags: 0,
    origin: "DAC",
    destination: "DXB",
    departureDate: new Date(),
    returnDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    minNights: 2,
    maxNights: 8,
  });

  const [isOneWay, setIsOneWay] = useState(false);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);

  const popularAirports = [
    { code: "DAC", name: "Dhaka", city: "Dhaka" },
    { code: "DXB", name: "Dubai Intl", city: "Dubai" },
    { code: "JFK", name: "John F Kennedy", city: "New York" },
    { code: "LHR", name: "Heathrow", city: "London" },
    { code: "SIN", name: "Changi", city: "Singapore" },
    { code: "BKK", name: "Suvarnabhumi", city: "Bangkok" },
    { code: "KUL", name: "Kuala Lumpur Intl", city: "Kuala Lumpur" },
  ];

  const handleSearch = async () => {
    try {
      const params = {
        originLocationCode: searchParams.origin,
        destinationLocationCode: searchParams.destination,
        departureDate: searchParams.departureDate.toISOString().split('T')[0],
        returnDate: isOneWay ? undefined : searchParams.returnDate?.toISOString().split('T')[0],
        adults: searchParams.passengers,
        travelClass: searchParams.class.toUpperCase(),
        nonStop: false,
        max: 50
      };

      // Store search params in localStorage to use on results page
      if (typeof window !== 'undefined') {
        localStorage.setItem('flightSearchParams', JSON.stringify(params));
      }
      
      // Navigate to results page
      router.push('/flights/results');
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleSwapLocations = () => {
    setSearchParams({
      ...searchParams,
      origin: searchParams.destination,
      destination: searchParams.origin
    });
  };

  const handleAirportSelect = (code: string, isOrigin: boolean) => {
    if (isOrigin) {
      setSearchParams({ ...searchParams, origin: code });
      setShowOriginDropdown(false);
    } else {
      setSearchParams({ ...searchParams, destination: code });
      setShowDestinationDropdown(false);
    }
  };

  const getAirportName = (code: string) => {
    const airport = popularAirports.find(a => a.code === code);
    return airport ? `${airport.city} (${airport.code})` : code;
  };

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

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Heading */}
        <h1 className="text-3xl font-semibold mb-2 tracking-widest">
          <span className="text-white">YOU </span>
          <span className="text-white font-light">FLY</span>{" "}
          <span className="text-white">FOR</span>{" "}
          <span className="text-white">LESS</span>
        </h1>
        <p className="mb-6 text-lg">
          Book cheap flights other sites simply can&apos;t find.
        </p>

        {/* Search Box */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-wrap items-center gap-3 text-black">
          {/* Trip Type */}
          <div className="flex items-center space-x-1 border-r pr-3">
            <select
              value={searchParams.tripType}
              onChange={(e) => {
                setIsOneWay(e.target.value === "one-way");
                setSearchParams({
                  ...searchParams,
                  tripType: e.target.value,
                  returnDate: e.target.value === "one-way" ? null : new Date(new Date().setDate(new Date().getDate() + 7))
                });
              }}
              className="border-none focus:ring-0 p-0"
            >
              <option value="return">Return</option>
              <option value="one-way">One-way</option>
            </select>
          </div>

          {/* Class */}
          <div className="flex items-center space-x-1 border-r pr-3">
            <select
              value={searchParams.class}
              onChange={(e) => setSearchParams({ ...searchParams, class: e.target.value })}
              className="border-none focus:ring-0 p-0"
            >
              <option value="economy">Economy</option>
              <option value="premium">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">First</option>
            </select>
          </div>

          {/* Passenger */}
          <div className="flex items-center space-x-1 border-r pr-3">
            <FiUser className="text-gray-600" />
            <select
              value={searchParams.passengers}
              onChange={(e) => setSearchParams({ ...searchParams, passengers: parseInt(e.target.value) })}
              className="border-none focus:ring-0 p-0"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
              ))}
            </select>
          </div>

          {/* Bags */}
          <div className="flex items-center space-x-2 border-r pr-3">
            <BsSuitcase className="text-gray-600" />
            <select
              value={searchParams.cabinBags}
              onChange={(e) => setSearchParams({ ...searchParams, cabinBags: parseInt(e.target.value) })}
              className="border-none focus:ring-0 p-0 w-8"
            >
              {[0, 1, 2].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <BsSuitcase className="text-gray-600" />
            <select
              value={searchParams.checkedBags}
              onChange={(e) => setSearchParams({ ...searchParams, checkedBags: parseInt(e.target.value) })}
              className="border-none focus:ring-0 p-0 w-8"
            >
              {[0, 1, 2].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          {/* From */}
          <div className="flex items-center border rounded px-2 py-1 space-x-2 relative">
            <span className="text-gray-500">From</span>
            <div 
              className="bg-teal-600 text-white px-2 py-0.5 rounded cursor-pointer"
              onClick={() => setShowOriginDropdown(!showOriginDropdown)}
            >
              {getAirportName(searchParams.origin)} ✕
            </div>
            {showOriginDropdown && (
              <div className="absolute top-10 left-0 z-20 bg-white border rounded shadow-lg w-64">
                {popularAirports.map(airport => (
                  <div 
                    key={airport.code}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleAirportSelect(airport.code, true)}
                  >
                    <div className="font-medium">{airport.city}</div>
                    <div className="text-sm text-gray-600">{airport.name} ({airport.code})</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Swap button */}
          <button 
            onClick={handleSwapLocations}
            className="p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
          >
            <FiRefreshCw className="text-sm" />
          </button>

          {/* To */}
          <div className="flex items-center border rounded px-2 py-1 space-x-2 relative">
            <span className="text-gray-500">To</span>
            <div 
              className="bg-orange-500 text-white px-2 py-0.5 rounded cursor-pointer"
              onClick={() => setShowDestinationDropdown(!showDestinationDropdown)}
            >
              {getAirportName(searchParams.destination)} ✕
            </div>
            {showDestinationDropdown && (
              <div className="absolute top-10 left-0 z-20 bg-white border rounded shadow-lg w-64">
                {popularAirports.map(airport => (
                  <div 
                    key={airport.code}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleAirportSelect(airport.code, false)}
                  >
                    <div className="font-medium">{airport.city}</div>
                    <div className="text-sm text-gray-600">{airport.name} ({airport.code})</div>
                  </div>
                ))}
              </div>
            )}
            <span className="text-teal-600 font-medium cursor-pointer">Add more</span>
          </div>

          {/* Departure */}
          <div className="flex items-center border rounded px-2 py-1 space-x-2">
            <span className="text-gray-500">Departure</span>
            <DatePicker
              selected={searchParams.departureDate}
              onChange={(date: Date) => setSearchParams({ ...searchParams, departureDate: date })}
              className="border-none p-0 w-32"
              minDate={new Date()}
            />
          </div>

          {/* Return (conditionally rendered) */}
          {!isOneWay && (
            <div className="flex items-center border rounded px-2 py-1 space-x-2">
              <span className="text-gray-500">Return</span>
              <DatePicker
                selected={searchParams.returnDate}
                onChange={(date: Date) => setSearchParams({ ...searchParams, returnDate: date })}
                className="border-none p-0 w-32"
                minDate={searchParams.departureDate}
              />
            </div>
          )}

          {/* Length (conditionally rendered for return trips) */}
          {!isOneWay && (
            <div className="flex items-center border rounded px-2 py-1 space-x-2">
              <span className="text-gray-500">Length</span>
              <select
                value={`${searchParams.minNights} – ${searchParams.maxNights}`}
                onChange={(e) => {
                  const [min, max] = e.target.value.split(' – ').map(Number);
                  setSearchParams({
                    ...searchParams,
                    minNights: min,
                    maxNights: max
                  });
                }}
                className="border-none focus:ring-0 p-0"
              >
                <option value="2 – 8">2 – 8 nights</option>
                <option value="5 – 10">5 – 10 nights</option>
                <option value="7 – 14">7 – 14 nights</option>
                <option value="10 – 21">10 – 21 nights</option>
              </select>
            </div>
          )}

          {/* Search Button */}
          <button 
            onClick={handleSearch}
            className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800 flex items-center"
          >
            Search <FiArrowRight className="ml-2" />
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