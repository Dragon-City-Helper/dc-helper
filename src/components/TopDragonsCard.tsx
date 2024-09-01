import { FC, useMemo } from "react";
import Card from "./Card";
import DragonsTable from "./DragonsTable";
import { dragons, Elements, Rarity } from "@prisma/client";

interface ITopDragonsCard {
  title: string;
  dragons: dragons[];
  ownedIdsMap: Map<number, boolean>;
  options: {
    rarity?: Rarity;
    breedable?: boolean;
    owned?: boolean;
    size?: number;
    element?: Elements;
    offset?: number;
  };
}

const TopDragonsCard: FC<ITopDragonsCard> = ({
  title,
  dragons,
  ownedIdsMap,
  options,
}) => {
  const filteredDragons = useMemo(() => {
    const dragonsFilter = dragons
      .filter((dragon) => {
        const OwnedFilterMatcher =
          options.owned !== undefined
            ? ownedIdsMap.has(dragon.dragonId) === options.owned
            : true;
        const BreedableMatcher =
          options.breedable !== undefined
            ? dragon.breedable === options.breedable
            : true;
        const RarityMatcher =
          options.rarity !== undefined
            ? options.rarity === dragon.rarity
            : true;
        const ElementsMatcher =
          options.element !== undefined
            ? dragon.elements.includes(options.element)
            : true;
        return (
          OwnedFilterMatcher &&
          BreedableMatcher &&
          RarityMatcher &&
          ElementsMatcher
        );
      })
      .sort((a, b) => a.globalRank - b.globalRank);
    return dragonsFilter.slice(
      options.offset ?? 0,
      options.offset ? options.offset + (options.size || 0) : options.size
    );
  }, [dragons, ownedIdsMap, options]);
  return (
    <Card title={title}>
      <DragonsTable dragons={filteredDragons} ownedIdsMap={ownedIdsMap} />
    </Card>
  );
};

export default TopDragonsCard;
