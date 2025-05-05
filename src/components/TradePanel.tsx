import {
  ActionIcon,
  Box,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Title,
  Drawer,
  Divider,
} from "@mantine/core";
import { IconX, IconChevronLeft } from "@tabler/icons-react";
import TradeDragonFaceCard from "./TradeDragonFaceCard";
import { UITrades } from "@/services/trades";
import { FC } from "react";

interface TradePanelProps {
  trade: UITrades[number];
  opened: boolean;
  onClose: () => void;
}

const TradePanel: FC<TradePanelProps> = ({ trade, opened, onClose }) => {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      size="xl"
      withCloseButton={false}
      position="right"
      styles={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.55)",
        },
      }}
    >
      <Card
        withBorder
        p="md"
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Group justify="space-between" mb="lg" align="flex-start">
          <Title
            order={3}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "80%",
            }}
          >
            {trade.lookingFor.dragon.name}
          </Title>

          <ActionIcon variant="subtle" onClick={onClose} size="lg">
            <IconX size={24} />
          </ActionIcon>
        </Group>

        <Stack>
          <Stack justify="center" style={{ width: "100%" }} align="center">
            <TradeDragonFaceCard dragon={trade.lookingFor.dragon} size="md" />
            <Text size="sm" fw={500} c="green">
              {trade.lookingFor.orbCount} orbs
            </Text>
          </Stack>

          <Divider my="md" />

          <Title order={4} mb="md">
            Can Give
          </Title>

          <div style={{ flex: 1, overflowY: "auto" }}>
            <Group wrap="wrap" gap="md" justify="space-evenly">
              {trade.canGive.map((dragon) => (
                <Stack gap="2" key={dragon.dragonsId} align="center">
                  <TradeDragonFaceCard dragon={dragon.dragon} size="sm" />
                  <Text size="sm" fw={500} c="dimmed">
                    {dragon.orbCount} orbs
                  </Text>
                  <Text size="sm" c="dimmed" fw={400}>
                    {dragon.ratioLeft}:{dragon.ratioRight}
                  </Text>
                </Stack>
              ))}
            </Group>
          </div>
        </Stack>
      </Card>
    </Drawer>
  );
};

export default TradePanel;
