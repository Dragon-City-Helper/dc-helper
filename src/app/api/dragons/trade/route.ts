import { NextResponse } from "next/server";
import { fetchTradeDragons } from "@/services/dragons";

export async function GET() {
  try {
    const dragons = await fetchTradeDragons();
    return NextResponse.json(dragons);
  } catch (error) {
    console.error("Error fetching trade dragons:", error);
    return NextResponse.json(
      { error: "Failed to fetch trade dragons" },
      { status: 500 }
    );
  }
}
