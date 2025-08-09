/* eslint-disable @typescript-eslint/no-explicit-any */
// app/flights/results/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiFilter, FiStar, FiClock, FiLayers, FiUser, FiArrowRight } from 'react-icons/fi';
import { FaWifi, FaUtensils, FaTv, FaWineGlassAlt } from 'react-icons/fa';

interface Flight {
  id: string;
  price: string;
  currency: string;
  departure: {
    time: string;
    airport: string;
    terminal?: string;
  };
  arrival: {
    time: string;
    airport: string;
    terminal?: string;
  };
  airline: string;
  airlineLogo: string;
  duration: string;
  stops: number;
  stopDetails?: {
    airport: string;
    duration: string;
  }[];
  amenities: string[];
  flightNumber: string;
  aircraft?: string;
}

export default function FlightResultsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    maxStops: 2,
    airlines: [] as string[],
    priceRange: [0, 5000] as [number, number],
    departureTime: [] as string[],
  });
  const [sortBy, setSortBy] = useState('best');
  const router = useRouter();

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        // In a real app, you would fetch from your backend which calls Amadeus API
        // For demo purposes, we'll use mock data
        let searchParams;
        if (typeof window !== 'undefined') {
          searchParams = localStorage.getItem('flightSearchParams');
        }
        
        if (!searchParams) {
          router.push('/');
          return;
        }

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data - in a real app, you would call Amadeus API via your backend
        const mockFlights: Flight[] = [
          {
            id: '1',
            price: '450',
            currency: 'USD',
            departure: {
              time: '08:45',
              airport: 'DAC',
              terminal: '1'
            },
            arrival: {
              time: '12:30',
              airport: 'DXB',
              terminal: '3'
            },
            airline: 'Emirates',
            airlineLogo: 'https://logos-world.net/wp-content/uploads/2020/09/Emirates-Logo.png',
            duration: '3h 45m',
            stops: 0,
            amenities: ['wifi', 'meals', 'entertainment'],
            flightNumber: 'EK 584'
          },
          {
            id: '2',
            price: '380',
            currency: 'USD',
            departure: {
              time: '14:20',
              airport: 'DAC'
            },
            arrival: {
              time: '19:15',
              airport: 'DXB'
            },
            airline: 'Qatar Airways',
            airlineLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Qatar-Airways-Logo.png',
            duration: '4h 55m',
            stops: 1,
            stopDetails: [
              {
                airport: 'DOH',
                duration: '1h 30m'
              }
            ],
            amenities: ['wifi', 'meals'],
            flightNumber: 'QR 1024'
          },
          {
            id: '3',
            price: '410',
            currency: 'USD',
            departure: {
              time: '22:10',
              airport: 'DAC'
            },
            arrival: {
              time: '02:45',
              airport: 'DXB'
            },
            airline: 'Fly Dubai',
            airlineLogo: 'https://logos-world.net/wp-content/uploads/2021/02/Flydubai-Logo.png',
            duration: '4h 35m',
            stops: 0,
            amenities: ['meals'],
            flightNumber: 'FZ 176'
          },
          {
            id: '4',
            price: '340',
            currency: 'USD',
            departure: {
              time: '06:15',
              airport: 'DAC'
            },
            arrival: {
              time: '12:50',
              airport: 'DXB'
            },
            airline: 'Air Arabia',
            airlineLogo: 'https://logos-world.net/wp-content/uploads/2020/04/Air-Arabia-Logo.png',
            duration: '5h 35m',
            stops: 1,
            stopDetails: [
              {
                airport: 'SHJ',
                duration: '2h 10m'
              }
            ],
            amenities: [],
            flightNumber: 'G9 432'
          },
          {
            id: '5',
            price: '520',
            currency: 'USD',
            departure: {
              time: '11:30',
              airport: 'DAC',
              terminal: '2'
            },
            arrival: {
              time: '15:05',
              airport: 'DXB',
              terminal: '1'
            },
            airline: 'Biman Bangladesh',
            airlineLogo: 'https://logos-world.net/wp-content/uploads/2021/02/Biman-Bangladesh-Airlines-Logo.png',
            duration: '3h 35m',
            stops: 0,
            amenities: ['meals', 'entertainment'],
            flightNumber: 'BG 123'
          }
        ];

        setFlights(mockFlights);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch flight data. Please try again.');
        setLoading(false);
        console.error('Flight search error:', err);
      }
    };

    fetchFlights();
  }, [router]);

  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption);
    // In a real app, you would sort the flights array here
  };

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    // In a real app, you would filter the flights array here
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi':
        return <FaWifi className="text-blue-500" />;
      case 'meals':
        return <FaUtensils className="text-green-500" />;
      case 'entertainment':
        return <FaTv className="text-purple-500" />;
      case 'drinks':
        return <FaWineGlassAlt className="text-red-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-lg">Searching for flights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-red-100 rounded-lg max-w-md">
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center text-teal-600 hover:text-teal-800"
          >
            <FiArrowLeft className="mr-2" />
            <span>Modify Search</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex space-x-2">
              <button 
                onClick={() => handleSortChange('best')}
                className={`px-3 py-1 rounded-full ${sortBy === 'best' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100'}`}
              >
                Best
              </button>
              <button 
                onClick={() => handleSortChange('price')}
                className={`px-3 py-1 rounded-full ${sortBy === 'price' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100'}`}
              >
                Price
              </button>
              <button 
                onClick={() => handleSortChange('duration')}
                className={`px-3 py-1 rounded-full ${sortBy === 'duration' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100'}`}
              >
                Duration
              </button>
              <button 
                onClick={() => handleSortChange('departure')}
                className={`px-3 py-1 rounded-full ${sortBy === 'departure' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100'}`}
              >
                Departure
              </button>
            </div>
            
            <button className="flex items-center text-gray-600 hover:text-gray-800">
              <FiFilter className="mr-1" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Summary */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your flight search</h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <span className="font-medium">DAC</span>
              <FiArrowRight className="mx-2 text-gray-500" />
              <span className="font-medium">DXB</span>
            </div>
            
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <span>Sat, 16 Aug</span>
              {false && ( // For return trips
                <>
                  <FiArrowRight className="mx-2 text-gray-500" />
                  <span>Tue, 19 Aug</span>
                </>
              )}
            </div>
            
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <FiUser className="mr-2 text-gray-600" />
              <span>1 Passenger</span>
            </div>
            
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <span>Economy</span>
            </div>
          </div>
        </div>

        {/* Filters (collapsed by default) */}
        <div className="hidden bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="font-medium mb-4">Filter by:</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-medium mb-2">Stops</h4>
              <div className="space-y-2">
                {[0, 1, 2].map(stops => (
                  <label key={stops} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.maxStops >= stops}
                      onChange={() => handleFilterChange('maxStops', stops)}
                      className="mr-2"
                    />
                    <span>
                      {stops === 0 ? 'Non-stop' : stops === 1 ? '1 stop' : '2+ stops'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Price range</h4>
              <div className="flex items-center justify-between mb-2">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                value={filters.priceRange[1]}
                onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Departure time</h4>
              <div className="grid grid-cols-2 gap-2">
                {['Morning', 'Afternoon', 'Evening', 'Night'].map(time => (
                  <label key={time} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.departureTime.includes(time)}
                      onChange={() => {
                        const newTimes = filters.departureTime.includes(time)
                          ? filters.departureTime.filter(t => t !== time)
                          : [...filters.departureTime, time];
                        handleFilterChange('departureTime', newTimes);
                      }}
                      className="mr-2"
                    />
                    <span>{time}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Airlines</h4>
              <div className="space-y-2">
                {['Emirates', 'Qatar Airways', 'Fly Dubai', 'Air Arabia', 'Biman Bangladesh'].map(airline => (
                  <label key={airline} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.airlines.includes(airline)}
                      onChange={() => {
                        const newAirlines = filters.airlines.includes(airline)
                          ? filters.airlines.filter(a => a !== airline)
                          : [...filters.airlines, airline];
                        handleFilterChange('airlines', newAirlines);
                      }}
                      className="mr-2"
                    />
                    <span>{airline}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Flight Results */}
        <div className="space-y-4">
          {flights.map(flight => (
            <div key={flight.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 flex flex-col md:flex-row">
                {/* Airline Info */}
                <div className="flex items-center mb-4 md:mb-0 md:w-1/4">
                  <img 
                    src={flight.airlineLogo} 
                    alt={flight.airline}
                    className="w-10 h-10 object-contain mr-3"
                  />
                  <div>
                    <p className="font-medium">{flight.airline}</p>
                    <p className="text-sm text-gray-500">{flight.flightNumber}</p>
                  </div>
                </div>
                
                {/* Flight Details */}
                <div className="flex-1 flex flex-col md:flex-row items-center">
                  <div className="flex-1 flex items-center justify-between mb-4 md:mb-0">
                    <div className="text-center">
                      <p className="text-xl font-semibold">{flight.departure.time}</p>
                      <p className="text-sm text-gray-600">{flight.departure.airport}</p>
                      {flight.departure.terminal && (
                        <p className="text-xs text-gray-500">Terminal {flight.departure.terminal}</p>
                      )}
                    </div>
                    
                    <div className="mx-2 md:mx-4 text-center">
                      <p className="text-sm text-gray-500">{flight.duration}</p>
                      <div className="relative">
                        <div className="h-px bg-gray-300 w-16 md:w-24 my-2"></div>
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-white px-1">
                          {flight.stops === 0 ? (
                            <span className="text-xs text-green-500">Direct</span>
                          ) : (
                            <span className="text-xs text-orange-500">
                              {flight.stops} {flight.stops === 1 ? 'stop' : 'stops'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xl font-semibold">{flight.arrival.time}</p>
                      <p className="text-sm text-gray-600">{flight.arrival.airport}</p>
                      {flight.arrival.terminal && (
                        <p className="text-xs text-gray-500">Terminal {flight.arrival.terminal}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Amenities */}
                  <div className="flex items-center space-x-3 mb-4 md:mb-0">
                    {flight.amenities.map(amenity => (
                      <div key={amenity} className="tooltip" data-tip={amenity.charAt(0).toUpperCase() + amenity.slice(1)}>
                        {getAmenityIcon(amenity)}
                      </div>
                    ))}
                  </div>
                  
                  {/* Price and Book */}
                  <div className="flex flex-col items-center md:items-end w-full md:w-48">
                    <p className="text-2xl font-bold text-teal-600">{flight.price} {flight.currency}</p>
                    <button className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 mt-2 w-full">
                      Select
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Stop details */}
              {flight.stops > 0 && flight.stopDetails && (
                <div className="bg-gray-50 p-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Stop details:</h4>
                  <div className="flex items-center space-x-4">
                    {flight.stopDetails.map((stop, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <FiLayers className="text-gray-600" />
                        </div>
                        <div className="ml-2">
                          <p className="text-sm">{stop.airport}</p>
                          <p className="text-xs text-gray-500">Layover: {stop.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Flight details expandable */}
              <div className="bg-gray-50 p-4 border-t flex justify-between items-center">
                <button className="text-teal-600 text-sm font-medium hover:underline">
                  Flight details
                </button>
                <button className="text-teal-600 text-sm font-medium hover:underline">
                  Fare rules
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}