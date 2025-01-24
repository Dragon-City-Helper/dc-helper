import { BaseDragons } from "@/services/dragons";
import { Checkbox, Group, Loader, SimpleGrid, Text } from "@mantine/core";

import { FC, useState } from "react";
import DragonDetailCard from "./DragonDetailCard";
import HomeLoadingSkeleton from "./HomeLoadingSkeleton";
import { useDisclosure } from "@mantine/hooks";
import DragonPanel from "./DragonPanel";

interface IDragonsGridProps {
  dragons: BaseDragons;
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
  const [opened, { open, close }] = useDisclosure(false);

  const [selectedDragon, setSelectedDragon] = useState<BaseDragons[number]>();

  const onDragonClick = (dragon: BaseDragons[number]) => {
    setSelectedDragon(dragon);
    open();
  };
  return (
    <>
      <SimpleGrid cols={{ base: 2, sm: 3, lg: 4 }}>
        {dragons.map((dragon) => {
          return (
            <DragonDetailCard
              key={dragon.id}
              dragon={dragon}
              onDragonClick={onDragonClick}
            >
              {onOwned && (
                <Group justify="space-between" my="md">
                  <Text>Owned ? </Text>
                  {loading === dragon.id ? (
                    <Loader size="sm" />
                  ) : (
                    <Checkbox
                      className="cursor-pointer"
                      size="sm"
                      checked={ownedIdsMap.has(dragon.id)}
                      onChange={(e) =>
                        onOwned(dragon.id, !ownedIdsMap.get(dragon.id))
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </Group>
              )}
            </DragonDetailCard>
          );
        })}
      </SimpleGrid>
      {true && <HomeLoadingSkeleton />}
      <DragonPanel dragon={selectedDragon} opened={opened} close={close} />
    </>
  );
};

export default DragonsGrid;
