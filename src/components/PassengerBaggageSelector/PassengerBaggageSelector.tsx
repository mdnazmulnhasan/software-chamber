// app/components/PassengerBaggageSelector.tsx
'use client';

import { useState } from 'react';
import { FiUser, FiMinus, FiPlus } from 'react-icons/fi';
import { BsSuitcase } from 'react-icons/bs';

interface PassengerBaggageSelectorProps {
  onPassengersChange?: (passengers: {
    adults: number;
    children: number;
    infants: number;
  }) => void;
  onBagsChange?: (bags: {
    cabin: number;
    checked: number;
  }) => void;
  initialValues?: {
    passengers?: {
      adults: number;
      children: number;
      infants: number;
    };
    bags?: {
      cabin: number;
      checked: number;
    };
  };
}

export default function PassengerBaggageSelector({
  onPassengersChange,
  onBagsChange,
  initialValues = {
    passengers: { adults: 1, children: 0, infants: 0 },
    bags: { cabin: 1, checked: 1 }
  }
}: PassengerBaggageSelectorProps) {
  const [passengers, setPassengers] = useState({
    adults: initialValues.passengers?.adults || 1,
    children: initialValues.passengers?.children || 0,
    infants: initialValues.passengers?.infants || 0,
  });

  const [bags, setBags] = useState({
    cabin: initialValues.bags?.cabin || 1,
    checked: initialValues.bags?.checked || 1,
  });

  const [isOpen, setIsOpen] = useState(false);

  const updatePassengerCount = (type: 'adults' | 'children' | 'infants', value: number) => {
    const newPassengers = {
      ...passengers,
      [type]: Math.max(0, value)
    };
    
    // Ensure at least 1 adult when there are infants
    if (type === 'adults' && value === 0 && newPassengers.infants > 0) {
      return;
    }
    
    // Ensure infants don't exceed adults
    if (type === 'infants' && value > newPassengers.adults) {
      return;
    }

    setPassengers(newPassengers);
    if (onPassengersChange) onPassengersChange(newPassengers);
  };

  const updateBagCount = (type: 'cabin' | 'checked', value: number) => {
    const newBags = {
      ...bags,
      [type]: Math.max(0, value)
    };
    setBags(newBags);
    if (onBagsChange) onBagsChange(newBags);
  };

  const totalPassengers = passengers.adults + passengers.children + passengers.infants;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white border rounded-md px-3 py-2 hover:bg-gray-50 transition-colors"
      >
        <FiUser className="text-gray-600" />
        <span className="font-medium">{totalPassengers} {totalPassengers === 1 ? 'Passenger' : 'Passengers'}</span>
        <BsSuitcase className="text-gray-600 ml-2" />
        <span className="font-medium">{bags.cabin + bags.checked} Bags</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-3">Passengers</h3>
            
            <div className="space-y-4">
              {/* Adults */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Adults</p>
                  <p className="text-sm text-gray-500">Over 11</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updatePassengerCount('adults', passengers.adults - 1)}
                    disabled={passengers.adults <= 1}
                    className={`p-1 rounded-full ${passengers.adults <= 1 ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                  >
                    <FiMinus size={16} />
                  </button>
                  <span className="w-6 text-center">{passengers.adults}</span>
                  <button
                    onClick={() => updatePassengerCount('adults', passengers.adults + 1)}
                    className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Children</p>
                  <p className="text-sm text-gray-500">2 – 11</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updatePassengerCount('children', passengers.children - 1)}
                    disabled={passengers.children <= 0}
                    className={`p-1 rounded-full ${passengers.children <= 0 ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                  >
                    <FiMinus size={16} />
                  </button>
                  <span className="w-6 text-center">{passengers.children}</span>
                  <button
                    onClick={() => updatePassengerCount('children', passengers.children + 1)}
                    className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
              </div>

              {/* Infants */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Infants</p>
                  <p className="text-sm text-gray-500">Under 2</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updatePassengerCount('infants', passengers.infants - 1)}
                    disabled={passengers.infants <= 0}
                    className={`p-1 rounded-full ${passengers.infants <= 0 ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                  >
                    <FiMinus size={16} />
                  </button>
                  <span className="w-6 text-center">{passengers.infants}</span>
                  <button
                    onClick={() => updatePassengerCount('infants', passengers.infants + 1)}
                    disabled={passengers.infants >= passengers.adults}
                    className={`p-1 rounded-full ${passengers.infants >= passengers.adults ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <h3 className="font-semibold text-lg mb-3">Bags</h3>
              
              <div className="space-y-4">
                {/* Cabin baggage */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Cabin baggage</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateBagCount('cabin', bags.cabin - 1)}
                      disabled={bags.cabin <= 0}
                      className={`p-1 rounded-full ${bags.cabin <= 0 ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                    >
                      <FiMinus size={16} />
                    </button>
                    <span className="w-6 text-center">{bags.cabin}</span>
                    <button
                      onClick={() => updateBagCount('cabin', bags.cabin + 1)}
                      className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>
                </div>

                {/* Checked baggage */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Checked baggage</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateBagCount('checked', bags.checked - 1)}
                      disabled={bags.checked <= 0}
                      className={`p-1 rounded-full ${bags.checked <= 0 ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                    >
                      <FiMinus size={16} />
                    </button>
                    <span className="w-6 text-center">{bags.checked}</span>
                    <button
                      onClick={() => updateBagCount('checked', bags.checked + 1)}
                      className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 flex justify-end border-t">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}