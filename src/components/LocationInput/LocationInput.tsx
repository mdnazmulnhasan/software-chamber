// // app/components/LocationInput.tsx
// 'use client';

// import { useState, useRef, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// interface LocationInputProps {
//   label: string;
//   value: string;
//   onSelect: (code: string) => void;
//   locations: {
//     label: string;
//     items: {
//       icon: string;
//       name: string;
//       code?: string;
//     }[];
//   }[];
//   className?: string;
// }

// export function LocationInput({ label, value, onSelect, locations, className = "" }: LocationInputProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div ref={containerRef} className={`relative ${className}`}>
//       <div 
//         className="flex items-center border rounded px-2 py-1 space-x-2 cursor-pointer"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span className="text-gray-500">{label}</span>
//         <input
//           type="text"
//           readOnly
//           value={value}
//           className="border-none focus:ring-0 p-0 w-40 bg-transparent cursor-pointer"
//         />
//       </div>

//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             transition={{ duration: 0.2 }}
//             className="absolute z-50 top-full left-0 mt-1 w-full max-h-72 overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg text-black"
//           >
//             {/* Recent search */}
//             <div className="px-4 py-3 border-b border-gray-200 text-sm text-gray-500 flex items-center gap-2">
//               <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l4 2" />
//               </svg>
//               <span className="font-semibold">Dhaka ⇄ Dubai</span>
//               <span className="ml-auto text-gray-400 text-xs">16/08 – 16/09 · 2 – 8 nights</span>
//             </div>

//             {locations.map((section) => (
//               <div key={section.label} className="p-4 last:border-b-0 border-b border-gray-100">
//                 <h3 className="mb-2 text-xs font-semibold text-gray-400">{section.label}</h3>
//                 <ul className="space-y-2">
//                   {section.items.map((item, idx) => (
//                     <motion.li
//                       key={idx}
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       className="flex items-center justify-between cursor-pointer rounded-md hover:bg-blue-50 px-2 py-1"
//                       onClick={() => {
//                         if (item.code) {
//                           onSelect(item.code);
//                           setIsOpen(false);
//                         }
//                       }}
//                     >
//                       <div className="flex items-center gap-2 text-gray-700">
//                         <span className="text-lg">{item.icon}</span>
//                         <span className="font-medium">{item.name}</span>
//                       </div>
//                       {item.code && item.code === value && (
//                         <span className="text-blue-600 text-sm">Selected</span>
//                       )}
//                       {item.code && item.code !== value && (
//                         <button
//                           type="button"
//                           className="flex items-center justify-center w-7 h-7 rounded bg-blue-100 hover:bg-blue-200 text-blue-600 text-xl font-bold"
//                           aria-label={`Select ${item.name}`}
//                         >
//                           +
//                         </button>
//                       )}
//                     </motion.li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }










'use client';

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiX } from "react-icons/fi";

interface LocationItem {
  icon?: string;
  name: string;
  code: string;
  type: 'airport' | 'city';
  cityName?: string;
  countryName?: string;
  detailedName?: string;
}

interface LocationInputProps {
  label: string;
  value: string;
  onSelect: (code: string, name: string) => void;
  className?: string;
  onSearch: (query: string) => Promise<LocationItem[]>;
}

export function LocationInput({ label, value, onSelect, className = "", onSearch }: LocationInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LocationItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<LocationItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const search = async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        try {
          const results = await onSearch(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(() => {
      search();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, onSearch]);

  const handleSelect = (item: LocationItem) => {
    const displayName = item.type === 'airport' 
      ? `${item.cityName || item.name} (${item.code})`
      : `${item.name} (${item.code})`;
      
    onSelect(item.code, displayName);
    setIsOpen(false);
    setSearchQuery("");
    
    // Add to recent searches if not already there
    if (!recentSearches.some(search => search.code === item.code)) {
      setRecentSearches(prev => [item, ...prev].slice(0, 3));
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div 
        className="flex items-center border rounded px-2 py-1 space-x-2 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <span className="text-gray-500">{label}</span>
        <input
          type="text"
          readOnly
          value={value}
          className="border-none focus:ring-0 p-0 w-40 bg-transparent cursor-pointer"
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 top-full left-0 mt-1 w-full max-h-72 overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg text-black"
          >
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search city or airport"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 border-none focus:ring-0"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                  >
                    <FiX />
                  </button>
                )}
              </div>
            </div>

            {isSearching ? (
              <div className="p-4 text-center text-gray-500">
                Searching...
              </div>
            ) : (
              <>
                {searchQuery.length > 0 && searchResults.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    No results found
                  </div>
                )}

                {searchResults.length > 0 && (
                  <div className="p-2 border-b border-gray-100">
                    <h3 className="px-2 py-1 text-xs font-semibold text-gray-400">Search Results</h3>
                    <ul className="space-y-1">
                      {searchResults.map((item, idx) => (
                        <motion.li
                          key={`${item.code}-${idx}`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center cursor-pointer rounded-md hover:bg-blue-50 px-2 py-2"
                          onClick={() => handleSelect(item)}
                        >
                          <span className="text-lg mr-2">
                            {item.type === 'airport' ? '✈️' : '🏙️'}
                          </span>
                          <div className="flex-1">
                            <div className="font-medium">
                              {item.type === 'airport' 
                                ? `${item.cityName || item.name} Airport`
                                : item.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.code} • {item.countryName}
                              {item.type === 'airport' && ` • ${item.detailedName}`}
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {recentSearches.length > 0 && searchQuery.length === 0 && (
                  <div className="p-2">
                    <h3 className="px-2 py-1 text-xs font-semibold text-gray-400">Recent Searches</h3>
                    <ul className="space-y-1">
                      {recentSearches.map((item, idx) => (
                        <motion.li
                          key={`recent-${item.code}-${idx}`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center cursor-pointer rounded-md hover:bg-blue-50 px-2 py-2"
                          onClick={() => handleSelect(item)}
                        >
                          <span className="text-lg mr-2">
                            {item.type === 'airport' ? '✈️' : '🏙️'}
                          </span>
                          <div className="flex-1">
                            <div className="font-medium">
                              {item.type === 'airport' 
                                ? `${item.cityName || item.name} Airport`
                                : item.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.code} • {item.countryName}
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}