import { Tabs, Text } from "@mantine/core";

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
    <Tabs value={activeTab} onChange={onTabChange} className="space-y-2">
      <Tabs.List>
        <Tabs.Tab value="browse">Browse Trades</Tabs.Tab>
        <Tabs.Tab value="my-trades" disabled={!isAuthenticated}>
          My Trades
        </Tabs.Tab>
        <Tabs.Tab value="archived" disabled={!isAuthenticated}>
          Archived Trades
        </Tabs.Tab>
      </Tabs.List>

      {/* Tab Descriptions */}
      <div className="px-4 py-2 text-sm text-gray-500">
        {activeTab === "browse" && (
          <Text size="sm">
            Browse all available trades from other players. Find the dragons
            you&apos;re looking for!
          </Text>
        )}
        {activeTab === "my-trades" && (
          <Text size="sm">
            View and manage your active trade listings. Monitor requests and
            update your offers.
          </Text>
        )}
        {activeTab === "archived" && (
          <Text size="sm">
            Review your hidden or completed trades. You can restore them at any
            time.
          </Text>
        )}
      </div>
    </Tabs>
  );
}
