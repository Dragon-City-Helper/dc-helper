"use client";

import { Modal, Stack, Text, Group, Button } from "@mantine/core";
import { UITrades } from "@/services/trades";
import { requestTrade, deleteTrade } from "@/services/tradeApi";
import CreateUpdateTradeModal from "@/components/CreateUpdateTradeModal";
import { useState } from "react";

type TradeModalProps = {
  createModalOpened: boolean;
  setCreateModalOpened: (opened: boolean) => void;
  updateModalOpened: boolean;
  setUpdateModalOpened: (opened: boolean) => void;
  deleteModalOpened: boolean;
  setDeleteModalOpened: (opened: boolean) => void;
  requestModalOpened: boolean;
  setRequestModalOpened: (opened: boolean) => void;
  tradeToEdit: UITrades[number] | null;
  setTradeToEdit: (trade: UITrades[number] | null) => void;
  tradeToDelete: UITrades[number] | null;
  setTradeToDelete: (trade: UITrades[number] | null) => void;
  tradeToRequest: UITrades[number] | null;
  setTradeToRequest: (trade: UITrades[number] | null) => void;
  onTradeCreated: () => void;
  onTradeUpdated: () => void;
  onTradeDeleted: () => void;
};

export function TradeModals({
  createModalOpened,
  setCreateModalOpened,
  updateModalOpened,
  setUpdateModalOpened,
  deleteModalOpened,
  setDeleteModalOpened,
  requestModalOpened,
  setRequestModalOpened,
  tradeToEdit,
  setTradeToEdit,
  tradeToDelete,
  setTradeToDelete,
  tradeToRequest,
  setTradeToRequest,
  onTradeCreated,
  onTradeUpdated,
  onTradeDeleted,
}: TradeModalProps) {
  const [isRequestLoading, setIsRequestLoading] = useState(false);

  // Function to submit a trade request
  const submitTradeRequest = async () => {
    if (!tradeToRequest) return;
    setIsRequestLoading(true);
    
    try {
      const success = await requestTrade(tradeToRequest);
      if (success) {
        setRequestModalOpened(false);
        setTradeToRequest(null);
      }
    } finally {
      setIsRequestLoading(false);
    }
  };

  // Function to handle confirming trade deletion
  const confirmDeleteTrade = async () => {
    if (!tradeToDelete) return;
    
    const success = await deleteTrade(tradeToDelete);
    if (success) {
      setDeleteModalOpened(false);
      setTradeToDelete(null);
      onTradeDeleted();
    }
  };

  return (
    <>
      {/* Create Trade Modal */}
      <CreateUpdateTradeModal
        opened={createModalOpened}
        onClose={() => setCreateModalOpened(false)}
        onSubmit={async (values) => {
          try {
            const tradeData = {
              lookingForDragon: {
                dragonId: values.lookingFor.dragonId,
                orbs: values.lookingFor.orbs,
              },
              canGiveDragons: values.canGiveDragons.map((d) => ({
                dragonId: d.dragonId,
                orbs: d.orbs,
                ratioLeft: d.ratioLeft,
                ratioRight: d.ratioRight,
              })),
            };
            
            // API call will be handled by the createTradeApi function
            // which is imported and used in the parent component
            onTradeCreated();
            return true;
          } catch (error) {
            console.error("Error creating trade:", error);
            return false;
          }
        }}
      />

      {/* Update Trade Modal */}
      {tradeToEdit && (
        <CreateUpdateTradeModal
          opened={updateModalOpened}
          onClose={() => {
            setUpdateModalOpened(false);
            setTradeToEdit(null);
          }}
          trade={tradeToEdit}
          onSubmit={async (values) => {
            try {
              const tradeData = {
                lookingForDragon: {
                  dragonId: values.lookingFor.dragonId,
                  orbs: values.lookingFor.orbs,
                },
                canGiveDragons: values.canGiveDragons.map((d) => ({
                  dragonId: d.dragonId,
                  orbs: d.orbs,
                  ratioLeft: d.ratioLeft,
                  ratioRight: d.ratioRight,
                })),
              };
              // API call will be handled by the update function
              // which should be implemented in the parent component
              onTradeUpdated();
              return true;
            } catch (error) {
              console.error("Error updating trade:", error);
              return false;
            }
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={() => {
          setDeleteModalOpened(false);
          setTradeToDelete(null);
        }}
        title="Delete Trade"
        centered
      >
        <Stack>
          <Text>
            Are you sure you want to delete this trade? This action cannot be undone.
          </Text>
          {tradeToDelete && (
            <Text fw={600}>
              Looking for: {tradeToDelete.lookingFor.dragon.name || ''}
            </Text>
          )}
          <Group justify="flex-end" mt="md">
            <Button
              variant="light"
              onClick={() => {
                setDeleteModalOpened(false);
                setTradeToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button color="red" onClick={confirmDeleteTrade}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Trade Request Confirmation Modal */}
      <Modal
        opened={requestModalOpened}
        onClose={() => {
          setRequestModalOpened(false);
          setTradeToRequest(null);
        }}
        title="Request Trade"
        centered
      >
        <Stack>
          <Text>
            You are about to request this trade. Your contact information will be visible to the trade owner.
          </Text>
          {tradeToRequest && (
            <Text fw={600}>
              Looking for: {tradeToRequest.lookingFor.dragon.name}
            </Text>
          )}
          <Group justify="flex-end" mt="md">
            <Button
              variant="light"
              onClick={() => {
                setRequestModalOpened(false);
                setTradeToRequest(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              color="green" 
              onClick={submitTradeRequest}
              loading={isRequestLoading}
            >
              Request Trade
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
