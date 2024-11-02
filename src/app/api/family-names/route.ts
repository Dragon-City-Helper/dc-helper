import { NextResponse } from "next/server";
import { fetchUniqueFamilyNames } from "@/services/dragons";

export async function GET() {
  console.log("GET request received at /api/dragons/families");

  try {
    const familyNames = await fetchUniqueFamilyNames();
    console.log(`Fetched ${familyNames.length} unique family names`);

    return NextResponse.json(familyNames);
  } catch (error) {
    console.error("Error fetching unique family names:", error);
    return NextResponse.json(
      { error: "Failed to fetch family names" },
      { status: 500 },
    );
  }
}
