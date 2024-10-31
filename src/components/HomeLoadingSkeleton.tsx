// LoadingSkeletons.tsx

import { SimpleGrid } from "@mantine/core";
import { FC } from "react";
import DragonDetailCardSkeleton from "./DragonCardSkeleton";

const HomeLoadingSkeleton: FC = () => {
  return (
    <SimpleGrid cols={{ xs: 2, sm: 3, lg: 4 }} my="md">
      {[...Array(12)].map((_, index) => (
        <DragonDetailCardSkeleton key={index} />
      ))}
    </SimpleGrid>
  );
};

export default HomeLoadingSkeleton;
