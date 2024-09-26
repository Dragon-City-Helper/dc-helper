import ArrowDown from "@/icons/arrow-down";
import ArrowUp from "@/icons/arrow-up";
import { dragons } from "@prisma/client";
import Image from "next/image";
import { FC, useCallback, useMemo, useState } from "react";

interface ITierListProps {
  dragons: dragons[];
  viewOnly?: boolean;
  onOwned?: (dragon: dragons, checked: boolean) => void;
  ownedIdsMap: Map<number, boolean>;
  loading?: boolean | number;
}
interface ISortOptions {
  sortBy: "name" | "speed" | "rank";
  sortOrder: "asc" | "desc";
}

const TierList: FC<ITierListProps> = ({ dragons: Dragons }) => {
  const [sortOptions, setSortOptions] = useState<ISortOptions>({
    sortBy: "rank",
    sortOrder: "desc",
  });

  const [weights] = useState<{
    skills: number;
    rarity: number;
    elements: number;
    speed: number;
    damage: number;
  }>({
    rarity: 3,
    skills: 1,
    elements: 1,
    speed: 2,
    damage: 2,
  });

  const sortOnclickHandler = useCallback(
    (key: ISortOptions["sortBy"]) => {
      const getSortOptions: () => ISortOptions = () => {
        if (sortOptions) {
          if (sortOptions.sortBy !== key) {
            return {
              sortBy: key,
              sortOrder: "asc",
            };
          } else if (sortOptions.sortOrder) {
            switch (sortOptions.sortOrder) {
              case "asc":
                return {
                  ...sortOptions,
                  sortOrder: "desc",
                };
              case "desc":
                return { sortBy: "rank", sortOrder: "asc" };
              default:
                return { sortBy: "rank", sortOrder: "asc" };
            }
          }
        }
        return {
          sortBy: key,
          sortOrder: "asc",
        };
      };
      setSortOptions(getSortOptions());
    },
    [sortOptions]
  );
  const getSortOptionIndicator = useCallback(
    (key: ISortOptions["sortBy"]) => {
      if (key === sortOptions?.sortBy) {
        return sortOptions?.sortOrder === "asc" ? <ArrowUp /> : <ArrowDown />;
      }
      return null;
    },
    [sortOptions?.sortBy, sortOptions?.sortOrder]
  );

  const sortedDragons = useMemo(() => {
    const { sortBy, sortOrder } = sortOptions || {};
    const sortByMapping: Record<
      ISortOptions["sortBy"],
      "name" | "dragonScore" | "speedScore" | "skillsScore" | "elementsScore"
    > = {
      name: "name",
      speed: "speedScore",
      rank: "dragonScore",
    };

    const calculateDragonScore = (dragon: dragons) => {
      return (
        (weights["speed"] * dragon.speedScore) / 10 +
        weights["elements"] * dragon.elementsScore +
        weights["rarity"] * dragon.rarityScore * 5 +
        weights["skills"] * dragon.skillsScore +
        (weights["damage"] * dragon.damageScore) / 100
      );
    };
    if (sortBy) {
      const sortByKey = sortByMapping[sortBy];
      return Dragons.map((dragon) => ({
        ...dragon,
        dragonScore: calculateDragonScore(dragon),
      })).sort((a, b) => {
        if (sortOrder === "asc") {
          return a[sortByKey] > b[sortByKey] ? 1 : -1;
        } else {
          return a[sortByKey] > b[sortByKey] ? -1 : 1;
        }
      });
    }
    return Dragons;
  }, [sortOptions, Dragons]);

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>
              <div
                onClick={() => sortOnclickHandler("name")}
                className="hover:cursor-pointer flex gap-2"
              >
                Name {getSortOptionIndicator("name")}
              </div>
            </th>
            <th>Rarity</th>
            <th>Elements</th>
            <th>
              <div
                onClick={() => sortOnclickHandler("speed")}
                className="hover:cursor-pointer flex gap-2"
              >
                Speed {getSortOptionIndicator("speed")}
              </div>
            </th>
            <th>Damage</th>
            <th>Skills Score</th>
            <th>
              <div
                onClick={() => sortOnclickHandler("rank")}
                className="hover:cursor-pointer flex gap-2"
              >
                Total Score {getSortOptionIndicator("rank")}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedDragons.map((dragon: dragons) => {
            return (
              <tr key={dragon.dragonId} className="hover">
                <td>
                  <div className="flex flex-row gap-2 items-center">
                    <Image
                      src={dragon.image}
                      alt={dragon.name}
                      width={100}
                      height={100}
                    />
                    <div>{dragon.name}</div>
                  </div>
                </td>
                <td>
                  <div className="flex flex-row gap-2 items-center">
                    <Image
                      src={`/images/rarity/${dragon.rarity}.png`}
                      alt={dragon.rarity}
                      width={64}
                      height={64}
                    />
                    <b>({dragon.rarityScore})</b>
                  </div>
                </td>
                <td>
                  <div className="flex flex-row gap-2 items-center">
                    {dragon.elements.map((element, index) => (
                      <Image
                        key={`${dragon.id}-${element}-${index}`}
                        src={`/images/elements/${element}.png`}
                        alt={element}
                        width={36}
                        height={76}
                      />
                    ))}
                    <b>({dragon.elementsScore})</b>
                  </div>
                </td>
                <td>
                  {`${dragon.baseSpeed} - ${dragon.maxSpeed}`}
                  <b>({dragon.speedScore})</b>
                </td>
                <td>
                  {dragon.maxDamage}
                  <b>({dragon.damageScore})</b>
                </td>
                <td>{dragon.skillsScore}</td>
                <td>{dragon.dragonScore}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TierList;
