// app/api/rate-dragons/route.ts

import { NextResponse } from "next/server";
import { fetchRateScreenDragons } from "@/services/dragons";
import { Rarity, Role } from "@prisma/client";
import { auth } from "@/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  console.log("GET request received at /api/rate-dragons with parameters:", {
    rarity: searchParams.get("rarity"),
    skip: searchParams.get("skip"),
    take: searchParams.get("take"),
    search: searchParams.get("search"),
    element: searchParams.get("element"),
    familyName: searchParams.get("familyName"),
    skins: searchParams.get("skins"),
  });

  const session = await auth();

  if (!session || !session.user || session.user.role === Role.USER) {
    console.warn(
      "Unauthorized access attempt detected. Redirecting to signin.",
    );
    return NextResponse.redirect("/api/auth/signin");
  }

  console.log(`User authenticated with role: ${session.user.role}`);

  const rarity = searchParams.get("rarity") as Rarity;
  const skip = Number(searchParams.get("skip")) || 0;
  const take = Number(searchParams.get("take")) || 50;
  const search = searchParams.get("search") || undefined;
  const element = searchParams.get("element") || undefined;
  const familyName = searchParams.get("familyName") || undefined;
  const skins = searchParams.get("skins") || undefined;

  if (!rarity) {
    console.warn("Rarity parameter missing in request");
    return NextResponse.json({ error: "Rarity is required" }, { status: 400 });
  }

  try {
    console.log("Fetching dragons with the following filters:", {
      rarity,
      skip,
      take,
      search,
      element,
      familyName,
      skins,
    });

    const dragons = await fetchRateScreenDragons({
      rarity,
      skip,
      take,
      search,
      element,
      familyName,
      skins,
    });

    console.log(`Fetched ${dragons.length} dragons for rating screen`);

    return NextResponse.json(dragons);
  } catch (error) {
    console.error("Error fetching dragons for rating screen:", error);
    return NextResponse.json(
      { error: "Failed to fetch dragons" },
      { status: 500 },
    );
  }
}
