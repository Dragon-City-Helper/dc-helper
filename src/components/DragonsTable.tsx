import { IDragonSimple } from "@/types/Dragon";
import { FC } from "react";

interface IDragonsTableProps {
  dragons: IDragonSimple[];
  viewOnly?: boolean;
  onOwned?: (dragon: IDragonSimple, checked: boolean) => void;
  ownedIdsMap: Map<number, boolean>;
  compact?: boolean;
}
const DragonsTable: FC<IDragonsTableProps> = ({
  dragons,
  viewOnly = false,
  onOwned,
  ownedIdsMap,
  compact = true,
}) => {
  return (
    <table className="table">
      {/* head */}
      <thead>
        <tr>
          <th>Owned ?</th>
          {!compact && <th>Id</th>}
          <th>Name</th>
          <th>rank</th>
          <th>rarity</th>
          {!compact && <th>breedable</th>}
        </tr>
      </thead>
      <tbody>
        {dragons.map((dragon: IDragonSimple) => {
          return (
            <tr key={dragon.id}>
              <td>
                {!viewOnly && onOwned ? (
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
                ) : (
                  <p>{ownedIdsMap.has(dragon.id) ? "Yes" : "No"}</p>
                )}
              </td>

              {!compact && <td>{dragon.id}</td>}
              <td>{dragon.name}</td>
              <td>{dragon.globalRank}</td>
              <td>{dragon.rarity}</td>
              {!compact && <td>{dragon.breedable ? "Yes" : "No"}</td>}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DragonsTable;
