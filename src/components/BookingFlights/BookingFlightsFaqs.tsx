'use client'
import React, { useState } from "react";
import { IoChevronDownCircleOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "How does Skyscanner work?",
    answer: "Skyscanner is a global travel search engine that helps you find and compare flights, hotels, and car rentals from hundreds of providers. We don't sell tickets directly but redirect you to the best deals available from airlines and travel agencies."
  },
  {
    question: "How can I find the cheapest flight using Skyscanner?",
    answer: "Use our 'Whole Month' view to see prices across an entire month, or 'Cheapest Month' to find the best time to fly. Set up Price Alerts to monitor price changes for your preferred routes."
  },
  {
    question: "Where should I book a flight to right now?",
    answer: "Check our 'Explore Everywhere' feature to discover destinations with the best prices currently available. We also highlight trending destinations and special deals."
  },
  {
    question: "Do I book my flight with Skyscanner?",
    answer: "No, Skyscanner is a metasearch engine. When you find a flight you like, we'll redirect you to the airline or travel agency's website to complete your booking."
  },
  {
    question: "What happens after I have booked my flight?",
    answer: "You'll receive a confirmation email directly from the airline or travel agent. For any changes or cancellations, you'll need to contact them directly as we don't handle bookings."
  },
  {
    question: "Does Skyscanner do hotels too?",
    answer: "Yes! In addition to flights, we compare millions of hotel options worldwide. You can filter by price, star rating, amenities, and more to find your perfect stay."
  },
  {
    question: "What about car hire?",
    answer: "Absolutely. Skyscanner compares car rental prices from major providers at airports and cities worldwide. You can filter by car type, transmission, and rental company preferences."
  },
  {
    question: "What's a Price Alert?",
    answer: "Price Alerts notify you when flight prices change for your specific route and dates. You can set up multiple alerts and we'll email you when prices drop or rise significantly."
  },
  {
    question: "Can I book a flexible flight ticket?",
    answer: "Many airlines now offer flexible tickets. Use our filters to specifically search for flexible or refundable fares. Always check the terms before booking."
  },
  {
    question: "Can I book flights that emit less CO₂?",
    answer: "Yes, our search results show CO₂ emissions estimates for each flight. You can filter to see the greenest options, though direct flights typically have lower emissions than connecting ones."
  },
];

export default function BookingFlights() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 md:py-16">
      <h2 className="text-3xl md:text-4xl text-center md:text-left font-bold mb-8 text-gray-900">
        Booking flights with Skyscanner
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <button
              className="w-full px-5 py-4 flex justify-between items-center text-left bg-white hover:bg-gray-50 transition-colors"
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <h3 className="font-medium text-lg text-gray-800 flex-1">
                {faq.question}
              </h3>
              <IoChevronDownCircleOutline
                className={`w-6 h-6 text-teal-600 transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  id={`faq-answer-${index}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 pt-0 text-gray-600">
                    {faq.answer}
                    {index === 0 && (
                      <div className="mt-3">
                        <button className="text-teal-600 font-medium hover:underline">
                          Learn more about how Skyscanner works
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 rounded-xl p-6 md:p-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Need more help?</h3>
        <p className="text-gray-600 mb-4">
          Visit our Help Center for comprehensive guides and answers to common questions about booking flights, hotels, and car rentals.
        </p>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg font-medium transition-colors">
          Visit Help Center
        </button>
      </div>
    </div>
  );
}