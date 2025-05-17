import { Button } from "@mantine/core";
import { IconPlus, IconRefresh } from "@tabler/icons-react";

interface TradeActionButtonsProps {
  onCreateClick: () => void;
  onRefreshClick: () => void;
  isLoading: boolean;
  showRefresh?: boolean;
}

export function TradeActionButtons({
  onCreateClick,
  onRefreshClick,
  isLoading,
  showRefresh = true
}: TradeActionButtonsProps) {
  return (
    <div className="flex justify-end items-center gap-3 mb-4">
      {showRefresh && (
        <Button
          variant="subtle"
          onClick={onRefreshClick}
          loading={isLoading}
          size="sm"
          className="flex items-center gap-1"
          leftSection={<IconRefresh size={16} />}
        >
          Refresh
        </Button>
      )}
      <Button
        onClick={onCreateClick}
        variant="filled"
        size="sm"
        className="flex items-center gap-1"
        leftSection={<IconPlus size={16} />}
      >
        Create New Trade
      </Button>
    </div>
  );
}
