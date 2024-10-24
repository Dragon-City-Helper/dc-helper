import { HomeDragons } from "@/services/dragons";
import { Checkbox, Group, Loader, SimpleGrid, Text } from "@mantine/core";

import { FC, useMemo } from "react";
import DragonDetailCard from "./DragonDetailCard";

interface IDragonsGridProps {
  dragons: HomeDragons;
  onOwned?: (dragonId: string, checked: boolean) => void;
  ownedIdsMap: Map<string, boolean>;
  loading?: boolean | string;
  size?: number;
}

const DragonsGrid: FC<IDragonsGridProps> = ({
  dragons,
  onOwned,
  ownedIdsMap,
  loading,
}) => {
  return (
    <SimpleGrid cols={{ xs: 2, sm: 3, lg: 4 }}>
      {dragons.map((dragon) => {
        return (
          <DragonDetailCard key={dragon.id} dragon={dragon}>
            {onOwned && (
              <Group justify="space-between" my="md">
                <Text>Owned ? </Text>
                {loading === true || loading === dragon.id ? (
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
  );
};

export default DragonsGrid;
