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
  Badge,
} from "@mantine/core";
import { IconX, IconChevronLeft } from "@tabler/icons-react";
import { formatDistanceToNow } from 'date-fns';
import TradeDragonFaceCard from "./TradeDragonFaceCard";
import { UITrades } from "@/services/trades";
import { FC } from "react";

interface TradePanelProps {
  trade: UITrades[number];
  opened: boolean;
  onClose: () => void;
}

const handleEssencesDisplay = {
  YES: 'Poster Handles Essence',
  NO: 'Requestor Handles Essence',
  SHARED: 'Both Players Share Essence',
};

const TradePanel: FC<TradePanelProps> = ({ trade, opened, onClose }) => {
  if (!trade) return null;
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
        <Group justify="space-between" mb="xs" align="flex-start">
          <div>
            <Title order={2} mb={4}>
              {trade.lookingFor.dragon.name}
            </Title>
            <Text size="sm" c="dimmed">
              Posted {formatDistanceToNow(new Date(trade.createdAt), { addSuffix: true })}
            </Text>
            {trade.isSponsored && (
              <Badge color="yellow" variant="light" mt={8}>
                Sponsored
              </Badge>
            )}
          </div>
          <ActionIcon variant="subtle" onClick={onClose} size="lg">
            <IconX size={24} />
          </ActionIcon>
        </Group>

        <Divider mb="xs" />

        <Stack gap="sm" style={{ flex: 1, minHeight: 0, justifyContent: 'space-between' }}>
          {/* Looking For Section */}
          <Box>
            <Title order={4} mb={4}>Looking For</Title>
            <Group gap="sm" align="center">
              <TradeDragonFaceCard dragon={trade.lookingFor.dragon} size="md" />
              <div>
                <Text fw={600} size="md">{trade.lookingFor.dragon.name}</Text>
                <Text size="sm" c="green" fw={600}>
                  {trade.lookingFor.orbCount} orbs
                </Text>
              </div>
            </Group>
          </Box>

          {/* Can Give Section */}
          <Box style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <Title order={4} mb={4}>Can Give</Title>
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 4 }}>
              <Group wrap="wrap" gap="sm" justify="flex-start">
                {trade.canGive.map((item: any) => (
                  <Card key={item.dragonsId} withBorder shadow="xs" p="xs" style={{ minWidth: 120, maxWidth: 140 }}>
                    <Stack align="center" gap={2}>
                      <TradeDragonFaceCard dragon={item.dragon} size="sm" />
                      <Text fw={600} size="sm">{item.dragon.name}</Text>
                      <Text size="xs" c="green">{item.orbCount} orbs</Text>
                      <Text size="xs" c="dimmed">Ratio: {item.ratioLeft}:{item.ratioRight}</Text>
                    </Stack>
                  </Card>
                ))}
              </Group>
            </div>
          </Box>

          {/* Essence Handling Section */}
          <Box>
            <Title order={4} mb={4}>Essence Handling</Title>
            <Text size="sm" fw={600} c={trade.handleEssences === 'SHARED' ? 'green' : 'dimmed'}>
              {handleEssencesDisplay[trade.handleEssences]}
            </Text>
          </Box>
        </Stack>
      </Card>
    </Drawer>
  );
};

export default TradePanel;
