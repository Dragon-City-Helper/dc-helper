import { Modal, Button, Text } from "@mantine/core";
import { UITrades } from "@/services/trades";
import CreateUpdateTradeModal from "@/components/CreateUpdateTradeModal";

interface TradeFormValues {
  lookingFor: {
    dragonId: string;
    orbs: number;
  };
  canGiveDragons: Array<{
    dragonId: string;
    orbs: number;
    ratioLeft: number;
    ratioRight: number;
  }>;
}

interface TradeModalsProps {
  // Create Modal
  createModalOpened: boolean;
  setCreateModalOpened: (opened: boolean) => void;
  onCreateTrade: (values: TradeFormValues) => Promise<boolean>;
  
  // Update Modal
  updateModalOpened: boolean;
  setUpdateModalOpened: (opened: boolean) => void;
  tradeToEdit: UITrades[number] | null;
  onUpdateTrade: (values: TradeFormValues) => Promise<boolean>;
  
  // Delete Modal
  deleteModalOpened: boolean;
  setDeleteModalOpened: (opened: boolean) => void;
  tradeToDelete: UITrades[number] | null;
  onConfirmDelete: () => void;
  isDeleting: boolean;
}

export function TradeModals({
  createModalOpened,
  setCreateModalOpened,
  onCreateTrade,
  updateModalOpened,
  setUpdateModalOpened,
  tradeToEdit,
  onUpdateTrade,
  deleteModalOpened,
  setDeleteModalOpened,
  tradeToDelete,
  onConfirmDelete,
  isDeleting
}: TradeModalsProps) {
  return (
    <>
      {/* Create Trade Modal */}
      <CreateUpdateTradeModal
        opened={createModalOpened}
        onClose={() => setCreateModalOpened(false)}
        onSubmit={onCreateTrade}
      />

      {/* Update Trade Modal */}
      {tradeToEdit && (
        <CreateUpdateTradeModal
          opened={updateModalOpened}
          onClose={() => {
            setUpdateModalOpened(false);
          }}
          trade={tradeToEdit}
          onSubmit={onUpdateTrade}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title="Delete Trade"
        size="sm"
      >
        <Text>Are you sure you want to delete this trade?</Text>
        <div className="mt-4 flex justify-end gap-3">
          <Button
            variant="default"
            onClick={() => setDeleteModalOpened(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={onConfirmDelete}
            loading={isDeleting}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
