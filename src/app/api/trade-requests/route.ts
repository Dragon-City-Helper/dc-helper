import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  createTradeRequest,
  getTradeRequestsForTrade,
} from "@/services/trades";

// Create a new trade request
export async function POST(request: Request) {
  console.log("[API] POST /api/trade-requests - Request received");
  const session = await auth();

  if (!session?.user?.id) {
    console.log("[API] POST /api/trade-requests - Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { tradeId } = await request.json();
    console.log(
      `[API] POST /api/trade-requests - User ${session.user.id} requesting trade ${tradeId}`
    );

    if (!tradeId) {
      console.log("[API] POST /api/trade-requests - Missing tradeId parameter");
      return NextResponse.json(
        { error: "Trade ID is required" },
        { status: 400 }
      );
    }

    const result = await createTradeRequest(tradeId, session.user.id);
    console.log(
      `[API] POST /api/trade-requests - Create trade request result: ${
        result.success ? "Success" : "Failed"
      }`
    );

    if (!result.success) {
      console.log(`[API] POST /api/trade-requests - Failed: ${result.message}`);
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    console.log(
      "[API] POST /api/trade-requests - Request created successfully"
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] POST /api/trade-requests - Error:", error);
    return NextResponse.json(
      { error: "Failed to create trade request" },
      { status: 500 }
    );
  }
}

// Get trade requests for a specific trade
export async function GET(request: Request) {
  console.log("[API] GET /api/trade-requests - Request received");
  const session = await auth();

  if (!session?.user?.id) {
    console.log("[API] GET /api/trade-requests - Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const tradeId = searchParams.get("tradeId");
    console.log(
      `[API] GET /api/trade-requests - User ${session.user.id} fetching requests for trade ${tradeId}`
    );

    if (!tradeId) {
      console.log("[API] GET /api/trade-requests - Missing tradeId parameter");
      return NextResponse.json(
        { error: "Trade ID is required" },
        { status: 400 }
      );
    }

    const result = await getTradeRequestsForTrade(tradeId, session.user.id);
    console.log(
      `[API] GET /api/trade-requests - Fetch result: ${
        result.success ? "Success" : "Failed"
      }`
    );

    if (!result.success) {
      console.log(`[API] GET /api/trade-requests - Failed: ${result.message}`);
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    console.log(
      `[API] GET /api/trade-requests - Successfully retrieved ${
        result.data?.length || 0
      } requests`
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] GET /api/trade-requests - Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trade requests" },
      { status: 500 }
    );
  }
}
