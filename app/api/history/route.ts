import { NextRequest, NextResponse } from "next/server";
import { fetchDailyHistory } from "@/lib/openMeteo";

export async function GET(req: NextRequest) {
  const days = Number(req.nextUrl.searchParams.get("days") ?? "14");
  try {
    const data = await fetchDailyHistory(Math.min(Math.max(days, 1), 90));
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Unable to fetch historical data. Please try again shortly." },
      { status: 502 }
    );
  }
}
