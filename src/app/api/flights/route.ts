// app/api/flights/route.ts
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
      adults,
      travelClass: travelClass || 'ECONOMY',
      nonStop: nonStop === 'true',
      max: max ? parseInt(max) : 50
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Amadeus API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flight data' },
      { status: 500 }
    );
  }
}