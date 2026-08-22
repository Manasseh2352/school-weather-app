import { NextResponse } from "next/server";
import { fetchCurrentAndHourly } from "@/lib/openMeteo";

export async function GET() {
  try {
    const data = await fetchCurrentAndHourly();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Unable to fetch weather data. Please try again shortly." },
      { status: 502 }
    );
  }
}
