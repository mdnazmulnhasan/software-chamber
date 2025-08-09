import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.toUpperCase() || "";

    if (query.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "Query must be at least 2 characters" },
        { status: 400 }
      );
    }

    // Get Amadeus API credentials
    const clientId = process.env.AMADEUS_API_KEY!;
    const clientSecret = process.env.AMADEUS_API_SECRET!;

    // Get access token
    const tokenRes = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      throw new Error(tokenData.error_description || "Failed to get Amadeus token");
    }

    const accessToken = tokenData.access_token;

    // First search by IATA code (exact match)
    const codeSearchRes = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations/${query}?subType=AIRPORT`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    let results = [];
    
    // If exact IATA code match found
    if (codeSearchRes.ok) {
      const codeData = await codeSearchRes.json();
      if (codeData.data) {
        results.push(codeData.data);
      }
    }

    // Then search by keyword (broad search)
    const keywordSearchRes = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT&keyword=${encodeURIComponent(query)}&view=LIGHT&page[limit]=20`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (keywordSearchRes.ok) {
      const keywordData = await keywordSearchRes.json();
      if (keywordData.data) {
        results = [...results, ...keywordData.data];
      }
    }

    // Process results to ensure consistent format
    const processedResults = results.map((item: any) => ({
      name: item.name || `${item.address?.cityName} Airport`,
      cityName: item.address?.cityName,
      countryName: item.address?.countryName,
      iataCode: item.iataCode,
      type: 'AIRPORT',
      detailedName: item.detailedName || `${item.name} (${item.iataCode})`
    }));

    // Remove duplicates
    const uniqueResults = processedResults.filter(
      (v: any, i: number, a: any[]) => a.findIndex(t => t.iataCode === v.iataCode) === i
    );

    // Special case: Ensure DAC is always included for Dhaka searches
    if (query.includes("DHAKA") || query.includes("DAC")) {
      if (!uniqueResults.some(item => item.iataCode === "DAC")) {
        uniqueResults.unshift({
          name: "Hazrat Shahjalal International Airport",
          cityName: "Dhaka",
          countryName: "Bangladesh",
          iataCode: "DAC",
          type: 'AIRPORT',
          detailedName: "Hazrat Shahjalal International Airport (DAC)"
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      data: uniqueResults
    });

  } catch (error: any) {
    console.error("Location API error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}