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

export default function PopularDestinations() {
  const [origin, setOrigin] = useState("DUB"); // default origin
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPopularDestinations = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/amadeus-destinations?origin=${origin}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch destinations");

        const processedDestinations = data.data.map((item: any) => {
          const cityName = item.destination.split(",")[0];
          return {
            id: item.destination,
            name: cityName,
            iataCode: item.destination,
            price: Math.floor(item.price.total * 0.8),
            img: getCityImage(cityName),
          };
        });

        setDestinations(processedDestinations.slice(0, 6));
      } catch (error) {
        console.error("Error fetching destinations:", error);
        setDestinations([
          {
            id: "LON",
            name: "London",
            iataCode: "LON",
            price: 294,
            img: "https://images.skypicker.com/?image=https%3A%2F%2Fimages.kiwi.com%2Fphotos%2F1280x720%2Flondon_gb.jpg&height=234&fit=cover&quality=75&dpr=2",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularDestinations();
  }, [origin]);

  const getCityImage = (cityName: string) => {
    const imageMap: Record<string, string> = {
      London: "https://images.skypicker.com/?image=https%3A%2F%2Fimages.kiwi.com%2Fphotos%2F1280x720%2Flondon_gb.jpg&height=234&fit=cover&quality=75&dpr=2",
      Istanbul: "https://images.skypicker.com/?image=https%3A%2F%2Fimages.kiwi.com%2Fphotos%2F1280x720%2Fistanbul_tr.jpg&height=234&fit=cover&quality=75&dpr=2",
      Dubai: "https://images.skypicker.com/?image=https%3A%2F%2Fimages.kiwi.com%2Fphotos%2F1280x720%2Fdubai_ae.jpg&height=234&fit=cover&quality=75&dpr=2",
      NewYork: "https://images.skypicker.com/?image=https%3A%2F%2Fimages.kiwi.com%2Fphotos%2F1280x720%2Fnew_york_us.jpg&height=234&fit=cover&quality=75&dpr=2",
      // Add more city images here
    };
    return imageMap[cityName] || "/images/default-city.jpg";
  };

  const handleDestinationClick = (destination: Destination) => {
    const departureDate = new Date().toISOString().split("T")[0];
    const returnDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const queryParams = new URLSearchParams({
      origin,
      destination: destination.iataCode,
      departureDate,
      returnDate,
      adults: "1",
    });

    router.push(`/flights/results?${queryParams.toString()}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-1">Popular destinations from</h2>

      <select
        value={origin}
        onChange={(e) => setOrigin(e.target.value)}
        className="mb-6 p-2 border rounded"
      >
        <option value="DUB">Dubai (DUB)</option>
        <option value="LHR">London (LHR)</option>
        <option value="JFK">New York (JFK)</option>
        <option value="IST">Istanbul (IST)</option>
        {/* Add more origin options here */}
      </select>

      {loading ? (
        <div className="text-center py-10">Loading popular destinations...</div>
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
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-3 left-3 text-white">
                <h3 className="text-lg font-semibold">{d.name}</h3>
                <p className="text-sm">Tickets from ${d.price}</p>
              </div>
            </div>
          ))}

          <div className="bg-gray-50 rounded-lg p-6 flex flex-col justify-center">
            <h3 className="text-lg font-semibold mb-2">Want to fly for even less?</h3>
            <p className="text-gray-600 mb-4">
              Search our best deals, price drops, and travel hacks.
            </p>
            <Link
              href="/deals"
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm font-medium text-center"
            >
              Explore deals
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
