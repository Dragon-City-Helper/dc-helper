import { NextRequest, NextResponse } from "next/server";
import { getAllianceTags } from "@/services/alliances";

export async function GET(req: NextRequest) {
  try {
    console.log("Received GET /api/alliances/tags");

    const uniqueTags = await getAllianceTags();

    console.log(`Fetched ${uniqueTags.length} unique tags`);

    return NextResponse.json({ tags: uniqueTags }, { status: 200 });
  } catch (error) {
    console.error("Error fetching alliance tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch alliance tags" },
      { status: 500 }
    );
  }
}
