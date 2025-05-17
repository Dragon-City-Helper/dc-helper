"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Text, Title, Stack, Group } from "@mantine/core";
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
import TradePanel from "@/components/TradePanel";
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
  const [tradePanelOpen, setTradePanelOpen] = useState(false);

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

  const handleTradeCreated = () => {
    refreshTrades();
    setCreateModalOpened(false);
  };

  const handleTradeUpdated = () => {
    refreshTrades();
    setUpdateModalOpened(false);
    setTradeToEdit(null);
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
        setRequestModalOpened(false);
        setTradeToRequest(null);
      }
    } finally {
      setIsRequestLoading(false);
    }
  };

  const handleOpenTradePanel = (trade: UITrades[number]) => {
    setSelectedTrade(trade);
    setTradePanelOpen(true);

    // Track trade panel open in Google Analytics
    sendGAEvent("event", "view_trade_details", {
      trade_id: trade.id,
      dragon_requested: trade.lookingFor.dragon.name,
      dragons_offered: trade.canGive.length,
    });
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
      refreshTrades();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Stack align="center" className="mb-6">
        <Title order={1} size="h2">
          Trading Hub
        </Title>
        <Text c="dimmed" ta="center" maw={600}>
          Connect with other players to trade dragons. Browse available trades
          or manage your own.
        </Text>
      </Stack>

      {/* Action Buttons */}
      <TradeActionButtons
        onCreateClick={() => setCreateModalOpened(true)}
        onRefreshClick={refreshTrades}
        isLoading={isLoading}
      />

      {/* Main Tabs */}
      <TradeTabs
        activeTab={activeTab}
        onTabChange={handleTabChangeWrapper}
        isAuthenticated={isAuthenticated}
      />

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
          onRequestTrade={handleOpenTradePanel} // You might want to create a separate handler for this
        />
      )}

      {/* My Trades Tab */}
      {activeTab === "my-trades" && (
        <div>
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

          {/* Trade Requests */}
          {Object.entries(tradeRequestsMap).map(([tradeId, requests]) => {
            const trade = trades.find((t) => t.id === tradeId);
            if (!trade || requests.length === 0) return null;

            return (
              <div key={tradeId} className="mt-6">
                <Text fw={500} mb="sm">
                  Requests for your {trade.lookingFor.dragon.name} trade
                </Text>
                {requests.map((request) => (
                  <div key={request.id}>
                    <Group>
                      <Text fw={500} size="sm">
                        {request.createdBy.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Requested {new Date(request.createdAt).toLocaleString()}
                      </Text>
                      {request.message && (
                        <Text size="xs" mt={4} className="italic">
                          {request.message}
                        </Text>
                      )}

                      {request.createdBy.Contacts ? (
                        <Stack gap={4} mt={4}>
                          {request.createdBy.Contacts.discord && (
                            <Text size="xs">
                              Discord:
                              <Text span fw={500}>
                                {request.createdBy.Contacts.discord}
                              </Text>
                            </Text>
                          )}
                          {request.createdBy.Contacts.facebook && (
                            <Text size="xs">
                              Facebook:
                              <Text span fw={500}>
                                {request.createdBy.Contacts.facebook}
                              </Text>
                            </Text>
                          )}
                          {request.createdBy.Contacts.twitter && (
                            <Text size="xs">
                              Twitter:
                              <Text span fw={500}>
                                {request.createdBy.Contacts.twitter}
                              </Text>
                            </Text>
                          )}
                          {request.createdBy.Contacts.instagram && (
                            <Text size="xs">
                              Instagram:
                              <Text span fw={500}>
                                {request.createdBy.Contacts.instagram}
                              </Text>
                            </Text>
                          )}
                          {request.createdBy.Contacts.reddit && (
                            <Text size="xs">
                              Reddit:
                              <Text span fw={500}>
                                {request.createdBy.Contacts.reddit}
                              </Text>
                            </Text>
                          )}
                        </Stack>
                      ) : (
                        <Text size="xs" c="dimmed">
                          No contact information provided
                        </Text>
                      )}
                    </Group>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
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
        onCreateTrade={async (values: TradeFormValues) => {
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
            handleTradeCreated();
            return true;
          } catch (error) {
            console.error("Error creating trade:", error);
            return false;
          }
        }}
        // Update Modal
        updateModalOpened={updateModalOpened}
        setUpdateModalOpened={setUpdateModalOpened}
        tradeToEdit={tradeToEdit}
        onUpdateTrade={async (values: TradeFormValues) => {
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
            handleTradeUpdated();
            return true;
          } catch (error) {
            console.error("Error updating trade:", error);
            return false;
          }
        }}
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

      {/* Trade Panel - Using a type assertion to bypass TypeScript errors for now */}
      {selectedTrade && (
        <div>
          {React.createElement(TradePanel as any, {
            trade: selectedTrade,
            opened: tradePanelOpen,
            onClose: () => setTradePanelOpen(false),
            onEdit: handleEditTrade,
            onDelete: handleDeleteTrade,
            onRequest: handleRequestTrade,
            onToggleVisibility: handleToggleVisibility,
            isOwner:
              "isCurrentUser" in selectedTrade
                ? (selectedTrade as any).isCurrentUser
                : false,
            requests: tradeRequestsMap[selectedTrade.id] || [],
          })}
        </div>
      )}
    </div>
  );
}
