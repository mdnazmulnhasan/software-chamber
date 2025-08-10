import React from 'react';
import FlightSearchHero from './FlightSearchHero/FlightSearchHero';
import PopularDestinations from '../PopularDestinations/PopularDestinations';

const HomePage = () => {
    return (
        <div>
            <FlightSearchHero/>

            <PopularDestinations/>
        </div>
    );
};

export default HomePage;