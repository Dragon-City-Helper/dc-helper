import TopDragonsCard from "@/components/TopDragonsCard";
import { elements, Elements, IDragonSimple } from "@/types/Dragon";
import fetchDragons from "@/utils/fetchDragons";
import { fetchOwned } from "@/utils/manageOwned";
import { useCallback, useMemo } from "react";

export async function getServerSideProps() {
  try {
    const dragons = await fetchDragons({});
    const ownedIds = await fetchOwned();

    return {
      props: {
        dragons,
        ownedIds,
      },
    };
  } catch (error) {
    console.log(error);
  }
}

export default function Page({
  dragons,
  ownedIds,
}: {
  dragons: IDragonSimple[];
  ownedIds: number[];
}) {
  const ownedIdsMap = useMemo(() => {
    return ownedIds.reduce((acc, curr) => {
      acc.set(curr, true);
      return acc;
    }, new Map<number, boolean>());
  }, [ownedIds]);

  const getTotalElementDragons = useCallback(
    (element: Elements) => {
      return dragons.filter((dragon) => dragon.elements.includes(element))
        .length;
    },
    [dragons]
  );
  const getTotalElementDragonsOwned = useCallback(
    (element: Elements) => {
      return dragons.filter(
        (dragon) =>
          dragon.elements.includes(element) && ownedIdsMap.has(dragon.id)
      ).length;
    },
    [dragons, ownedIdsMap]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="stats stats-vertical lg:stats-horizontal shadow">
        {elements.slice(0, 11).map((element) => (
          <div className="stat" key={`stat-${element}`}>
            <div className="stat-title">{`Total ${Elements[element]} Dragons`}</div>
            <div className="stat-value">{`${getTotalElementDragonsOwned(
              element as Elements
            )}/${getTotalElementDragons(element as Elements)}`}</div>
          </div>
        ))}
      </div>
      <div className="stats stats-vertical lg:stats-horizontal shadow">
        {elements.slice(11, -1).map((element) => (
          <div className="stat" key={`stat-${element}`}>
            <div className="stat-title">{`Total ${Elements[element]} Dragons`}</div>
            <div className="stat-value">{`${getTotalElementDragonsOwned(
              element as Elements
            )}/${getTotalElementDragons(element as Elements)}`}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-4">
        {elements.map((element) => (
          <TopDragonsCard
            key={element}
            title={`My Top ${Elements[element]} Dragons`}
            dragons={dragons}
            ownedIdsMap={ownedIdsMap}
            options={{ owned: true, size: 5, element }}
          />
        ))}
      </div>
    </div>
  );
}
