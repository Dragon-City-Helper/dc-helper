import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getTradesByUser } from '@/services/trades';

export async function GET(request: Request) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(2, 9);
  
  console.log(`[${new Date().toISOString()}] [${requestId}] [GET /api/trades/me] Request started`);
  
  const session = await auth();
  
  if (!session?.user?.id) {
    console.log(`[${new Date().toISOString()}] [${requestId}] [GET /api/trades/me] Unauthorized access attempt`);
    return NextResponse.json([], { status: 401 });
  }

  try {
    // Determine if we're fetching active or archived trades
    const url = new URL(request.url);
    const mode = url.searchParams.get('mode') === 'archived' ? 'archived' : 'active';
    
    console.log(`[${new Date().toISOString()}] [${requestId}] [GET /api/trades/me] Fetching ${mode} trades for user ${session.user.id}`);
    
    const trades = await getTradesByUser(session.user.id, mode);
    
    const endTime = Date.now();
    console.log(`[${new Date().toISOString()}] [${requestId}] [GET /api/trades/me] Request completed in ${endTime - startTime}ms`, {
      userId: session.user.id,
      mode,
      tradeCount: trades.length
    });
    
    return NextResponse.json(trades);
  } catch (error) {
    const endTime = Date.now();
    console.error(`[${new Date().toISOString()}] [${requestId}] [GET /api/trades/me] Error:`, {
      userId: session?.user?.id,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      requestDuration: `${endTime - startTime}ms`
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch user trades',
        requestId
      },
      { status: 500 }
    );
  }
}
