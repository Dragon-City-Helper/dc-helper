import { NextResponse } from "next/server";
import { fetchUniqueTags } from "@/services/dragons";

export async function GET() {
  console.log("GET request received at /api/dragons/tags");

  try {
    const tags = await fetchUniqueTags();
    console.log(`Fetched ${tags.length} unique tags`);

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching unique tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 },
    );
  }
}
