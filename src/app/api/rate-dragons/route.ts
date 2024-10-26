// app/api/rate-dragons/route.ts

import { NextResponse } from "next/server";
import { fetchRateScreenDragons } from "@/services/dragons";
import { Rarity, Role } from "@prisma/client";
import { auth } from "@/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const session = await auth();

  if (!session || !session.user || session.user.role === Role.USER) {
    return NextResponse.redirect("/api/auth/signin");
  }

  const rarity = searchParams.get("rarity") as Rarity;
  const skip = Number(searchParams.get("skip")) || 0;
  const take = Number(searchParams.get("take")) || 50;
  const search = searchParams.get("search") || undefined;
  const element = searchParams.get("element") || undefined;
  const familyName = searchParams.get("familyName") || undefined;
  const skins = searchParams.get("skins") || undefined;

  if (!rarity) {
    return NextResponse.json({ error: "Rarity is required" }, { status: 400 });
  }

  try {
    const dragons = await fetchRateScreenDragons({
      rarity,
      skip,
      take,
      search,
      element,
      familyName,
      skins,
    });

    return NextResponse.json(dragons);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch dragons" },
      { status: 500 },
    );
  }
}
