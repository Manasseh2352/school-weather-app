import { NextResponse } from "next/server";
import { fetchThreeDayForecast } from "@/lib/openMeteo";

export async function GET() {
  try {
    const data = await fetchThreeDayForecast();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Unable to fetch forecast data. Please try again shortly." },
      { status: 502 }
    );
  }
}
