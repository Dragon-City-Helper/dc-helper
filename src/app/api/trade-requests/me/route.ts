import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  console.log("[API] GET /api/trade-requests/me - Request received");
  const session = await auth();

  if (!session?.user?.id) {
    console.log("[API] GET /api/trade-requests/me - Unauthorized access attempt");
    return NextResponse.json(
      { error: "Unauthorized access" },
      { status: 401 }
    );
  }

  try {
    console.log(`[API] GET /api/trade-requests/me - Fetching requests for user ${session.user.id}`);
    
    const tradeRequests = await prisma.tradeRequest.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        trade: {
          include: {
            lookingFor: {
              include: {
                dragon: {
                  select: {
                    id: true,
                    name: true,
                    elements: true,
                    image: true,
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
                    elements: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`[API] GET /api/trade-requests/me - Found ${tradeRequests.length} requests`);

    // Transform the data to match the expected format
    const formattedRequests = tradeRequests.map(request => {
      // Add a default status since it's not in the schema
      const tradeRequest = request as any;
      return {
        id: tradeRequest.id,
        tradeId: tradeRequest.tradeId,
        status: 'pending', // Default status since it's not in the schema
        createdAt: tradeRequest.createdAt,
        updatedAt: tradeRequest.updatedAt,
        trade: {
          id: tradeRequest.trade.id,
          lookingFor: {
            dragon: tradeRequest.trade.lookingFor.dragon,
            orbCount: tradeRequest.trade.lookingFor.orbCount,
          },
          canGive: tradeRequest.trade.canGive.map((give: any) => ({
            dragon: give.dragon,
            orbCount: give.orbCount,
            ratioLeft: give.ratioLeft,
            ratioRight: give.ratioRight,
          })),
          isVisible: tradeRequest.trade.isVisible,
          isDeleted: tradeRequest.trade.isDeleted,
          createdAt: tradeRequest.trade.createdAt,
          updatedAt: tradeRequest.trade.updatedAt,
        },
      };
    });

    return NextResponse.json({ data: formattedRequests });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("[API] GET /api/trade-requests/me - Error:", errorMessage);
    return NextResponse.json(
      { 
        error: "Failed to fetch trade requests",
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
