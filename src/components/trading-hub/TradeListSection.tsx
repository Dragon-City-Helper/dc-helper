import { TradeList } from "@/components/trading/TradeList";
import { UITrades } from "@/services/trades";

interface TradeListSectionProps {
  activeTab: string;
  trades: UITrades;
  isLoading: boolean;
  error: string | null;
  onOpenTradePanel: (trade: UITrades[number]) => void;
  onToggleVisibility: (trade: UITrades[number]) => void;
  onEditTrade?: (trade: UITrades[number]) => void;
  onDeleteTrade?: (trade: UITrades[number]) => void;
  showActions: boolean;
  showRequestButton?: boolean;
  onRequestTrade?: (trade: UITrades[number]) => void;
}

export function TradeListSection({
  activeTab,
  trades,
  isLoading,
  error,
  onOpenTradePanel,
  onToggleVisibility,
  onEditTrade,
  onDeleteTrade,
  showActions,
  showRequestButton = false,
  onRequestTrade
}: TradeListSectionProps) {
  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'browse':
        return 'No trades available. Check back later or create your own trade!';
      case 'my-trades':
        return 'You don\'t have any active trades. Create one to get started!';
      case 'archived':
        return 'You don\'t have any archived trades.';
      default:
        return 'No trades found.';
    }
  };

  return (
    <div className="mt-4">
      
      <TradeList
        trades={trades}
        onOpenTradePanel={onOpenTradePanel}
        onToggleVisibility={onToggleVisibility}
        onEditTrade={onEditTrade}
        onDeleteTrade={onDeleteTrade}
        isLoading={isLoading}
        error={error}
        emptyMessage={getEmptyMessage()}
        showActions={showActions}
        showRequestButton={showRequestButton}
        onRequestTrade={onRequestTrade}
      />
      
      {activeTab === 'archived' && (
        <p className="mt-4 text-sm text-gray-500 text-center">
          You can restore any hidden trade by toggling its visibility.
        </p>
      )}
    </div>
  );
}
