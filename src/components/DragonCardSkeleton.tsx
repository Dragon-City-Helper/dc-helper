import { Card, Skeleton, Group, Text, Center } from "@mantine/core";
import { FC } from "react";

const DragonDetailCardSkeleton: FC = () => {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      {/* Title Skeleton */}
      <Skeleton height={40} width="50%" mt="md" mx="auto" />

      {/* Image Skeleton */}
      <Card.Section h={130}>
        <Center>
          <Skeleton height={100} width={100} mt="md" />
        </Center>
      </Card.Section>
      <Card.Section inheritPadding>
        {/* Elements Skeleton */}
        <Group justify="center" gap={4} my="md" visibleFrom="sm">
          {/* Simulate the number of elements (e.g., 4) */}
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} height={32} width={32} radius="xl" />
          ))}
        </Group>

        {/* Rating Skeleton */}
        <Group className="justify-center sm:justify-between my-4 sm:mt-0">
          <Text visibleFrom="sm">Rating</Text>
          <Skeleton height={24} width={80} radius="sm" />
        </Group>
      </Card.Section>
    </Card>
  );
};

export default DragonDetailCardSkeleton;
