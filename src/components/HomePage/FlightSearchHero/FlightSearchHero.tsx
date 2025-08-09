/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { SearchFlightInput } from '@/components/SearchFlightInput/SearchFlightInput';
import { motion } from 'framer-motion';

import { useRouter } from 'next/navigation';

export default function FlightSearchHero() {
  const router = useRouter();

  const handleSearch = (params: any) => {
    localStorage.setItem('flightSearchParams', JSON.stringify(params));
    router.push('/flights/results');
  };

  function setNonStop(checked: boolean): void {
    throw new Error('Function not implemented.');
  }

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
            Book cheap flights other sites simply can&apos;t find.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow p-4 text-black"
        >
          <SearchFlightInput 
            onSearch={handleSearch}
            showReturnDate={true}
            showPassengerSelector={true}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-3 flex items-center space-x-2"
          >
            <input 
              type="checkbox" 
              className="w-4 h-4" 
              onChange={(e) => setNonStop(e.target.checked)}
            />
            <span>
              Check accommodation with{" "}
              <span className="text-blue-600 font-medium">Booking.com</span>
            </span>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}