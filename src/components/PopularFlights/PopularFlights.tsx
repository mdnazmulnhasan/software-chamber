'use client'
import React, { useState } from "react";
import { FiArrowRight, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion } from "framer-motion";

const flights = [
  {
    img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop",
    route: "London ⇌ Istanbul",
    price: "From $89",
    duration: "3h 45m"
  },
  {
    img: "https://images.unsplash.com/photo-1544986581-efac024faf62?q=80&w=800&auto=format&fit=crop",
    route: "London ⇌ Barcelona",
    price: "From $65",
    duration: "2h 15m"
  },
  {
    img: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=800&auto=format&fit=crop",
    route: "London ⇌ Tirana",
    price: "From $112",
    duration: "2h 55m"
  },
  {
    img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop",
    route: "London ⇌ Jeddah",
    price: "From $249",
    duration: "5h 40m"
  },
  {
    img: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=800&auto=format&fit=crop",
    route: "Istanbul ⇌ London",
    price: "From $79",
    duration: "3h 45m"
  },
  {
    img: "https://images.unsplash.com/photo-1582542025427-45e93d43127f?q=80&w=800&auto=format&fit=crop",
    route: "London ⇌ Athens",
    price: "From $98",
    duration: "3h 30m"
  },
  {
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop",
    route: "London ⇌ Paris",
    price: "From $45",
    duration: "1h 15m"
  },
  {
    img: "https://images.unsplash.com/photo-1505739788717-6b6b7aefb7e0?q=80&w=800&auto=format&fit=crop",
    route: "London ⇌ Lisbon",
    price: "From $75",
    duration: "2h 30m"
  },
  {
    img: "https://images.unsplash.com/photo-1509475826633-fed577a2c71b?q=80&w=800&auto=format&fit=crop",
    route: "London ⇌ Bucharest",
    price: "From $105",
    duration: "3h 10m"
  },
  {
    img: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=800&auto=format&fit=crop",
    route: "London ⇌ Rome",
    price: "From $68",
    duration: "2h 25m"
  },
  {
    img: "https://images.unsplash.com/photo-1505763752-deae8a3a06a0?q=80&w=800&auto=format&fit=crop",
    route: "London ⇌ Prague",
    price: "From $72",
    duration: "2h 5m"
  },
  {
    img: "https://images.unsplash.com/photo-1571066811602-716837d681de?q=80&w=800&auto=format&fit=crop",
    route: "London ⇌ Málaga",
    price: "From $82",
    duration: "2h 45m"
  },
];

export default function PopularFlights() {
  const [showAll, setShowAll] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const visibleFlights = showAll ? flights : flights.slice(0, 6);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Popular Flight Routes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most sought-after destinations with great deals and convenient flight times
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleFlights.map((flight, index) => (
            <motion.div
              key={index}
              className="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer"
              whileHover={{ y: -5 }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Image with overlay */}
              <div className="relative h-48">
                <img
                  src={flight.img}
                  alt={flight.route}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{flight.route}</h3>
                    <div className="flex items-center space-x-3 text-sm">
                      <span>{flight.duration}</span>
                      <span className="font-bold">{flight.price}</span>
                    </div>
                  </div>
                  <motion.div
                    animate={{
                      x: hoveredCard === index ? 5 : 0,
                      opacity: hoveredCard === index ? 1 : 0.7
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FiArrowRight className="text-2xl" />
                  </motion.div>
                </div>
              </div>

              {/* Badge */}
              <div className="absolute top-4 right-4 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                Best Deal
              </div>
            </motion.div>
          ))}
        </div>

        {/* Show more/less button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-full text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all"
          >
            {showAll ? (
              <>
                Show Less
                <FiChevronUp className="ml-2" />
              </>
            ) : (
              <>
                Show More Routes
                <FiChevronDown className="ml-2" />
              </>
            )}
          </button>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-teal-600 to-teal-500 rounded-xl p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Can't find your perfect route?</h3>
            <p className="text-lg mb-6">
              Our flight experts can help you discover hidden gems and create custom itineraries tailored just for you.
            </p>
            <button className="bg-white text-teal-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold shadow-md transition">
              Contact Our Travel Experts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}