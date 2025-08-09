// app/flights/results/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiFilter, FiClock, FiLayers, FiArrowRight, FiUser } from 'react-icons/fi';
import { FaWifi, FaUtensils, FaTv, FaWineGlassAlt } from 'react-icons/fa';

interface FlightOffer {
  id: string;
  price: {
    total: string;
    currency: string;
  };
  itineraries: {
    duration: string;
    segments: {
      departure: {
        at: string;
        iataCode: string;
        terminal?: string;
      };
      arrival: {
        at: string;
        iataCode: string;
        terminal?: string;
      };
      carrierCode: string;
      number: string;
      aircraft?: {
        code: string;
      };
      operating?: {
        carrierCode: string;
      };
    }[];
  }[];
  travelerPricings: {
    fareDetailsBySegment: {
      cabin: string;
      class: string;
      amenities?: {
        description: string;
        isChargeable: boolean;
        amenityType: string;
      }[];
    }[];
  }[];
}

interface ProcessedFlight {
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

const airlineLogos: Record<string, string> = {
  EK: 'https://logos-world.net/wp-content/uploads/2020/09/Emirates-Logo.png',
  QR: 'https://logos-world.net/wp-content/uploads/2020/11/Qatar-Airways-Logo.png',
  FZ: 'https://logos-world.net/wp-content/uploads/2021/02/Flydubai-Logo.png',
  G9: 'https://logos-world.net/wp-content/uploads/2020/04/Air-Arabia-Logo.png',
  BG: 'https://logos-world.net/wp-content/uploads/2021/02/Biman-Bangladesh-Airlines-Logo.png',
};

const airlineNames: Record<string, string> = {
  EK: 'Emirates',
  QR: 'Qatar Airways',
  FZ: 'Fly Dubai',
  G9: 'Air Arabia',
  BG: 'Biman Bangladesh',
};

const getFallbackLogo = (airlineCode: string) => {
  // Use a reliable placeholder service or base64 encoded image
  return `data:image/svg+xml;base64,${btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <rect width="40" height="40" fill="#f0f0f0"/>
      <text x="20" y="22" font-family="Arial" font-size="12" text-anchor="middle" fill="#666">${airlineCode}</text>
    </svg>`
  )}`;
};

export default function FlightResultsPage() {
  const [flights, setFlights] = useState<ProcessedFlight[]>([]);
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
console.log(flights,'flie');

  const processFlightData = (data: FlightOffer[]): ProcessedFlight[] => {
    if (!Array.isArray(data)) return [];
    
    return data.map((flight, index) => {
      try {
        const itinerary = flight.itineraries?.[0];
        if (!itinerary) throw new Error('No itinerary found');
        
        const segments = itinerary.segments || [];
        if (segments.length === 0) throw new Error('No segments found');

        const departureTime = new Date(segments[0].departure.at);
        const arrivalTime = new Date(segments[segments.length - 1].arrival.at);

        const formatTime = (date: Date) => {
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        const amenities = flight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.amenities
          ?.filter(amenity => !amenity.isChargeable)
          ?.map(amenity => amenity.amenityType.toLowerCase()) || [];

        const stopDetails: { airport: string; duration: string }[] = [];
        if (segments.length > 1) {
          for (let i = 0; i < segments.length - 1; i++) {
            try {
              const currentArrival = new Date(segments[i].arrival.at);
              const nextDeparture = new Date(segments[i + 1].departure.at);
              const layoverMs = nextDeparture.getTime() - currentArrival.getTime();
              const layoverHours = Math.floor(layoverMs / (1000 * 60 * 60));
              const layoverMinutes = Math.floor((layoverMs % (1000 * 60 * 60)) / (1000 * 60));
              
              stopDetails.push({
                airport: segments[i].arrival.iataCode,
                duration: `${layoverHours}h ${layoverMinutes}m`
              });
            } catch (e) {
              console.error('Error processing stop details:', e);
            }
          }
        }

        const operatingCarrier = segments[0].operating?.carrierCode || segments[0].carrierCode;
        const airlineName = airlineNames[operatingCarrier] || operatingCarrier;
        const airlineLogo = airlineLogos[operatingCarrier] || getFallbackLogo(operatingCarrier);

        return {
          id: flight.id || `flight-${index}`,
          price: flight.price?.total || '0',
          currency: flight.price?.currency || 'USD',
          departure: {
            time: formatTime(departureTime),
            airport: segments[0].departure.iataCode,
            terminal: segments[0].departure.terminal
          },
          arrival: {
            time: formatTime(arrivalTime),
            airport: segments[segments.length - 1].arrival.iataCode,
            terminal: segments[segments.length - 1].arrival.terminal
          },
          airline: airlineName,
          airlineLogo,
          duration: itinerary.duration,
          stops: segments.length - 1,
          stopDetails: stopDetails.length > 0 ? stopDetails : undefined,
          amenities,
          flightNumber: `${segments[0].carrierCode} ${segments[0].number}`,
          aircraft: segments[0].aircraft?.code
        };
      } catch (err) {
        console.error('Error processing flight:', err);
        return {
          id: `error-${index}`,
          price: '0',
          currency: 'USD',
          departure: { time: '00:00', airport: 'N/A' },
          arrival: { time: '00:00', airport: 'N/A' },
          airline: 'Unknown',
          airlineLogo: getFallbackLogo('NA'),
          duration: '0h 0m',
          stops: 0,
          amenities: [],
          flightNumber: 'N/A'
        };
      }
    }).filter(flight => !flight.id.startsWith('error-'));
  };

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        setError(null);

        const searchParams = localStorage.getItem('flightSearchParams');
        if (!searchParams) {
          router.push('/');
          return;
        }

        const params = JSON.parse(searchParams);
        const queryString = new URLSearchParams(params).toString();

        const response = await fetch(`/api/flights?${queryString}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format');
        }

        const processedFlights = processFlightData(data);
        setFlights(processedFlights);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load flights');
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [router]);

  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption);
    
    setFlights(prevFlights => {
      const sorted = [...prevFlights];
      
      const parseDuration = (duration: string) => {
        const parts = duration.split(' ');
        let total = 0;
        for (const part of parts) {
          if (part.includes('h')) total += parseInt(part) * 60;
          if (part.includes('m')) total += parseInt(part);
        }
        return total;
      };

      const parseTime = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
      };

      sorted.sort((a, b) => {
        switch (sortOption) {
          case 'price':
            return parseFloat(a.price) - parseFloat(b.price);
          
          case 'duration':
            return parseDuration(a.duration) - parseDuration(b.duration);
          
          case 'departure':
            return parseTime(a.departure.time) - parseTime(b.departure.time);
          
          default: // 'best'
            const priceDiff = parseFloat(a.price) - parseFloat(b.price);
            return priceDiff !== 0 ? priceDiff : parseDuration(a.duration) - parseDuration(b.duration);
        }
      });
      
      return sorted;
    });
  };

  const handleFilterChange = (filterType: string, value: any) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    };
    setFilters(newFilters);
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi': return <FaWifi className="text-blue-500" />;
      case 'meals': return <FaUtensils className="text-green-500" />;
      case 'entertainment': return <FaTv className="text-purple-500" />;
      case 'drinks': return <FaWineGlassAlt className="text-red-500" />;
      default: return null;
    }
  };

  const getTimeOfDay = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 21) return 'Evening';
    return 'Night';
  };

  const filteredFlights = flights.filter(flight => {
    // Filter by stops
    if (flight.stops > filters.maxStops) return false;
    
    // Filter by price
    const price = parseFloat(flight.price);
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
    
    // Filter by airlines
    if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) {
      return false;
    }
    
    // Filter by departure time
    if (filters.departureTime.length > 0) {
      const timeOfDay = getTimeOfDay(flight.departure.time);
      if (!filters.departureTime.includes(timeOfDay)) return false;
    }
    
    return true;
  });

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
              {['best', 'price', 'duration', 'departure'].map(option => (
                <button 
                  key={option}
                  onClick={() => handleSortChange(option)}
                  className={`px-3 py-1 rounded-full ${sortBy === option ? 'bg-teal-100 text-teal-800' : 'bg-gray-100'}`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
            
            <button className="flex items-center text-gray-600 hover:text-gray-800">
              <FiFilter className="mr-1" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto  px-4 py-6">
        {filteredFlights.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4">Your flight search</h2>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                <span className="font-medium">{filteredFlights[0].departure.airport}</span>
                <FiArrowRight className="mx-2 text-gray-500" />
                <span className="font-medium">{filteredFlights[0].arrival.airport}</span>
              </div>
              
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                <span>{new Date().toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}</span>
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
        )}

        <div className="space-y-4">
          {filteredFlights.length > 0 ? (
            filteredFlights.map(flight => (
              <div key={flight.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4  flex-col md:flex-row">
                  <div className="flex items-center mb-4 md:mb-0 md:w-1/4">
                    <img 
                      src={flight.airlineLogo} 
                      alt={flight.airline}
                      className="w-10 h-10 object-contain mr-3"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getFallbackLogo(flight.flightNumber.substring(0, 2));
                        target.onerror = null;
                      }}
                    />
                    <div>
                      <p className="font-medium">{flight.airline}</p>
                      <p className="text-sm text-gray-500">{flight.flightNumber}</p>
                    </div>
                  </div>
                  
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
                    
                    <div className="flex items-center space-x-3 mb-4 md:mb-0">
                      {flight.amenities.map((amenity, index) => (
                        <div key={index} title={amenity.charAt(0).toUpperCase() + amenity.slice(1)}>
                          {getAmenityIcon(amenity)}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-col items-center md:items-end w-full md:w-48">
                      <p className="text-2xl font-bold text-teal-600">
                        {flight.price} {flight.currency}
                      </p>
                      <button className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 mt-2 w-full">
                        Select
                      </button>
                    </div>
                  </div>
                </div>
                
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
                
                <div className="bg-gray-50 p-4 border-t flex justify-between items-center">
                  <button className="text-teal-600 text-sm font-medium hover:underline">
                    Flight details
                  </button>
                  <button className="text-teal-600 text-sm font-medium hover:underline">
                    Fare rules
                  </button>
                </div>
              </div>
            ))
          ) : (
            !loading && (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No flights found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
                <button 
                  onClick={() => router.push('/')}
                  className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                >
                  Modify Search
                </button>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}