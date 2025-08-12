/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import Amadeus from 'amadeus';

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  try {
    const originLocationCode = searchParams.get('originLocationCode');
    const destinationLocationCode = searchParams.get('destinationLocationCode');
    const departureDate = searchParams.get('departureDate');
    const returnDate = searchParams.get('returnDate');
    const adults = searchParams.get('adults');
    const children = searchParams.get('children') || '0';
    const infants = searchParams.get('infants') || '0';
    const travelClass = searchParams.get('travelClass');
    const nonStop = searchParams.get('nonStop');
    const max = searchParams.get('max');

    if (!originLocationCode || !destinationLocationCode || !departureDate || !adults) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate: returnDate || undefined,
      adults: parseInt(adults),
      children: parseInt(children),
      infants: parseInt(infants),
      travelClass: travelClass || 'ECONOMY',
      nonStop: nonStop === 'true',
      max: max ? parseInt(max) : 50,
      currencyCode: 'USD',
      includedAirlineCodes: undefined,
      excludedAirlineCodes: undefined,
    });

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid response format from Amadeus API');
    }

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Amadeus API error:', error);
    
    if (error.code === 'NetworkError') {
      return NextResponse.json(
        { error: 'Network error connecting to Amadeus API' },
        { status: 503 }
      );
    }
    
    if (error.response) {
      return NextResponse.json(
        { error: error.response.data?.errors?.[0]?.detail || 'Amadeus API error' },
        { status: error.response.status || 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch flight data' },
      { status: 500 }
    );
  }
}




