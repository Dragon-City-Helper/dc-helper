"use client";

import { Card, Group, Text, Badge, Button, Stack, Tooltip, Anchor } from "@mantine/core";
import { IconEdit, IconMessageCircle, IconTrash, IconEye, IconEyeOff } from "@tabler/icons-react";
import { FC } from "react";
import { HandleEssences } from '@prisma/client';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

// Map enum values to display text
const handleEssencesDisplay = {
  [HandleEssences.YES]: 'Poster Handles Essence',
  [HandleEssences.NO]: 'Requestor Handles Essence',
  [HandleEssences.SHARED]: 'Both Players Share Essence'
};
import TradeDragonFaceCard from "@/components/TradeDragonFaceCard";
import { UITrades } from "@/services/trades";
import { timeAgo } from "@/utils/time";
import { formatDistanceToNow } from 'date-fns';

interface TradeCardProps {
  trade: UITrades[number];
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleVisibility?: () => void;
  onOpenTradePanel?: (trade: UITrades[number]) => void;
  onRequestTrade?: (trade: UITrades[number]) => void;
  showRequestButton?: boolean;
  isRequested?: boolean;
}

const TradeCard: FC<TradeCardProps> = ({ 
  trade, 
  onEdit, 
  onDelete, 
  onToggleVisibility, 
  onOpenTradePanel, 
  onRequestTrade, 
  showRequestButton = false,
  isRequested = false
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  return (
    <Card
      withBorder
      radius="md"
      shadow="sm"
      className="h-full flex flex-col hover:shadow-md transition-shadow"
      component="article"
      onClick={() => router.push(`/trades/${trade.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <Card.Section p="md">
        <Group justify="space-between" align="flex-start">
          <div>
            <Text size="lg" fw={600} className="hover:underline">
              {trade.lookingFor.dragon.name}
            </Text>
            <Text size="sm" c="dimmed">
              Posted {formatDistanceToNow(new Date(trade.createdAt), { addSuffix: true })}
            </Text>
          </div>
          <Group gap="xs">
            {trade.isDeleted ? (
              <Badge color="red" variant="light">
                Deleted
              </Badge>
            ) : !trade.isVisible ? (
              <Badge color="orange" variant="light">
                Hidden
              </Badge>
            ) : null}
            {trade.isSponsored && (
              <Badge color="yellow" variant="light">
                Sponsored
              </Badge>
            )}
          </Group>
        </Group>
      </Card.Section>

      <Card.Section p="md" className="flex-1">
        <Stack gap="md">
          <div>
            <Text size="sm" fw={500} c="dimmed" mb="xs">Looking For</Text>
            <Group gap="sm">
              <TradeDragonFaceCard dragon={trade.lookingFor.dragon} size="sm" />
              <div>
                <Text fw={500}>{trade.lookingFor.dragon.name}</Text>
                <Text size="sm" c="green" fw={500}>
                  {trade.lookingFor.orbCount} orbs
                </Text>
              </div>
            </Group>
          </div>

          <div>
            <Text size="sm" fw={500} c="dimmed" mb="xs">Can Give</Text>
            <Stack gap="sm">
              {trade.canGive.slice(0, 3).map((item, index) => (
                <Group key={index} gap="sm">
                  <TradeDragonFaceCard dragon={item.dragon} size="xs" />
                  <div>
                    <Text size="sm" fw={500}>{item.dragon.name}</Text>
                    <Group gap="xs">
                      <Text size="xs" c="green">{item.orbCount} orbs</Text>
                      <Text size="xs" c="dimmed">
                        {item.ratioLeft}:{item.ratioRight}
                      </Text>
                    </Group>
                  </div>
                </Group>
              ))}
              {trade.canGive.length > 3 && (
                <Text size="xs" c="dimmed">
                  +{trade.canGive.length - 3} more dragons
                </Text>
              )}
            </Stack>
          </div>

          <div>
            <Text size="sm" fw={500} c="dimmed" mb="xs">Essence Handling</Text>
            <Text size="sm" fw={500} c={trade.handleEssences === HandleEssences.SHARED ? 'green' : 'dimmed'}>
              {handleEssencesDisplay[trade.handleEssences]}
            </Text>
          </div>
        </Stack>
      </Card.Section>

      <Card.Section p="md" className="border-t border-gray-200">
        <Group justify="space-between">
          {(onEdit || onDelete || onToggleVisibility) ? (
            <Group>
              {onEdit && (
                <Tooltip label="Edit trade">
                  <Button
                    component="a"
                    href={`/trades/${trade.id}`}
                    variant="subtle"
                    leftSection={<IconEdit size={16} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/trades/${trade.id}`);
                    }}
                  >
                    Edit
                  </Button>
                </Tooltip>
              )}
              {onToggleVisibility && (
                <Tooltip label={trade.isVisible ? 'Hide trade' : 'Show trade'}>
                  <Button
                    variant="subtle"
                    color={trade.isVisible ? 'blue' : 'gray'}
                    leftSection={trade.isVisible ? <IconEye size={16} /> : <IconEyeOff size={16} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVisibility();
                    }}
                    size="xs"
                  >
                    {trade.isVisible ? 'Visible' : 'Hidden'}
                  </Button>
                </Tooltip>
              )}
              {onDelete && (
                <Tooltip label="Delete trade">
                  <Button
                    variant="subtle"
                    color="red"
                    leftSection={<IconTrash size={16} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    size="xs"
                  >
                    Delete
                  </Button>
                </Tooltip>
              )}
            </Group>
          ) : (
            <div />
          )}
          
          <Group>
            {showRequestButton && session && onRequestTrade && (
              <Button
                variant={isRequested ? "outline" : "subtle"}
                color={isRequested ? "gray" : "green"}
                leftSection={<IconMessageCircle size={16} />}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isRequested) {
                    onRequestTrade(trade);
                  }
                }}
                disabled={isRequested}
                size="sm"
              >
                {isRequested ? 'Requested' : 'Request Trade'}
              </Button>
            )}
            <Button
              component="a"
              href={`/trades/${trade.id}`}
              variant="light"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/trades/${trade.id}`);
              }}
              size="sm"
            >
              View Details
            </Button>
          </Group>
        </Group>
      </Card.Section>
    </Card>
  );
};

export default TradeCard;
