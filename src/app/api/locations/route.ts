/* eslint-disable @typescript-eslint/no-explicit-any */


import { NextResponse } from 'next/server';
import Amadeus from 'amadeus';

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query || query.length < 2) {
    return NextResponse.json(
      { success: false, message: 'Query parameter is required and must be at least 2 characters long' },
      { status: 400 }
    );
  }

  try {
    const response = await amadeus.referenceData.locations.get({
      keyword: query,
      subType: 'AIRPORT,CITY',
      'page[limit]': 10
    });

    return NextResponse.json({
      success: true,
      data: response.data
    });
  } catch (error: any) {
    console.error('Amadeus API error:', error);
    
    if (error.code === 'NetworkError') {
      return NextResponse.json(
        { success: false, message: 'Network error connecting to Amadeus API' },
        { status: 503 }
      );
    }
    
    if (error.response) {
      return NextResponse.json(
        { 
          success: false, 
          message: error.response.data?.errors?.[0]?.detail || 'Amadeus API error' 
        },
        { status: error.response.status || 500 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}