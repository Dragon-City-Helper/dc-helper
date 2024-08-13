import TopDragonsCard from "@/components/TopDragonsCard";
import { elements, ElementsNames } from "@/types/Dragon";
import { fetchDragons } from "@/services/dragons";
import { getOwned } from "@/services/ownedDragons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { dragons, Elements } from "@prisma/client";

export async function getStaticProps() {
  try {
    const dragons = await fetchDragons();

    return {
      props: {
        dragons,
      },
      revalidate: 24 * 60 * 60,
    };
  } catch (error) {
    console.log(error);
  }
}

export default function Page({ dragons }: { dragons: dragons[] }) {
  const [ownedIds, setOwned] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    getOwned().then((res) => {
      setOwned(res.data.ids);
      setLoading(false);
    });
  }, []);

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
          dragon.elements.includes(element) && ownedIdsMap.has(dragon.dragonId)
      ).length;
    },
    [dragons, ownedIdsMap]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="stats stats-vertical lg:stats-horizontal shadow">
        {elements.slice(0, 11).map((element) => (
          <div className="stat" key={`stat-${element}`}>
            <div className="stat-title">{`Total ${ElementsNames[element]} Dragons`}</div>
            <div className="stat-value">
              {loading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                getTotalElementDragonsOwned(element)
              )}
              /{getTotalElementDragons(element)}
            </div>
          </div>
        ))}
      </div>
      <div className="stats stats-vertical lg:stats-horizontal shadow">
        {elements.slice(11, -1).map((element) => (
          <div className="stat" key={`stat-${element}`}>
            <div className="stat-title">{`Total ${ElementsNames[element]} Dragons`}</div>
            <div className="stat-value">
              {loading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                getTotalElementDragonsOwned(element)
              )}
              /{getTotalElementDragons(element)}
            </div>
          </div>
        ))}
      </div>
      {ownedIds.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {elements.map((element) => (
            <TopDragonsCard
              key={element}
              title={`My Top ${ElementsNames[element]} Dragons`}
              dragons={dragons}
              ownedIdsMap={ownedIdsMap}
              options={{ owned: true, size: 5, element }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
