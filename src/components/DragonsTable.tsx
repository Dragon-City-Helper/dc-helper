import { IDragonSimple } from "@/types/Dragon";
import Image from "next/image";
import { FC } from "react";

interface IDragonsTableProps {
  dragons: IDragonSimple[];
  viewOnly?: boolean;
  onOwned?: (dragon: IDragonSimple, checked: boolean) => void;
  ownedIdsMap: Map<number, boolean>;
}
const DragonsTable: FC<IDragonsTableProps> = ({
  dragons,
  viewOnly = false,
  onOwned,
  ownedIdsMap,
}) => {
  return (
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
        {dragons.map((dragon: IDragonSimple) => {
          return (
            <tr key={dragon.id}>
              {!viewOnly && onOwned && (
                <td>
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
  );
};

export default DragonsTable;
