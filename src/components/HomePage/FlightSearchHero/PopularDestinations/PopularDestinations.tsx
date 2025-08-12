/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Destination {
  id: string;
  name: string;
  iataCode: string;
  price: number;
  img: string;
}

const FALLBACK_DESTINATIONS: Destination[] = [
  {
    id: "LON",
    name: "London",
    iataCode: "LON",
    price: 294,
    img: "https://images.skypicker.com/?image=https%3A%2F%2Fimages.kiwi.com%2Fphotos%2F1280x720%2Flondon_gb.jpg&height=234&fit=cover&quality=75&dpr=2",
  },
  {
    id: "IST",
    name: "Istanbul",
    iataCode: "IST",
    price: 320,
    img: "https://images.skypicker.com/?image=https%3A%2F%2Fimages.kiwi.com%2Fphotos%2F1280x720%2Fistanbul_tr.jpg&height=234&fit=cover&quality=75&dpr=2",
  },
  {
    id: "DXB",
    name: "Dubai",
    iataCode: "DXB",
    price: 450,
    img: "https://images.skypicker.com/?image=https%3A%2F%2Fimages.kiwi.com%2Fphotos%2F1280x720%2Fdubai_ae.jpg&height=234&fit=cover&quality=75&dpr=2",
  },
  {
    id: "JFK",
    name: "New York",
    iataCode: "JFK",
    price: 520,
    img: "https://images.skypicker.com/?image=https%3A%2F%2Fimages.kiwi.com%2Fphotos%2F1280x720%2Fnew_york_us.jpg&height=234&fit=cover&quality=75&dpr=2",
  },
];

const CITY_IMAGE_MAP: Record<string, string> = {
  London: "https://images.skypicker.com/?image=https%3A%2F%2Fimages.kiwi.com%2Fphotos%2F1280x720%2Flondon_gb.jpg&height=234&fit=cover&quality=75&dpr=2",
  Istanbul: "https://images.skypicker.com/?image=https%3A%2F%2Fimages.kiwi.com%2Fphotos%2F1280x720%2Fistanbul_tr.jpg&height=234&fit=cover&quality=75&dpr=2",
  Dubai: "https://images.skypicker.com/?image=https%3A%2F%2Fimages.kiwi.com%2Fphotos%2F1280x720%2Fdubai_ae.jpg&height=234&fit=cover&quality=75&dpr=2",
  "New York": "https://images.skypicker.com/?image=https%3A%2F%2Fimages.kiwi.com%2Fphotos%2F1280x720%2Fnew_york_us.jpg&height=234&fit=cover&quality=75&dpr=2",
};

export default function PopularDestinations() {
  const [origin, setOrigin] = useState("DUB");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPopularDestinations = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const res = await fetch(`/api/amadeus-destinations?origin=${origin}`);
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        
        if (!data?.data || !Array.isArray(data.data)) {
          throw new Error("Invalid data format from API");
        }

        const processedDestinations = data.data.map((item: any) => {
          const cityName = item.destination?.split(",")[0] || "Unknown City";
          return {
            id: item.destination || cityName,
            name: cityName,
            iataCode: item.destination || cityName,
            price: Math.floor((item.price?.total || 300) * 0.8),
            img: getCityImage(cityName),
          };
        });

        setDestinations(processedDestinations.slice(0, 6));
      } catch (error) {
        console.error("Error fetching destinations:", error);
        setError("Failed to load destinations. Showing popular options instead.");
        setDestinations(FALLBACK_DESTINATIONS);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularDestinations();
  }, [origin]);

  const getCityImage = (cityName: string) => {
    return CITY_IMAGE_MAP[cityName] || "/images/default-city.jpg";
  };

  const handleDestinationClick = (destination: Destination) => {
    const departureDate = new Date();
    const returnDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Create URLSearchParams object
    const params = new URLSearchParams();
    params.set('originLocationCode', origin);
    params.set('destinationLocationCode', destination.iataCode);
    params.set('departureDate', departureDate.toISOString().split('T')[0]);
    params.set('returnDate', returnDate.toISOString().split('T')[0]);
    params.set('adults', '1');
    params.set('travelClass', 'ECONOMY');
    params.set('nonStop', 'false');
    params.set('max', '50');
    params.set('currencyCode', 'USD');

    // Store in localStorage as a fallback
    localStorage.setItem('flightSearchParams', params.toString());
    
    // Navigate with query parameters in URL
    router.push(`/flights/results?${params.toString()}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-2xl font-bold mb-4 sm:mb-0">Popular destinations from</h2>
        
        <select
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="p-2 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="DUB">Dubai (DUB)</option>
          <option value="LHR">London (LHR)</option>
          <option value="JFK">New York (JFK)</option>
          <option value="IST">Istanbul (IST)</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-lg h-56 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {destinations.map((d) => (
            <div
              key={d.id}
              className="relative rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => handleDestinationClick(d)}
            >
              <Image
                src={d.img}
                alt={d.name}
                width={500}
                height={300}
                className="object-cover w-full h-56 group-hover:scale-105 transition-transform duration-300"
                priority={true}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-3 left-3 text-white">
                <h3 className="text-lg font-semibold">{d.name}</h3>
                <p className="text-sm">Tickets from ${d.price}</p>
              </div>
            </div>
          ))}

          <div className="bg-gray-50 rounded-lg p-6 flex flex-col justify-center border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Want to fly for even less?</h3>
            <p className="text-gray-600 mb-4">
              Search our best deals, price drops, and travel hacks.
            </p>
            <Link
              href="/deals"
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm font-medium text-center transition-colors duration-200"
            >
              Explore deals
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}