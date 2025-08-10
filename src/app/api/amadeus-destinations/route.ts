/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get("origin") || "DUB"; // default origin Dubai

    const tokenResponse = await fetch(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: process.env.AMADEUS_API_KEY || "",
          client_secret: process.env.AMADEUS_API_SECRET || "",
        }),
      }
    );

    if (!tokenResponse.ok) {
      return NextResponse.json({ error: "Failed to get token" }, { status: 500 });
    }

    const tokenData = await tokenResponse.json();

    const destinationsResponse = await fetch(
      `https://test.api.amadeus.com/v1/shopping/flight-destinations?origin=${origin}`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    if (!destinationsResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch destinations" }, { status: 500 });
    }

    const destinationsData = await destinationsResponse.json();

    return NextResponse.json(destinationsData);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
