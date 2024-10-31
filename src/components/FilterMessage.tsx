import { Text } from "@mantine/core";
import { useMemo } from "react";

export interface IFilterMessageProps {
  metadata?: {
    filterDragonsCount: number;
    filterSkinsCount: number;
    totalDragonsCount: number;
    totalSkinsCount: number;
  };
}

export default function FilterMessage({ metadata }: IFilterMessageProps) {
  const textContent = useMemo(() => {
    if (!metadata) {
      return "Showing all Dragons and Skins";
    }
    const {
      filterDragonsCount,
      totalDragonsCount,
      filterSkinsCount,
      totalSkinsCount,
    } = metadata;

    const areDragonsEqual = filterDragonsCount === totalDragonsCount;
    const areSkinsEqual = filterSkinsCount === totalSkinsCount;

    if (areSkinsEqual && areDragonsEqual) {
      return "Showing all Dragons and Skins";
    } else if (areDragonsEqual) {
      return `Matched all Dragons and ${filterSkinsCount}/${totalSkinsCount} Skins`;
    } else if (areSkinsEqual) {
      return `Matched ${filterDragonsCount}/${totalDragonsCount} Dragons and all Skins`;
    }
    return `Matched ${filterDragonsCount}/${totalDragonsCount} Dragons and ${filterSkinsCount}/${totalSkinsCount} Skins`;
  }, [metadata]);

  return (
    <Text fw="bold" my="sm">
      {textContent}
    </Text>
  );
}
