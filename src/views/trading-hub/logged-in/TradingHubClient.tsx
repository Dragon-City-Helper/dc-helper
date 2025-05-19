"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Text, Title, Stack, Group, Container, Box, Badge } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { sendGAEvent } from "@next/third-parties/google";
import { useSession } from "next-auth/react";
import { createTradeApi, UITrades } from "@/services/trades";
import {
  requestTrade,
  fetchTradeRequests,
  deleteTrade as deleteTradeApi,
  toggleTradeVisibility,
  updateTradeApi,
  UpdateTradeData,
} from "@/services/tradeApi";
import { useTradingHub } from "@/hooks/useTradingHub";
import {
  TradeTabs,
  TradeListSection,
  TradeRequestModal,
  TradeActionButtons,
  TradeModals,
} from "@/components/trading-hub";

export function TradingHubClient() {
  const router = useRouter();
  const { data: session } = useSession();
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [updateModalOpened, setUpdateModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [tradeToEdit, setTradeToEdit] = useState<UITrades[number] | null>(null);
  const [tradeToDelete, setTradeToDelete] = useState<UITrades[number] | null>(
    null
  );
  const [tradeRequestsMap, setTradeRequestsMap] = useState<
    Record<string, any[]>
  >({});
  const [requestModalOpened, setRequestModalOpened] = useState(false);
  const [tradeToRequest, setTradeToRequest] = useState<UITrades[number] | null>(
    null
  );
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<UITrades[number] | null>(
    null
  );

  const {
    activeTab,
    trades,
    isLoading,
    error: tradingHubError,
    handleTabChange,
    refreshTrades,
    isAuthenticated,
  } = useTradingHub();

  // Convert error to string for display
  const error = useMemo(() => {
    if (!tradingHubError) return null;
    if (typeof tradingHubError === "string") return tradingHubError;
    if (tradingHubError && typeof tradingHubError === "object") {
      const errorObj = tradingHubError as { message?: unknown };
      if ("message" in errorObj && errorObj.message) {
        return String(errorObj.message);
      }
    }
    return "An unknown error occurred";
  }, [tradingHubError]);

  const handleTabChangeWrapper = (tab: string | null) => {
    if (tab) {
      handleTabChange(tab as "browse" | "my-trades" | "archived");

      // Track tab change in Google Analytics
      sendGAEvent("event", "trading_hub_tab_change", {
        tab: tab,
      });
    }
  };

  // Load trade requests for user's trades when viewing My Trades tab
  useEffect(() => {
    if (activeTab === "my-trades" && trades.length > 0 && isAuthenticated) {
      const loadRequests = async () => {
        const requestsMap: Record<string, any[]> = {};

        for (const trade of trades) {
          const requests = await fetchTradeRequests(trade.id);
          if (requests && requests.length > 0) {
            requestsMap[trade.id] = requests;
          }
        }

        setTradeRequestsMap(requestsMap);
      };

      loadRequests();
    }
  }, [activeTab, trades, isAuthenticated]);

  const handleCreateTrade = async (values: TradeFormValues) => {
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

      // Track trade creation in Google Analytics
      sendGAEvent("event", "create_trade", {
        dragon_requested: values.lookingFor.dragonId,
        orbs_requested: values.lookingFor.orbs,
        dragons_offered: values.canGiveDragons.length,
      });

      await createTradeApi(tradeData);
      refreshTrades();
      setCreateModalOpened(false);
      return true;
    } catch (error) {
      console.error("Error creating trade:", error);
      return false;
    }
  };

  const handleUpdateTrade = async (values: TradeFormValues) => {
    if (!tradeToEdit) return false;

    try {
      const updateData: UpdateTradeData = {
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

      await updateTradeApi(tradeToEdit.id, updateData);
      
      // Track trade update in Google Analytics
      sendGAEvent("event", "update_trade", {
        trade_id: tradeToEdit.id,
        dragon_requested: values.lookingFor.dragonId,
        orbs_requested: values.lookingFor.orbs,
        dragons_offered: values.canGiveDragons.length,
      });
      
      refreshTrades();
      setUpdateModalOpened(false);
      setTradeToEdit(null);
      return true;
    } catch (error) {
      console.error("Error updating trade:", error);
      return false;
    }
  };

  // Define types for the trade form values
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

  // Function to handle requesting a trade
  const handleRequestTrade = (trade: UITrades[number]) => {
    setTradeToRequest(trade);
    setRequestModalOpened(true);

    // Track trade request click in Google Analytics
    sendGAEvent("event", "request_trade_click", {
      trade_id: trade.id,
      dragon_requested: trade.lookingFor.dragon.name,
    });
  };

  // Function to submit a trade request
  const submitTradeRequest = async () => {
    if (!tradeToRequest) return;
    setIsRequestLoading(true);

    try {
      const success = await requestTrade(tradeToRequest);
      if (success) {
        // Track successful trade request in Google Analytics
        sendGAEvent("event", "trade_request_submitted", {
          trade_id: tradeToRequest.id,
          dragon_requested: tradeToRequest.lookingFor.dragon.name,
        });
        setRequestModalOpened(false);
        setTradeToRequest(null);
      }
    } finally {
      setIsRequestLoading(false);
    }
  };

  const handleOpenTradePanel = (trade: UITrades[number]) => {
    // Track trade view in Google Analytics
    sendGAEvent("event", "view_trade_details", {
      trade_id: trade.id,
      dragon_requested: trade.lookingFor.dragon.name,
    });
    router.push(`/trades/${trade.id}`);
  };

  const handleEditTrade = (trade: UITrades[number]) => {
    setTradeToEdit(trade);
    setUpdateModalOpened(true);

    // Track edit trade action in Google Analytics
    sendGAEvent("event", "edit_trade_click", {
      trade_id: trade.id,
    });
  };

  const confirmDeleteTrade = async () => {
    if (!tradeToDelete) return;

    try {
      await deleteTradeApi(tradeToDelete);
      // Track successful trade deletion in Google Analytics
      sendGAEvent("event", "trade_deleted", {
        trade_id: tradeToDelete.id,
        dragon_requested: tradeToDelete.lookingFor.dragon.name,
      });
      refreshTrades();
      setDeleteModalOpened(false);
      notifications.show({
        title: "Success",
        message: "Trade deleted successfully",
        color: "green",
      });
    } catch (error) {
      console.error("Error deleting trade:", error);
      notifications.show({
        title: "Error",
        message: "Failed to delete trade. Please try again.",
        color: "red",
      });
    } finally {
      setTradeToDelete(null);
    }
  };

  const handleDeleteTrade = (trade: UITrades[number]) => {
    setTradeToDelete(trade);
    setDeleteModalOpened(true);

    // Track delete trade action in Google Analytics
    sendGAEvent("event", "delete_trade_click", {
      trade_id: trade.id,
    });
  };

  const handleToggleVisibility = async (trade: UITrades[number]) => {
    const success = await toggleTradeVisibility(trade);
    if (success) {
      // Track trade visibility toggle in Google Analytics
      sendGAEvent("event", "toggle_trade_visibility", {
        trade_id: trade.id,
        new_visibility: !trade.isVisible ? "visible" : "hidden"
      });
      refreshTrades();
    }
  };

  return (
    <Container size="xl" px={{ base: 'xs', sm: 'md' }}>
      <Stack gap="lg">
        {/* Header */}
        <Stack gap="xs" align="center" mt={-8} mb={-4}>
          <Group justify="center" gap="sm">
            <Title order={2} size="h3" lh={1.2}>
              Trading Hub
            </Title>
            <Badge color="blue" variant="light" size="lg" radius="sm">
              Beta
            </Badge>
          </Group>
          <Text c="dimmed" ta="center" maw={600} size="sm" lh={1.3}>
            Connect with other players to trade dragons. Browse available trades
            or manage your own.
          </Text>
        </Stack>

        {/* Action Buttons */}
        <Box mt="sm">
          <TradeActionButtons
            onCreateClick={() => setCreateModalOpened(true)}
            onRefreshClick={refreshTrades}
            isLoading={isLoading}
          />
        </Box>

        {/* Main Tabs */}
        <TradeTabs
          activeTab={activeTab}
          onTabChange={handleTabChangeWrapper}
          isAuthenticated={isAuthenticated}
        />

        {/* Tab Content */}
        <Box mt="md">
          {/* Browse Trades Tab */}
          {activeTab === "browse" && (
            <TradeListSection
              activeTab={activeTab}
              trades={trades.filter((t) => {
                // Filter out the current user's trades and only show visible, non-deleted trades
                const tradeUserId =
                  (t as any).userId || ((t as any).user && (t as any).user.id);
                return (
                  tradeUserId !== session?.user?.id && !t.isDeleted && t.isVisible
                );
              })}
              isLoading={isLoading}
              error={error}
              onOpenTradePanel={handleOpenTradePanel}
              onToggleVisibility={handleToggleVisibility}
              showActions={false}
              showRequestButton={true}
              onRequestTrade={handleRequestTrade}
            />
          )}

              {/* My Trades Tab */}
          {activeTab === "my-trades" && (
            <Box>
              <TradeListSection
                activeTab={activeTab}
                trades={trades.filter((t) => {
                  // Safely check if the trade belongs to the current user
                  const tradeUserId =
                    (t as any).userId || ((t as any).user && (t as any).user.id);
                  return (
                    tradeUserId === session?.user?.id && !t.isDeleted && t.isVisible
                  );
                })}
                isLoading={isLoading}
                error={error}
                onOpenTradePanel={handleOpenTradePanel}
                onToggleVisibility={handleToggleVisibility}
                onEditTrade={handleEditTrade}
                onDeleteTrade={handleDeleteTrade}
                showActions={true}
              />
            </Box>
          )}

              {/* Archived Trades Tab */}
          {activeTab === "archived" && (
            <TradeListSection
              activeTab={activeTab}
              trades={trades.filter((t) => t.isDeleted || !t.isVisible)}
              isLoading={isLoading}
              error={error}
              onOpenTradePanel={handleOpenTradePanel}
              onToggleVisibility={handleToggleVisibility}
              showActions={true}
            />
          )}

          {/* All Modals */}
          <TradeModals
            // Create Modal
            createModalOpened={createModalOpened}
            setCreateModalOpened={setCreateModalOpened}
            onCreateTrade={handleCreateTrade}
            // Update Modal
            updateModalOpened={updateModalOpened}
            setUpdateModalOpened={setUpdateModalOpened}
            tradeToEdit={tradeToEdit}
            onUpdateTrade={handleUpdateTrade}
            // Delete Modal
            deleteModalOpened={deleteModalOpened}
            setDeleteModalOpened={setDeleteModalOpened}
            tradeToDelete={tradeToDelete}
            onConfirmDelete={confirmDeleteTrade}
            isDeleting={isDeleting}
          />

          {/* Trade Request Modal */}
          <TradeRequestModal
            opened={requestModalOpened}
            onClose={() => setRequestModalOpened(false)}
            trade={tradeToRequest}
            onSubmit={submitTradeRequest}
            isLoading={isRequestLoading}
          />


        </Box>
      </Stack>
    </Container>
  );
}
