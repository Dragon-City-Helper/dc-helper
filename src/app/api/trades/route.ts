import {
  createTrade,
  createTradeRequest,
  getTradesByFilters,
} from "@/services/trades";
import { NextResponse } from "next/server";
import { Rarity, Elements, HandleEssences } from "@prisma/client";
import { auth } from "@/auth";

export async function GET(request: Request) {
  console.log("Received trades API request");
  const { searchParams } = new URL(request.url);
  const rarity = searchParams.get("rarity");
  const element = searchParams.get("element");
  const familyName = searchParams.get("familyName");
  const isSponsored = searchParams.get("isSponsored");
  const lookingForDragonIds = searchParams.get("lookingForDragonIds");
  const canGiveDragonIds = searchParams.get("canGiveDragonIds");

  console.log("Request parameters:", {
    rarity,
    element,
    familyName,
    isSponsored,
    lookingForDragonIds,
    canGiveDragonIds,
  });

  const trades = await getTradesByFilters({
    rarity: rarity ? (rarity as Rarity) : undefined,
    element: element ? (element as Elements) : undefined,
    familyName: familyName ? (familyName as string) : undefined,
    isSponsored: isSponsored ? isSponsored === "true" : undefined,
    lookingForDragonIds: lookingForDragonIds
      ? (lookingForDragonIds as string).split(",")
      : undefined,
    canGiveDragonIds: canGiveDragonIds
      ? (canGiveDragonIds as string).split(",")
      : undefined,
  });

  console.log(`Found ${trades.length} trades matching the criteria`);
  return NextResponse.json(trades);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session || !session.user) {
    console.warn(
      "Unauthorized access attempt detected. Redirecting to signin."
    );
    return NextResponse.redirect("/api/auth/signin");
  }

  const { id: userId } = session.user;
  const { lookingForDragon, canGiveDragons } = (await request.json()) as {
    lookingForDragon: {
      dragonId: string;
      orbs: number;
    };
    canGiveDragons: {
      dragonId: string;
      orbs: number;
      ratioLeft: number;
      ratioRight: number;
    }[];
  };
  try {
    const trade = await createTrade(userId, {
      lookingFor: {
        dragonId: lookingForDragon.dragonId,
        orbs: lookingForDragon.orbs,
      },
      canGiveDragons: canGiveDragons.map((canGive) => ({
        dragonId: canGive.dragonId,
        orbs: canGive.orbs,
        ratioLeft: canGive.ratioLeft,
        ratioRight: canGive.ratioRight,
      })),
      isVisible: true,
      isDeleted: false,
      isSponsored: false,
      handleEssences: HandleEssences.NO,
    });

    return NextResponse.json(trade);
  } catch (error) {
    console.error("Error creating trade:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create trade";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
