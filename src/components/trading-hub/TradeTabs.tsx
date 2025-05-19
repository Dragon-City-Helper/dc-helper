import { Tabs, Text, Box } from "@mantine/core";
interface TradeTabsProps {
  activeTab: string;
  onTabChange: (tab: string | null) => void;
  isAuthenticated: boolean;
}

export function TradeTabs({
  activeTab,
  onTabChange,
  isAuthenticated,
}: TradeTabsProps) {
  return (
    <Tabs value={activeTab} onChange={onTabChange} radius="md">
      <Tabs.List grow={true}>
        <Tabs.Tab value="browse">Browse Trades</Tabs.Tab>
        <Tabs.Tab value="my-trades" disabled={!isAuthenticated}>
          My Trades
        </Tabs.Tab>
        <Tabs.Tab value="archived" disabled={!isAuthenticated}>
          Archived
        </Tabs.Tab>
      </Tabs.List>

      <Box px="sm" py="md">
        {activeTab === "browse" && (
          <Text size="sm" c="dimmed">
            Browse all available trades from other players. Find the dragons
            you&apos;re looking for!
          </Text>
        )}
        {activeTab === "my-trades" && (
          <Text size="sm" c="dimmed">
            View and manage your active trade listings. Monitor requests and
            update your offers.
          </Text>
        )}
        {activeTab === "archived" && (
          <Text size="sm" c="dimmed">
            Review your hidden or completed trades. You can restore them at any
            time.
          </Text>
        )}
      </Box>
    </Tabs>
  );
}
