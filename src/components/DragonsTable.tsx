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
          <th>rank</th>
          <th>rarity</th>
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
                  width={72}
                  height={72}
                ></Image>
                <div>{dragon.name}</div>
              </td>
              <td>{dragon.globalRank}</td>
              <td>{dragon.rarity}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DragonsTable;
