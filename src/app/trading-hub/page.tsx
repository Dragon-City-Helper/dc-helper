import { Metadata } from 'next';
import { getTrades } from '@/services/trades';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { TradingHubPublicClient } from '@/views/trading-hub/logged-out/TradingHubPublicClient';

export const metadata: Metadata = {
  title: "Trading Hub | Dragon City Helper",
  description: "Browse and trade dragons with other players. Log in to create your own trades!",
};

export const revalidate = 60; // Revalidate every minute

export default async function TradingHubPage() {
  const session = await auth();
  
  // If user is logged in, redirect to the logged-in version
  if (session) {
    redirect('/trading-hub/me');
  }

  // Get the first 10 trades for the public view
  const allTrades = await getTrades();
  const initialTrades = allTrades.slice(0, 10);

  return (
    <div className="container mx-auto px-4 py-8">
      <TradingHubPublicClient initialTrades={initialTrades} />
    </div>
  );
}
