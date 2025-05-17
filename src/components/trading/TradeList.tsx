"use client";

import { type UITrades } from "@/services/trades";
import TradeCard from "@/components/TradeCard";
import { Text, Stack } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchTradeRequests } from "@/services/tradeApi";

interface TradeListProps {
  trades: UITrades;
  onEditTrade?: (trade: UITrades[number]) => void;
  onDeleteTrade?: (trade: UITrades[number]) => void;
  onOpenTradePanel?: (trade: UITrades[number]) => void;
  onToggleVisibility?: (trade: UITrades[number]) => void;
  onRequestTrade?: (trade: UITrades[number]) => void;
  emptyMessage?: string;
  isLoading?: boolean;
  error?: string | null;
  showActions?: boolean;
  showRequestButton?: boolean;
}

export function TradeList({
  trades,
  onEditTrade,
  onDeleteTrade,
  onOpenTradePanel,
  onToggleVisibility,
  onRequestTrade,
  emptyMessage = "No trades found",
  isLoading = false,
  error = null,
  showActions = false,
  showRequestButton = false,
}: TradeListProps) {
  const { data: session } = useSession();
  const [requestedTrades, setRequestedTrades] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadRequestedTrades = async () => {
      if (!session?.user?.id) return;
      
      try {
        // Fetch all trade requests for the current user
        const response = await fetch('/api/trade-requests/me');
        if (!response.ok) throw new Error('Failed to fetch trade requests');
        
        const requests = await response.json();
        const userRequestedTradeIds = new Set<string>(
          requests.data.map((req: { tradeId: string }) => req.tradeId)
        );
        setRequestedTrades(userRequestedTradeIds);
      } catch (error) {
        console.error('Error fetching trade requests:', error);
      }
    };
    
    loadRequestedTrades();
  }, [session?.user?.id]);
  if (isLoading) {
    return (
      <Stack align="center" justify="center" h={200}>
        <Text c="dimmed" ta="center">
          Loading trades...
        </Text>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack align="center" justify="center" h={200}>
        <Text c="red" ta="center">
          {error}
        </Text>
      </Stack>
    );
  }

  if (trades.length === 0) {
    return (
      <Stack align="center" justify="center" h={200}>
        <Text c="dimmed" ta="center">
          {emptyMessage}
        </Text>
      </Stack>
    );
  }

  return (
    <>
      <style>{`
        .trade-list-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          margin-right: calc(-50vw + 50%);
          box-sizing: border-box;
        }
        .trade-list-card {
          margin-bottom: 0.5rem;
        }
        @media (max-width: 600px) {
          .trade-list-grid {
            grid-template-columns: 1fr;
            gap: 0.3rem;
            padding: 0;
            width: 100vw;
            margin-left: calc(-50vw + 50%);
            margin-right: calc(-50vw + 50%);
          }
          .trade-list-card {
            margin-bottom: 0.3rem;
          }
        }
        @media (min-width: 601px) and (max-width: 900px) {
          .trade-list-grid {
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 0.75rem;
            padding: 0 0.5rem;
            width: 100%;
            margin-left: 0;
            margin-right: 0;
          }
        }
      `}</style>
      <Stack gap="md">
      <div className="trade-list-grid">
        {trades.map((trade) => {
          const isRequested = requestedTrades.has(trade.id);
          return (
            <div className="trade-list-card" key={trade.id}>
              <TradeCard
                trade={trade}
                onEdit={
                  showActions && onEditTrade ? () => onEditTrade(trade) : undefined
                }
                onDelete={
                  showActions && onDeleteTrade
                    ? () => onDeleteTrade(trade)
                    : undefined
                }
                onToggleVisibility={
                  showActions && onToggleVisibility
                    ? () => onToggleVisibility(trade)
                    : undefined
                }
                onOpenTradePanel={
                  onOpenTradePanel ? () => onOpenTradePanel(trade) : undefined
                }
                onRequestTrade={
                  onRequestTrade && !isRequested ? () => onRequestTrade(trade) : undefined
                }
                showRequestButton={showRequestButton}
                isRequested={isRequested}
              />
            </div>
          );
        })}
      </div>

      {trades.length > 0 ? (
        <Text size="sm" c="dimmed" ta="center" py="md">
          Showing {trades.length} {trades.length === 1 ? "trade" : "trades"}
        </Text>
      ) : (
        <Text size="sm" c="dimmed" ta="center" py="md">
          {emptyMessage}
        </Text>
      )}
    </Stack>
    </>
  );
}
