import { NextResponse } from "next/server";
import { fetchUniqueTags } from "@/services/dragons";

export async function GET() {
  try {
    const tags = await fetchUniqueTags();
    return NextResponse.json(tags);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 },
    );
  }
}
