import { NextResponse } from "next/server";
import { fetchUniqueFamilyNames } from "@/services/dragons";

export async function GET() {
  try {
    const familyNames = await fetchUniqueFamilyNames();
    return NextResponse.json(familyNames);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch family names" },
      { status: 500 },
    );
  }
}
