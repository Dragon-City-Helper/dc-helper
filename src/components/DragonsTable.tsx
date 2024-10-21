import { getRatingText } from "@/constants/Rating";
import { HomeDragons } from "@/services/dragons";
import { Center, Checkbox, Loader } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { FC, useMemo } from "react";

interface IDragonsTableProps {
  dragons: HomeDragons;
  viewOnly?: boolean;
  onOwned?: (dragonId: string, checked: boolean) => void;
  ownedIdsMap: Map<string, boolean>;
  loading?: boolean | string;
  size?: number;
}

const DragonsTable: FC<IDragonsTableProps> = ({
  dragons,
  viewOnly = false,
  onOwned,
  ownedIdsMap,
  loading,
  size,
}) => {
  const sortedDragons = useMemo(() => {
    const rarityOrder = ["H", "M", "L", "E", "V", "R", "C"];
    const sortedDragons = dragons.sort((a, b) => {
      // Sort by dragon.rating.overall (descending)
      if (b.rating?.overall !== a.rating?.overall) {
        return (b.rating?.overall ?? 0) - (a.rating?.overall ?? 0);
      }

      // Sort by dragon.rating.score (descending)
      if (b.rating?.score !== a.rating?.score) {
        return (b.rating?.score ?? 0) - (a.rating?.score ?? 0);
      }

      // Sort by dragon.isSkin (true values come first)
      if (a.isSkin !== b.isSkin) {
        return a.isSkin ? -1 : 1;
      }

      // Sort by dragon.hasSkills (true values come first)
      if (a.hasSkills !== b.hasSkills) {
        return a.hasSkills ? -1 : 1;
      }

      // Sort by dragon.rarity according to the specified order
      return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
    });
    if (size) {
      return sortedDragons.slice(0, size);
    }
    return sortedDragons;
  }, [dragons, size]);

  const showOwned = useMemo(() => !viewOnly && onOwned, [viewOnly, onOwned]);

  return (
    <div className="flex flex-col">
      <div
        className={`grid ${showOwned ? "grid-cols-5" : "grid-cols-4"} text-center`}
      >
        <div className="col-span-2">Name</div>
        <div>Speed</div>
        <div>Overall Rating</div>
        {showOwned && <div>Owned ?</div>}
      </div>

      {sortedDragons.map((dragon: HomeDragons[number]) => {
        return (
          <div
            key={dragon.id}
            className={`grid ${showOwned ? "grid-cols-5" : "grid-cols-4"} border border-gray-500 items-center text-center p-6`}
          >
            <div className="col-span-2 justify-items-center">
              <Link href={`/dragons/${dragon.id}`}>
                <div className="p-4">
                  <Image
                    src={`https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui${dragon.image}`}
                    alt={dragon.name}
                    width={120}
                    height={120}
                  />
                </div>
                <div className="flex flex-col justify-between items-start">
                  <div className="flex flex-row gap-2 items-start flex-wrap w-full">
                    {dragon.elements.map((element, index) => (
                      <Image
                        key={`${dragon.id}-${element}-${index}`}
                        src={`/images/elements/${element}.png`}
                        alt={element}
                        width={16}
                        height={32}
                      />
                    ))}
                    <Image
                      src={`/images/rarity/${dragon.rarity}.png`}
                      alt={dragon.rarity}
                      width={32}
                      height={32}
                    />
                    {dragon.familyName && (
                      <Image
                        src={`/images/family/icon-${dragon.familyName}.png`}
                        alt={dragon.familyName}
                        width={32}
                        height={32}
                      />
                    )}
                    {dragon.isSkin ? (
                      <Image
                        src={`/images/skin.png`}
                        alt={dragon.rarity}
                        width={32}
                        height={32}
                      />
                    ) : null}
                    {!dragon.isSkin && !dragon.isVip && dragon.hasSkills ? (
                      <Image
                        src={`/images/skilltype/${dragon.skillType}.png`}
                        alt={dragon.rarity}
                        width={32}
                        height={32}
                      />
                    ) : null}
                  </div>
                  <div className="text-left">{dragon.name}</div>
                </div>
              </Link>
            </div>
            <div>{`${dragon.baseSpeed} - ${dragon.maxSpeed}`}</div>
            <div>
              {dragon.rating?.overall
                ? getRatingText(dragon.rating?.overall)
                : "Unrated"}
            </div>
            {!viewOnly && onOwned && (
              <Center>
                {loading === true || loading === dragon.id ? (
                  <Loader />
                ) : (
                  <Checkbox
                    checked={ownedIdsMap.has(dragon.id)}
                    onChange={() =>
                      onOwned(dragon.id, !ownedIdsMap.get(dragon.id))
                    }
                  />
                )}
              </Center>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DragonsTable;
