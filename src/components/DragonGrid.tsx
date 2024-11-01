import { HomeDragons } from "@/services/dragons";
import { Checkbox, Group, Loader, SimpleGrid, Text } from "@mantine/core";

import { FC } from "react";
import DragonDetailCard from "./DragonDetailCard";
import HomeLoadingSkeleton from "./HomeLoadingSkeleton";

interface IDragonsGridProps {
  dragons: HomeDragons;
  onOwned?: (dragonId: string, checked: boolean) => void;
  ownedIdsMap: Map<string, boolean>;
  loading?: string;
  size?: number;
  infiniteLoading: boolean;
}

const DragonsGrid: FC<IDragonsGridProps> = ({
  dragons,
  onOwned,
  ownedIdsMap,
  loading,
  infiniteLoading,
}) => {
  return (
    <>
      <SimpleGrid cols={{ base: 2, sm: 3, lg: 4 }}>
        {dragons.map((dragon) => {
          return (
            <DragonDetailCard key={dragon.id} dragon={dragon}>
              {onOwned && (
                <Group justify="space-between" my="md">
                  <Text>Owned ? </Text>
                  {loading === dragon.id ? (
                    <Loader size="sm" />
                  ) : (
                    <Checkbox
                      size="sm"
                      checked={ownedIdsMap.has(dragon.id)}
                      onChange={() =>
                        onOwned(dragon.id, !ownedIdsMap.get(dragon.id))
                      }
                    />
                  )}
                </Group>
              )}
            </DragonDetailCard>
          );
        })}
      </SimpleGrid>
      {infiniteLoading && <HomeLoadingSkeleton />}
    </>
  );
};

export default DragonsGrid;
