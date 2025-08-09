
// // app/components/FlightSearchHero.tsx
// 'use client';

// import { useState, useRef, useEffect } from "react";
// import { FiUser, FiRefreshCw, FiArrowRight } from "react-icons/fi";
// import { BsSuitcase } from "react-icons/bs";
// import { useRouter } from "next/navigation";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import PassengerBaggageSelector from "@/components/PassengerBaggageSelector/PassengerBaggageSelector";

// interface SearchParams {
//   originLocationCode: string;
//   destinationLocationCode: string;
//   departureDate: string;
//   returnDate?: string;
//   adults: number;
//   travelClass: string;
//   nonStop: boolean;
//   max: number;
// }

// interface Airport {
//   code: string;
//   name: string;
//   city: string;
// }

// interface LocationSection {
//   label: string;
//   items: LocationItem[];
// }

// interface LocationItem {
//   icon: string;
//   name: string;
//   code?: string;
// }

// const FlightSearchHero = () => {
//   const router = useRouter();
//   const [searchParams, setSearchParams] = useState<Omit<SearchParams, 'max'>>({
//     originLocationCode: "DAC",
//     destinationLocationCode: "DXB",
//     departureDate: new Date().toISOString().split('T')[0],
//     returnDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
//     adults: 1,
//     travelClass: "ECONOMY",
//     nonStop: false,
//   });

//   const [isOneWay, setIsOneWay] = useState(false);
//   const [showOriginDropdown, setShowOriginDropdown] = useState(false);
//   const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
//   const [originInputFocused, setOriginInputFocused] = useState(false);
//   const [destinationInputFocused, setDestinationInputFocused] = useState(false);
//   const originContainerRef = useRef<HTMLDivElement>(null);
//   const destinationContainerRef = useRef<HTMLDivElement>(null);

//   const popularAirports: Airport[] = [
//     { code: "DAC", name: "Shahjalal International", city: "Dhaka" },
//     { code: "DXB", name: "Dubai International", city: "Dubai" },
//     { code: "JFK", name: "John F Kennedy", city: "New York" },
//     { code: "LHR", name: "Heathrow", city: "London" },
//     { code: "SIN", name: "Changi", city: "Singapore" },
//     { code: "BKK", name: "Suvarnabhumi", city: "Bangkok" },
//     { code: "KUL", name: "Kuala Lumpur Intl", city: "Kuala Lumpur" },
//   ];

//   const locationSections: LocationSection[] = [
//     {
//       label: "Your locations",
//       items: [
//         { icon: "🏢", name: "Dhaka, Bangladesh", code: "DAC" },
//       ],
//     },
//     {
//       label: "Near you",
//       items: [
//         { icon: "🏢", name: "Dhaka, Bangladesh", code: "DAC" },
//         { icon: "↔️", name: "250 km around Dhaka" },
//         { icon: "✈️", name: "DAC Dhaka - Shahjalal International Airport", code: "DAC" },
//       ],
//     },
//     {
//       label: "Popular airports",
//       items: popularAirports.map(airport => ({
//         icon: "✈️",
//         name: `${airport.city} (${airport.code}) - ${airport.name}`,
//         code: airport.code
//       }))
//     }
//   ];

//   // Close dropdown on outside click
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (originContainerRef.current && !originContainerRef.current.contains(event.target as Node)) {
//         setShowOriginDropdown(false);
//         setOriginInputFocused(false);
//       }
//       if (destinationContainerRef.current && !destinationContainerRef.current.contains(event.target as Node)) {
//         setShowDestinationDropdown(false);
//         setDestinationInputFocused(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleSearch = async () => {
//     try {
//       const params = {
//         ...searchParams,
//         max: 50,
//         returnDate: isOneWay ? undefined : searchParams.returnDate
//       };

//       localStorage.setItem('flightSearchParams', JSON.stringify(params));
//       router.push('/flights/results');
//     } catch (error) {
//       console.error('Search error:', error);
//     }
//   };

  
//   const handlePassengersChange = (passengers: {
//     adults: number;
//     children: number;
//     infants: number;
//   }) => {
//     setSearchParams(prev => ({
//       ...prev,
//       adults: passengers.adults,
//       // You might want to add children and infants to your searchParams if needed
//     }));
//   };


//   const handleSwapLocations = () => {
//     setSearchParams({
//       ...searchParams,
//       originLocationCode: searchParams.destinationLocationCode,
//       destinationLocationCode: searchParams.originLocationCode
//     });
//   };

//   const handleAirportSelect = (code: string, isOrigin: boolean) => {
//     if (isOrigin) {
//       setSearchParams({ ...searchParams, originLocationCode: code });
//       setShowOriginDropdown(false);
//       setOriginInputFocused(false);
//     } else {
//       setSearchParams({ ...searchParams, destinationLocationCode: code });
//       setShowDestinationDropdown(false);
//       setDestinationInputFocused(false);
//     }
//   };

//   const getAirportName = (code: string) => {
//     const airport = popularAirports.find(a => a.code === code);
//     return airport ? `${airport.city} (${airport.code})` : code;
//   };

//   const renderLocationDropdown = (isOrigin: boolean) => {
//     const containerRef = isOrigin ? originContainerRef : destinationContainerRef;
//     const showDropdown = isOrigin ? showOriginDropdown : showDestinationDropdown;
//     const currentCode = isOrigin ? searchParams.originLocationCode : searchParams.destinationLocationCode;

//     return (
//       <div className="absolute z-50 top-full left-0 mt-1 w-full max-h-72 overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg text-black">
//         {/* Recent search */}
//         <div className="px-4 py-3 border-b border-gray-200 text-sm text-gray-500 flex items-center gap-2">
//           <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
//             <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l4 2" />
//           </svg>
//           <span className="font-semibold">Dhaka ⇄ Dubai</span>
//           <span className="ml-auto text-gray-400 text-xs">16/08 – 16/09 · 2 – 8 nights</span>
//         </div>

//         {locationSections.map((section) => (
//           <div key={section.label} className="p-4 last:border-b-0 border-b border-gray-100">
//             <h3 className="mb-2 text-xs font-semibold text-gray-400">{section.label}</h3>
//             <ul className="space-y-2">
//               {section.items.map((item, idx) => (
//                 <li
//                   key={idx}
//                   className="flex items-center justify-between cursor-pointer rounded-md hover:bg-blue-50 px-2 py-1"
//                   onClick={() => item.code && handleAirportSelect(item.code, isOrigin)}
//                 >
//                   <div className="flex items-center gap-2 text-gray-700">
//                     <span className="text-lg">{item.icon}</span>
//                     <span className="font-medium">{item.name}</span>
//                   </div>
//                   {item.code && item.code === currentCode && (
//                     <span className="text-blue-600 text-sm">Selected</span>
//                   )}
//                   {item.code && item.code !== currentCode && (
//                     <button
//                       type="button"
//                       className="flex items-center justify-center w-7 h-7 rounded bg-blue-100 hover:bg-blue-200 text-blue-600 text-xl font-bold"
//                       aria-label={`Select ${item.name}`}
//                     >
//                       +
//                     </button>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <section className="bg-teal-700 text-white py-12 relative">
//       <div className="absolute inset-0 opacity-20 text-center text-sm tracking-widest select-none">
//         {Array.from({ length: 20 }).map((_, i) => (
//           <div key={i}>0 1 1 0 1 0 0 1 0 1 0 1 1 0 1 1 0 0 1 1 0 1</div>
//         ))}
//       </div>

//       <div className="relative z-10 max-w-7xl mx-auto px-4">
//         <h1 className="text-3xl font-semibold mb-2 tracking-widest">
//           <span className="text-white">YOU </span>
//           <span className="text-white font-light">FLY</span>{" "}
//           <span className="text-white">FOR</span>{" "}
//           <span className="text-white">LESS</span>
//         </h1>
//         <p className="mb-6 text-lg">
//           Book cheap flights other sites simply can't find.
//         </p>

//         <div className="bg-white rounded-lg shadow p-4 flex flex-wrap items-center gap-3 text-black">
//           <div className="flex items-center space-x-1 border-r pr-3">
//             <select
//               value={isOneWay ? "one-way" : "return"}
//               onChange={(e) => {
//                 setIsOneWay(e.target.value === "one-way");
//               }}
//               className="border-none focus:ring-0 p-0"
//             >
//               <option value="return">Return</option>
//               <option value="one-way">One-way</option>
//             </select>
//           </div>

//           <div className="flex items-center space-x-1 border-r pr-3">
//             <select
//               value={searchParams.travelClass}
//               onChange={(e) => setSearchParams({ ...searchParams, travelClass: e.target.value })}
//               className="border-none focus:ring-0 p-0"
//             >
//               <option value="ECONOMY">Economy</option>
//               <option value="PREMIUM_ECONOMY">Premium Economy</option>
//               <option value="BUSINESS">Business</option>
//               <option value="FIRST">First</option>
//             </select>
//           </div>


//           <PassengerBaggageSelector 
//           onPassengersChange={handlePassengersChange}
//           initialValues={{
//             passengers: {
//               adults: searchParams.adults,
//               children: 0,
//               infants: 0
//             }
//           }}
//         />

//           <div ref={originContainerRef} className="relative">
//             <div className="flex items-center border rounded px-2 py-1 space-x-2">
//               <span className="text-gray-500">From</span>
//               <input
//                 type="text"
//                 placeholder="City or airport"
//                 value={getAirportName(searchParams.originLocationCode)}
//                 onFocus={() => {
//                   setShowOriginDropdown(true);
//                   setOriginInputFocused(true);
//                 }}
//                 onChange={(e) => {
//                   // You can implement search functionality here
//                 }}
//                 className="border-none focus:ring-0 p-0 w-40"
//               />
//             </div>
//             {originInputFocused && showOriginDropdown && renderLocationDropdown(true)}
//           </div>

//           <button 
//             onClick={handleSwapLocations}
//             className="p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
//           >
//             <FiRefreshCw className="text-sm" />
//           </button>

//           <div ref={destinationContainerRef} className="relative">
//             <div className="flex items-center border rounded px-2 py-1 space-x-2">
//               <span className="text-gray-500">To</span>
//               <input
//                 type="text"
//                 placeholder="City or airport"
//                 value={getAirportName(searchParams.destinationLocationCode)}
//                 onFocus={() => {
//                   setShowDestinationDropdown(true);
//                   setDestinationInputFocused(true);
//                 }}
//                 onChange={(e) => {
//                   // You can implement search functionality here
//                 }}
//                 className="border-none focus:ring-0 p-0 w-40"
//               />
//             </div>
//             {destinationInputFocused && showDestinationDropdown && renderLocationDropdown(false)}
//           </div>

//           <div className="flex items-center border rounded px-2 py-1 space-x-2">
//             <span className="text-gray-500">Departure</span>
//             <DatePicker
//               selected={new Date(searchParams.departureDate)}
//               onChange={(date: Date) => setSearchParams({ 
//                 ...searchParams, 
//                 departureDate: date.toISOString().split('T')[0] 
//               })}
//               className="border-none p-0 w-32"
//               minDate={new Date()}
//             />
//           </div>

//           {!isOneWay && (
//             <div className="flex items-center border rounded px-2 py-1 space-x-2">
//               <span className="text-gray-500">Return</span>
//               <DatePicker
//                 selected={new Date(searchParams.returnDate!)}
//                 onChange={(date: Date) => setSearchParams({ 
//                   ...searchParams, 
//                   returnDate: date.toISOString().split('T')[0] 
//                 })}
//                 className="border-none p-0 w-32"
//                 minDate={new Date(searchParams.departureDate)}
//               />
//             </div>
//           )}

//           <button 
//             onClick={handleSearch}
//             className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800 flex items-center"
//           >
//             Search <FiArrowRight className="ml-2" />
//           </button>
//         </div>

//         <div className="mt-3 flex items-center space-x-2">
//           <input type="checkbox" className="w-4 h-4" />
//           <span>
//             Check accommodation with{" "}
//             <span className="text-blue-600 font-medium">Booking.com</span>
//           </span>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FlightSearchHero;


















// app/components/FlightSearchHero.tsx
'use client';

import { useState } from "react";
import { FiRefreshCw, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";
import PassengerBaggageSelector from "@/components/PassengerBaggageSelector/PassengerBaggageSelector";
import { LocationInput } from "@/components/LocationInput/LocationInput";

interface SearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  originName?: string;
  destinationName?: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  travelClass: string;
  nonStop: boolean;
  max: number;
}

interface LocationItem {
  icon?: string;
  name: string;
  code: string;
  type: 'airport' | 'city';
}

const FlightSearchHero = () => {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<Omit<SearchParams, 'max'>>({
    originLocationCode: "DAC",
    destinationLocationCode: "DXB",
    originName: "Dhaka (DAC)",
    destinationName: "Dubai (DXB)",
    departureDate: new Date().toISOString().split('T')[0],
    returnDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
    adults: 1,
    travelClass: "ECONOMY",
    nonStop: false,
  });

  













  interface SearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  originName?: string;
  destinationName?: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  travelClass: string;
  nonStop: boolean;
  max: number;
}

interface LocationItem {
  icon?: string;
  name: string;
  code: string;
  type: 'airport' | 'city';
  cityName?: string;
  countryName?: string;
  detailedName?: string;
}


  const [isOneWay, setIsOneWay] = useState(false);

  const searchLocations = async (query: string): Promise<LocationItem[]> => {
    try {
      const response = await fetch(`/api/locations?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Failed to fetch locations");
      
      const data = await response.json();
      if (!data.success) throw new Error(data.message || "Failed to fetch locations");
      
      return data.data.map((item: any) => ({
        name: item.name,
        code: item.iataCode,
        type: item.subType === 'AIRPORT' ? 'airport' : 'city',
        cityName: item.cityName,
        countryName: item.countryName,
        detailedName: item.detailedName
      }));
    } catch (error) {
      console.error("Location search error:", error);
      return [];
    }
  };

  const handleSearch = async () => {
    try {
      const params = {
        ...searchParams,
        max: 50,
        returnDate: isOneWay ? undefined : searchParams.returnDate
      };

      localStorage.setItem('flightSearchParams', JSON.stringify(params));
      router.push('/flights/results');
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handlePassengersChange = (passengers: {
    adults: number;
    children: number;
    infants: number;
  }) => {
    setSearchParams(prev => ({
      ...prev,
      adults: passengers.adults,
    }));
  };

  const handleSwapLocations = () => {
    setSearchParams({
      ...searchParams,
      originLocationCode: searchParams.destinationLocationCode,
      destinationLocationCode: searchParams.originLocationCode,
      originName: searchParams.destinationName,
      destinationName: searchParams.originName,
    });
  };

  return (
    <motion.section 
      className="bg-teal-700 text-white py-12 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 opacity-20 text-center text-sm tracking-widest select-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i}>0 1 1 0 1 0 0 1 0 1 0 1 1 0 1 1 0 0 1 1 0 1</div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-semibold mb-2 tracking-widest">
            <span className="text-white">YOU </span>
            <span className="text-white font-light">FLY</span>{" "}
            <span className="text-white">FOR</span>{" "}
            <span className="text-white">LESS</span>
          </h1>
          <p className="mb-6 text-lg">
            Book cheap flights other sites simply can't find.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow p-4 flex flex-wrap items-center gap-3 text-black"
        >
          <div className="flex items-center space-x-1 border-r pr-3">
            <select
              value={isOneWay ? "one-way" : "return"}
              onChange={(e) => setIsOneWay(e.target.value === "one-way")}
              className="border-none focus:ring-0 p-0"
            >
              <option value="return">Return</option>
              <option value="one-way">One-way</option>
            </select>
          </div>

          <div className="flex items-center space-x-1 border-r pr-3">
            <select
              value={searchParams.travelClass}
              onChange={(e) => setSearchParams({ ...searchParams, travelClass: e.target.value })}
              className="border-none focus:ring-0 p-0"
            >
              <option value="ECONOMY">Economy</option>
              <option value="PREMIUM_ECONOMY">Premium Economy</option>
              <option value="BUSINESS">Business</option>
              <option value="FIRST">First</option>
            </select>
          </div>

          <PassengerBaggageSelector 
            onPassengersChange={handlePassengersChange}
            initialValues={{
              passengers: {
                adults: searchParams.adults,
                children: 0,
                infants: 0
              }
            }}
          />

          <LocationInput
            label="From"
            value={searchParams.originName || ""}
            onSelect={(code, name) => setSearchParams(prev => ({
              ...prev,
              originLocationCode: code,
              originName: name
            }))}
            onSearch={searchLocations}
          />

          <motion.button 
            onClick={handleSwapLocations}
            className="p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiRefreshCw className="text-sm" />
          </motion.button>

          <LocationInput
            label="To"
            value={searchParams.destinationName || ""}
            onSelect={(code, name) => setSearchParams(prev => ({
              ...prev,
              destinationLocationCode: code,
              destinationName: name
            }))}
            onSearch={searchLocations}
          />

          <div className="flex items-center border rounded px-2 py-1 space-x-2">
            <span className="text-gray-500">Departure</span>
            <DatePicker
              selected={new Date(searchParams.departureDate)}
              onChange={(date: Date) => setSearchParams({ 
                ...searchParams, 
                departureDate: date.toISOString().split('T')[0] 
              })}
              className="border-none p-0 w-32"
              minDate={new Date()}
            />
          </div>

          {!isOneWay && (
            <div className="flex items-center border rounded px-2 py-1 space-x-2">
              <span className="text-gray-500">Return</span>
              <DatePicker
                selected={new Date(searchParams.returnDate!)}
                onChange={(date: Date) => setSearchParams({ 
                  ...searchParams, 
                  returnDate: date.toISOString().split('T')[0] 
                })}
                className="border-none p-0 w-32"
                minDate={new Date(searchParams.departureDate)}
              />
            </div>
          )}

          <motion.button 
            onClick={handleSearch}
            className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800 flex items-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Search <FiArrowRight className="ml-2" />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-3 flex items-center space-x-2"
        >
          <input type="checkbox" className="w-4 h-4" />
          <span>
            Check accommodation with{" "}
            <span className="text-blue-600 font-medium">Booking.com</span>
          </span>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FlightSearchHero;