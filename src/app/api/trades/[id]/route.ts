import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { HandleEssences } from "@prisma/client";
import { deleteTrade, updateTrade } from "@/services/trades";
import { prisma } from "@/lib/prisma";

// GET /api/trades/[id] - Get a single trade by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(2, 9);
  const tradeId = params.id;
  
  console.log(`[${new Date().toISOString()}] [${requestId}] [GET /api/trades/${tradeId}] Request started`);

  try {
    const trade = await prisma.trade.findUnique({
      where: { id: tradeId, isDeleted: false },
      include: {
        lookingFor: {
          include: {
            dragon: {
              select: {
                id: true,
                name: true,
                rarity: true,
                thumbnail: true,
                familyName: true,
                isSkin: true,
                isVip: true,
                hasSkills: true,
                hasAllSkins: true,
                skillType: true,
              },
            },
          },
        },
        canGive: {
          include: {
            dragon: {
              select: {
                id: true,
                name: true,
                rarity: true,
                thumbnail: true,
                familyName: true,
                isSkin: true,
                isVip: true,
                hasSkills: true,
                hasAllSkins: true,
                skillType: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!trade) {
      console.log(`[${new Date().toISOString()}] [${requestId}] [GET /api/trades/${tradeId}] Trade not found`);
      return NextResponse.json(
        { error: "Trade not found" },
        { status: 404 }
      );
    }

    const endTime = Date.now();
    console.log(`[${new Date().toISOString()}] [${requestId}] [GET /api/trades/${tradeId}] Request completed successfully in ${endTime - startTime}ms`);
    return NextResponse.json(trade);
  } catch (error) {
    const endTime = Date.now();
    console.error(`[${new Date().toISOString()}] [${requestId}] [GET /api/trades/${tradeId}] Error:`, {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      requestDuration: `${endTime - startTime}ms`
    });
    
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch trade";
    return NextResponse.json({ error: errorMessage, requestId }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(2, 9);
  const tradeId = params.id;
  
  console.log(`[${new Date().toISOString()}] [${requestId}] [PATCH /api/trades/${tradeId}] Request started`);
  
  const session = await auth();

  if (!session || !session.user) {
    console.log(`[${new Date().toISOString()}] [${requestId}] [PATCH /api/trades/${tradeId}] Unauthorized access attempt`);
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { id: userId } = session.user;
  console.log(`[${new Date().toISOString()}] [${requestId}] [PATCH /api/trades/${tradeId}] User ${userId} attempting to update trade`);

  try {
    const data = await request.json();
    console.log(`[${new Date().toISOString()}] [${requestId}] [PATCH /api/trades/${tradeId}] Update data:`, {
      userId,
      tradeId,
      // Log the operation type but not the full data for security
      operations: Object.keys(data)
    });
    
    // Pass the full data object to support all CreateTradeInput fields
    // This includes lookingFor and canGiveDragons for complete trade updates
    const updatedTrade = await updateTrade(tradeId, userId, data);

    if (!updatedTrade) {
      console.log(`[${new Date().toISOString()}] [${requestId}] [PATCH /api/trades/${tradeId}] Trade not found or permission denied`);
      return NextResponse.json(
        { error: "Trade not found or you don't have permission to update it" },
        { status: 404 }
      );
    }

    const endTime = Date.now();
    console.log(`[${new Date().toISOString()}] [${requestId}] [PATCH /api/trades/${tradeId}] Request completed successfully in ${endTime - startTime}ms`);
    return NextResponse.json(updatedTrade);
  } catch (error) {
    const endTime = Date.now();
    console.error(`[${new Date().toISOString()}] [${requestId}] [PATCH /api/trades/${tradeId}] Error:`, {
      userId,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      requestDuration: `${endTime - startTime}ms`
    });
    
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update trade";
    return NextResponse.json({ error: errorMessage, requestId }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(2, 9);
  const tradeId = params.id;
  
  console.log(`[${new Date().toISOString()}] [${requestId}] [DELETE /api/trades/${tradeId}] Request started`);
  
  const session = await auth();

  if (!session || !session.user) {
    console.log(`[${new Date().toISOString()}] [${requestId}] [DELETE /api/trades/${tradeId}] Unauthorized access attempt`);
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { id: userId } = session.user;
  console.log(`[${new Date().toISOString()}] [${requestId}] [DELETE /api/trades/${tradeId}] User ${userId} attempting to delete trade`);

  try {
    // Delete the trade (soft delete) using the service method
    const deletedTrade = await deleteTrade(tradeId, userId);

    if (!deletedTrade) {
      console.log(`[${new Date().toISOString()}] [${requestId}] [DELETE /api/trades/${tradeId}] Trade not found or permission denied`);
      return NextResponse.json(
        { error: "Trade not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    const endTime = Date.now();
    console.log(`[${new Date().toISOString()}] [${requestId}] [DELETE /api/trades/${tradeId}] Request completed successfully in ${endTime - startTime}ms`);
    return NextResponse.json({ success: true, trade: deletedTrade });
  } catch (error) {
    const endTime = Date.now();
    console.error(`[${new Date().toISOString()}] [${requestId}] [DELETE /api/trades/${tradeId}] Error:`, {
      userId,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      requestDuration: `${endTime - startTime}ms`
    });
    
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to delete trade: ${errorMessage}`, requestId },
      { status: 500 }
    );
  }
}
