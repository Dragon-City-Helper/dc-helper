"use client";

import { Button, Stack, Text, Title } from "@mantine/core";
import { signIn } from "next-auth/react";
import { TradeList } from "@/components/trading/TradeList";
import type { UITrades } from "@/services/trades";

interface TradingHubPublicClientProps {
  initialTrades: UITrades;
}

export function TradingHubPublicClient({
  initialTrades,
}: TradingHubPublicClientProps) {
  const handleOpenTradePanel = () => {
    // Redirect to login when trying to interact with a trade
    signIn();
  };

  return (
    <div className="space-y-6">
      <Stack align="center" className="mb-12">
        <Title order={1} size="h2">
          Trading Hub
        </Title>
        <Text c="dimmed" ta="center" maw={600}>
          Connect with other players to trade dragons. Log in to create and
          manage your trades.
        </Text>
        <Button
          variant="filled"
          size="lg"
          onClick={() => signIn()}
          mt="md"
          mb="xl"
        >
          Log in to Trade
        </Button>
      </Stack>

      <div className="mt-8">
        <TradeList
          trades={initialTrades}
          onOpenTradePanel={handleOpenTradePanel}
          // Using default empty message from TradeList
        />
      </div>
    </div>
  );
}
