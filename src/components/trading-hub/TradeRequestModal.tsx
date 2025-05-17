import { Modal, Button, Stack, Text } from "@mantine/core";
import { UITrades } from "@/services/trades";

interface TradeRequestModalProps {
  opened: boolean;
  onClose: () => void;
  trade: UITrades[number] | null;
  onSubmit: () => void;
  isLoading: boolean;
}

export function TradeRequestModal({
  opened,
  onClose,
  trade,
  onSubmit,
  isLoading
}: TradeRequestModalProps) {
  if (!trade) return null;

  return (
    <Modal 
      opened={opened} 
      onClose={onClose}
      title="Request Trade"
      size="md"
    >
      <Stack gap="md">
        <Text>Are you sure you want to request this trade?</Text>
        <Text size="sm" c="dimmed">
          Your contact information will be shared with the trade owner.
        </Text>
        
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="default" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            color="green" 
            onClick={onSubmit}
            loading={isLoading}
          >
            Request Trade
          </Button>
        </div>
      </Stack>
    </Modal>
  );
}
