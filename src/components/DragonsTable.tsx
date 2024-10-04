import ArrowDown from "@/icons/arrow-down";
import ArrowUp from "@/icons/arrow-up";
import { dragons } from "@prisma/client";
import Image from "next/image";
import { FC, useCallback, useMemo, useState } from "react";

interface IDragonsTableProps {
  dragons: dragons[];
  viewOnly?: boolean;
  onOwned?: (dragon: dragons, checked: boolean) => void;
  ownedIdsMap: Map<string, boolean>;
  loading?: boolean | string;
}
interface ISortOptions {
  sortBy: "name" | "speed" | "rank";
  sortOrder: "asc" | "desc";
}

const DragonsTable: FC<IDragonsTableProps> = ({
  dragons: Dragons,
  viewOnly = false,
  onOwned,
  ownedIdsMap,
  loading,
}) => {
  const [sortOptions, setSortOptions] = useState<ISortOptions>({
    sortBy: "rank",
    sortOrder: "asc",
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
      "name" | "maxSpeed" | "rank"
    > = {
      name: "name",
      speed: "maxSpeed",
      rank: "rank",
    };
    if (sortBy) {
      const sortByKey = sortByMapping[sortBy];
      return Dragons.sort((a, b) => {
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
    <div className="overflow-x-auto ">
      <table className="table">
        <thead className="text-center">
          <tr>
            {!viewOnly && onOwned && <th>Owned ?</th>}
            <th>
              <div
                onClick={() => sortOnclickHandler("name")}
                className="hover:cursor-pointer flex gap-2"
              >
                Name {getSortOptionIndicator("name")}
              </div>
            </th>
            <th>
              <div
                onClick={() => sortOnclickHandler("speed")}
                className="hover:cursor-pointer flex gap-2"
              >
                Speed {getSortOptionIndicator("speed")}
              </div>
            </th>
            <th>
              <div
                onClick={() => sortOnclickHandler("rank")}
                className="hover:cursor-pointer flex gap-2"
              >
                Rank {getSortOptionIndicator("rank")}
              </div>
            </th>
            <th>Rarity</th>
            <th>Family</th>
            <th>Elements</th>
          </tr>
        </thead>
        <tbody>
          {sortedDragons.map((dragon: dragons) => {
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
                            onOwned(dragon, !ownedIdsMap.get(dragon.id))
                          }
                        />
                      </label>
                    )}
                  </td>
                )}
                <td className="flex flex-row gap-2 items-center">
                  <Image
                    src={dragon.image}
                    alt={dragon.name}
                    width={100}
                    height={100}
                  />
                  <div>{dragon.name}</div>
                </td>
                <td>{`${dragon.baseSpeed} - ${dragon.maxSpeed}`}</td>
                <td>{dragon.rank}</td>
                <td>
                  <div className="flex items-center justify-center">
                    <Image
                      src={`/images/rarity/${dragon.rarity}.png`}
                      alt={dragon.rarity}
                      width={64}
                      height={64}
                    />
                  </div>
                </td>
                <td>
                  <div className="flex items-center justify-center">
                    {dragon.familyName ? (
                      <Image
                        src={`/images/family/icon-${dragon.familyName}.png`}
                        alt={dragon.familyName}
                        width={64}
                        height={64}
                      />
                    ) : (
                      <div className="text-center">NA</div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="flex flex-row gap-2 items-center justify-center">
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
