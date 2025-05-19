import { notFound } from 'next/navigation';
import TradeDetail from '@/components/trading/TradeDetail';
import { getTradeById } from '@/services/trades';

interface TradeDetailPageProps {
  params: {
    id: string;
  };
}

export default async function TradeDetailPage({ params }: TradeDetailPageProps) {
  const trade = await getTradeById(params.id);

  if (!trade) {
    notFound();
  }

  return <TradeDetail trade={trade} />;
}

export const dynamic = 'force-dynamic';
