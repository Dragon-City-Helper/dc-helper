"use client";

import { type UITrades } from "@/services/trades";
import TradeCard from "@/components/TradeCard";
import { Text, Stack, SimpleGrid, Box } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchTradeRequests } from "@/services/tradeApi";
import { useMediaQuery } from "@mantine/hooks";
import { useMantineTheme } from "@mantine/core";

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
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const isTablet = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

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
    <Stack gap="md">
      <Box px={{ base: 0, sm: 'md' }} mx={{ base: -16, sm: 0 }}>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing={{ base: 'xs', sm: 'md' }}
          verticalSpacing={{ base: 'xs', sm: 'md' }}
        >
          {trades.map((trade) => {
            const isRequested = requestedTrades.has(trade.id);
            return (
              <Box key={trade.id}>
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
                    onRequestTrade ? () => onRequestTrade(trade) : undefined
                  }
                  showRequestButton={showRequestButton}
                  isRequested={isRequested}
                />
              </Box>
            );
          })}
        </SimpleGrid>
      </Box>

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
  );
}
