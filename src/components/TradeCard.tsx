"use client";

import {
  Card,
  Group,
  Text,
  Badge,
  Divider,
  Button,
  Stack,
  SimpleGrid,
} from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { FC } from "react";
import TradeDragonFaceCard from "@/components/TradeDragonFaceCard";
import { UITrades } from "@/services/trades";
import { timeAgo } from "@/utils/time";

interface TradeCardProps {
  trade: UITrades[number];
  onEdit?: () => void;
  onDelete?: () => void;
  onOpenTradePanel?: (trade: UITrades[number]) => void;
}

const TradeCard: FC<TradeCardProps> = ({ trade, onEdit, onDelete, onOpenTradePanel }) => {
  return (
    <Card
      p="md"
      withBorder
      radius="md"
      shadow="md"
      onClick={() => onOpenTradePanel?.(trade)}
      className="cursor-pointer hover:shadow-lg transition-shadow"
    >
      <Group justify="space-between" mb="sm">
        <Text fw={500}>{trade.lookingFor.dragon.name}</Text>
        {trade.isSponsored && (
          <Badge color="pink" variant="light">
            Sponsored
          </Badge>
        )}
      </Group>

      <Stack gap="sm" align="center">
        <TradeDragonFaceCard dragon={trade.lookingFor.dragon} size="sm" />
        <Text size="sm" fw={500} c="green">
          {trade.lookingFor.orbCount} orbs
        </Text>
      </Stack>

      <Divider my="2px" />

      <Stack gap="2px">
        <Group justify="space-between" mb="sm">
          <Text fw={500} c="dimmed" size="sm">
            Can Give
          </Text>
          {trade.canGive.length > 3 && (
            <Text size="sm" c="dimmed" fw={500}>
              +{trade.canGive.length - 3} more
            </Text>
          )}
        </Group>

        <SimpleGrid cols={3} spacing="sm">
          {trade.canGive.slice(0, 3).map((dragon, index) => (
            <Card key={index} p="sm" withBorder radius="md" shadow="md">
              <Stack gap="sm" align="center">
                <TradeDragonFaceCard dragon={dragon.dragon} size="xs" />
                <Text size="xs" fw={500} c="green">
                  {dragon.orbCount} orbs
                </Text>
                <Text size="xs" c="dimmed" fw={400}>
                  {dragon.ratioLeft}:{dragon.ratioRight}
                </Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>

      <Group mt="2px">
        {onEdit && (
          <Button
            variant="subtle"
            leftSection={<IconEdit size={12} />}
            onClick={() => onEdit()}
          >
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            variant="subtle"
            color="red"
            leftSection={<IconTrash size={12} />}
            onClick={() => onDelete()}
          >
            Delete
          </Button>
        )}
      </Group>
    </Card>
  );
};

export default TradeCard;
