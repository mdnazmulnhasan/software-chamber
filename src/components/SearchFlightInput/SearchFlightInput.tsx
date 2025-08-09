/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiRefreshCw, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import PassengerBaggageSelector from '../PassengerBaggageSelector/PassengerBaggageSelector';
import { LocationInput } from '../LocationInput/LocationInput';


interface SearchFlightInputProps {
    onSearch: (params: any) => void;
    defaultValues?: {
        origin?: string;
        originName?: string;
        destination?: string;
        destinationName?: string;
        departureDate?: string;
        returnDate?: string;
        adults?: number;
        children?: number;
        infants?: number;
        travelClass?: string;
        nonStop?: boolean;
    };
    showReturnDate?: boolean;
    className?: string;
    showPassengerSelector?: boolean;
}

interface LocationItem {
    name: string;
    code: string;
    type: 'airport' | 'city';
    cityName?: string;
    countryName?: string;
}

export function SearchFlightInput({
    onSearch,
    defaultValues,
    showReturnDate = true,
    showPassengerSelector = true,
    className = ''
}: SearchFlightInputProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize state from URL params or default values
    const [origin, setOrigin] = useState({
        code: defaultValues?.origin || searchParams.get('origin') || 'DAC',
        name: defaultValues?.originName || searchParams.get('originName') || 'Dhaka (DAC)'
    });

    const [destination, setDestination] = useState({
        code: defaultValues?.destination || searchParams.get('destination') || 'DXB',
        name: defaultValues?.destinationName || searchParams.get('destinationName') || 'Dubai (DXB)'
    });

    const [departureDate, setDepartureDate] = useState<Date>(
        defaultValues?.departureDate
            ? new Date(defaultValues.departureDate)
            : searchParams.get('departureDate')
                ? new Date(searchParams.get('departureDate') as string)
                : new Date()
    );

    const [returnDate, setReturnDate] = useState<Date | null>(
        showReturnDate
            ? defaultValues?.returnDate
                ? new Date(defaultValues.returnDate)
                : searchParams.get('returnDate')
                    ? new Date(searchParams.get('returnDate') as string)
                    : new Date(new Date().setDate(new Date().getDate() + 7))
            : null
    );

    const [passengers, setPassengers] = useState({
        adults: defaultValues?.adults || parseInt(searchParams.get('adults') || '1', 10),
        children: defaultValues?.children || parseInt(searchParams.get('children') || '0', 10),
        infants: defaultValues?.infants || parseInt(searchParams.get('infants') || '0', 10)
    });

    const [travelClass, setTravelClass] = useState(
        defaultValues?.travelClass || searchParams.get('travelClass') || 'ECONOMY'
    );

    const [nonStop, setNonStop] = useState(
        defaultValues?.nonStop || searchParams.get('nonStop') === 'true' || false
    );

    const [isOneWay, setIsOneWay] = useState(!showReturnDate);

    // Update URL when search params change
    useEffect(() => {
        const params = new URLSearchParams();
        params.set('origin', origin.code);
        params.set('originName', origin.name);
        params.set('destination', destination.code);
        params.set('destinationName', destination.name);
        params.set('departureDate', departureDate.toISOString().split('T')[0]);

        if (returnDate && !isOneWay) {
            params.set('returnDate', returnDate.toISOString().split('T')[0]);
        }

        params.set('adults', passengers.adults.toString());
        params.set('children', passengers.children.toString());
        params.set('infants', passengers.infants.toString());
        params.set('travelClass', travelClass);
        params.set('nonStop', nonStop.toString());

        router.replace(`?${params.toString()}`, { scroll: false });
    }, [origin, destination, departureDate, returnDate, passengers, travelClass, nonStop, isOneWay, router]);

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
                countryName: item.countryName
            }));
        } catch (error) {
            console.error("Location search error:", error);
            return [];
        }
    };

    const handleSearch = () => {
        const searchParams = {
            originLocationCode: origin.code,
            destinationLocationCode: destination.code,
            originName: origin.name,
            destinationName: destination.name,
            departureDate: departureDate.toISOString().split('T')[0],
            returnDate: returnDate && !isOneWay ? returnDate.toISOString().split('T')[0] : undefined,
            adults: passengers.adults,
            children: passengers.children,
            infants: passengers.infants,
            travelClass,
            nonStop,
            max: 50
        };

        onSearch(searchParams);
    };

    const handleSwapLocations = () => {
        setOrigin(destination);
        setDestination(origin);
    };

    const handlePassengersChange = (newPassengers: {
        adults: number;
        children: number;
        infants: number;
    }) => {
        setPassengers(newPassengers);
    };

    return (
        <div className={`flex flex-wrap items-center gap-3 ${className}`}>
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
                    value={travelClass}
                    onChange={(e) => setTravelClass(e.target.value)}
                    className="border-none focus:ring-0 p-0"
                >
                    <option value="ECONOMY">Economy</option>
                    <option value="PREMIUM_ECONOMY">Premium Economy</option>
                    <option value="BUSINESS">Business</option>
                    <option value="FIRST">First</option>
                </select>
            </div>

            {showPassengerSelector && (
                <PassengerBaggageSelector
                    onPassengersChange={handlePassengersChange}
                    initialValues={{
                        passengers: {
                            adults: passengers.adults,
                            children: passengers.children,
                            infants: passengers.infants
                        }
                    }}
                />
            )}

            <LocationInput
                label="From"
                value={origin.name}
                onSelect={(code, name) => setOrigin({ code, name })}
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
                value={destination.name}
                onSelect={(code, name) => setDestination({ code, name })}
                onSearch={searchLocations}
            />

            <div className="flex items-center border rounded px-2 py-1 space-x-2">
                <span className="text-gray-500">Departure</span>
                <DatePicker
                    selected={departureDate}
                    onChange={(date: Date | null) => {
                        if (date) setDepartureDate(date);
                    }}
                    className="border-none p-0 w-32"
                    minDate={new Date()}
                />
            </div>

            {!isOneWay && (
                <div className="flex items-center border rounded px-2 py-1 space-x-2">
                    <span className="text-gray-500">Return</span>
                    <DatePicker
                        selected={returnDate}
                        onChange={(date: Date | null) => setReturnDate(date)}
                        className="border-none p-0 w-32"
                        minDate={departureDate}
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
        </div>
    );
}