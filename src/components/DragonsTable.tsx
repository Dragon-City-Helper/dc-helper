import { dragons } from "@prisma/client";
import Image from "next/image";
import { FC } from "react";

interface IDragonsTableProps {
  dragons: dragons[];
  viewOnly?: boolean;
  onOwned?: (dragon: dragons, checked: boolean) => void;
  ownedIdsMap: Map<number, boolean>;
  loading?: boolean | number;
}
const DragonsTable: FC<IDragonsTableProps> = ({
  dragons,
  viewOnly = false,
  onOwned,
  ownedIdsMap,
  loading,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            {!viewOnly && onOwned && <th>Owned ?</th>}
            <th>Name</th>
            <th>Rank</th>
            <th>Rarity</th>
            <th>Elements</th>
          </tr>
        </thead>
        <tbody>
          {dragons.map((dragon: dragons) => {
            return (
              <tr key={dragon.dragonId} className="hover">
                {!viewOnly && onOwned && (
                  <td>
                    {loading === true || loading === dragon.dragonId ? (
                      <span className="loading loading-spinner loading-md"></span>
                    ) : (
                      <label>
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={ownedIdsMap.has(dragon.dragonId)}
                          onChange={() =>
                            onOwned(dragon, !ownedIdsMap.get(dragon.dragonId))
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
                <td>{dragon.globalRank}</td>
                <td>
                  <Image
                    src={`/images/rarity/${dragon.rarity}.png`}
                    alt={dragon.rarity}
                    width={64}
                    height={64}
                  />
                </td>
                <td className="flex flex-row gap-2 items-center">
                  {dragon.elements.map((element, index) => (
                    <Image
                      key={`${dragon.id}-${element}-${index}`}
                      src={`/images/elements/${element}.png`}
                      alt={element}
                      width={36}
                      height={76}
                    />
                  ))}
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
