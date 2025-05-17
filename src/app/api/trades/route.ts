import { createTrade } from "@/services/trades";
import { NextResponse } from "next/server";
import { HandleEssences } from "@prisma/client";
import { auth } from "@/auth";

export async function POST(request: Request) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(2, 9);
  
  console.log(`[${new Date().toISOString()}] [${requestId}] [POST /api/trades] Request started`);
  
  const session = await auth();

  if (!session || !session.user) {
    console.warn(
      `[${new Date().toISOString()}] [${requestId}] [POST /api/trades] Unauthorized access attempt detected. Redirecting to signin.`
    );
    return NextResponse.redirect("/api/auth/signin");
  }

  const { id: userId } = session.user;
  console.log(`[${new Date().toISOString()}] [${requestId}] [POST /api/trades] User ${userId} creating new trade`);
  
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
  
  console.log(`[${new Date().toISOString()}] [${requestId}] [POST /api/trades] Trade details:`, {
    lookingForDragon: {
      dragonId: lookingForDragon.dragonId,
      orbs: lookingForDragon.orbs
    },
    canGiveDragons: canGiveDragons.length
  });
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

    const endTime = Date.now();
    console.log(`[${new Date().toISOString()}] [${requestId}] [POST /api/trades] Trade created successfully in ${endTime - startTime}ms`, {
      userId,
      tradeId: trade.id,
      duration: `${endTime - startTime}ms`
    });
    
    return NextResponse.json(trade);
  } catch (error) {
    const endTime = Date.now();
    console.error(`[${new Date().toISOString()}] [${requestId}] [POST /api/trades] Error creating trade:`, {
      userId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      requestDuration: `${endTime - startTime}ms`
    });
    
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create trade";
    return NextResponse.json({ error: errorMessage, requestId }, { status: 500 });
  }
}
