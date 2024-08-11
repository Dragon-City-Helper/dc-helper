import { FC, useMemo } from "react";
import Card from "./Card";
import DragonsTable from "./DragonsTable";
import { Elements, IDragonSimple, Rarity } from "@/types/Dragon";

interface ITopDragonsCard {
  title: string;
  dragons: IDragonSimple[];
  ownedIdsMap: Map<number, boolean>;
  options: {
    rarity?: keyof typeof Rarity;
    breedable?: boolean;
    owned?: boolean;
    size?: number;
    element?: keyof typeof Elements;
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
            ? ownedIdsMap.has(dragon.id) === options.owned
            : true;
        const BreedableMatcher =
          options.breedable !== undefined
            ? dragon.breedable === options.breedable
            : true;
        const RarityMatcher =
          options.rarity !== undefined
            ? (options.rarity as Rarity) === dragon.rarity
            : true;
        const ElementsMatcher =
          options.element !== undefined
            ? dragon.elements.includes(options.element as Elements)
            : true;
        return (
          OwnedFilterMatcher &&
          BreedableMatcher &&
          RarityMatcher &&
          ElementsMatcher
        );
      })
      .sort((a, b) => a.globalRank - b.globalRank);
    return dragonsFilter.slice(0, options.size);
  }, [dragons, ownedIdsMap, options]);
  return (
    <Card title={title}>
      <DragonsTable dragons={filteredDragons} ownedIdsMap={ownedIdsMap} />
    </Card>
  );
};

export default TopDragonsCard;
