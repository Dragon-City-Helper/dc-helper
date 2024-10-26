import { Card, Skeleton, Group, Text, Center } from "@mantine/core";
import { FC } from "react";

const DragonDetailCardSkeleton: FC = () => {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      {/* Title Skeleton */}
      <Skeleton height={20} width="60%" mt="md" mx="auto" />

      {/* Image Skeleton */}
      <Card.Section h={250}>
        <Center>
          <Skeleton height={175} width={175} mt="md" />
        </Center>
      </Card.Section>

      {/* Elements Skeleton */}
      <Group justify="center" gap={4} my="md">
        {/* Simulate the number of elements (e.g., 4) */}
        {[...Array(4)].map((_, index) => (
          <Skeleton key={index} height={32} width={32} radius="xl" />
        ))}
      </Group>

      {/* Rating Skeleton */}
      <Group justify="space-between">
        <Text>Rating</Text>
        <Skeleton height={24} width={80} radius="sm" />
      </Group>

      {/* Tags Skeleton */}
      <Group my="md" gap="sm" h={72}>
        {/* Simulate the number of tags (e.g., 3) */}
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} height={20} width={60} radius="sm" />
        ))}
      </Group>
    </Card>
  );
};

export default DragonDetailCardSkeleton;
