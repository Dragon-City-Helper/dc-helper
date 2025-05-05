"use client";
import { useState } from "react";
import {
  Container,
  Text,
  Button,
  Group,
  Stack,
  SimpleGrid,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { CreateTradeInput, UITrades } from "@/services/trades";
import TradeCard from "@/components/TradeCard";
import CreateUpdateTradeModal from "@/components/CreateUpdateTradeModal";
import TradePanel from "@/components/TradePanel";
import { useSession } from "next-auth/react";

interface TradingHubProps {
  trades: UITrades[number][];
}

interface ModalStates {
  isCreateTradeOpen: boolean;
  isTradePanelOpen: boolean;
  selectedTrade?: UITrades[number];
}

const TradingHub = ({ trades }: TradingHubProps) => {
  const [modalState, setModalState] = useState<ModalStates>({
    isCreateTradeOpen: false,
    isTradePanelOpen: false,
  });

  const { data: session, status } = useSession();
  const handleSubmit = async (trade: CreateTradeInput) => {
    console.log("Form submitted:", trade);
    setModalState({
      ...modalState,
      isCreateTradeOpen: false,
      isTradePanelOpen: false,
    });
  };

  return (
    <Container>
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={500}>
          Trading Hub
        </Text>
        {status === "authenticated" && (
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() =>
              setModalState({
                ...modalState,
                isCreateTradeOpen: true,
                isTradePanelOpen: false,
              })
            }
          >
            Create Trade
          </Button>
        )}
      </Group>

      <Stack gap="lg">
        <CreateUpdateTradeModal
          opened={modalState.isCreateTradeOpen}
          onClose={() =>
            setModalState({ ...modalState, isCreateTradeOpen: false })
          }
          onSubmit={handleSubmit}
        />
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="sm">
          {trades.map((trade) => (
            <TradeCard
              key={trade.id}
              trade={trade}
              onOpenTradePanel={(trade) => {
                setModalState({
                  ...modalState,
                  isTradePanelOpen: true,
                  isCreateTradeOpen: false,
                  selectedTrade: trade,
                });
              }}
            />
          ))}
        </SimpleGrid>
        <TradePanel
          trade={modalState.selectedTrade || trades[0]}
          opened={modalState.isTradePanelOpen}
          onClose={() =>
            setModalState({ ...modalState, isTradePanelOpen: false })
          }
        />
      </Stack>
    </Container>
  );
};

export default TradingHub;
