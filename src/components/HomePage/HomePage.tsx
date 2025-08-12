import React from 'react';
import FlightSearchHero from './FlightSearchHero/FlightSearchHero';
import PopularDestinations from './FlightSearchHero/PopularDestinations/PopularDestinations';
import PopularFlights from '../PopularFlights/PopularFlights';
import BookingFlights from '../BookingFlights/BookingFlightsFaqs';

const HomePage = () => {
    return (
        <div>
            <FlightSearchHero/>

            <PopularDestinations/>
            <PopularFlights/>
            <BookingFlights/>
        </div>
    );
};

export default HomePage;