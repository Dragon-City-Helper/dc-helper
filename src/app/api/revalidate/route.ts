// app/api/revalidate/route.ts

import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Get the secret and tag parameters from the request URL
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const tag = searchParams.get("tag");

  // Check if the secret matches; replace 'YOUR_SECRET_KEY' with an actual secret
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  // Validate that the tag parameter exists
  if (!tag) {
    return NextResponse.json(
      { message: "Tag query parameter is required" },
      { status: 400 },
    );
  }

  try {
    // Revalidate the tag path
    revalidateTag(tag);

    // Send a successful response
    return NextResponse.json({ revalidated: true, tag });
  } catch (err) {
    // Handle errors during revalidation
    return NextResponse.json(
      { message: "Error revalidating", error: (err as Error).message },
      { status: 500 },
    );
  }
}
