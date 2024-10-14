import { getRatingText } from "@/constants/Rating";
import { HomeDragons } from "@/services/dragons";
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

  return (
    <div className="overflow-x-auto ">
      <table className="table">
        <thead className="text-center">
          <tr>
            {!viewOnly && onOwned && <th>Owned ?</th>}
            <th>Name</th>
            <th>Speed</th>
            <th>Overall Rating</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {sortedDragons.map((dragon: HomeDragons[number]) => {
            return (
              <tr key={dragon.id} className="hover">
                {!viewOnly && onOwned && (
                  <td>
                    {loading === true || loading === dragon.id ? (
                      <span className="loading loading-spinner loading-md"></span>
                    ) : (
                      <label>
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={ownedIdsMap.has(dragon.id)}
                          onChange={() =>
                            onOwned(dragon.id, !ownedIdsMap.get(dragon.id))
                          }
                        />
                      </label>
                    )}
                  </td>
                )}
                <td>
                  <Link href={`/dragons/${dragon.id}`}>
                    <div className="flex flex-row gap-2 items-center">
                      <Image
                        src={`https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui${dragon.image}`}
                        alt={dragon.name}
                        width={100}
                        height={100}
                      />
                      <div>{dragon.name}</div>
                    </div>
                  </Link>
                </td>
                <td>{`${dragon.baseSpeed} - ${dragon.maxSpeed}`}</td>
                <td>
                  <div className="flex flex-row gap-2 items-center">
                    {dragon.rating?.overall
                      ? getRatingText(dragon.rating?.overall)
                      : "Unrated"}
                  </div>
                </td>
                <td>
                  <div className="flex flex-row gap-2 items-center justify-start">
                    {dragon.elements.map((element, index) => (
                      <Image
                        key={`${dragon.id}-${element}-${index}`}
                        src={`/images/elements/${element}.png`}
                        alt={element}
                        width={36}
                        height={76}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-start">
                    <Image
                      src={`/images/rarity/${dragon.rarity}.png`}
                      alt={dragon.rarity}
                      width={64}
                      height={64}
                    />
                    {dragon.familyName ? (
                      <Image
                        src={`/images/family/icon-${dragon.familyName}.png`}
                        alt={dragon.familyName}
                        width={64}
                        height={64}
                      />
                    ) : null}
                    {dragon.isSkin ? (
                      <Image
                        src={`/images/skin.png`}
                        alt={dragon.rarity}
                        width={64}
                        height={64}
                      />
                    ) : null}
                    {!dragon.isSkin && !dragon.isVip && dragon.hasSkills ? (
                      <Image
                        src={`/images/skilltype/${dragon.skillType}.png`}
                        alt={dragon.rarity}
                        width={64}
                        height={64}
                      />
                    ) : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DragonsTable;
