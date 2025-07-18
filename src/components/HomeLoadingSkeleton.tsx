"use client";
// LoadingSkeletons.tsx

import { SimpleGrid } from "@mantine/core";
import { FC } from "react";
import DragonDetailCardSkeleton from "./DragonCardSkeleton";

const HomeLoadingSkeleton: FC = () => {
  return (
    <SimpleGrid cols={{ base: 2, sm: 3, lg: 4 }} my="md">
      {[...Array(12)].map((_, index) => (
        <DragonDetailCardSkeleton key={index} />
      ))}
    </SimpleGrid>
  );
};

export default HomeLoadingSkeleton;
