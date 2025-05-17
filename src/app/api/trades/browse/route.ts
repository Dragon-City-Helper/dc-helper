import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getTrades, getTradesExcludingUser } from '@/services/trades';

export async function GET(request: Request) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(2, 9);
  
  console.log(`[${new Date().toISOString()}] [${requestId}] [GET /api/trades/browse] Request started`, {
    url: request.url,
    headers: Object.fromEntries(request.headers.entries())
  });

  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    
    // For public access (no session), return a limited set of trades
    if (!session?.user?.id) {
      const publicTrades = await getTrades();
      const limit = parseInt(searchParams.get('limit') || '10');
      const paginatedTrades = publicTrades.slice(0, limit);
      
      console.log(`[${new Date().toISOString()}] [${requestId}] Returning ${paginatedTrades.length} public trades`);
      return NextResponse.json(paginatedTrades);
    }
    
    // For logged-in users, exclude their own trades using the service method
    const trades = await getTradesExcludingUser(session.user.id);
    
    const endTime = Date.now();
    console.log(`[${new Date().toISOString()}] [${requestId}] [GET /api/trades/browse] Request completed in ${endTime - startTime}ms`, {
      userId: session.user.id,
      tradeCount: trades.length
    });

    return NextResponse.json(trades);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [${requestId}] Error fetching trades:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      requestDuration: `${Date.now() - startTime}ms`
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch trades',
        requestId
      },
      { status: 500 }
    );
  }
}
